<?php
/**
 * Renderer unit tests.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu\Tests;

use StructuredMegaMenu\Renderer;
use StructuredMegaMenu\Schema;

/**
 * Tests frontend renderer output and missing-config handling.
 */
class RendererTest extends TestCase_Unit {

	/**
	 * @return void
	 */
	public function test_missing_configuration_renders_static_label() {
		$html = Renderer::render_menu_item(
			array(
				'label'      => 'Products',
				'megaMenuId' => 0,
			)
		);

		$this->assertStringContainsString( 'is-missing-config', $html );
		$this->assertStringContainsString( 'Products', $html );
		$this->assertStringNotContainsString( 'data-wp-interactive', $html );
	}

	/**
	 * @return void
	 */
	public function test_missing_menu_post_renders_static_label() {
		$html = Renderer::render_menu_item(
			array(
				'label'      => 'Ghost',
				'megaMenuId' => 999,
			)
		);

		$this->assertStringContainsString( 'is-missing-config', $html );
		$this->assertStringContainsString( 'Ghost', $html );
	}

	/**
	 * @return void
	 */
	public function test_label_is_escaped() {
		$html = Renderer::render_menu_item(
			array(
				'label'      => '<script>alert(1)</script>',
				'megaMenuId' => 0,
			)
		);

		$this->assertStringNotContainsString( '<script>', $html );
		$this->assertStringContainsString( 'alert(1)', $html );
	}

	/**
	 * @return void
	 */
	public function test_usable_menu_with_schema_renders_interactive_markup() {
		$menu_id = 42;
		$schema  = Schema::get_default();
		$schema['columns'][] = array(
			'id'       => 'col-1',
			'type'     => 'link_list',
			'width'    => 1,
			'enabled'  => true,
			'settings' => array(
				'heading'     => 'Explore',
				'description' => '',
				'displayStyle'=> 'with_descriptions',
				'items'       => array(
					array(
						'id'            => 'item-1',
						'enabled'       => true,
						'label'         => 'Docs',
						'description'   => 'Read the docs',
						'url'           => 'https://example.com/docs',
						'opensInNewTab' => false,
					),
				),
			),
		);

		$GLOBALS['smm_test_posts'][ $menu_id ] = (object) array(
			'ID'          => $menu_id,
			'post_type'   => SMM_POST_TYPE,
			'post_status' => 'publish',
		);
		$GLOBALS['smm_test_post_meta'][ $menu_id ] = array(
			SMM_META_SCHEMA         => wp_json_encode( $schema ),
			SMM_META_SCHEMA_VERSION => 1,
		);

		// Meta::get_schema expects decoded array via get_post_meta + json - check Meta implementation.
		$html = Renderer::render_menu_item(
			array(
				'label'       => 'Resources',
				'megaMenuId'  => $menu_id,
				'triggerType' => 'button',
			)
		);

		$this->assertStringContainsString( 'data-wp-interactive="structured-mega-menu"', $html );
		$this->assertStringContainsString( 'smm-menu-item__toggle', $html );
		$this->assertStringContainsString( 'Resources', $html );
		$this->assertStringContainsString( 'Explore', $html );
		$this->assertStringContainsString( 'Docs', $html );
		$this->assertStringContainsString( 'aria-expanded', $html );
	}

	/**
	 * @return void
	 */
	public function test_is_usable_menu_requires_enabled_column() {
		$menu_id = 7;
		$schema  = Schema::get_default();
		$schema['columns'][] = array(
			'id'       => 'off',
			'type'     => 'link_list',
			'enabled'  => false,
			'settings' => array( 'items' => array() ),
		);

		$GLOBALS['smm_test_posts'][ $menu_id ] = (object) array(
			'ID'          => $menu_id,
			'post_type'   => SMM_POST_TYPE,
			'post_status' => 'publish',
		);
		$GLOBALS['smm_test_post_meta'][ $menu_id ] = array(
			SMM_META_SCHEMA => wp_json_encode( $schema ),
		);

		$this->assertFalse( Renderer::is_usable_menu( $menu_id ) );
	}
}
