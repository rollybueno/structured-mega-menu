/**
 * Client-side validation helpers.
 *
 * Server-side sanitization remains authoritative.
 */

import { MAX_COLUMNS } from './constants';
import { countEnabledColumns, isValidLayoutForCount } from './schema';

/**
 * Validates a schema for the admin editor.
 *
 * @param {Object} schema Schema object.
 * @return {Array<{code: string, message: string, path: string}>} Errors.
 */
export function validateSchema( schema ) {
	const errors = [];

	if ( ! schema || typeof schema !== 'object' ) {
		return [
			{
				code: 'invalid_schema',
				message: 'Invalid mega menu schema.',
				path: '',
			},
		];
	}

	const columns = Array.isArray( schema.columns ) ? schema.columns : [];

	if ( columns.length > MAX_COLUMNS ) {
		errors.push( {
			code: 'too_many_columns',
			message: `A maximum of ${ MAX_COLUMNS } columns is allowed.`,
			path: 'columns',
		} );
	}

	const enabledCount = countEnabledColumns( columns );
	const layout =
		schema.settings && schema.settings.layoutPreset
			? schema.settings.layoutPreset
			: '';

	if ( enabledCount > 0 && ! isValidLayoutForCount( layout, enabledCount ) ) {
		errors.push( {
			code: 'invalid_layout',
			message:
				'The selected layout does not match the number of enabled columns.',
			path: 'settings.layoutPreset',
		} );
	}

	columns.forEach( ( column, columnIndex ) => {
		if ( ! column || ! column.settings ) {
			return;
		}

		const items = Array.isArray( column.settings.items )
			? column.settings.items
			: [];

		items.forEach( ( item, itemIndex ) => {
			if ( ! item || item.enabled === false ) {
				return;
			}

			if ( ! item.label ) {
				errors.push( {
					code: 'required_label',
					message: 'Link label is required.',
					path: `columns.${ columnIndex }.settings.items.${ itemIndex }.label`,
				} );
			}

			if ( ! item.url ) {
				errors.push( {
					code: 'required_url',
					message: 'Link destination is required.',
					path: `columns.${ columnIndex }.settings.items.${ itemIndex }.url`,
				} );
			}
		} );
	} );

	return errors;
}
