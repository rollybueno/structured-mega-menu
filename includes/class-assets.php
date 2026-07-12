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
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_theme_layout_vars' ), 20 );
		add_action( 'enqueue_block_assets', array( __CLASS__, 'enqueue_theme_layout_vars' ), 20 );
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
					array( 'wp-components', 'dashicons' ),
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
				'colorPalette'          => Appearance::get_theme_palette(),
				'developerDocs'         => Developer_Docs::get_client_payload(),
				'strings'               => array(
					'appTitle' => __( 'Mega Menus', 'structured-mega-menu' ),
				),
			)
		);

		wp_set_script_translations( 'smm-admin', 'structured-mega-menu', SMM_PLUGIN_DIR . 'languages' );
	}

	/**
	 * Enqueues the Navigation extension and block editor config.
	 *
	 * @return void
	 */
	public static function enqueue_block_editor_assets() {
		if ( ! wp_script_is( 'smm-navigation-extension', 'registered' ) ) {
			self::register_scripts();
		}

		if ( ! wp_script_is( 'smm-navigation-extension', 'registered' ) ) {
			return;
		}

		wp_enqueue_script( 'smm-navigation-extension' );

		/*
		 * Shared by the navigation extension and the menu-item block editor UI.
		 * Attached here because the block.json script handle is generated at runtime.
		 */
		wp_localize_script(
			'smm-navigation-extension',
			'smmBlockEditor',
			array(
				'adminUrl'  => esc_url_raw( admin_url( 'themes.php?page=structured-mega-menu' ) ),
				'restNonce' => wp_create_nonce( 'wp_rest' ),
			)
		);
	}

	/**
	 * Exposes theme.json layout.fullSize as a CSS custom property.
	 *
	 * Core only outputs content-size and wide-size; fullSize is a theme extension.
	 *
	 * @return void
	 */
	public static function enqueue_theme_layout_vars() {
		static $done = false;
		if ( $done ) {
			return;
		}

		$full_size = Schema::get_theme_layout_size( 'fullSize' );
		if ( '' === $full_size ) {
			return;
		}

		/*
		 * Basic length safety — theme.json values are trusted theme author input,
		 * but reject obvious injection.
		 */
		if ( ! preg_match( '/^[0-9.]+(px|rem|em|%|vw|vh|ch|ex|vmin|vmax)?$/i', trim( $full_size ) ) ) {
			return;
		}

		$done = true;
		$css  = sprintf(
			':root{--wp--style--global--full-size:%1$s;--smm-theme-full-size:%1$s;}',
			esc_html( $full_size )
		);

		$handle = 'structured-mega-menu-menu-item-style';
		if ( wp_style_is( $handle, 'registered' ) ) {
			wp_enqueue_style( $handle );
			wp_add_inline_style( $handle, $css );
			return;
		}

		wp_register_style( 'smm-theme-layout', false, array(), SMM_VERSION );
		wp_enqueue_style( 'smm-theme-layout' );
		wp_add_inline_style( 'smm-theme-layout', $css );
	}
}
