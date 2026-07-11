/**
 * Admin data store for mega menu editing.
 */

import { createReduxStore, register, select, dispatch } from '@wordpress/data';

import { STORE_NAME } from '../shared/constants';
import { countEnabledColumns } from '../shared/schema';
import { DEFAULT_STATE, editorReducer } from './reducer';

/**
 * @param {Object} schema Schema.
 * @param {string} title  Title.
 * @return {string} Snapshot key.
 */
export function snapshotOf( schema, title ) {
	return JSON.stringify( { title, schema } );
}

const actions = {
	setView( view ) {
		return { type: 'SET_VIEW', view };
	},
	setLoading( isLoading ) {
		return { type: 'SET_LOADING', isLoading };
	},
	setError( error ) {
		return { type: 'SET_ERROR', error };
	},
	setMenus( menus ) {
		return { type: 'SET_MENUS', menus };
	},
	setIcons( icons ) {
		return { type: 'SET_ICONS', icons };
	},
	setEditor( payload ) {
		return { type: 'SET_EDITOR', payload };
	},
	setSaveStatus( saveStatus ) {
		return { type: 'SET_SAVE_STATUS', saveStatus };
	},
	setValidationErrors( validationErrors ) {
		return { type: 'SET_VALIDATION_ERRORS', validationErrors };
	},
	setUndoNotice( undoNotice ) {
		return { type: 'SET_UNDO_NOTICE', undoNotice };
	},
	toggleColumnExpanded( columnId, force ) {
		return { type: 'TOGGLE_COLUMN_EXPANDED', columnId, force };
	},
	toggleItemExpanded( itemId, force ) {
		return { type: 'TOGGLE_ITEM_EXPANDED', itemId, force };
	},
	setTypeChangeModal( typeChangeModal ) {
		return { type: 'SET_TYPE_CHANGE_MODAL', typeChangeModal };
	},
	setDeleteModal( deleteModal ) {
		return { type: 'SET_DELETE_MODAL', deleteModal };
	},
	setPluginSetting( deleteDataOnUninstall ) {
		return { type: 'SET_PLUGIN_SETTING', deleteDataOnUninstall };
	},
	setFocusItemId( focusItemId ) {
		return { type: 'SET_FOCUS_ITEM_ID', focusItemId };
	},
	updateTitle( title ) {
		return { type: 'UPDATE_TITLE', title };
	},
	updateSettings( settings ) {
		return { type: 'UPDATE_SETTINGS', settings };
	},
	addColumn( columnType ) {
		return { type: 'ADD_COLUMN', columnType };
	},
	updateColumn( columnId, updater ) {
		return { type: 'UPDATE_COLUMN', columnId, updater };
	},
	removeColumn( columnId ) {
		return { type: 'REMOVE_COLUMN', columnId };
	},
	undoRemove() {
		return { type: 'UNDO_REMOVE' };
	},
	duplicateColumn( columnId ) {
		return { type: 'DUPLICATE_COLUMN', columnId };
	},
	moveColumn( columnId, direction ) {
		return { type: 'MOVE_COLUMN', columnId, direction };
	},
	changeColumnType( columnId, nextType, confirmed = false ) {
		return { type: 'CHANGE_COLUMN_TYPE', columnId, nextType, confirmed };
	},
	addItem( columnId ) {
		return { type: 'ADD_ITEM', columnId };
	},
	updateItem( columnId, itemId, patch ) {
		return { type: 'UPDATE_ITEM', columnId, itemId, patch };
	},
	removeItem( columnId, itemId ) {
		return { type: 'REMOVE_ITEM', columnId, itemId };
	},
	duplicateItem( columnId, itemId ) {
		return { type: 'DUPLICATE_ITEM', columnId, itemId };
	},
	moveItem( columnId, itemId, target ) {
		return { type: 'MOVE_ITEM', columnId, itemId, target };
	},
};

const store = createReduxStore( STORE_NAME, {
	reducer: editorReducer,
	actions,
	selectors: {
		getView: ( state ) => state.view,
		getMenus: ( state ) => state.menus,
		getIcons: ( state ) => state.icons,
		getCurrentId: ( state ) => state.currentId,
		getTitle: ( state ) => state.title,
		getSchema: ( state ) => state.schema,
		getSaveStatus: ( state ) => state.saveStatus,
		isLoading: ( state ) => state.isLoading,
		getError: ( state ) => state.error,
		getValidationErrors: ( state ) => state.validationErrors,
		getUndoNotice: ( state ) => state.undoNotice,
		isColumnExpanded: ( state, columnId ) =>
			!! state.expandedColumns[ columnId ],
		isItemExpanded: ( state, itemId ) => !! state.expandedItems[ itemId ],
		getTypeChangeModal: ( state ) => state.typeChangeModal,
		getDeleteModal: ( state ) => state.deleteModal,
		getDeleteDataOnUninstall: ( state ) => state.deleteDataOnUninstall,
		getFocusItemId: ( state ) => state.focusItemId,
		hasUnsavedChanges( state ) {
			if ( ! state.savedSnapshot ) {
				return (
					state.saveStatus === 'unsaved' ||
					( state.schema.columns || [] ).length > 0 ||
					!! state.title
				);
			}
			return (
				state.savedSnapshot !== snapshotOf( state.schema, state.title )
			);
		},
		getEnabledColumnCount( state ) {
			return countEnabledColumns( state.schema.columns || [] );
		},
	},
} );

register( store );

export function getStoreSelect() {
	return select( STORE_NAME );
}

export function getStoreDispatch() {
	return dispatch( STORE_NAME );
}

export { STORE_NAME, DEFAULT_STATE, editorReducer };
