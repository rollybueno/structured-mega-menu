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
		// Reserved for future capability filters.
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
		$post_id = absint( $post_id );

		if ( ! $post_id ) {
			return self::current_user_can_manage();
		}

		return current_user_can( 'edit_post', $post_id );
	}
}
