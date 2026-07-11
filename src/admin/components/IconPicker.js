/**
 * Built-in icon picker.
 */

import { __ } from '@wordpress/i18n';
import { useMemo, useState } from '@wordpress/element';
import { Button, TextControl, Modal } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { STORE_NAME } from '../store';

/**
 * @param {Object}   props
 * @param {Object}   props.value    Icon value { source, value }.
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

	const current = value?.value || '';

	return (
		<div className="smm-icon-picker">
			<div className="smm-icon-picker__current">
				<span className="smm-icon-picker__slug" aria-hidden="true">
					{ current || '—' }
				</span>
				<Button variant="secondary" onClick={ () => setIsOpen( true ) }>
					{ __( 'Choose icon', 'structured-mega-menu' ) }
				</Button>
				{ current ? (
					<Button
						variant="link"
						onClick={ () =>
							onChange( { source: 'library', value: '' } )
						}
					>
						{ __( 'Clear', 'structured-mega-menu' ) }
					</Button>
				) : null }
			</div>
			{ isOpen && (
				<Modal
					title={ __( 'Select icon', 'structured-mega-menu' ) }
					onRequestClose={ () => setIsOpen( false ) }
				>
					<TextControl
						label={ __( 'Search icons', 'structured-mega-menu' ) }
						value={ search }
						onChange={ setSearch }
					/>
					<ul className="smm-icon-picker__grid">
						{ filtered.map( ( icon ) => (
							<li key={ icon.slug }>
								<Button
									variant={
										current === icon.slug
											? 'primary'
											: 'secondary'
									}
									onClick={ () => {
										onChange( {
											source: 'library',
											value: icon.slug,
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
