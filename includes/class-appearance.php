<?php
/**
 * Per-menu appearance settings mapped to public CSS custom properties.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Appearance presets and CSS variable helpers.
 */
class Appearance {

	/**
	 * Default appearance settings.
	 *
	 * @return array<string, string>
	 */
	public static function get_defaults() {
		return array(
			'density'         => 'default',
			'radius'          => 'inherit',
			'panelBackground' => '',
			'panelText'       => '',
			'panelBorder'     => '',
		);
	}

	/**
	 * Allowed density values.
	 *
	 * @return string[]
	 */
	public static function get_densities() {
		/**
		 * Filters allowed appearance density presets.
		 *
		 * @since 1.0.0
		 *
		 * @param string[] $densities Density slugs.
		 */
		return apply_filters(
			'structured_mega_menu_appearance_densities',
			array( 'compact', 'default', 'roomy' )
		);
	}

	/**
	 * Allowed radius presets.
	 *
	 * @return string[]
	 */
	public static function get_radii() {
		/**
		 * Filters allowed appearance radius presets.
		 *
		 * @since 1.0.0
		 *
		 * @param string[] $radii Radius slugs.
		 */
		return apply_filters(
			'structured_mega_menu_appearance_radii',
			array( 'inherit', 'none', 'small', 'medium', 'large' )
		);
	}

	/**
	 * Sanitizes appearance settings.
	 *
	 * @param mixed $appearance Raw appearance.
	 * @return array<string, string>
	 */
	public static function sanitize( $appearance ) {
		$defaults = self::get_defaults();
		$data     = is_array( $appearance ) ? $appearance : array();

		$density = isset( $data['density'] ) ? sanitize_key( $data['density'] ) : $defaults['density'];
		if ( ! in_array( $density, self::get_densities(), true ) ) {
			$density = $defaults['density'];
		}

		$radius = isset( $data['radius'] ) ? sanitize_key( $data['radius'] ) : $defaults['radius'];
		if ( ! in_array( $radius, self::get_radii(), true ) ) {
			$radius = $defaults['radius'];
		}

		return array(
			'density'         => $density,
			'radius'          => $radius,
			'panelBackground' => self::sanitize_css_color( isset( $data['panelBackground'] ) ? $data['panelBackground'] : '' ),
			'panelText'       => self::sanitize_css_color( isset( $data['panelText'] ) ? $data['panelText'] : '' ),
			'panelBorder'     => self::sanitize_css_color( isset( $data['panelBorder'] ) ? $data['panelBorder'] : '' ),
		);
	}

	/**
	 * Sanitizes a CSS color value (hex, rgb/rgba, or CSS custom property).
	 *
	 * @param mixed $color Raw color.
	 * @return string
	 */
	public static function sanitize_css_color( $color ) {
		$color = is_string( $color ) ? trim( $color ) : '';

		if ( '' === $color ) {
			return '';
		}

		if ( preg_match( '/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i', $color ) ) {
			return strtolower( $color );
		}

		if ( preg_match( '/^rgba?\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})(?:\s*,\s*(0|0?\.\d+|1))?\s*\)$/i', $color, $matches ) ) {
			$r = min( 255, absint( $matches[1] ) );
			$g = min( 255, absint( $matches[2] ) );
			$b = min( 255, absint( $matches[3] ) );
			if ( isset( $matches[4] ) && '' !== $matches[4] ) {
				$a = (float) $matches[4];
				$a = max( 0, min( 1, $a ) );
				return sprintf( 'rgba(%d,%d,%d,%s)', $r, $g, $b, rtrim( rtrim( sprintf( '%.3f', $a ), '0' ), '.' ) );
			}
			return sprintf( 'rgb(%d,%d,%d)', $r, $g, $b );
		}

		if ( preg_match( '/^var\(\s*(--[a-zA-Z0-9\-_]+)\s*\)$/', $color, $matches ) ) {
			return 'var(' . $matches[1] . ')';
		}

		return '';
	}

