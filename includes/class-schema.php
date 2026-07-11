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
		);
	}

	/**
	 * Allowed panel width values.
	 *
	 * @return string[]
	 */
	public static function get_panel_widths() {
		return array( 'navigation', 'content', 'wide', 'viewport' );
	}

	/**
	 * Allowed opening modes.
	 *
	 * @return string[]
	 */
	public static function get_opening_modes() {
		return array( 'click', 'hover' );
	}

	/**
	 * Allowed mobile modes.
	 *
	 * @return string[]
	 */
	public static function get_mobile_modes() {
		return array( 'accordion', 'expanded' );
	}

	/**
	 * Layout presets keyed by column count.
	 *
	 * @return array<int, string[]>
	 */
	public static function get_layout_presets() {
		return array(
			1 => array( '1' ),
			2 => array( '1-1', '1-2', '2-1' ),
			3 => array( '1-1-1', '1-1-2', '2-1-1' ),
			4 => array( '1-1-1-1', '1-1-1-2', '2-1-1-1' ),
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
