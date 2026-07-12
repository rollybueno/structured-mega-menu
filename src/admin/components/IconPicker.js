/**
 * Icon picker: WordPress Dashicons library or uploaded media.
 */

import { __, sprintf } from '@wordpress/i18n';
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
 * @param {string} slug Dashicons name without prefix.
 * @return {JSX.Element|null} Dashicon span.
 */
function DashiconPreview( { slug } ) {
	if ( ! slug ) {
		return null;
	}

	return (
		<span
			className={ `dashicons dashicons-${ slug }` }
			aria-hidden="true"
		/>
	);
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
	const currentLabel =
		icons.find( ( icon ) => icon.slug === current )?.label || current;

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
					) : current && source === 'library' ? (
						<DashiconPreview slug={ current } />
					) : (
						<span className="smm-icon-picker__slug">—</span>
					) }
				</div>
				<div className="smm-icon-picker__meta">
					<p className="smm-icon-picker__status">
						{ ! hasIcon
							? __( 'No icon selected', 'structured-mega-menu' )
							: source === 'media'
							? __( 'Custom upload', 'structured-mega-menu' )
							: currentLabel }
					</p>
					<div className="smm-field-actions">
						<Button
							variant="secondary"
							onClick={ () => setIsOpen( true ) }
						>
							{ __( 'Dashicons', 'structured-mega-menu' ) }
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
					title={ __( 'Select Dashicon', 'structured-mega-menu' ) }
					onRequestClose={ () => setIsOpen( false ) }
					className="smm-icon-picker__modal"
				>
					<div className="smm-icon-picker__modal-body">
						<div className="smm-icon-picker__modal-toolbar">
							<TextControl
								label={ __(
									'Search icons',
									'structured-mega-menu'
								) }
								hideLabelFromVision
								placeholder={ __(
									'Search icons…',
									'structured-mega-menu'
								) }
								value={ search }
								onChange={ setSearch }
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
							<p className="smm-icon-picker__modal-count" role="status">
								{ filtered.length === 1
									? __( '1 icon', 'structured-mega-menu' )
									: /* translators: %d: number of icons */
									  sprintf(
											__( '%d icons', 'structured-mega-menu' ),
											filtered.length
									  ) }
							</p>
						</div>
						{ filtered.length === 0 ? (
							<p className="smm-icon-picker__modal-empty">
								{ __(
									'No icons match your search.',
									'structured-mega-menu'
								) }
							</p>
						) : (
							<ul className="smm-icon-picker__grid">
								{ filtered.map( ( icon ) => (
									<li key={ icon.slug }>
										<Button
											className="smm-icon-picker__option"
											variant={
												source === 'library' &&
												current === icon.slug
													? 'primary'
													: 'secondary'
											}
											label={ icon.label || icon.slug }
											showTooltip
											onClick={ () => {
												onChange( {
													source: 'library',
													value: icon.slug,
													url: '',
												} );
												setIsOpen( false );
											} }
										>
											<span
												className={ `dashicons dashicons-${ icon.slug }` }
												aria-hidden="true"
											/>
											<span className="smm-icon-picker__option-label">
												{ icon.label || icon.slug }
											</span>
										</Button>
									</li>
								) ) }
							</ul>
						) }
					</div>
				</Modal>
			) }
		</div>
	);
}
