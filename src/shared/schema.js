/**
 * Client-side schema helpers.
 */

import { LAYOUT_PRESETS, MAX_COLUMNS } from './constants';
import { getDefaultSchema } from './defaults';

/**
 * Returns allowed layout presets for a column count.
 *
 * @param {number} columnCount Enabled column count.
 * @return {string[]} Layout presets.
 */
export function getLayoutsForCount( columnCount ) {
	const count = Number( columnCount );
	return LAYOUT_PRESETS[ count ] || [ '1' ];
}

/**
 * @param {string} preset      Layout preset.
 * @param {number} columnCount Column count.
 * @return {boolean} Whether the preset is valid.
 */
export function isValidLayoutForCount( preset, columnCount ) {
	return getLayoutsForCount( columnCount ).includes( preset );
}

/**
 * Converts a layout preset into a CSS grid-template-columns value.
 *
 * @param {string} preset Layout preset.
 * @return {string} Grid template.
 */
export function layoutToGridTemplate( preset ) {
	const parts = String( preset || '1' )
		.split( '-' )
		.map( ( part ) => part.trim() )
		.filter( Boolean );

	if ( ! parts.length ) {
		return 'minmax(0, 1fr)';
	}

	return parts
		.map( ( part ) => {
			const fr = Math.max( 1, parseInt( part, 10 ) || 1 );
			return `minmax(0, ${ fr }fr)`;
		} )
		.join( ' ' );
}

/**
 * Counts enabled columns.
 *
 * @param {Array} columns Columns array.
 * @return {number} Enabled count.
 */
export function countEnabledColumns( columns ) {
	if ( ! Array.isArray( columns ) ) {
		return 0;
	}
	return columns.filter( ( column ) => column && column.enabled !== false )
		.length;
}

/**
 * Ensures schema shape basics without claiming full server parity.
 *
 * @param {Object} schema Raw schema.
 * @return {Object} Normalized schema shell.
 */
export function normalizeSchemaShell( schema ) {
	const defaults = getDefaultSchema();

	if ( ! schema || typeof schema !== 'object' ) {
		return defaults;
	}

	const columns = Array.isArray( schema.columns )
		? schema.columns.slice( 0, MAX_COLUMNS )
		: [];

	return {
		version: defaults.version,
		settings: {
			...defaults.settings,
			...( schema.settings || {} ),
		},
		columns,
	};
}
