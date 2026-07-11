/**
 * Editor async operations (load / save / delete).
 */

import { __ } from '@wordpress/i18n';

import {
	META_SCHEMA,
	META_SCHEMA_VERSION,
	META_SETTINGS,
} from '../shared/constants';
import { getDefaultSchema } from '../shared/defaults';
import { validateSchema } from '../shared/validation';
import {
	fetchMenus,
	fetchMenu,
	createMenu,
	updateMenu,
	deleteMenu,
	parseSchemaFromPost,
	fetchIcons,
	updatePluginSettings,
} from './api';
import { syncLayoutPreset } from './utilities/columns';
import { getStoreDispatch, getStoreSelect, snapshotOf } from './store';

/**
 * Loads the menu list.
 *
 * @return {Promise<void>}
 */
export async function loadMenus() {
	const { setLoading, setError, setMenus } = getStoreDispatch();
	setLoading( true );
	setError( null );
	try {
		const menus = await fetchMenus();
		setMenus( Array.isArray( menus ) ? menus : [] );
	} catch ( error ) {
		setError(
			error?.message ||
				__( 'Unable to load mega menus.', 'structured-mega-menu' )
		);
	}
	setLoading( false );
}

/**
 * Loads icon definitions.
 *
 * @return {Promise<void>}
 */
export async function loadIcons() {
	const { setIcons } = getStoreDispatch();
	try {
		const icons = await fetchIcons();
		setIcons( Array.isArray( icons ) ? icons : [] );
	} catch ( e ) {
		setIcons( [] );
	}
}

/**
 * Opens a blank editor.
 *
 * @return {void}
 */
export function openNew() {
	const schema = getDefaultSchema();
	getStoreDispatch().setEditor( {
		currentId: null,
		title: __( 'Untitled mega menu', 'structured-mega-menu' ),
		schema,
		savedSnapshot: null,
		saveStatus: 'unsaved',
		view: 'editor',
		expandedColumns: {},
		expandedItems: {},
		validationErrors: [],
		undoNotice: null,
		error: null,
	} );
}

/**
 * Opens an existing menu.
 *
 * @param {number} id Post ID.
 * @return {Promise<void>}
 */
export async function openMenu( id ) {
	const { setLoading, setError, setEditor } = getStoreDispatch();
	setLoading( true );
	setError( null );
	try {
		const post = await fetchMenu( id );
		const schema = syncLayoutPreset(
			parseSchemaFromPost( post, getDefaultSchema() )
		);
		const title = post?.title?.raw || post?.title?.rendered || '';
		setEditor( {
			currentId: post.id,
			title,
			schema,
			savedSnapshot: snapshotOf( schema, title ),
			saveStatus: 'saved',
			view: 'editor',
			expandedColumns: {},
			expandedItems: {},
			validationErrors: [],
			undoNotice: null,
			error: null,
		} );
	} catch ( error ) {
		setError(
			error?.message ||
				__( 'Unable to open mega menu.', 'structured-mega-menu' )
		);
	}
	setLoading( false );
}

/**
 * Returns to the list view.
 *
 * @return {Promise<void>}
 */
export async function backToList() {
	getStoreDispatch().setView( 'list' );
	await loadMenus();
}

/**
 * Saves the current editor state.
 *
 * @return {Promise<{ok: boolean, errors?: Array}>} Save result.
 */
export async function saveCurrent() {
	const state = getStoreSelect();
	const { setValidationErrors, setSaveStatus, setError, setEditor } =
		getStoreDispatch();

	const errors = validateSchema( state.getSchema() );
	setValidationErrors( errors );

	if ( errors.length ) {
		setSaveStatus( 'error' );
		return { ok: false, errors };
	}

	setSaveStatus( 'saving' );
	setError( null );

	const schema = state.getSchema();
	const title =
		state.getTitle() || __( 'Untitled mega menu', 'structured-mega-menu' );
	const currentId = state.getCurrentId();

	const payload = {
		title,
		status: 'publish',
		meta: {
			[ META_SCHEMA ]: JSON.stringify( schema ),
			[ META_SCHEMA_VERSION ]: schema.version || 1,
			[ META_SETTINGS ]: JSON.stringify( schema.settings || {} ),
		},
	};

	try {
		const post = currentId
			? await updateMenu( currentId, payload )
			: await createMenu( payload );

		const nextSchema = syncLayoutPreset(
			parseSchemaFromPost( post, schema )
		);
		const nextTitle = post?.title?.raw || title;

		setEditor( {
			currentId: post.id,
			title: nextTitle,
			schema: nextSchema,
			savedSnapshot: snapshotOf( nextSchema, nextTitle ),
			saveStatus: 'saved',
			view: 'editor',
			validationErrors: [],
			error: null,
		} );

		return { ok: true, post };
	} catch ( error ) {
		setSaveStatus( 'error' );
		setError(
			error?.message ||
				__(
					'Save failed. Your changes were kept.',
					'structured-mega-menu'
				)
		);
		return { ok: false, error };
	}
}

/**
 * Deletes the current menu.
 *
 * @return {Promise<void>}
 */
export async function deleteCurrent() {
	const { getCurrentId } = getStoreSelect();
	const { setError, setDeleteModal, setView } = getStoreDispatch();
	const currentId = getCurrentId();

	if ( ! currentId ) {
		setView( 'list' );
		return;
	}

	try {
		await deleteMenu( currentId );
		setDeleteModal( null );
		setView( 'list' );
		await loadMenus();
	} catch ( error ) {
		setError(
			error?.message ||
				__( 'Unable to delete mega menu.', 'structured-mega-menu' )
		);
	}
}

/**
 * Persists the uninstall data-deletion setting.
 *
 * @param {boolean} value Setting value.
 * @return {Promise<void>}
 */
export async function savePluginSetting( value ) {
	getStoreDispatch().setPluginSetting( value );
	try {
		await updatePluginSettings( { deleteDataOnUninstall: value } );
	} catch ( e ) {
		// Keep local value.
	}
}
