/**
 * Layout preset picker based on enabled column count.
 */

import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';
import { LAYOUT_PRESETS } from '../../shared/constants';

/**
 * @param {Object}   props
 * @param {number}   props.columnCount
 * @param {string}   props.value
 * @param {Function} props.onChange
 * @return {JSX.Element|null} Layout picker.
 */
export default function ColumnLayoutPicker( { columnCount, value, onChange } ) {
	const presets = LAYOUT_PRESETS[ columnCount ] || [];

	if ( columnCount < 1 || ! presets.length ) {
		return null;
	}

	return (
		<SelectControl
			label={ __( 'Column layout', 'structured-mega-menu' ) }
			value={ value }
			options={ presets.map( ( preset ) => ( {
				label: preset,
				value: preset,
			} ) ) }
			onChange={ onChange }
			help={ __(
				'Layout ratios must match the number of enabled columns.',
				'structured-mega-menu'
			) }
		/>
	);
}
