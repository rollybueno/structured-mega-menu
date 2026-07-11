<?php
/**
 * PSR-4 style autoloader for WordPress class-* file names.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Maps StructuredMegaMenu\* classes to includes/class-*.php files.
 */
class Autoloader {

	/**
	 * Base directory for class files.
	 *
	 * @var string
	 */
	private static $base_dir = '';

	/**
	 * Registers the autoloader.
	 *
	 * @param string $base_dir Absolute path to the includes directory.
	 * @return void
	 */
	public static function register( $base_dir ) {
		self::$base_dir = trailingslashit( $base_dir );

		spl_autoload_register( array( __CLASS__, 'autoload' ) );
	}

	/**
	 * Autoloads a class if it belongs to this plugin.
	 *
	 * @param string $class_name Fully-qualified class name.
	 * @return void
	 */
	public static function autoload( $class_name ) {
		$prefix = __NAMESPACE__ . '\\';

		if ( 0 !== strpos( $class_name, $prefix ) ) {
			return;
		}

		$relative   = substr( $class_name, strlen( $prefix ) );
		$parts      = explode( '\\', $relative );
		$class_part = array_pop( $parts );

		$subdir = '';
		if ( ! empty( $parts ) ) {
			$subdir = strtolower(
				str_replace( '_', '-', implode( '/', $parts ) )
			) . '/';
		}

		$filename = 'class-' . strtolower( str_replace( '_', '-', $class_part ) ) . '.php';

		// Interfaces use interface-*.php naming.
		if ( 0 === strpos( $class_part, 'Interface_' ) || 'Column_Type' === $class_part ) {
			if ( 'Column_Type' === $class_part ) {
				$filename = 'interface-column-type.php';
			} else {
				$filename = 'interface-' . strtolower(
					str_replace( '_', '-', substr( $class_part, strlen( 'Interface_' ) ) )
				) . '.php';
			}
		}

		$file = self::$base_dir . $subdir . $filename;

		if ( is_readable( $file ) ) {
			require_once $file;
		}
	}
}
