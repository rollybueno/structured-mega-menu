/**
 * Shared constants for Structured Mega Menu.
 */

export const SCHEMA_VERSION = 1;
export const MAX_COLUMNS = 4;
export const POST_TYPE = 'smm_mega_menu';
export const META_SCHEMA = '_smm_menu_schema';
export const META_SCHEMA_VERSION = '_smm_schema_version';
export const META_SETTINGS = '_smm_menu_settings';
export const REST_NAMESPACE = 'structured-mega-menu/v1';
export const STORE_NAME = 'structured-mega-menu/admin';

export const COLUMN_TYPES = {
	IMAGE_CTA: 'image_cta',
	ICON_LINKS: 'icon_links',
	LINK_LIST: 'link_list',
};

export const PANEL_WIDTHS = [ 'navigation', 'content', 'viewport' ];
export const OPENING_MODES = [ 'click', 'hover' ];
export const MOBILE_MODES = [ 'accordion', 'expanded' ];

export const LAYOUT_PRESETS = {
	1: [ '1' ],
	2: [ '1-1', '1-2', '2-1' ],
	3: [ '1-1-1', '1-1-2', '2-1-1' ],
	4: [ '1-1-1-1', '1-1-1-2', '2-1-1-1' ],
};
