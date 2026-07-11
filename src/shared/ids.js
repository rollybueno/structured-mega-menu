/**
 * Stable client ID generation.
 */

/**
 * Generates a UUID-like identifier with a prefix.
 *
 * @param {string} prefix ID prefix.
 * @return {string} Unique ID.
 */
export function createId( prefix = 'smm' ) {
	if (
		typeof crypto !== 'undefined' &&
		typeof crypto.randomUUID === 'function'
	) {
		return `${ prefix }-${ crypto.randomUUID() }`;
	}

	const random = Math.random().toString( 16 ).slice( 2 );
	const time = Date.now().toString( 16 );
	return `${ prefix }-${ time }-${ random }`;
}

/**
 * Creates a column ID.
 *
 * @return {string} Column ID.
 */
export function createColumnId() {
	return createId( 'smm-col' );
}

/**
 * Creates a repeater item ID.
 *
 * @return {string} Item ID.
 */
export function createItemId() {
	return createId( 'smm-item' );
}
