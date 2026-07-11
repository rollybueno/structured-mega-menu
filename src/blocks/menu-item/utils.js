/**
 * Parses mega menu schema from a REST post entity.
 *
 * @param {Object|null} post Post entity.
 * @return {Object|null} Schema or null.
 */
export function parseMenuSchema( post ) {
	if ( ! post ) {
		return null;
	}

	const raw = post.meta?._smm_menu_schema;

	if ( ! raw ) {
		return { version: 1, settings: {}, columns: [] };
	}

	if ( typeof raw === 'object' ) {
		return raw;
	}

	try {
		return JSON.parse( raw );
	} catch ( e ) {
		return null;
	}
}

/**
 * Human-readable title from a menu post.
 *
 * @param {Object} post Post entity.
 * @return {string} Title.
 */
export function getMenuTitle( post ) {
	if ( ! post ) {
		return '';
	}

	return (
		post.title?.raw || post.title?.rendered?.replace( /<[^>]+>/g, '' ) || ''
	);
}

/**
 * Whether a post looks missing or unusable.
 *
 * @param {Object|null|undefined} post        Post entity.
 * @param {boolean}               hasResolved Whether the query resolved.
 * @param {number}                id          Requested ID.
 * @return {'ok'|'loading'|'missing'|'trashed'|'empty'} Status.
 */
export function getMenuStatus( post, hasResolved, id ) {
	if ( ! id ) {
		return 'empty';
	}

	if ( ! hasResolved ) {
		return 'loading';
	}

	if ( ! post ) {
		return 'missing';
	}

	if ( post.status === 'trash' ) {
		return 'trashed';
	}

	return 'ok';
}
