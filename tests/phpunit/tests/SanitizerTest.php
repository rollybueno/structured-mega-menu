<?php
/**
 * Sanitizer unit tests.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu\Tests;

use StructuredMegaMenu\Migrations;
use StructuredMegaMenu\Schema;

/**
 * Tests schema sanitization and validation.
 */
class SanitizerTest extends TestCase_Unit {

	/**
	 * @return void
	 */
	public function test_empty_payload_returns_defaults() {
		$sanitizer = $this->make_sanitizer();
		$result    = $sanitizer->sanitize_schema( null );

		$this->assertSame( Schema::get_default(), $result );
	}

	/**
	 * @return void
	 */
	public function test_invalid_column_types_are_dropped() {
		$sanitizer = $this->make_sanitizer();
		$result    = $sanitizer->sanitize_schema(
			array(
				'version'  => 1,
				'settings' => array(),
				'columns'  => array(
					array(
						'id'       => 'bad',
						'type'     => 'not_a_real_type',
						'enabled'  => true,
						'settings' => array(),
					),
					array(
						'id'       => 'good',
						'type'     => 'image_cta',
						'enabled'  => true,
						'settings' => array(
							'heading' => 'Hello',
						),
					),
				),
			)
		);

		$this->assertCount( 1, $result['columns'] );
		$this->assertSame( 'image_cta', $result['columns'][0]['type'] );
		$this->assertSame( 'Hello', $result['columns'][0]['settings']['heading'] );
	}

	/**
	 * @return void
	 */
	public function test_more_than_four_columns_are_truncated() {
		$sanitizer = $this->make_sanitizer();
		$columns   = array();

		for ( $i = 0; $i < 6; $i++ ) {
			$columns[] = array(
				'id'       => 'col-' . $i,
				'type'     => 'link_list',
				'enabled'  => true,
				'settings' => array(
					'heading' => 'Column ' . $i,
					'items'   => array(),
				),
			);
		}

		$result = $sanitizer->sanitize_schema(
			array(
				'version'  => 1,
				'settings' => array( 'layoutPreset' => '1-1-1-1' ),
				'columns'  => $columns,
			)
		);

		$this->assertCount( 4, $result['columns'] );
	}

	/**
	 * @return void
	 */
	public function test_invalid_layout_preset_is_corrected() {
		$sanitizer = $this->make_sanitizer();
		$result    = $sanitizer->sanitize_schema(
			array(
				'version'  => 1,
				'settings' => array(
					'layoutPreset' => '1-1-1-1',
				),
				'columns'  => array(
					array(
						'id'       => 'a',
						'type'     => 'link_list',
						'enabled'  => true,
						'settings' => array( 'items' => array() ),
					),
					array(
						'id'       => 'b',
						'type'     => 'link_list',
						'enabled'  => true,
						'settings' => array( 'items' => array() ),
					),
				),
			)
		);

		$this->assertTrue(
			Schema::is_valid_layout_for_count(
				$result['settings']['layoutPreset'],
				2
			)
		);
		$this->assertNotSame( '1-1-1-1', $result['settings']['layoutPreset'] );
	}

	/**
	 * @return void
	 */
	public function test_url_sanitization() {
		$sanitizer = $this->make_sanitizer();

		$this->assertSame(
			'https://example.com/path',
			$sanitizer->sanitize_url( ' https://example.com/path ' )
		);
		$this->assertSame( '/about/', $sanitizer->sanitize_url( '/about/' ) );
		$this->assertSame( '', $sanitizer->sanitize_url( 'javascript:alert(1)' ) );
	}

