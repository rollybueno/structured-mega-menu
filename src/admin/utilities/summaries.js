/**
 * Collapsed summary helpers for columns and repeater rows.
 */

import { COLUMN_TYPES } from '../../shared/constants';
import { getTypeLabel } from './columns';

/**
 * @param {Object} column Column.
 * @param {number} index  Zero-based index.
 * @return {string} Summary text.
 */
export function getColumnSummary( column, index ) {
	const typeLabel = getTypeLabel( column.type );
	const width = `${ column.width || 1 }fr`;
	let detail = '';

	if (
		column.type === COLUMN_TYPES.ICON_LINKS ||
		column.type === COLUMN_TYPES.LINK_LIST
	) {
		const count = Array.isArray( column.settings?.items )
			? column.settings.items.length
			: 0;
		detail = `${ count } items`;
	} else if ( column.type === COLUMN_TYPES.IMAGE_CTA ) {
		detail =
			column.settings?.heading ||
			column.settings?.ctaLabel ||
			'No heading';
	}

	const parts = [ typeLabel ];
	if ( detail ) {
		parts.push( detail );
	}
	parts.push( width );

	return `Column ${ index + 1 } · ${ parts.join( ' · ' ) }`;
}

/**
 * @param {Object} item Repeater item.
 * @return {{title: string, subtitle: string}} Summary.
 */
export function getItemSummary( item ) {
	return {
		title: item.label || 'Untitled link',
		subtitle: item.url || 'No destination',
	};
}
