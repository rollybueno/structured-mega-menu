<?php
/**
 * Shared sanitization helpers for column types.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Lightweight helpers that avoid circular Sanitizer construction.
 */
class Helpers {

	/**
	 * Sanitizes a URL for storage.
	 *
	 * @param string $url Raw URL.
	 * @return string
	 */
	public static function sanitize_url( $url ) {
		$url = is_string( $url ) ? trim( $url ) : '';

		if ( '' === $url ) {
			return '';
		}

		return esc_url_raw( $url );
	}

	/**
	 * Casts a value to boolean.
	 *
	 * @param mixed $value Raw value.
	 * @return bool
	 */
	public static function to_bool( $value ) {
		return (bool) $value;
	}

	/**
	 * Sanitizes a stable client ID.
	 *
	 * @param string $id     Raw ID.
	 * @param string $prefix Fallback prefix.
	 * @return string
	 */
	public static function sanitize_id( $id, $prefix = 'smm' ) {
		$id = is_string( $id ) ? sanitize_text_field( $id ) : '';
		$id = preg_replace( '/[^a-zA-Z0-9_-]/', '', $id );

		if ( '' === $id || strlen( $id ) > 64 ) {
			return self::generate_id( $prefix );
		}

		return $id;
	}

	/**
	 * Generates a stable unique ID.
	 *
	 * @param string $prefix ID prefix.
	 * @return string
	 */
	public static function generate_id( $prefix = 'smm' ) {
		try {
			$hex = bin2hex( random_bytes( 8 ) );
		} catch ( \Exception $e ) {
			$hex = wp_generate_password( 16, false, false );
		}

		return sanitize_key( $prefix . '-' . $hex );
	}
}
