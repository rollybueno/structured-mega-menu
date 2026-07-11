<?php
/**
 * Built-in icon registry (Phase 1 scaffold).
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Manages the locally bundled icon library.
 */
class Icons {

	/**
	 * Built-in icon definitions keyed by slug.
	 *
	 * @var array<string, array>
	 */
	private static $icons = array();

	/**
	 * Initializes the icon registry.
	 *
	 * @return void
	 */
	public static function init() {
		self::$icons = self::get_default_icons();

		/**
		 * Filters the built-in icon registry.
		 *
		 * @since 1.0.0
		 *
		 * @param array $icons Icon definitions keyed by slug.
		 */
		self::$icons = apply_filters( 'structured_mega_menu_icon_registry', self::$icons );
	}

	/**
	 * Returns default general-purpose icons.
	 *
	 * SVG markup is added in Phase 4. Phase 1 registers slugs and labels only.
	 *
	 * @return array<string, array>
	 */
	public static function get_default_icons() {
		return array(
			'chart'        => array(
				'label' => __( 'Chart', 'structured-mega-menu' ),
				'group' => 'general',
			),
			'document'     => array(
				'label' => __( 'Document', 'structured-mega-menu' ),
				'group' => 'general',
			),
			'globe'        => array(
				'label' => __( 'Globe', 'structured-mega-menu' ),
				'group' => 'general',
			),
			'heart'        => array(
				'label' => __( 'Heart', 'structured-mega-menu' ),
				'group' => 'general',
			),
			'home'         => array(
				'label' => __( 'Home', 'structured-mega-menu' ),
				'group' => 'general',
			),
			'mail'         => array(
				'label' => __( 'Mail', 'structured-mega-menu' ),
				'group' => 'general',
			),
			'map-pin'      => array(
				'label' => __( 'Map pin', 'structured-mega-menu' ),
				'group' => 'general',
			),
			'phone'        => array(
				'label' => __( 'Phone', 'structured-mega-menu' ),
				'group' => 'general',
			),
			'settings'     => array(
				'label' => __( 'Settings', 'structured-mega-menu' ),
				'group' => 'general',
			),
			'shopping-bag' => array(
				'label' => __( 'Shopping bag', 'structured-mega-menu' ),
				'group' => 'general',
			),
			'star'         => array(
				'label' => __( 'Star', 'structured-mega-menu' ),
				'group' => 'general',
			),
			'users'        => array(
				'label' => __( 'Users', 'structured-mega-menu' ),
				'group' => 'general',
			),
		);
	}

	/**
	 * Returns all registered icons.
	 *
	 * @return array<string, array>
	 */
	public static function all() {
		return self::$icons;
	}

	/**
	 * Whether an icon slug exists.
	 *
	 * @param string $slug Icon slug.
	 * @return bool
	 */
	public static function has( $slug ) {
		return isset( self::$icons[ sanitize_key( $slug ) ] );
	}

	/**
	 * Renders a decorative icon by slug.
	 *
	 * @param string $slug Icon slug.
	 * @return string Empty until SVG assets are wired in Phase 4.
	 */
	public static function render( $slug ) {
		$slug = sanitize_key( $slug );

		if ( ! self::has( $slug ) ) {
			return '';
		}

		// Trusted SVG markup is loaded from assets/icons in Phase 4.
		return '';
	}
}
