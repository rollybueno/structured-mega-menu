<?php
/**
 * Dashicons-backed icon registry for Links with icons columns.
 *
 * Uses WordPress core Dashicons (GPL) — no third-party icon package.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Manages the Dashicons library used by mega menu link icons.
 */
class Icons {

	/**
	 * Registered dashicon definitions keyed by dashicon name (without prefix).
	 *
	 * @var array<string, array>
	 */
	private static $icons = array();

	/**
	 * Maps legacy custom SVG slugs to Dashicons names.
	 *
	 * @var array<string, string>
	 */
	private static $legacy_map = array(
		'chart'        => 'chart-bar',
		'document'     => 'media-document',
		'globe'        => 'admin-site-alt3',
		'heart'        => 'heart',
		'home'         => 'admin-home',
		'mail'         => 'email',
		'map-pin'      => 'location',
		'phone'        => 'phone',
		'settings'     => 'admin-generic',
		'shopping-bag' => 'cart',
		'star'         => 'star-filled',
		'users'        => 'groups',
	);

	/**
	 * Initializes the icon registry.
	 *
	 * @return void
	 */
	public static function init() {
		self::$icons = self::get_default_icons();

		/**
		 * Filters the Dashicons icon registry.
		 *
		 * Keys must be valid Dashicons names without the `dashicons-` prefix.
		 *
		 * @since 1.0.0
		 *
		 * @param array $icons Icon definitions keyed by dashicon name.
		 */
		self::$icons = apply_filters( 'structured_mega_menu_icon_registry', self::$icons );
	}

