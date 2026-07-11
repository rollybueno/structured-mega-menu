<?php
/**
 * Plugin Name:       Structured Mega Menu
 * Plugin URI:        https://wordpress.org/plugins/structured-mega-menu/
 * Description:       Create responsive mega menus with structured image, icon-link, and link-list columns for the WordPress Navigation block.
 * Version:           1.0.0
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Author:            Structured Mega Menu Contributors
 * Author URI:        https://wordpress.org/plugins/structured-mega-menu/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       structured-mega-menu
 *
 * @package StructuredMegaMenu
 */

defined( 'ABSPATH' ) || exit;

/*
 * Global constants use the SMM_ prefix (project convention).
 * WPCS PrefixAllGlobals ignores prefixes shorter than 4 characters, so these
 * defines are intentionally excluded from that sniff.
 */
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- SMM_ is the documented plugin prefix.
define( 'SMM_VERSION', '1.0.0' );
define( 'SMM_PLUGIN_FILE', __FILE__ );
define( 'SMM_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'SMM_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'SMM_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
define( 'SMM_SCHEMA_VERSION', 1 );
define( 'SMM_POST_TYPE', 'smm_mega_menu' );
define( 'SMM_META_SCHEMA', '_smm_menu_schema' );
define( 'SMM_META_SCHEMA_VERSION', '_smm_schema_version' );
define( 'SMM_META_SETTINGS', '_smm_menu_settings' );
define( 'SMM_OPTION_DELETE_DATA', 'smm_delete_data_on_uninstall' );
define( 'SMM_MAX_COLUMNS', 4 );
// phpcs:enable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound

require_once SMM_PLUGIN_DIR . 'includes/class-autoloader.php';

StructuredMegaMenu\Autoloader::register( SMM_PLUGIN_DIR . 'includes/' );

register_activation_hook( __FILE__, array( 'StructuredMegaMenu\\Activator', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'StructuredMegaMenu\\Activator', 'deactivate' ) );

add_action(
	'plugins_loaded',
	static function () {
		StructuredMegaMenu\Plugin::instance()->init();
	}
);
