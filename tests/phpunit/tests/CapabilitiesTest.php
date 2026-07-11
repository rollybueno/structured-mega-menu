<?php
/**
 * Capability and REST permission unit tests.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu\Tests;

use StructuredMegaMenu\Capabilities;
use StructuredMegaMenu\REST_Controller;

/**
 * Tests capability helpers and REST permission callbacks.
 */
class CapabilitiesTest extends TestCase_Unit {

	/**
	 * @return void
	 */
	public function test_manage_capability_constant() {
		$this->assertSame( 'edit_theme_options', Capabilities::MANAGE );
	}

	/**
	 * @return void
	 */
	public function test_custom_caps_list_is_prefixed() {
		foreach ( Capabilities::get_caps() as $cap ) {
			$this->assertStringContainsString( 'smm_', $cap );
		}
	}

	/**
	 * @return void
	 */
	public function test_current_user_can_manage() {
		$GLOBALS['smm_test_user_caps'] = array(
			'edit_theme_options' => true,
		);
		$this->assertTrue( Capabilities::current_user_can_manage() );

		$GLOBALS['smm_test_user_caps'] = array();
		$this->assertFalse( Capabilities::current_user_can_manage() );
	}

	/**
	 * @return void
	 */
	public function test_add_caps_to_administrator() {
		$GLOBALS['smm_test_roles'] = array(
			'administrator' => new \SMM_Test_Role(
				'administrator',
				array( 'edit_theme_options' => true )
			),
			'editor'        => new \SMM_Test_Role(
				'editor',
				array( 'edit_theme_options' => true )
			),
		);

		Capabilities::add_caps();

		$admin = get_role( 'administrator' );
		$this->assertTrue( $admin->has_cap( 'edit_smm_mega_menus' ) );
		$this->assertTrue( $admin->has_cap( 'create_smm_mega_menus' ) );
	}

	/**
	 * @return void
	 */
	public function test_rest_can_manage_permission() {
		$GLOBALS['smm_test_user_caps'] = array(
			'edit_theme_options' => true,
		);
		$this->assertTrue( REST_Controller::can_manage() );

		$GLOBALS['smm_test_user_caps'] = array();
		$this->assertFalse( REST_Controller::can_manage() );
	}

	/**
	 * @return void
	 */
	public function test_map_meta_cap_routes_to_edit_theme_options() {
		$mapped = Capabilities::map_meta_cap(
			array( 'do_not_allow' ),
			'edit_smm_mega_menus',
			1,
			array()
		);

		$this->assertSame( array( 'edit_theme_options' ), $mapped );

		$passthrough = Capabilities::map_meta_cap(
			array( 'read' ),
			'read',
			1,
			array()
		);
		$this->assertSame( array( 'read' ), $passthrough );
	}
}
