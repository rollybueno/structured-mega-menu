/**
 * Admin editor reducer (testable without registering the data store).
 */

import { __ } from '@wordpress/i18n';

import { COLUMN_TYPES } from '../shared/constants';
import { getDefaultSchema } from '../shared/defaults';
import {
	createColumn,
	duplicateColumn,
	createItem,
	duplicateItem,
	syncLayoutPreset,
	canAddColumn,
	moveIndex,
	switchRepeaterType,
} from './utilities/columns';

export const DEFAULT_STATE = {
	view: 'list',
	menus: [],
	icons: [],
	currentId: null,
	title: '',
	schema: getDefaultSchema(),
	savedSnapshot: null,
	saveStatus: 'saved',
	isLoading: false,
	error: null,
	validationErrors: [],
	undoNotice: null,
	expandedColumns: {},
	expandedItems: {},
	deleteDataOnUninstall: !! (
		typeof window !== 'undefined' && window.smmAdmin?.deleteDataOnUninstall
	),
	typeChangeModal: null,
	deleteModal: null,
	focusItemId: null,
};

export function editorReducer( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case 'SET_VIEW':
			return { ...state, view: action.view };
		case 'SET_LOADING':
			return { ...state, isLoading: action.isLoading };
		case 'SET_ERROR':
			return { ...state, error: action.error };
		case 'SET_MENUS':
			return { ...state, menus: action.menus };
		case 'SET_ICONS':
			return { ...state, icons: action.icons };
		case 'SET_EDITOR':
			return { ...state, ...action.payload };
		case 'UPDATE_TITLE':
			return {
				...state,
				title: action.title,
				saveStatus: 'unsaved',
			};
		case 'SET_SAVE_STATUS':
			return { ...state, saveStatus: action.saveStatus };
		case 'SET_VALIDATION_ERRORS':
			return { ...state, validationErrors: action.validationErrors };
		case 'SET_UNDO_NOTICE':
			return { ...state, undoNotice: action.undoNotice };
		case 'SET_FOCUS_ITEM_ID':
			return { ...state, focusItemId: action.focusItemId };
		case 'TOGGLE_COLUMN_EXPANDED': {
			const current = !! state.expandedColumns[ action.columnId ];
			const next =
				typeof action.force === 'boolean' ? action.force : ! current;
			return {
				...state,
				expandedColumns: {
					...state.expandedColumns,
					[ action.columnId ]: next,
				},
			};
		}
		case 'TOGGLE_ITEM_EXPANDED': {
			const current = !! state.expandedItems[ action.itemId ];
			const next =
				typeof action.force === 'boolean' ? action.force : ! current;
			return {
				...state,
				expandedItems: {
					...state.expandedItems,
					[ action.itemId ]: next,
				},
			};
		}
		case 'SET_TYPE_CHANGE_MODAL':
			return { ...state, typeChangeModal: action.typeChangeModal };
		case 'SET_DELETE_MODAL':
			return { ...state, deleteModal: action.deleteModal };
		case 'SET_PLUGIN_SETTING':
			return {
				...state,
				deleteDataOnUninstall: action.deleteDataOnUninstall,
			};
		case 'UPDATE_SETTINGS': {
			const schema = syncLayoutPreset( {
				...state.schema,
				settings: {
					...state.schema.settings,
					...action.settings,
				},
			} );
			return { ...state, schema, saveStatus: 'unsaved' };
		}
		case 'ADD_COLUMN': {
			if ( ! canAddColumn( state.schema.columns ) ) {
				return state;
			}
			const column = createColumn( action.columnType );
			const columns = [ ...state.schema.columns, column ];
			return {
				...state,
				schema: syncLayoutPreset( {
					...state.schema,
					columns,
				} ),
				saveStatus: 'unsaved',
				expandedColumns: {
					...state.expandedColumns,
					[ column.id ]: true,
				},
			};
		}
		case 'UPDATE_COLUMN': {
			const columns = state.schema.columns.map( ( column ) => {
				if ( column.id !== action.columnId ) {
					return column;
				}
				return typeof action.updater === 'function'
					? action.updater( column )
					: { ...column, ...action.updater };
			} );
			return {
				...state,
				schema: syncLayoutPreset( { ...state.schema, columns } ),
				saveStatus: 'unsaved',
			};
		}
		case 'REMOVE_COLUMN': {
			const index = state.schema.columns.findIndex(
				( column ) => column.id === action.columnId
			);
			if ( index < 0 ) {
				return state;
			}
			const removed = state.schema.columns[ index ];
			const columns = state.schema.columns.filter(
				( column ) => column.id !== action.columnId
			);
			return {
				...state,
				schema: syncLayoutPreset( { ...state.schema, columns } ),
				saveStatus: 'unsaved',
				undoNotice: {
					kind: 'column',
					index,
					item: removed,
					message: __( 'Column removed.', 'structured-mega-menu' ),
				},
			};
		}
		case 'DUPLICATE_COLUMN': {
			if ( ! canAddColumn( state.schema.columns ) ) {
				return state;
			}
			const index = state.schema.columns.findIndex(
				( column ) => column.id === action.columnId
			);
			if ( index < 0 ) {
				return state;
			}
			const copy = duplicateColumn( state.schema.columns[ index ] );
			const columns = [ ...state.schema.columns ];
			columns.splice( index + 1, 0, copy );
			return {
				...state,
				schema: syncLayoutPreset( { ...state.schema, columns } ),
				saveStatus: 'unsaved',
				expandedColumns: {
					...state.expandedColumns,
					[ copy.id ]: true,
				},
			};
		}
		case 'MOVE_COLUMN': {
			const index = state.schema.columns.findIndex(
				( column ) => column.id === action.columnId
			);
			if ( index < 0 ) {
				return state;
			}
			const to = action.direction === 'left' ? index - 1 : index + 1;
			return {
				...state,
				schema: {
					...state.schema,
					columns: moveIndex( state.schema.columns, index, to ),
				},
				saveStatus: 'unsaved',
			};
		}
		case 'CHANGE_COLUMN_TYPE': {
			const index = state.schema.columns.findIndex(
				( column ) => column.id === action.columnId
			);
			if ( index < 0 ) {
				return state;
			}
			const column = state.schema.columns[ index ];
			const nextType = action.nextType;
			const isRepeaterSwitch =
				( column.type === COLUMN_TYPES.ICON_LINKS ||
					column.type === COLUMN_TYPES.LINK_LIST ) &&
				( nextType === COLUMN_TYPES.ICON_LINKS ||
					nextType === COLUMN_TYPES.LINK_LIST );

			const isDestructive =
				! isRepeaterSwitch && column.type !== nextType;

			if ( isDestructive && ! action.confirmed ) {
				return {
					...state,
					typeChangeModal: {
						columnId: column.id,
						nextType,
					},
				};
			}

			const nextColumn = isRepeaterSwitch
				? switchRepeaterType( column, nextType )
				: {
						...createColumn( nextType ),
						id: column.id,
						enabled: column.enabled !== false,
				  };

			const columns = [ ...state.schema.columns ];
			columns[ index ] = nextColumn;

			return {
				...state,
				schema: syncLayoutPreset( { ...state.schema, columns } ),
				saveStatus: 'unsaved',
				typeChangeModal: null,
				expandedColumns: {
					...state.expandedColumns,
					[ nextColumn.id ]: true,
				},
			};
		}
		case 'ADD_ITEM': {
			let newId = null;
			const columns = state.schema.columns.map( ( column ) => {
				if ( column.id !== action.columnId ) {
					return column;
				}
				const item = createItem( column.type );
				newId = item.id;
				return {
					...column,
					settings: {
						...column.settings,
						items: [ ...( column.settings.items || [] ), item ],
					},
				};
			} );
			return {
				...state,
				schema: { ...state.schema, columns },
				saveStatus: 'unsaved',
				expandedItems: newId
					? { ...state.expandedItems, [ newId ]: true }
					: state.expandedItems,
				focusItemId: newId,
			};
		}
		case 'UPDATE_ITEM': {
			const columns = state.schema.columns.map( ( column ) => {
				if ( column.id !== action.columnId ) {
					return column;
				}
				const items = ( column.settings.items || [] ).map( ( item ) =>
					item.id === action.itemId
						? { ...item, ...action.patch }
						: item
				);
				return {
					...column,
					settings: { ...column.settings, items },
				};
			} );
			return {
				...state,
				schema: { ...state.schema, columns },
				saveStatus: 'unsaved',
			};
		}
		case 'REMOVE_ITEM': {
			let notice = null;
			const columns = state.schema.columns.map( ( column ) => {
				if ( column.id !== action.columnId ) {
					return column;
				}
				const items = column.settings.items || [];
				const index = items.findIndex(
					( item ) => item.id === action.itemId
				);
				if ( index < 0 ) {
					return column;
				}
				const removed = items[ index ];
				notice = {
					kind: 'item',
					columnId: column.id,
					index,
					item: removed,
					message: removed.label
						? sprintf(
								/* translators: %s: removed link label */
								__( '“%s” removed.', 'structured-mega-menu' ),
								removed.label
						  )
						: __( 'Link removed.', 'structured-mega-menu' ),
				};
				return {
					...column,
					settings: {
						...column.settings,
						items: items.filter(
							( item ) => item.id !== action.itemId
						),
					},
				};
			} );
			return {
				...state,
				schema: { ...state.schema, columns },
				saveStatus: 'unsaved',
				undoNotice: notice || state.undoNotice,
			};
		}
		case 'DUPLICATE_ITEM': {
			let newId = null;
			const columns = state.schema.columns.map( ( column ) => {
				if ( column.id !== action.columnId ) {
					return column;
				}
				const items = [ ...( column.settings.items || [] ) ];
				const index = items.findIndex(
					( item ) => item.id === action.itemId
				);
				if ( index < 0 ) {
					return column;
				}
				const copy = duplicateItem( items[ index ] );
				newId = copy.id;
				items.splice( index + 1, 0, copy );
				return {
					...column,
					settings: { ...column.settings, items },
				};
			} );
			return {
				...state,
				schema: { ...state.schema, columns },
				saveStatus: 'unsaved',
				expandedItems: newId
					? { ...state.expandedItems, [ newId ]: true }
					: state.expandedItems,
				focusItemId: newId,
			};
		}
		case 'MOVE_ITEM': {
			const columns = state.schema.columns.map( ( column ) => {
				if ( column.id !== action.columnId ) {
					return column;
				}
				const items = [ ...( column.settings.items || [] ) ];
				const index = items.findIndex(
					( item ) => item.id === action.itemId
				);
				if ( index < 0 ) {
					return column;
				}
				let to = index;
				switch ( action.target ) {
					case 'up':
						to = index - 1;
						break;
					case 'down':
						to = index + 1;
						break;
					case 'top':
						to = 0;
						break;
					case 'bottom':
						to = items.length - 1;
						break;
				}
				return {
					...column,
					settings: {
						...column.settings,
						items: moveIndex( items, index, to ),
					},
				};
			} );
			return {
				...state,
				schema: { ...state.schema, columns },
				saveStatus: 'unsaved',
			};
		}
		case 'UNDO_REMOVE': {
			if ( ! state.undoNotice ) {
				return state;
			}
			const notice = state.undoNotice;
			if ( notice.kind === 'column' ) {
				const columns = [ ...state.schema.columns ];
				columns.splice( notice.index, 0, notice.item );
				return {
					...state,
					schema: syncLayoutPreset( {
						...state.schema,
						columns,
					} ),
					saveStatus: 'unsaved',
					undoNotice: null,
				};
			}
			if ( notice.kind === 'item' ) {
				const columns = state.schema.columns.map( ( column ) => {
					if ( column.id !== notice.columnId ) {
						return column;
					}
					const items = [ ...( column.settings.items || [] ) ];
					items.splice( notice.index, 0, notice.item );
					return {
						...column,
						settings: { ...column.settings, items },
					};
				} );
				return {
					...state,
					schema: { ...state.schema, columns },
					saveStatus: 'unsaved',
					undoNotice: null,
				};
			}
			return { ...state, undoNotice: null };
		}
		default:
			return state;
	}
}

/**
 * @return {Object} Fresh default editor state.
 */
export function getDefaultEditorState() {
	return {
		...DEFAULT_STATE,
		schema: getDefaultSchema(),
		expandedColumns: {},
		expandedItems: {},
	};
}

// Local sprintf to avoid extra dependency in reducer path.
function sprintf( format, ...args ) {
	let i = 0;
	return format.replace( /%s/g, () => args[ i++ ] );
}
