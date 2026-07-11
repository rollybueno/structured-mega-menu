<?php
/**
 * PHPUnit bootstrap for Structured Mega Menu unit tests.
 *
 * Loads lightweight WordPress function stubs so schema/sanitizer/helpers
 * can be tested without the full WordPress test suite. Integration tests
 * that need WP_UnitTestCase should set WP_TESTS_DIR and use bootstrap-wp.php.
 *
 * @package StructuredMegaMenu
 */

// phpcs:ignoreFile

$plugin_root = dirname( __DIR__, 2 );

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', $plugin_root . '/../../../../' );
}

if ( ! defined( 'SMM_VERSION' ) ) {
	define( 'SMM_VERSION', '1.0.0' );
}
if ( ! defined( 'SMM_PLUGIN_FILE' ) ) {
	define( 'SMM_PLUGIN_FILE', $plugin_root . '/structured-mega-menu.php' );
}
if ( ! defined( 'SMM_PLUGIN_DIR' ) ) {
	define( 'SMM_PLUGIN_DIR', $plugin_root . '/' );
}
if ( ! defined( 'SMM_PLUGIN_URL' ) ) {
	define( 'SMM_PLUGIN_URL', 'http://example.test/wp-content/plugins/structured-mega-menu/' );
}
if ( ! defined( 'SMM_PLUGIN_BASENAME' ) ) {
	define( 'SMM_PLUGIN_BASENAME', 'structured-mega-menu/structured-mega-menu.php' );
}
if ( ! defined( 'SMM_SCHEMA_VERSION' ) ) {
	define( 'SMM_SCHEMA_VERSION', 1 );
}
if ( ! defined( 'SMM_POST_TYPE' ) ) {
	define( 'SMM_POST_TYPE', 'smm_mega_menu' );
}
if ( ! defined( 'SMM_META_SCHEMA' ) ) {
	define( 'SMM_META_SCHEMA', '_smm_menu_schema' );
}
if ( ! defined( 'SMM_META_SCHEMA_VERSION' ) ) {
	define( 'SMM_META_SCHEMA_VERSION', '_smm_schema_version' );
}
if ( ! defined( 'SMM_META_SETTINGS' ) ) {
	define( 'SMM_META_SETTINGS', '_smm_menu_settings' );
}
if ( ! defined( 'SMM_OPTION_DELETE_DATA' ) ) {
	define( 'SMM_OPTION_DELETE_DATA', 'smm_delete_data_on_uninstall' );
}
if ( ! defined( 'SMM_MAX_COLUMNS' ) ) {
	define( 'SMM_MAX_COLUMNS', 4 );
}

require_once $plugin_root . '/tests/phpunit/includes/wp-stubs.php';

require_once $plugin_root . '/includes/class-autoloader.php';
\StructuredMegaMenu\Autoloader::register( $plugin_root . '/includes/' );

require_once __DIR__ . '/includes/testcase.php';
