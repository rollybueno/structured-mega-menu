<?php
/**
 * Schema defaults and layout helpers.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Provides canonical schema defaults and layout preset maps.
 */
class Schema {

	/**
	 * Returns a complete default schema.
	 *
	 * @return array
	 */
	public static function get_default() {
		return array(
			'version'  => SMM_SCHEMA_VERSION,
			'settings' => self::get_default_settings(),
			'columns'  => array(),
		);
	}

	/**
	 * Returns default top-level settings.
	 *
	 * @return array
	 */
	public static function get_default_settings() {
		return array(
			'panelWidth'          => 'navigation',
			'openingMode'         => 'click',
			'closeOnOutsideClick' => true,
			'closeOnEscape'       => true,
			'mobileMode'          => 'accordion',
			'layoutPreset'        => '1',
			'appearance'          => Appearance::get_defaults(),
		);
	}

	/**
	 * Allowed panel width values.
	 *
	 * @return string[]
	 */
	public static function get_panel_widths() {
		/**
		 * Filters allowed mega menu panel width modes.
		 *
		 * Values become CSS modifiers (`smm-panel-width-{slug}`) and must be
		 * sanitize_key-safe.
		 *
		 * @since 1.0.0
		 *
		 * @param string[] $widths Panel width slugs.
		 */
		return apply_filters(
			'structured_mega_menu_panel_widths',
			array( 'navigation', 'content', 'wide', 'full', 'viewport' )
		);
	}

	/**
	 * Reads a theme.json layout size (contentSize, wideSize, fullSize, …).
	 *
	 * Core only emits CSS vars for content/wide. Themes may still declare
	 * fullSize; this helper resolves it from global settings or theme.json.
	 *
	 * @param string $key Layout size key (e.g. fullSize).
	 * @return string CSS length or empty string.
	 */
	public static function get_theme_layout_size( $key ) {
		$key = is_string( $key ) ? $key : '';
		if ( ! preg_match( '/^[a-zA-Z][a-zA-Z0-9]*$/', $key ) ) {
			return '';
		}

		$layout = wp_get_global_settings( array( 'layout' ) );
		if ( is_array( $layout ) && ! empty( $layout[ $key ] ) && is_string( $layout[ $key ] ) ) {
			return $layout[ $key ];
		}

		foreach ( array( get_stylesheet_directory(), get_template_directory() ) as $dir ) {
			$path = trailingslashit( $dir ) . 'theme.json';
			if ( ! is_readable( $path ) ) {
				continue;
			}

			$raw  = file_get_contents( $path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- local theme.json only.
			$data = json_decode( is_string( $raw ) ? $raw : '', true );
			if ( ! is_array( $data ) ) {
				continue;
			}

			$theme_layout = isset( $data['settings']['layout'] ) && is_array( $data['settings']['layout'] )
				? $data['settings']['layout']
				: array();

			if ( ! empty( $theme_layout[ $key ] ) && is_string( $theme_layout[ $key ] ) ) {
				return $theme_layout[ $key ];
			}
		}

		return '';
	}

	/**
	 * Allowed opening modes.
	 *
	 * @return string[]
	 */
	public static function get_opening_modes() {
		/**
		 * Filters allowed opening modes.
		 *
		 * @since 1.0.0
		 *
		 * @param string[] $modes Opening mode slugs.
		 */
		return apply_filters(
			'structured_mega_menu_opening_modes',
			array( 'click', 'hover' )
		);
	}

	/**
	 * Allowed mobile modes.
	 *
	 * @return string[]
	 */
	public static function get_mobile_modes() {
		/**
		 * Filters allowed mobile presentation modes.
		 *
		 * @since 1.0.0
		 *
		 * @param string[] $modes Mobile mode slugs.
		 */
		return apply_filters(
			'structured_mega_menu_mobile_modes',
			array( 'accordion', 'expanded' )
		);
	}

	/**
	 * Layout presets keyed by column count.
	 *
	 * @return array<int, string[]>
	 */
	public static function get_layout_presets() {
		/**
		 * Filters layout presets keyed by enabled column count.
		 *
		 * @since 1.0.0
		 *
		 * @param array<int, string[]> $presets Layout presets.
		 */
		return apply_filters(
			'structured_mega_menu_layout_presets',
			array(
				1 => array( '1' ),
				2 => array( '1-1', '1-2', '2-1' ),
				3 => array( '1-1-1', '1-1-2', '2-1-1' ),
				4 => array( '1-1-1-1', '1-1-1-2', '2-1-1-1' ),
			)
		);
	}

	/**
	 * Returns allowed layout presets for a column count.
	 *
	 * @param int $column_count Number of enabled columns.
	 * @return string[]
	 */
	public static function get_layouts_for_count( $column_count ) {
		$column_count = (int) $column_count;
		$presets      = self::get_layout_presets();

		if ( isset( $presets[ $column_count ] ) ) {
			return $presets[ $column_count ];
		}

		return array( '1' );
	}

	/**
	 * Default layout preset for a column count.
	 *
	 * @param int $column_count Number of enabled columns.
	 * @return string
	 */
	public static function get_default_layout_for_count( $column_count ) {
		$layouts = self::get_layouts_for_count( $column_count );

		return $layouts[0];
	}

	/**
	 * Converts a layout preset string into a CSS grid-template-columns value.
	 *
	 * @param string $preset Layout preset (e.g. 1-2-1).
	 * @return string
	 */
	public static function layout_to_grid_template( $preset ) {
		$preset = is_string( $preset ) ? $preset : '1';
		$parts  = array_filter( array_map( 'trim', explode( '-', $preset ) ) );

		if ( empty( $parts ) ) {
			return 'minmax(0, 1fr)';
		}

		$tracks = array();
		foreach ( $parts as $part ) {
			$fr       = max( 1, absint( $part ) );
			$tracks[] = sprintf( 'minmax(0, %dfr)', $fr );
		}

		return implode( ' ', $tracks );
	}

	/**
	 * Whether a layout preset matches the given column count.
	 *
	 * @param string $preset       Layout preset.
	 * @param int    $column_count Column count.
	 * @return bool
	 */
	public static function is_valid_layout_for_count( $preset, $column_count ) {
		return in_array( $preset, self::get_layouts_for_count( $column_count ), true );
	}
}
