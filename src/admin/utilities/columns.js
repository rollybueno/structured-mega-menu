/**
 * Column and layout helpers for the admin editor.
 */

import {
	MAX_COLUMNS,
	LAYOUT_PRESETS,
	COLUMN_TYPES,
} from '../../shared/constants';
import { getColumnDefaults, getDefaultSettings } from '../../shared/defaults';
import { createColumnId, createItemId } from '../../shared/ids';
import { countEnabledColumns } from '../../shared/schema';

/**
 * @param {string} type Column type.
 * @return {Object} New column.
 */
export function createColumn( type ) {
	return {
		id: createColumnId(),
		type,
		width: 1,
		enabled: true,
		settings: { ...getColumnDefaults( type ) },
		_iconCache: type === COLUMN_TYPES.ICON_LINKS ? {} : undefined,
	};
}

/**
 * @param {Object} column Source column.
 * @return {Object} Duplicated column with new IDs.
 */
export function duplicateColumn( column ) {
	const copy = JSON.parse( JSON.stringify( column ) );
	copy.id = createColumnId();

	if ( Array.isArray( copy.settings?.items ) ) {
		copy.settings.items = copy.settings.items.map( ( item ) => ( {
			...item,
			id: createItemId(),
		} ) );
	}

	return copy;
}

/**
 * @param {string} type Item type context.
 * @return {Object} New repeater item.
 */
export function createItem( type ) {
	const base = {
		id: createItemId(),
		enabled: true,
		label: '',
		description: '',
		url: '',
		opensInNewTab: false,
	};

	if ( type === COLUMN_TYPES.ICON_LINKS ) {
		return {
			...base,
			icon: { source: 'library', value: 'document', url: '' },
		};
	}

	return base;
}

/**
 * @param {Object} item Source item.
 * @return {Object} Duplicate with new ID.
 */
export function duplicateItem( item ) {
	return {
		...JSON.parse( JSON.stringify( item ) ),
		id: createItemId(),
	};
}

/**
 * Syncs layout preset to enabled column count.
 *
 * @param {Object} schema Schema.
 * @return {Object} Schema with valid layout.
 */
export function syncLayoutPreset( schema ) {
	const enabled = countEnabledColumns( schema.columns || [] );
	const presets = LAYOUT_PRESETS[ enabled ] || [ '1' ];
	const current = schema.settings?.layoutPreset;
	const layoutPreset = presets.includes( current ) ? current : presets[ 0 ];

	return {
		...schema,
		settings: {
			...getDefaultSettings(),
			...( schema.settings || {} ),
			layoutPreset,
		},
	};
}

/**
 * @param {Array} columns Columns.
 * @return {boolean} Whether another column can be added.
 */
export function canAddColumn( columns ) {
	return ( columns?.length || 0 ) < MAX_COLUMNS;
}

/**
 * Moves an array item.
 *
 * @param {Array}  list List.
 * @param {number} from From index.
 * @param {number} to   To index.
 * @return {Array} New list.
 */
export function moveIndex( list, from, to ) {
	if (
		from < 0 ||
		to < 0 ||
		from >= list.length ||
		to >= list.length ||
		from === to
	) {
		return list;
	}

	const next = [ ...list ];
	const [ item ] = next.splice( from, 1 );
	next.splice( to, 0, item );
	return next;
}

/**
 * Converts between icon_links and link_list while preserving compatible fields.
 *
 * @param {Object} column   Column.
 * @param {string} nextType Target type.
 * @return {Object} Converted column.
 */
export function switchRepeaterType( column, nextType ) {
	const items = Array.isArray( column.settings?.items )
		? column.settings.items
		: [];

	if ( nextType === COLUMN_TYPES.LINK_LIST ) {
		const iconCache = {};
		items.forEach( ( item ) => {
			if ( item.icon ) {
				iconCache[ item.id ] = item.icon;
			}
		} );

		return {
			...column,
			type: nextType,
			settings: {
				heading: column.settings?.heading || '',
				description: column.settings?.description || '',
				displayStyle:
					column.settings?.displayStyle === 'compact'
						? 'simple'
						: 'with_descriptions',
				items: items.map( ( item ) => ( {
					id: item.id,
					enabled: item.enabled !== false,
					label: item.label || '',
					description: item.description || '',
					url: item.url || '',
					opensInNewTab: !! item.opensInNewTab,
				} ) ),
			},
			_iconCache: {
				...( column._iconCache || {} ),
				...iconCache,
			},
		};
	}

	if ( nextType === COLUMN_TYPES.ICON_LINKS ) {
		const cache = column._iconCache || {};
		return {
			...column,
			type: nextType,
			settings: {
				heading: column.settings?.heading || '',
				description: column.settings?.description || '',
				displayStyle:
					column.settings?.displayStyle === 'simple'
						? 'compact'
						: 'descriptive',
				iconPosition: 'left',
				items: items.map( ( item ) => ( {
					id: item.id,
					enabled: item.enabled !== false,
					label: item.label || '',
					description: item.description || '',
					url: item.url || '',
					opensInNewTab: !! item.opensInNewTab,
					icon: cache[ item.id ] || {
						source: 'library',
						value: 'document',
					},
				} ) ),
			},
			_iconCache: cache,
		};
	}

	return {
		...createColumn( nextType ),
		id: column.id,
		enabled: column.enabled !== false,
	};
}

/**
 * Human label for a column type.
 *
 * @param {string} type Type slug.
 * @return {string} Label.
 */
export function getTypeLabel( type ) {
	const config = window.smmAdmin?.columnTypes?.[ type ];
	if ( config?.label ) {
		return config.label;
	}

	switch ( type ) {
		case COLUMN_TYPES.IMAGE_CTA:
			return 'Image and CTA';
		case COLUMN_TYPES.ICON_LINKS:
			return 'Links with icons';
		case COLUMN_TYPES.LINK_LIST:
			return 'Link list';
		default:
			return type;
	}
}
