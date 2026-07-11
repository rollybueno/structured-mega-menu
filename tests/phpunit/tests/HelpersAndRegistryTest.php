<?php
/**
 * Helpers and registry unit tests.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu\Tests;

use StructuredMegaMenu\Helpers;
use StructuredMegaMenu\Markup;

/**
 * Tests helpers, IDs, markup escaping, and column registry.
 */
class HelpersAndRegistryTest extends TestCase_Unit {

	/**
	 * @return void
	 */
	public function test_generate_unique_ids() {
		$id_a = Helpers::generate_id( 'smm-panel' );
		$id_b = Helpers::generate_id( 'smm-panel' );

		$this->assertStringStartsWith( 'smm-panel-', $id_a );
		$this->assertNotSame( $id_a, $id_b );
	}

	/**
	 * @return void
	 */
	public function test_sanitize_id_rejects_invalid_values() {
		$this->assertSame( 'valid-id', Helpers::sanitize_id( 'valid-id', 'smm' ) );
		$generated = Helpers::sanitize_id( '!!!', 'smm' );
		$this->assertStringStartsWith( 'smm-', $generated );
	}

	/**
	 * @return void
	 */
	public function test_column_registry_defaults() {
		$registry = $this->make_registry();

		$this->assertTrue( $registry->has( 'image_cta' ) );
		$this->assertTrue( $registry->has( 'icon_links' ) );
		$this->assertTrue( $registry->has( 'link_list' ) );
		$this->assertFalse( $registry->has( 'bogus' ) );
		$this->assertCount( 3, $registry->all() );
	}

	/**
	 * @return void
	 */
	public function test_markup_escapes_heading_and_description() {
		$heading = Markup::heading( '<b>Title</b>' );
		$desc    = Markup::description( '<script>x</script>Text' );

		$this->assertStringContainsString( '&lt;b&gt;Title&lt;/b&gt;', $heading );
		$this->assertStringNotContainsString( '<script>', $desc );
		$this->assertStringContainsString( 'Text', $desc );
	}

	/**
	 * @return void
	 */
	public function test_to_bool_helper() {
		$this->assertTrue( Helpers::to_bool( 1 ) );
		$this->assertFalse( Helpers::to_bool( 0 ) );
		$this->assertTrue( Helpers::to_bool( true ) );
	}
}
