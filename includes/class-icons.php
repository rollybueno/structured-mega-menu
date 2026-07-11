<?php
/**
 * Built-in icon registry with trusted local SVG markup.
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
	 * Returns default general-purpose icons with trusted path data.
	 *
	 * @return array<string, array>
	 */
	public static function get_default_icons() {
		return array(
			'chart'        => array(
				'label' => __( 'Chart', 'structured-mega-menu' ),
				'group' => 'general',
				'path'  => 'M3 3v18h18 M7 14l4-4 4 3 5-6',
			),
			'document'     => array(
				'label' => __( 'Document', 'structured-mega-menu' ),
				'group' => 'general',
				'path'  => 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h8 M8 9h2',
			),
			'globe'        => array(
				'label' => __( 'Globe', 'structured-mega-menu' ),
				'group' => 'general',
				'path'  => 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20',
			),
			'heart'        => array(
				'label' => __( 'Heart', 'structured-mega-menu' ),
				'group' => 'general',
				'path'  => 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z',
			),
			'home'         => array(
				'label' => __( 'Home', 'structured-mega-menu' ),
				'group' => 'general',
				'path'  => 'M3 11l9-8 9 8 M5 10v10h14V10',
			),
			'mail'         => array(
				'label' => __( 'Mail', 'structured-mega-menu' ),
				'group' => 'general',
				'path'  => 'M4 6h16v12H4z M4 6l8 7 8-7',
			),
			'map-pin'      => array(
				'label' => __( 'Map pin', 'structured-mega-menu' ),
				'group' => 'general',
				'path'  => 'M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11z M12 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
			),
			'phone'        => array(
				'label' => __( 'Phone', 'structured-mega-menu' ),
				'group' => 'general',
				'path'  => 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.8.3 1.6.6 2.3a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.8-1.1a2 2 0 0 1 2.1-.4c.7.3 1.5.5 2.3.6a2 2 0 0 1 1.7 1.9z',
			),
			'settings'     => array(
				'label' => __( 'Settings', 'structured-mega-menu' ),
				'group' => 'general',
				'path'  => 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
			),
			'shopping-bag' => array(
				'label' => __( 'Shopping bag', 'structured-mega-menu' ),
				'group' => 'general',
				'path'  => 'M6 8h12l1 13H5L6 8z M9 8a3 3 0 0 1 6 0',
			),
			'star'         => array(
				'label' => __( 'Star', 'structured-mega-menu' ),
				'group' => 'general',
				'path'  => 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z',
			),
			'users'        => array(
				'label' => __( 'Users', 'structured-mega-menu' ),
				'group' => 'general',
				'path'  => 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8',
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
	 * Renders a decorative icon by slug or media attachment.
	 *
	 * @param array|string $icon Icon slug or icon array with source/value.
	 * @return string
	 */
	public static function render( $icon ) {
		if ( is_string( $icon ) ) {
			$icon = array(
				'source' => 'library',
				'value'  => $icon,
			);
		}

		if ( ! is_array( $icon ) ) {
			return '';
		}

		$source = isset( $icon['source'] ) ? sanitize_key( $icon['source'] ) : 'library';

		if ( 'media' === $source ) {
			$attachment_id = absint( isset( $icon['value'] ) ? $icon['value'] : 0 );
			if ( ! $attachment_id ) {
				return '';
			}

			$html = wp_get_attachment_image(
				$attachment_id,
				'thumbnail',
				false,
				array(
					'class'    => 'smm-icon smm-icon--media',
					'alt'      => '',
					'loading'  => 'lazy',
					'decoding' => 'async',
				)
			);

			return is_string( $html ) ? $html : '';
		}

		$slug = sanitize_key( isset( $icon['value'] ) ? $icon['value'] : '' );

		if ( ! self::has( $slug ) ) {
			return '';
		}

		$path = isset( self::$icons[ $slug ]['path'] ) ? self::$icons[ $slug ]['path'] : '';

		if ( '' === $path ) {
			return '';
		}

		// Trusted built-in path data only — never user SVG.
		return sprintf(
			'<svg class="smm-icon smm-icon--%1$s" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="%2$s" /></svg>',
			esc_attr( $slug ),
			esc_attr( $path )
		);
	}
}
