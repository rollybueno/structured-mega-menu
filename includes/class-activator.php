<?php
/**
 * Activation and deactivation routines.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Handles plugin activation and deactivation.
 */
class Activator {

	/**
	 * Runs on plugin activation.
	 *
	 * @return void
	 */
	public static function activate() {
		Capabilities::add_caps();
		Post_Type::register();
		flush_rewrite_rules( false );

		if ( false === get_option( SMM_OPTION_DELETE_DATA, false ) ) {
			add_option( SMM_OPTION_DELETE_DATA, false, '', false );
		}

		update_option( 'smm_schema_version', SMM_SCHEMA_VERSION, false );
	}

	/**
	 * Runs on plugin deactivation.
	 *
	 * Does not delete plugin data.
	 *
	 * @return void
	 */
	public static function deactivate() {
		flush_rewrite_rules( false );
	}
}
