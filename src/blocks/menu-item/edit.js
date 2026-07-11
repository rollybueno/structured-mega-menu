/**
 * Block editor UI (Phase 1 scaffold).
 *
 * Full inspector controls and preview arrive in Phase 3.
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @return {JSX.Element} Editor element.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { label } = attributes;
	const blockProps = useBlockProps( {
		className: 'wp-block-navigation-item smm-menu-item',
	} );

	return (
		<li { ...blockProps }>
			<RichText
				tagName="span"
				className="wp-block-navigation-item__label"
				value={ label }
				onChange={ ( value ) => setAttributes( { label: value } ) }
				placeholder={ __( 'Mega menu…', 'structured-mega-menu' ) }
				allowedFormats={ [] }
				withoutInteractiveFormatting
			/>
		</li>
	);
}