	/**
	 * Returns curated Dashicons useful for mega menu navigation.
	 *
	 * @return array<string, array>
	 */
	public static function get_default_icons() {
		return array(
			'admin-home'         => array(
				'label' => __( 'Home', 'structured-mega-menu' ),
				'group' => 'admin',
			),
			'admin-site'         => array(
				'label' => __( 'Site', 'structured-mega-menu' ),
				'group' => 'admin',
			),
			'admin-site-alt3'    => array(
				'label' => __( 'Globe', 'structured-mega-menu' ),
				'group' => 'admin',
			),
			'admin-generic'      => array(
				'label' => __( 'Settings', 'structured-mega-menu' ),
				'group' => 'admin',
			),
			'admin-users'        => array(
				'label' => __( 'Users', 'structured-mega-menu' ),
				'group' => 'admin',
			),
			'admin-media'        => array(
				'label' => __( 'Media', 'structured-mega-menu' ),
				'group' => 'admin',
			),
			'admin-page'         => array(
				'label' => __( 'Page', 'structured-mega-menu' ),
				'group' => 'admin',
			),
			'admin-post'         => array(
				'label' => __( 'Post', 'structured-mega-menu' ),
				'group' => 'admin',
			),
			'admin-comments'     => array(
				'label' => __( 'Comments', 'structured-mega-menu' ),
				'group' => 'admin',
			),
			'admin-appearance'   => array(
				'label' => __( 'Appearance', 'structured-mega-menu' ),
				'group' => 'admin',
			),
			'admin-plugins'      => array(
				'label' => __( 'Plugins', 'structured-mega-menu' ),
				'group' => 'admin',
			),
			'admin-tools'        => array(
				'label' => __( 'Tools', 'structured-mega-menu' ),
				'group' => 'admin',
			),
			'dashboard'          => array(
				'label' => __( 'Dashboard', 'structured-mega-menu' ),
				'group' => 'admin',
			),
			'welcome-write-blog' => array(
				'label' => __( 'Write', 'structured-mega-menu' ),
				'group' => 'content',
			),
			'welcome-view-site'  => array(
				'label' => __( 'View site', 'structured-mega-menu' ),
				'group' => 'content',
			),
			'media-document'     => array(
				'label' => __( 'Document', 'structured-mega-menu' ),
				'group' => 'media',
			),
			'media-text'         => array(
				'label' => __( 'Text', 'structured-mega-menu' ),
				'group' => 'media',
			),
			'media-spreadsheet'  => array(
				'label' => __( 'Spreadsheet', 'structured-mega-menu' ),
				'group' => 'media',
			),
			'media-archive'      => array(
				'label' => __( 'Archive', 'structured-mega-menu' ),
				'group' => 'media',
			),
			'media-code'         => array(
				'label' => __( 'Code', 'structured-mega-menu' ),
				'group' => 'media',
			),
			'media-audio'        => array(
				'label' => __( 'Audio', 'structured-mega-menu' ),
				'group' => 'media',
			),
			'media-video'        => array(
				'label' => __( 'Video', 'structured-mega-menu' ),
				'group' => 'media',
			),
			'format-image'       => array(
				'label' => __( 'Image', 'structured-mega-menu' ),
				'group' => 'media',
			),
			'format-gallery'     => array(
				'label' => __( 'Gallery', 'structured-mega-menu' ),
				'group' => 'media',
			),
			'format-video'       => array(
				'label' => __( 'Video format', 'structured-mega-menu' ),
				'group' => 'media',
			),
			'format-audio'       => array(
				'label' => __( 'Audio format', 'structured-mega-menu' ),
				'group' => 'media',
			),
			'cart'               => array(
				'label' => __( 'Cart', 'structured-mega-menu' ),
				'group' => 'commerce',
			),
			'products'           => array(
				'label' => __( 'Products', 'structured-mega-menu' ),
				'group' => 'commerce',
			),
			'store'              => array(
				'label' => __( 'Store', 'structured-mega-menu' ),
				'group' => 'commerce',
			),
			'money-alt'          => array(
				'label' => __( 'Money', 'structured-mega-menu' ),
				'group' => 'commerce',
			),
			'tag'                => array(
				'label' => __( 'Tag', 'structured-mega-menu' ),
				'group' => 'content',
			),
			'category'           => array(
				'label' => __( 'Category', 'structured-mega-menu' ),
				'group' => 'content',
			),
			'book'               => array(
				'label' => __( 'Book', 'structured-mega-menu' ),
				'group' => 'content',
			),
			'book-alt'           => array(
				'label' => __( 'Book alt', 'structured-mega-menu' ),
				'group' => 'content',
			),
			'portfolio'          => array(
				'label' => __( 'Portfolio', 'structured-mega-menu' ),
				'group' => 'content',
			),
			'calendar'           => array(
				'label' => __( 'Calendar', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'location'           => array(
				'label' => __( 'Location', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'location-alt'       => array(
				'label' => __( 'Location alt', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'email'              => array(
				'label' => __( 'Email', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'email-alt'          => array(
				'label' => __( 'Email alt', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'phone'              => array(
				'label' => __( 'Phone', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'heart'              => array(
				'label' => __( 'Heart', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'star-filled'        => array(
				'label' => __( 'Star', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'groups'             => array(
				'label' => __( 'Groups', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'businessman'        => array(
				'label' => __( 'Person', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'building'           => array(
				'label' => __( 'Building', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'chart-bar'          => array(
				'label' => __( 'Chart', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'chart-area'         => array(
				'label' => __( 'Area chart', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'chart-line'         => array(
				'label' => __( 'Line chart', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'chart-pie'          => array(
				'label' => __( 'Pie chart', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'search'             => array(
				'label' => __( 'Search', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'info'               => array(
				'label' => __( 'Info', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'yes'                => array(
				'label' => __( 'Check', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'plus'               => array(
				'label' => __( 'Plus', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'edit'               => array(
				'label' => __( 'Edit', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'visibility'         => array(
				'label' => __( 'Visibility', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'lock'               => array(
				'label' => __( 'Lock', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'unlock'             => array(
				'label' => __( 'Unlock', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'download'           => array(
				'label' => __( 'Download', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'external'           => array(
				'label' => __( 'External', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'share'              => array(
				'label' => __( 'Share', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'megaphone'          => array(
				'label' => __( 'Megaphone', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'lightbulb'          => array(
				'label' => __( 'Idea', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'performance'        => array(
				'label' => __( 'Performance', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'cloud'              => array(
				'label' => __( 'Cloud', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'smartphone'         => array(
				'label' => __( 'Phone device', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'desktop'            => array(
				'label' => __( 'Desktop', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'laptop'             => array(
				'label' => __( 'Laptop', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'menu-alt3'          => array(
				'label' => __( 'Menu', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'networking'         => array(
				'label' => __( 'Network', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'translation'        => array(
				'label' => __( 'Translation', 'structured-mega-menu' ),
				'group' => 'misc',
			),
			'rss'                => array(
				'label' => __( 'RSS', 'structured-mega-menu' ),
				'group' => 'misc',
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
	 * Normalizes a stored library slug to a Dashicons name.
	 *
	 * @param string $slug Stored icon slug.
	 * @return string Dashicons name without prefix, or empty string.
	 */
	public static function normalize_slug( $slug ) {
		$slug = sanitize_key( $slug );

		if ( '' === $slug ) {
			return '';
		}

		if ( isset( self::$legacy_map[ $slug ] ) ) {
			$slug = self::$legacy_map[ $slug ];
		}

		/* Allow values stored with a dashicons- prefix. */
		if ( 0 === strpos( $slug, 'dashicons-' ) ) {
			$slug = substr( $slug, strlen( 'dashicons-' ) );
		}

		return $slug;
	}

	/**
	 * Whether an icon slug exists in the registry.
	 *
	 * @param string $slug Icon slug.
	 * @return bool
	 */
	public static function has( $slug ) {
		$slug = self::normalize_slug( $slug );
		return '' !== $slug && isset( self::$icons[ $slug ] );
	}

	/**
	 * Ensures Dashicons CSS is available on the frontend.
	 *
	 * @return void
	 */
	public static function enqueue_dashicons() {
		wp_enqueue_style( 'dashicons' );
	}

	/**
	 * Renders a decorative icon by Dashicons slug or media attachment.
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

		$slug = self::normalize_slug( isset( $icon['value'] ) ? $icon['value'] : '' );

		if ( ! self::has( $slug ) ) {
			return '';
		}

		self::enqueue_dashicons();

		return sprintf(
			'<span class="smm-icon smm-icon--dashicons dashicons dashicons-%1$s" aria-hidden="true" focusable="false"></span>',
			esc_attr( $slug )
		);
	}
}
