<?php
/**
 * Phase 1 smoke test (no WordPress bootstrap).
 *
 * @package StructuredMegaMenu
 */

// phpcs:ignoreFile

namespace {
	function trailingslashit( $s ) {
		return rtrim( $s, '/' ) . '/';
	}
	function sanitize_key( $s ) {
		return strtolower( preg_replace( '/[^a-z0-9_\-]/', '', (string) $s ) );
	}
	function sanitize_text_field( $s ) {
		return trim( strip_tags( (string) $s ) );
	}
	function sanitize_textarea_field( $s ) {
		return trim( strip_tags( (string) $s ) );
	}
	function esc_url_raw( $s ) {
		return (string) $s;
	}
	function absint( $n ) {
		return abs( (int) $n );
	}
	function wp_json_encode( $d ) {
		return json_encode( $d );
	}
	function wp_generate_password( $l ) {
		return bin2hex( random_bytes( (int) ( $l / 2 ) ) );
	}
	function wp_get_attachment_image_url() {
		return false;
	}
	function __( $s ) {
		return $s;
	}
}

namespace StructuredMegaMenu\Smoke {
	define( 'ABSPATH', '/tmp/' );
	define( 'SMM_SCHEMA_VERSION', 1 );
	define( 'SMM_MAX_COLUMNS', 4 );

	$plugin_root = dirname( __DIR__, 2 );

	require $plugin_root . '/includes/class-autoloader.php';
	\StructuredMegaMenu\Autoloader::register( $plugin_root . '/includes/' );

	$registry = new \StructuredMegaMenu\Column_Types\Column_Registry();
	$registry->register_defaults();
	echo 'Types: ' . implode( ',', array_keys( $registry->all() ) ) . PHP_EOL;

	$sanitizer = new \StructuredMegaMenu\Sanitizer( $registry );
	$out       = $sanitizer->sanitize_schema(
		array(
			'version'  => 1,
			'settings' => array(),
			'columns'  => array(
				array(
					'id'       => 'x',
					'type'     => 'bogus',
					'settings' => array(),
				),
				array(
					'id'       => 'c1',
					'type'     => 'image_cta',
					'settings' => array( 'heading' => '<b>Hi</b>' ),
				),
			),
		)
	);
	echo 'Cols: ' . count( $out['columns'] ) . ' type=' . $out['columns'][0]['type'] . ' heading=' . $out['columns'][0]['settings']['heading'] . PHP_EOL;

	$many = array();
	for ( $i = 0; $i < 6; $i++ ) {
		$many[] = array(
			'id'       => 'c' . $i,
			'type'     => 'link_list',
			'enabled'  => true,
			'settings' => array(),
		);
	}
	$out2 = $sanitizer->sanitize_schema(
		array(
			'version'  => 1,
			'settings' => array( 'layoutPreset' => '1-1' ),
			'columns'  => $many,
		)
	);
	echo 'Max: ' . count( $out2['columns'] ) . ' layout=' . $out2['settings']['layoutPreset'] . PHP_EOL;
	echo 'Grid: ' . \StructuredMegaMenu\Schema::layout_to_grid_template( '1-2-1' ) . PHP_EOL;
	echo "Phase 1 smoke test OK\n";
}
