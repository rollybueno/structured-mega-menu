<?php
/**
 * Asset registration.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Registers admin, editor, and frontend assets.
 */
class Assets {

	/**
	 * Hooks asset registration.
	 *
	 * @return void
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_scripts' ) );
		add_action( 'enqueue_block_editor_assets', array( __CLASS__, 'enqueue_block_editor_assets' ) );
	}

	/**
	 * Registers script and style handles from the build directory.
	 *
	 * @return void
	 */
	public static function register_scripts() {
		$admin_asset = SMM_PLUGIN_DIR . 'build/admin/index.asset.php';
		if ( file_exists( $admin_asset ) ) {
			$asset = include $admin_asset;

			wp_register_script(
				'smm-admin',
				SMM_PLUGIN_URL . 'build/admin/index.js',
				isset( $asset['dependencies'] ) ? $asset['dependencies'] : array(),
				isset( $asset['version'] ) ? $asset['version'] : SMM_VERSION,
				true
			);

			$admin_style = SMM_PLUGIN_DIR . 'build/admin/index.css';
			if ( file_exists( $admin_style ) ) {
				wp_register_style(
					'smm-admin',
					SMM_PLUGIN_URL . 'build/admin/index.css',
					array( 'wp-components' ),
					isset( $asset['version'] ) ? $asset['version'] : SMM_VERSION
				);
			}
		}

		$nav_asset = SMM_PLUGIN_DIR . 'build/navigation-extension/index.asset.php';
		if ( file_exists( $nav_asset ) ) {
			$asset = include $nav_asset;

			wp_register_script(
				'smm-navigation-extension',
				SMM_PLUGIN_URL . 'build/navigation-extension/index.js',
				isset( $asset['dependencies'] ) ? $asset['dependencies'] : array(),
				isset( $asset['version'] ) ? $asset['version'] : SMM_VERSION,
				true
			);
		}
	}

	/**
	 * Enqueues the admin React application and localized data.
	 *
	 * @return void
	 */
	public static function enqueue_admin_app() {
		if ( ! wp_script_is( 'smm-admin', 'registered' ) ) {
			self::register_scripts();
		}

		if ( ! wp_script_is( 'smm-admin', 'registered' ) ) {
			return;
		}

		wp_enqueue_media();
		wp_enqueue_script( 'smm-admin' );

		if ( wp_style_is( 'smm-admin', 'registered' ) ) {
			wp_enqueue_style( 'smm-admin' );
		}

		$registry = Plugin::instance()->get_column_registry();

		wp_localize_script(
			'smm-admin',
			'smmAdmin',
			array(
				'restUrl'               => esc_url_raw( rest_url( REST_Controller::NAMESPACE ) ),
				'restNonce'             => wp_create_nonce( 'wp_rest' ),
				'postsUrl'              => esc_url_raw( rest_url( 'wp/v2/smm-mega-menus' ) ),
				'pluginUrl'             => esc_url_raw( SMM_PLUGIN_URL ),
				'maxColumns'            => SMM_MAX_COLUMNS,
				'schemaVersion'         => SMM_SCHEMA_VERSION,
				'columnTypes'           => $registry->get_client_definitions(),
				'layoutPresets'         => Schema::get_layout_presets(),
				'defaults'              => Schema::get_default(),
				'deleteDataOnUninstall' => (bool) get_option( SMM_OPTION_DELETE_DATA, false ),
				'strings'               => array(
					'appTitle' => __( 'Mega Menus', 'structured-mega-menu' ),
				),
			)
		);

		wp_set_script_translations( 'smm-admin', 'structured-mega-menu', SMM_PLUGIN_DIR . 'languages' );
	}

	/**
	 * Enqueues the Navigation allowedBlocks extension in the block editor.
	 *
	 * @return void
	 */
	public static function enqueue_block_editor_assets() {
		if ( wp_script_is( 'smm-navigation-extension', 'registered' ) ) {
			wp_enqueue_script( 'smm-navigation-extension' );
		}
	}
}
