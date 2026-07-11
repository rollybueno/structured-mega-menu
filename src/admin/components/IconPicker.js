/**
 * Icon picker: built-in library or uploaded media.
 */

import { __ } from '@wordpress/i18n';
import { useMemo, useState } from '@wordpress/element';
import { Button, TextControl, Modal } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { STORE_NAME } from '../store';

/**
 * Opens the media frame for an icon image.
 *
 * @return {Promise<Object|null>} Selected attachment.
 */
function openIconMediaFrame() {
	return new Promise( ( resolve ) => {
		if ( ! window.wp?.media ) {
			resolve( null );
			return;
		}

		const frame = window.wp.media( {
			title: __( 'Select icon image', 'structured-mega-menu' ),
			button: { text: __( 'Use icon', 'structured-mega-menu' ) },
			multiple: false,
			library: { type: 'image' },
		} );

		frame.on( 'select', () => {
			const attachment = frame
				.state()
				.get( 'selection' )
				.first()
				.toJSON();
			resolve( attachment );
		} );

		frame.open();
	} );
}

/**
 * @param {Object}   props
 * @param {Object}   props.value    Icon value { source, value, url? }.
 * @param {Function} props.onChange
 * @return {JSX.Element} Icon picker.
 */
export default function IconPicker( { value, onChange } ) {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ search, setSearch ] = useState( '' );
	const icons = useSelect(
		( select ) => select( STORE_NAME ).getIcons(),
		[]
	);

	const filtered = useMemo( () => {
		const term = search.trim().toLowerCase();
		if ( ! term ) {
			return icons;
		}
		return icons.filter(
			( icon ) =>
				icon.slug.includes( term ) ||
				( icon.label || '' ).toLowerCase().includes( term )
		);
	}, [ icons, search ] );

	const source = value?.source || 'library';
	const current = value?.value || '';
	const mediaUrl = value?.url || '';
	const hasIcon = !! current;

	const selectUpload = async () => {
		const media = await openIconMediaFrame();
		if ( ! media?.id ) {
			return;
		}
		onChange( {
			source: 'media',
			value: String( media.id ),
			url: media.sizes?.thumbnail?.url || media.url || '',
		} );
	};

	const clearIcon = () =>
		onChange( { source: 'library', value: '', url: '' } );

	return (
		<div className="smm-icon-picker">
			<span className="smm-field-label">
				{ __( 'Icon', 'structured-mega-menu' ) }
			</span>
			<div className="smm-icon-picker__card">
				<div className="smm-icon-picker__preview" aria-hidden="true">
					{ source === 'media' && mediaUrl ? (
						<img src={ mediaUrl } alt="" />
					) : (
						<span className="smm-icon-picker__slug">
							{ current || '—' }
						</span>
					) }
				</div>
				<div className="smm-icon-picker__meta">
					<p className="smm-icon-picker__status">
						{ ! hasIcon
							? __( 'No icon selected', 'structured-mega-menu' )
							: source === 'media'
							? __( 'Custom upload', 'structured-mega-menu' )
							: current }
					</p>
					<div className="smm-field-actions">
						<Button
							variant="secondary"
							onClick={ () => setIsOpen( true ) }
						>
							{ __( 'Library', 'structured-mega-menu' ) }
						</Button>
						<Button variant="secondary" onClick={ selectUpload }>
							{ hasIcon && source === 'media'
								? __( 'Replace', 'structured-mega-menu' )
								: __( 'Upload', 'structured-mega-menu' ) }
						</Button>
						{ hasIcon ? (
							<Button variant="tertiary" onClick={ clearIcon }>
								{ __( 'Clear', 'structured-mega-menu' ) }
							</Button>
						) : null }
					</div>
				</div>
			</div>
			{ isOpen && (
				<Modal
					title={ __( 'Select icon', 'structured-mega-menu' ) }
					onRequestClose={ () => setIsOpen( false ) }
					className="smm-icon-picker__modal"
				>
					<TextControl
						label={ __( 'Search icons', 'structured-mega-menu' ) }
						value={ search }
						onChange={ setSearch }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<ul className="smm-icon-picker__grid">
						{ filtered.map( ( icon ) => (
							<li key={ icon.slug }>
								<Button
									variant={
										source === 'library' &&
										current === icon.slug
											? 'primary'
											: 'secondary'
									}
									onClick={ () => {
										onChange( {
											source: 'library',
											value: icon.slug,
											url: '',
										} );
										setIsOpen( false );
									} }
								>
									{ icon.label || icon.slug }
								</Button>
							</li>
						) ) }
					</ul>
				</Modal>
			) }
		</div>
	);
}