	/**
	 * @return void
	 */
	public function test_repeater_sanitization_and_disabled_rows() {
		$sanitizer = $this->make_sanitizer();
		$result    = $sanitizer->sanitize_schema(
			array(
				'version'  => 1,
				'settings' => array(),
				'columns'  => array(
					array(
						'id'       => 'links',
						'type'     => 'icon_links',
						'enabled'  => true,
						'settings' => array(
							'heading' => '<b>Links</b>',
							'items'   => array(
								array(
									'id'      => 'item-1',
									'enabled' => true,
									'label'   => '<em>Docs</em>',
									'url'     => 'https://example.com/docs',
									'icon'    => array(
										'source' => 'library',
										'value'  => 'document',
									),
								),
								array(
									'id'      => 'item-2',
									'enabled' => false,
									'label'   => 'Hidden',
									'url'     => 'https://example.com/hidden',
								),
							),
						),
					),
				),
			)
		);

		$items = $result['columns'][0]['settings']['items'];
		$this->assertCount( 2, $items );
		$this->assertSame( 'Docs', $items[0]['label'] );
		$this->assertFalse( $items[1]['enabled'] );
		$this->assertSame( 'Links', $result['columns'][0]['settings']['heading'] );
	}

	/**
	 * @return void
	 */
	public function test_html_is_stripped_from_text_fields() {
		$sanitizer = $this->make_sanitizer();
		$result    = $sanitizer->sanitize_schema(
			array(
				'version'  => 1,
				'settings' => array(),
				'columns'  => array(
					array(
						'id'       => 'cta',
						'type'     => 'image_cta',
						'enabled'  => true,
						'settings' => array(
							'heading'     => '<script>alert(1)</script>Title',
							'description' => '<p>Safe</p>',
							'ctaLabel'    => '<b>Go</b>',
							'url'         => 'https://example.com',
						),
					),
				),
			)
		);

		$settings = $result['columns'][0]['settings'];
		$this->assertStringNotContainsString( '<script>', $settings['heading'] );
		$this->assertStringNotContainsString( '<p>', $settings['description'] );
		$this->assertSame( 'Go', $settings['ctaLabel'] );
	}

	/**
	 * @return void
	 */
	public function test_migration_from_pre_v1() {
		$migrated = Migrations::migrate( array( 'columns' => array() ), 0 );

		$this->assertSame( SMM_SCHEMA_VERSION, $migrated['version'] );
		$this->assertArrayHasKey( 'settings', $migrated );
		$this->assertArrayHasKey( 'columns', $migrated );
	}

	/**
	 * @return void
	 */
	public function test_validate_flags_missing_required_link_fields() {
		$sanitizer = $this->make_sanitizer();
		$schema    = $sanitizer->sanitize_schema(
			array(
				'version'  => 1,
				'settings' => array( 'layoutPreset' => '1' ),
				'columns'  => array(
					array(
						'id'       => 'list',
						'type'     => 'link_list',
						'enabled'  => true,
						'settings' => array(
							'items' => array(
								array(
									'id'      => 'broken',
									'enabled' => true,
									'label'   => '',
									'url'     => '',
								),
							),
						),
					),
				),
			)
		);

		$errors = $sanitizer->validate( $schema );
		$codes  = array_column( $errors, 'code' );

		$this->assertContains( 'required_label', $codes );
		$this->assertContains( 'required_url', $codes );
	}

	/**
	 * @return void
	 */
	public function test_disabled_columns_do_not_count_for_layout() {
		$sanitizer = $this->make_sanitizer();
		$result    = $sanitizer->sanitize_schema(
			array(
				'version'  => 1,
				'settings' => array( 'layoutPreset' => '1-1' ),
				'columns'  => array(
					array(
						'id'       => 'on',
						'type'     => 'link_list',
						'enabled'  => true,
						'settings' => array( 'items' => array() ),
					),
					array(
						'id'       => 'off',
						'type'     => 'link_list',
						'enabled'  => false,
						'settings' => array( 'items' => array() ),
					),
				),
			)
		);

		$this->assertSame( '1', $result['settings']['layoutPreset'] );
		$this->assertSame( 1, $sanitizer->count_enabled_columns( $result['columns'] ) );
	}
}
