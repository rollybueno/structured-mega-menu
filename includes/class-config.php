<?php
/**
 * Plugin configuration constants.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Central configuration values.
 *
 * Global define() aliases are also set in the main plugin file for convenience
 * in templates and procedural code, using the SMM_ prefix.
 */
final class Config {

	const VERSION         = '1.0.0';
	const SCHEMA_VERSION  = 1;
	const POST_TYPE       = 'smm_mega_menu';
	const META_SCHEMA     = '_smm_menu_schema';
	const META_SCHEMA_VER = '_smm_schema_version';
	const META_SETTINGS   = '_smm_menu_settings';
	const OPTION_DELETE   = 'smm_delete_data_on_uninstall';
	const MAX_COLUMNS     = 4;
}
