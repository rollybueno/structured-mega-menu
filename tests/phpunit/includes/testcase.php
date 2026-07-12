<?php
/**
 * Base test case for Structured Mega Menu unit tests.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu\Tests;

use PHPUnit\Framework\TestCase;
use StructuredMegaMenu\Column_Types\Column_Registry;
use StructuredMegaMenu\Icons;
use StructuredMegaMenu\Plugin;
use StructuredMegaMenu\Sanitizer;

/**
 * Shared helpers for unit tests.
 */
abstract class TestCase_Unit extends TestCase {

	/**
	 * Fresh sanitizer with default column types.
	 *
	 * @return Sanitizer
	 */
	protected function make_sanitizer() {
		$registry = new Column_Registry();
		$registry->register_defaults();
		return new Sanitizer( $registry );
	}

	/**
	 * Fresh column registry with defaults.
	 *
	 * @return Column_Registry
	 */
	protected function make_registry() {
		$registry = new Column_Registry();
		$registry->register_defaults();
		return $registry;
	}

	/**
	 * Ensures Plugin singleton has a usable column registry.
	 *
	 * @return void
	 */
	protected function boot_plugin() {
		$plugin = Plugin::instance();
		$ref    = new \ReflectionClass( $plugin );

		if ( $ref->hasProperty( 'column_registry' ) ) {
			$prop = $ref->getProperty( 'column_registry' );
			$prop->setAccessible( true );
			if ( null === $prop->getValue( $plugin ) ) {
				$prop->setValue( $plugin, $this->make_registry() );
			}
		}
	}

	/**
	 * Resets mutable globals used by stubs.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$GLOBALS['smm_test_options']   = array();
		$GLOBALS['smm_test_user_caps'] = array();
		$GLOBALS['smm_test_roles']     = array();
		$GLOBALS['smm_test_posts']     = array();
		$GLOBALS['smm_test_post_meta'] = array();

		Icons::init();
		$this->boot_plugin();
	}
}
