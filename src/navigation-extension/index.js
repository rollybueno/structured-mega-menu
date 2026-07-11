/**
 * Extends core/navigation to allow the mega menu item block.
 */

import { addFilter } from '@wordpress/hooks';

/**
 * Appends the mega menu item block to Navigation allowed blocks.
 *
 * @param {Object} settings Block settings.
 * @param {string} name     Block name.
 * @return {Object} Filtered settings.
 */
function addMegaMenuToNavigation( settings, name ) {
	if ( name !== 'core/navigation' ) {
		return settings;
	}

	const existing = settings.allowedBlocks;

	if ( ! Array.isArray( existing ) ) {
		return {
			...settings,
			allowedBlocks: [ 'structured-mega-menu/menu-item' ],
		};
	}

	if ( existing.includes( 'structured-mega-menu/menu-item' ) ) {
		return settings;
	}

	return {
		...settings,
		allowedBlocks: [ ...existing, 'structured-mega-menu/menu-item' ],
	};
}

addFilter(
	'blocks.registerBlockType',
	'structured-mega-menu/allow-in-navigation',
	addMegaMenuToNavigation
);
