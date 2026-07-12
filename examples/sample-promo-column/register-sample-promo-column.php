<?php
/**
 * Drop-in loader for the sample promo column.
 *
 * Copy this file + class-sample-promo-column.php into a must-use or custom
 * plugin, then activate. Not bundled in the WordPress.org distribution.
 *
 * Plugin Name: SMM Sample Promo Column
 * Description: Example custom column type for Structured Mega Menu.
 * Requires Plugins: structured-mega-menu
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'structured_mega_menu_register_column_types',
	static function ( $registry ) {
		require_once __DIR__ . '/class-sample-promo-column.php';

		if ( class_exists( 'Sample_Promo_Column' ) ) {
			$registry->register( new Sample_Promo_Column() );
		}
	}
);
