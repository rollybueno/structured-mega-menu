<?php
/**
 * Post meta registration.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Registers and protects mega menu post meta.
 */
class Meta {

	/**
	 * Hooks meta registration.
	 *
	 * @return void
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'register' ) );
	}

	/**
	 * Registers post meta keys.
	 *
	 * @return void
	 */
	public static function register() {
		register_post_meta(
			SMM_POST_TYPE,
			SMM_META_SCHEMA,
			array(
				'type'              => 'string',
				'description'       => __( 'Canonical JSON schema for the mega menu configuration.', 'structured-mega-menu' ),
				'single'            => true,
				'default'           => '',
				'show_in_rest'      => true,
				'auth_callback'     => array( __CLASS__, 'auth_callback' ),
				'sanitize_callback' => array( __CLASS__, 'sanitize_schema_meta' ),
			)
		);

		register_post_meta(
			SMM_POST_TYPE,
			SMM_META_SCHEMA_VERSION,
			array(
				'type'              => 'integer',
				'description'       => __( 'Schema version for the mega menu configuration.', 'structured-mega-menu' ),
				'single'            => true,
				'default'           => SMM_SCHEMA_VERSION,
				'show_in_rest'      => true,
				'auth_callback'     => array( __CLASS__, 'auth_callback' ),
				'sanitize_callback' => 'absint',
			)
		);

		register_post_meta(
			SMM_POST_TYPE,
			SMM_META_SETTINGS,
			array(
				'type'              => 'string',
				'description'       => __( 'JSON-encoded top-level menu settings snapshot.', 'structured-mega-menu' ),
				'single'            => true,
				'default'           => '',
				'show_in_rest'      => true,
				'auth_callback'     => array( __CLASS__, 'auth_callback' ),
				'sanitize_callback' => array( __CLASS__, 'sanitize_settings_meta' ),
			)
		);
	}

	/**
	 * Auth callback for mega menu meta.
	 *
	 * @param bool   $allowed  Whether the user can add the meta (unused).
	 * @param string $meta_key Meta key.
	 * @param int    $post_id  Post ID.
	 * @return bool
	 */
	public static function auth_callback( $allowed, $meta_key, $post_id ) {
		unset( $allowed, $meta_key );

		return Capabilities::user_can_edit_menu( $post_id );
	}

	/**
	 * Sanitizes the schema meta value.
	 *
	 * Accepts a JSON string or array. Always persists a validated JSON string.
	 *
	 * @param mixed $value Raw meta value.
	 * @return string
	 */
	public static function sanitize_schema_meta( $value ) {
		$sanitizer = new Sanitizer( Plugin::instance()->get_column_registry() );
		$schema    = $sanitizer->sanitize_schema( $value );

		/**
		 * Filters the sanitized mega menu schema before persistence.
		 *
		 * @since 1.0.0
		 *
		 * @param array $schema Sanitized schema array.
		 */
		$schema = apply_filters( 'structured_mega_menu_menu_schema', $schema );

		$encoded = wp_json_encode( $schema );

		return is_string( $encoded ) ? $encoded : wp_json_encode( Schema::get_default() );
	}

	/**
	 * Sanitizes the settings meta snapshot.
	 *
	 * @param mixed $value Raw meta value.
	 * @return string
	 */
	public static function sanitize_settings_meta( $value ) {
		$sanitizer = new Sanitizer( Plugin::instance()->get_column_registry() );

		if ( is_string( $value ) && '' !== $value ) {
			$decoded = json_decode( $value, true );
			$value   = is_array( $decoded ) ? $decoded : array();
		}

		if ( ! is_array( $value ) ) {
			$value = array();
		}

		$settings = $sanitizer->sanitize_settings( $value );
		$encoded  = wp_json_encode( $settings );

		return is_string( $encoded ) ? $encoded : wp_json_encode( Schema::get_default_settings() );
	}

	/**
	 * Retrieves and decodes the schema for a mega menu post.
	 *
	 * @param int $post_id Post ID.
	 * @return array
	 */
	public static function get_schema( $post_id ) {
		$post_id = absint( $post_id );
		$raw     = get_post_meta( $post_id, SMM_META_SCHEMA, true );

		$sanitizer = new Sanitizer( Plugin::instance()->get_column_registry() );
		$schema    = $sanitizer->sanitize_schema( $raw );

		$version = (int) get_post_meta( $post_id, SMM_META_SCHEMA_VERSION, true );
		if ( $version < SMM_SCHEMA_VERSION ) {
			$schema = Migrations::migrate( $schema, $version );
		}

		return $schema;
	}
}
