/**
 * REST helpers for the admin application.
 */

import apiFetch from '@wordpress/api-fetch';

/**
 * @return {Object} Localized admin config.
 */
export function getAdminConfig() {
	return window.smmAdmin || {};
}

/**
 * Fetches all mega menus.
 *
 * @return {Promise<Array>} Menu posts.
 */
export async function fetchMenus() {
	const config = getAdminConfig();
	return apiFetch( {
		path: '/wp/v2/smm-mega-menus?per_page=100&context=edit&status=publish,draft,private',
		headers: config.restNonce
			? { 'X-WP-Nonce': config.restNonce }
			: undefined,
	} );
}

/**
 * Fetches a single mega menu.
 *
 * @param {number} id Post ID.
 * @return {Promise<Object>} Menu post.
 */
export async function fetchMenu( id ) {
	return apiFetch( {
		path: `/wp/v2/smm-mega-menus/${ id }?context=edit`,
	} );
}

/**
 * Creates a mega menu.
 *
 * @param {Object} payload Title and meta.
 * @return {Promise<Object>} Created post.
 */
export async function createMenu( payload ) {
	return apiFetch( {
		path: '/wp/v2/smm-mega-menus',
		method: 'POST',
		data: payload,
	} );
}

/**
 * Updates a mega menu.
 *
 * @param {number} id      Post ID.
 * @param {Object} payload Update payload.
 * @return {Promise<Object>} Updated post.
 */
export async function updateMenu( id, payload ) {
	return apiFetch( {
		path: `/wp/v2/smm-mega-menus/${ id }`,
		method: 'POST',
		data: payload,
	} );
}

/**
 * Deletes a mega menu.
 *
 * @param {number} id Post ID.
 * @return {Promise<Object>} Deleted post.
 */
export async function deleteMenu( id ) {
	return apiFetch( {
		path: `/wp/v2/smm-mega-menus/${ id }?force=true`,
		method: 'DELETE',
	} );
}

/**
 * Searches posts/terms for the link picker.
 *
 * @param {string} search Search term.
 * @return {Promise<Array>} Results.
 */
export async function searchLinks( search ) {
	const term = encodeURIComponent( search || '' );
	return apiFetch( {
		path: `/structured-mega-menu/v1/link-search?search=${ term }&per_page=20`,
	} );
}

/**
 * Fetches icon definitions.
 *
 * @return {Promise<Array>} Icons.
 */
export async function fetchIcons() {
	return apiFetch( {
		path: '/structured-mega-menu/v1/icons',
	} );
}

/**
 * Updates plugin settings.
 *
 * @param {Object} settings Settings payload.
 * @return {Promise<Object>} Updated settings.
 */
export async function updatePluginSettings( settings ) {
	return apiFetch( {
		path: '/structured-mega-menu/v1/settings',
		method: 'POST',
		data: settings,
	} );
}

/**
 * Parses schema JSON from post meta.
 *
 * @param {Object} post     REST post.
 * @param {Object} fallback Default schema.
 * @return {Object} Schema object.
 */
export function parseSchemaFromPost( post, fallback ) {
	const raw =
		post?.meta?._smm_menu_schema || post?.meta?._smm_menu_schema || '';

	if ( ! raw ) {
		return { ...fallback, columns: [] };
	}

	if ( typeof raw === 'object' ) {
		return raw;
	}

	try {
		const parsed = JSON.parse( raw );
		return parsed && typeof parsed === 'object' ? parsed : fallback;
	} catch ( e ) {
		return fallback;
	}
}
