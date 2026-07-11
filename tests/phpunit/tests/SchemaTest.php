<?php
/**
 * Schema unit tests.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu\Tests;

use StructuredMegaMenu\Schema;

/**
 * Tests schema defaults and layout helpers.
 */
class SchemaTest extends TestCase_Unit {

	/**
	 * @return void
	 */
	public function test_default_schema_shape() {
		$schema = Schema::get_default();

		$this->assertSame( SMM_SCHEMA_VERSION, $schema['version'] );
		$this->assertIsArray( $schema['settings'] );
		$this->assertSame( array(), $schema['columns'] );
		$this->assertSame( 'navigation', $schema['settings']['panelWidth'] );
		$this->assertSame( 'click', $schema['settings']['openingMode'] );
		$this->assertTrue( $schema['settings']['closeOnOutsideClick'] );
		$this->assertTrue( $schema['settings']['closeOnEscape'] );
	}

	/**
	 * @return void
	 */
	public function test_layout_presets_for_counts() {
		$this->assertSame( array( '1' ), Schema::get_layouts_for_count( 1 ) );
		$this->assertContains( '1-2', Schema::get_layouts_for_count( 2 ) );
		$this->assertContains( '1-1-1-1', Schema::get_layouts_for_count( 4 ) );
		$this->assertSame( array( '1' ), Schema::get_layouts_for_count( 0 ) );
	}

	/**
	 * @return void
	 */
	public function test_layout_to_grid_template() {
		$this->assertSame( 'minmax(0, 1fr)', Schema::layout_to_grid_template( '1' ) );
		$this->assertSame( 'minmax(0, 1fr) minmax(0, 2fr)', Schema::layout_to_grid_template( '1-2' ) );
		$this->assertSame( 'minmax(0, 1fr)', Schema::layout_to_grid_template( '' ) );
	}

	/**
	 * @return void
	 */
	public function test_panel_widths_include_wide() {
		$widths = Schema::get_panel_widths();

		$this->assertContains( 'navigation', $widths );
		$this->assertContains( 'content', $widths );
		$this->assertContains( 'wide', $widths );
		$this->assertContains( 'viewport', $widths );
	}

	/**
	 * @return void
	 */
	public function test_is_valid_layout_for_count() {
		$this->assertTrue( Schema::is_valid_layout_for_count( '1-1', 2 ) );
		$this->assertFalse( Schema::is_valid_layout_for_count( '1-1-1', 2 ) );
	}
}
