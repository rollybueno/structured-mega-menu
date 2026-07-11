<?php
/**
 * Schema migration service.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Migrates mega menu schemas between versions.
 */
class Migrations {

	/**
	 * Hooks migration-related actions.
	 *
	 * @return void
	 */
	public static function init() {
		add_action( 'admin_init', array( __CLASS__, 'maybe_upgrade' ) );
	}

	/**
	 * Runs plugin-level upgrades when the stored schema version lags.
	 *
	 * @return void
	 */
	public static function maybe_upgrade() {
		$stored = (int) get_option( 'smm_schema_version', 0 );

		if ( $stored >= SMM_SCHEMA_VERSION ) {
			return;
		}

		update_option( 'smm_schema_version', SMM_SCHEMA_VERSION, false );
	}

	/**
	 * Migrates a schema array from an older version to the current version.
	 *
	 * @param array $schema  Schema data.
	 * @param int   $version Source schema version.
	 * @return array
	 */
	public static function migrate( array $schema, $version ) {
		$version = (int) $version;

		if ( $version < 1 ) {
			$schema  = self::migrate_to_v1( $schema );
			$version = 1;
		}

		// Future migrations go here.

		$schema['version'] = SMM_SCHEMA_VERSION;

		return $schema;
	}

	/**
	 * Normalizes unknown or empty payloads into a v1 schema shape.
	 *
	 * @param array $schema Raw schema.
	 * @return array
	 */
	private static function migrate_to_v1( array $schema ) {
		$default = Schema::get_default();

		if ( empty( $schema ) ) {
			return $default;
		}

		if ( ! isset( $schema['settings'] ) || ! is_array( $schema['settings'] ) ) {
			$schema['settings'] = $default['settings'];
		} else {
			$schema['settings'] = array_merge( $default['settings'], $schema['settings'] );
		}

		if ( ! isset( $schema['columns'] ) || ! is_array( $schema['columns'] ) ) {
			$schema['columns'] = array();
		}

		$schema['version'] = 1;

		return $schema;
	}
}
