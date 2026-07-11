/**
 * Link list column fields.
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
export default function LinkListFields( {
	settings,
	columnId,
	columnIndex,
	onChange,
} ) {
	const update = ( patch ) => onChange( { ...settings, ...patch } );
	const showDescriptions = settings.displayStyle === 'with_descriptions';

	return (
		<div className="smm-fields smm-fields--link-list">
			<TextControl
				label={ __( 'Heading', 'structured-mega-menu' ) }
				value={ settings.heading || '' }
				onChange={ ( heading ) => update( { heading } ) }
			/>
			{ ( showDescriptions || settings.description ) && (
				<TextareaControl
					label={ __( 'Description', 'structured-mega-menu' ) }
					value={ settings.description || '' }
					onChange={ ( description ) => update( { description } ) }
				/>
			) }
			<SelectControl
				label={ __( 'Display style', 'structured-mega-menu' ) }
				value={ settings.displayStyle || 'simple' }
				options={ [
					{
						label: __( 'Simple', 'structured-mega-menu' ),
						value: 'simple',
					},
					{
						label: __(
							'With descriptions',
							'structured-mega-menu'
						),
						value: 'with_descriptions',
					},
				] }
				onChange={ ( displayStyle ) => update( { displayStyle } ) }
				help={ __(
					'Saved descriptions are kept when switching to Simple.',
					'structured-mega-menu'
				) }
			/>
			<Repeater
				columnId={ columnId }
				columnType="link_list"
				items={ settings.items || [] }
				columnIndex={ columnIndex }
			/>
		</div>
	);
}
