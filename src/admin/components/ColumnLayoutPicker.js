/**
 * Layout preset picker based on enabled column count.
 */

import { __ } from '@wordpress/i18n';
import { LAYOUT_PRESETS } from '../../shared/constants';

/**
 * @param {string} preset Layout preset like 1-2-1.
 * @return {string} CSS grid-template-columns value.
 */
function tracksForPreset( preset ) {
	return String( preset )
		.split( '-' )
		.map( ( part ) => `${ Math.max( 1, parseInt( part, 10 ) || 1 ) }fr` )
		.join( ' ' );
}

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
		<div className="smm-layout-picker smm-settings-grid__full">
			<span className="smm-layout-picker__label" id="smm-layout-label">
				{ __( 'Column layout', 'structured-mega-menu' ) }
			</span>
			<div
				className="smm-layout-picker__options"
				role="radiogroup"
				aria-labelledby="smm-layout-label"
			>
				{ presets.map( ( preset ) => {
					const selected = value === preset;
					const parts = String( preset ).split( '-' );

					return (
						<button
							key={ preset }
							type="button"
							role="radio"
							aria-checked={ selected }
							aria-label={ preset }
							title={ preset }
							className={ `smm-layout-option${
								selected ? ' is-selected' : ''
							}` }
							style={ {
								'--smm-layout-tracks':
									tracksForPreset( preset ),
							} }
							onClick={ () => onChange( preset ) }
						>
							{ parts.map( ( part, index ) => (
								<span key={ `${ preset }-${ index }` } />
							) ) }
						</button>
					);
				} ) }
			</div>
			<p className="smm-layout-picker__help">
				{ __(
					'Choose how enabled columns share the panel width.',
					'structured-mega-menu'
				) }
			</p>
		</div>
	);
}