	/**
	 * Maps appearance settings to public CSS custom properties.
	 *
	 * @param array $appearance Sanitized appearance settings.
	 * @return array<string, string> Property => value.
	 */
	public static function to_css_vars( array $appearance ) {
		$appearance = self::sanitize( $appearance );
		$vars       = array();

		switch ( $appearance['density'] ) {
			case 'compact':
				$vars['--smm-panel-padding'] = 'clamp(0.75rem, 1.6vw, 1.1rem)';
				$vars['--smm-grid-gap']      = '0.75rem';
				break;
			case 'roomy':
				$vars['--smm-panel-padding'] = 'clamp(1.35rem, 3vw, 2.25rem)';
				$vars['--smm-grid-gap']      = 'clamp(1.25rem, 3vw, 2.25rem)';
				break;
			default:
				break;
		}

		switch ( $appearance['radius'] ) {
			case 'none':
				$vars['--smm-panel-radius'] = '0';
				break;
			case 'small':
				$vars['--smm-panel-radius'] = '0.25rem';
				break;
			case 'medium':
				$vars['--smm-panel-radius'] = '0.5rem';
				break;
			case 'large':
				$vars['--smm-panel-radius'] = '1rem';
				break;
			default:
				break;
		}

		if ( '' !== $appearance['panelBackground'] ) {
			$vars['--smm-panel-bg'] = $appearance['panelBackground'];
		}
		if ( '' !== $appearance['panelText'] ) {
			$vars['--smm-panel-color'] = $appearance['panelText'];
		}
		if ( '' !== $appearance['panelBorder'] ) {
			$vars['--smm-panel-border'] = $appearance['panelBorder'];
		}

		return $vars;
	}

	/**
	 * Builds an inline style string from CSS variables.
	 *
	 * @param array<string, string> $vars Property map.
	 * @return string
	 */
	public static function css_vars_to_style( array $vars ) {
		$parts = array();

		foreach ( $vars as $property => $value ) {
			$property = is_string( $property ) ? trim( $property ) : '';
			$value    = is_string( $value ) ? trim( $value ) : '';

			if ( '' === $property || '' === $value ) {
				continue;
			}

			if ( ! preg_match( '/^--[a-zA-Z0-9\-_]+$/', $property ) ) {
				continue;
			}

			/* Reject characters that could break out of a style attribute. */
			if ( preg_match( '/[;{}<>"\']/', $value ) ) {
				continue;
			}

			$parts[] = $property . ': ' . $value;
		}

		return implode( '; ', $parts );
	}

	/**
	 * Appearance-related class names for the menu item wrapper.
	 *
	 * @param array $appearance Sanitized appearance.
	 * @return string[]
	 */
	public static function get_wrapper_classes( array $appearance ) {
		$appearance = self::sanitize( $appearance );
		$classes    = array();

		if ( 'default' !== $appearance['density'] ) {
			$classes[] = 'smm-density-' . $appearance['density'];
		}

		if ( 'inherit' !== $appearance['radius'] ) {
			$classes[] = 'smm-radius-' . $appearance['radius'];
		}

		return $classes;
	}

	/**
	 * Theme color palette for the admin color pickers.
	 *
	 * @return array<int, array{name:string,slug:string,color:string}>
	 */
	public static function get_theme_palette() {
		$palette = wp_get_global_settings( array( 'color', 'palette' ) );
		$colors  = array();

		if ( ! is_array( $palette ) ) {
			return $colors;
		}

		/* Flatten theme/default/custom palette groups when present. */
		$candidates = isset( $palette['theme'] ) || isset( $palette['default'] ) || isset( $palette['custom'] )
			? array_merge(
				isset( $palette['theme'] ) && is_array( $palette['theme'] ) ? $palette['theme'] : array(),
				isset( $palette['default'] ) && is_array( $palette['default'] ) ? $palette['default'] : array(),
				isset( $palette['custom'] ) && is_array( $palette['custom'] ) ? $palette['custom'] : array()
			)
			: $palette;

		foreach ( $candidates as $entry ) {
			if ( ! is_array( $entry ) || empty( $entry['color'] ) || ! is_string( $entry['color'] ) ) {
				continue;
			}

			$slug  = isset( $entry['slug'] ) ? sanitize_title( $entry['slug'] ) : '';
			$color = self::sanitize_css_color( $entry['color'] );
			if ( '' === $color ) {
				continue;
			}

			$colors[] = array(
				'name'  => isset( $entry['name'] ) ? (string) $entry['name'] : $slug,
				'slug'  => $slug,
				'color' => $color,
				/* Prefer preset vars when a slug exists so themes can restyle. */
				'value' => $slug ? 'var(--wp--preset--color--' . $slug . ')' : $color,
			);
		}

		return $colors;
	}
}
