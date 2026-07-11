<?php
/**
 * Shared frontend markup helpers for column types.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Escaped markup helpers used by column renderers.
 */
class Markup {

	/**
	 * Renders an optional heading.
	 *
	 * @param string $heading   Heading text.
	 * @param string $css_class CSS class.
	 * @return string
	 */
	public static function heading( $heading, $css_class = 'smm-column__heading' ) {
		$heading = is_string( $heading ) ? trim( $heading ) : '';
		if ( '' === $heading ) {
			return '';
		}

		return sprintf(
			'<h3 class="%1$s">%2$s</h3>',
			esc_attr( $css_class ),
			esc_html( $heading )
		);
	}

	/**
	 * Renders an optional description paragraph.
	 *
	 * @param string $description Description text.
	 * @param string $css_class   CSS class.
	 * @return string
	 */
	public static function description( $description, $css_class = 'smm-column__description' ) {
		$description = is_string( $description ) ? trim( $description ) : '';
		if ( '' === $description ) {
			return '';
		}

		return sprintf(
			'<p class="%1$s">%2$s</p>',
			esc_attr( $css_class ),
			esc_html( $description )
		);
	}

	/**
	 * Builds safe link attributes.
	 *
	 * @param string $url            URL.
	 * @param bool   $opens_in_new_tab Whether to open in a new tab.
	 * @return string Attribute string.
	 */
	public static function link_attributes( $url, $opens_in_new_tab = false ) {
		$attrs = 'href="' . esc_url( $url ) . '"';

		if ( $opens_in_new_tab ) {
			$attrs .= ' target="_blank" rel="noopener noreferrer"';
		}

		return $attrs;
	}
}
