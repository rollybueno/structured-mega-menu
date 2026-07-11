<?php
/**
 * Capability helpers.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Manages custom capabilities for mega menus.
 *
 * Mega menu management is gated by `edit_theme_options` so users who can
 * edit Appearance settings can manage configurations. Custom capability
 * names are registered for clarity and future extension.
 */
class Capabilities {

	/**
	 * Primary capability used for managing mega menus.
	 *
	 * @var string
	 */
	const MANAGE = 'edit_theme_options';

	/**
	 * Custom capability names (mapped to edit_theme_options on the CPT).
	 *
	 * @return string[]
	 */
	public static function get_caps() {
		return array(
			'edit_smm_mega_menu',
			'read_smm_mega_menu',
			'delete_smm_mega_menu',
			'edit_smm_mega_menus',
			'edit_others_smm_mega_menus',
			'publish_smm_mega_menus',
			'read_private_smm_mega_menus',
			'delete_smm_mega_menus',
			'delete_private_smm_mega_menus',
			'delete_published_smm_mega_menus',
			'delete_others_smm_mega_menus',
			'edit_private_smm_mega_menus',
			'edit_published_smm_mega_menus',
			'create_smm_mega_menus',
		);
	}

	/**
	 * Hooks capability-related filters.
	 *
	 * @return void
	 */
	public static function init() {
		add_filter( 'map_meta_cap', array( __CLASS__, 'map_meta_cap' ), 10, 4 );
		add_action( 'admin_init', array( __CLASS__, 'maybe_add_caps' ) );
	}

	/**
	 * Maps custom mega-menu capabilities to edit_theme_options.
	 *
	 * This keeps REST/CPT checks working even when activation caps were
	 * never written to the role (common during local development).
	 *
	 * @param string[] $caps    Required primitive capabilities.
	 * @param string   $cap     Capability being checked.
	 * @param int      $user_id User ID.
	 * @param array    $args    Extra arguments.
	 * @return string[]
	 */
	public static function map_meta_cap( $caps, $cap, $user_id, $args ) {
		unset( $user_id, $args );

		if ( in_array( $cap, self::get_caps(), true ) ) {
			return array( self::MANAGE );
		}

		return $caps;
	}

	/**
	 * Ensures role capabilities exist after upgrades or skipped activation.
	 *
	 * @return void
	 */
	public static function maybe_add_caps() {
		if ( get_option( 'smm_caps_version' ) === SMM_VERSION ) {
			return;
		}

		self::add_caps();
		update_option( 'smm_caps_version', SMM_VERSION, false );
	}

	/**
	 * Grants mega-menu capabilities to roles that can edit theme options.
	 *
	 * @return void
	 */
	public static function add_caps() {
		$roles = array( 'administrator', 'editor' );

		foreach ( $roles as $role_name ) {
			$role = get_role( $role_name );

			if ( ! $role ) {
				continue;
			}

			// Only grant custom caps when the role can already edit theme options,
			// or is the administrator (always receives caps).
			if ( 'administrator' !== $role_name && ! $role->has_cap( self::MANAGE ) ) {
				continue;
			}

			foreach ( self::get_caps() as $cap ) {
				$role->add_cap( $cap );
			}
		}
	}

	/**
	 * Removes mega-menu capabilities from known roles.
	 *
	 * @return void
	 */
	public static function remove_caps() {
		$roles = array( 'administrator', 'editor' );

		foreach ( $roles as $role_name ) {
			$role = get_role( $role_name );

			if ( ! $role ) {
				continue;
			}

			foreach ( self::get_caps() as $cap ) {
				$role->remove_cap( $cap );
			}
		}
	}

	/**
	 * Whether the current user can manage mega menus.
	 *
	 * @return bool
	 */
	public static function current_user_can_manage() {
		return current_user_can( self::MANAGE );
	}

	/**
	 * Whether a user can manage a specific mega menu post.
	 *
	 * @param int $post_id Mega menu post ID.
	 * @return bool
	 */
	public static function user_can_edit_menu( $post_id ) {
		if ( ! self::current_user_can_manage() ) {
			return false;
		}

		$post_id = absint( $post_id );

		if ( ! $post_id ) {
			return true;
		}

		$post = get_post( $post_id );

		if ( ! $post || SMM_POST_TYPE !== $post->post_type ) {
			return false;
		}

		return current_user_can( 'edit_post', $post_id );
	}
}
