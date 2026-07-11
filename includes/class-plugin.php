<?php
/**
 * Main plugin bootstrap.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Coordinates plugin services and hooks.
 */
class Plugin {

	/**
	 * Singleton instance.
	 *
	 * @var Plugin|null
	 */
	private static $instance = null;

	/**
	 * Column type registry.
	 *
	 * @var Column_Types\Column_Registry|null
	 */
	private $column_registry = null;

	/**
	 * Returns the singleton instance.
	 *
	 * @return Plugin
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Prevents cloning.
	 */
	private function __clone() {}

	/**
	 * Prevents unserialization.
	 *
	 * @throws \Exception When unserialization is attempted.
	 * @return void
	 */
	public function __wakeup() {
		throw new \Exception( 'Cannot unserialize ' . __CLASS__ );
	}

	/**
	 * Initializes plugin services.
	 *
	 * @return void
	 */
	public function init() {
		load_plugin_textdomain(
			'structured-mega-menu',
			false,
			dirname( SMM_PLUGIN_BASENAME ) . '/languages'
		);

		$this->column_registry = new Column_Types\Column_Registry();
		$this->column_registry->register_defaults();

		/**
		 * Fires after built-in column types are registered.
		 *
		 * Third parties may register additional column types.
		 *
		 * @since 1.0.0
		 *
		 * @param Column_Types\Column_Registry $registry Column type registry.
		 */
		do_action( 'structured_mega_menu_register_column_types', $this->column_registry );

		Capabilities::init();
		Post_Type::init();
		Meta::init();
		Migrations::init();
		Assets::init();
		Admin::init();
		REST_Controller::init();
		Icons::init();

		add_action( 'init', array( $this, 'register_blocks' ) );
	}

	/**
	 * Returns the column type registry.
	 *
	 * @return Column_Types\Column_Registry
	 */
	public function get_column_registry() {
		return $this->column_registry;
	}

	/**
	 * Registers Gutenberg blocks from the build directory.
	 *
	 * @return void
	 */
	public function register_blocks() {
		$block_path = SMM_PLUGIN_DIR . 'build/blocks/menu-item';

		if ( file_exists( $block_path . '/block.json' ) ) {
			register_block_type( $block_path );
		}
	}
}
