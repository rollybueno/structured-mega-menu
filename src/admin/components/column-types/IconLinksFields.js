/**
 * Links with icons column fields.
 */

import { __ } from '@wordpress/i18n';
import {
	TextControl,
	TextareaControl,
	SelectControl,
} from '@wordpress/components';
import Repeater from '../Repeater';

/**
 * @param {Object}   props
 * @param {Object}   props.settings
 * @param {string}   props.columnId
 * @param {number}   props.columnIndex
 * @param {Function} props.onChange
 * @return {JSX.Element} Fields.
 */
export default function IconLinksFields( {
	settings,
	columnId,
	columnIndex,
	onChange,
} ) {
	const update = ( patch ) => onChange( { ...settings, ...patch } );

	return (
		<div className="smm-fields smm-fields--icon-links">
			<TextControl
				label={ __( 'Heading', 'structured-mega-menu' ) }
				value={ settings.heading || '' }
				onChange={ ( heading ) => update( { heading } ) }
			/>
			<TextareaControl
				label={ __( 'Description', 'structured-mega-menu' ) }
				value={ settings.description || '' }
				onChange={ ( description ) => update( { description } ) }
			/>
			<SelectControl
				label={ __( 'Display style', 'structured-mega-menu' ) }
				value={ settings.displayStyle || 'descriptive' }
				options={ [
					{
						label: __( 'Compact', 'structured-mega-menu' ),
						value: 'compact',
					},
					{
						label: __( 'Descriptive', 'structured-mega-menu' ),
						value: 'descriptive',
					},
				] }
				onChange={ ( displayStyle ) => update( { displayStyle } ) }
				help={ __(
					'Switching styles does not delete saved descriptions.',
					'structured-mega-menu'
				) }
			/>
			<SelectControl
				label={ __( 'Icon position', 'structured-mega-menu' ) }
				value={ settings.iconPosition || 'left' }
				options={ [
					{
						label: __( 'Left', 'structured-mega-menu' ),
						value: 'left',
					},
					{
						label: __( 'Above', 'structured-mega-menu' ),
						value: 'above',
					},
				] }
				onChange={ ( iconPosition ) => update( { iconPosition } ) }
			/>
			<Repeater
				columnId={ columnId }
				columnType="icon_links"
				items={ settings.items || [] }
				columnIndex={ columnIndex }
			/>
		</div>
	);
}
