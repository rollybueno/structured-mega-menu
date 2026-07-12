<?php
/**
 * Admin screen registration.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Admin UI bootstrap for the Mega Menus React application.
 */
class Admin {

	/**
	 * Admin page slug.
	 *
	 * @var string
	 */
	const PAGE_SLUG = 'structured-mega-menu';

	/**
	 * Hooks admin behavior.
	 *
	 * @return void
	 */
	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'register_menu' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ) );
		add_action( 'load-appearance_page_' . self::PAGE_SLUG, array( __CLASS__, 'add_help_tabs' ) );
		add_filter( 'option_page_capability_smm_settings', array( __CLASS__, 'settings_capability' ) );
	}

	/**
	 * Registers the Appearance → Mega Menus screen.
	 *
	 * @return void
	 */
	public static function register_menu() {
		add_theme_page(
			__( 'Mega Menus', 'structured-mega-menu' ),
			__( 'Mega Menus', 'structured-mega-menu' ),
			Capabilities::MANAGE,
			self::PAGE_SLUG,
			array( __CLASS__, 'render_page' )
		);
	}

	/**
	 * Renders the React admin root.
	 *
	 * @return void
	 */
	public static function render_page() {
		if ( ! Capabilities::current_user_can_manage() ) {
			wp_die( esc_html__( 'You do not have permission to manage mega menus.', 'structured-mega-menu' ) );
		}

		echo '<div class="wrap smm-admin-wrap">';
		echo '<div id="smm-admin-root" class="smm-admin"></div>';
		echo '</div>';
	}

	/**
	 * Enqueues admin application assets on the plugin screen only.
	 *
	 * @param string $hook_suffix Current admin page hook.
	 * @return void
	 */
	public static function enqueue_assets( $hook_suffix ) {
		if ( 'appearance_page_' . self::PAGE_SLUG !== $hook_suffix ) {
			return;
		}

		Assets::enqueue_admin_app();
	}

	/**
	 * Adds contextual help.
	 *
	 * @return void
	 */
	public static function add_help_tabs() {
		$screen = get_current_screen();

		if ( ! $screen ) {
			return;
		}

		$screen->add_help_tab(
			array(
				'id'      => 'smm-overview',
				'title'   => __( 'Overview', 'structured-mega-menu' ),
				'content' => '<p>' . esc_html__( 'Create reusable mega menu configurations with up to four columns. Each column can be an Image and CTA, Links with icons, or a Link list. Attach a configuration to the Navigation block using the Mega Menu Item block.', 'structured-mega-menu' ) . '</p>',
			)
		);

		$screen->add_help_tab(
			array(
				'id'      => 'smm-columns',
				'title'   => __( 'Columns', 'structured-mega-menu' ),
				'content' => '<p>' . esc_html__( 'Add columns, choose a type, reorder, duplicate, or temporarily disable them. Disabled columns and repeater rows are kept as drafts and do not render on the frontend.', 'structured-mega-menu' ) . '</p>',
			)
		);

		$screen->add_help_tab(
			array(
				'id'      => 'smm-css-api',
				'title'   => __( 'CSS API', 'structured-mega-menu' ),
				'content' => Developer_Docs::get_css_api_html(),
			)
		);

		$screen->add_help_tab(
			array(
				'id'      => 'smm-hooks',
				'title'   => __( 'Developer hooks', 'structured-mega-menu' ),
				'content' => Developer_Docs::get_hooks_html(),
			)
		);

		$screen->set_help_sidebar(
			'<p><strong>' . esc_html__( 'For more information:', 'structured-mega-menu' ) . '</strong></p>' .
			'<p>' . esc_html__( 'Open the Help tab for CSS API and developer hooks, or scroll to For developers on this screen.', 'structured-mega-menu' ) . '</p>' .
			'<p><a href="https://github.com/rollybueno/structured-mega-menu" target="_blank" rel="noopener noreferrer">' .
			esc_html__( 'Source on GitHub', 'structured-mega-menu' ) .
			'</a></p>'
		);
	}

	/**
	 * Capability required for plugin settings pages.
	 *
	 * @return string
	 */
	public static function settings_capability() {
		return Capabilities::MANAGE;
	}
}
