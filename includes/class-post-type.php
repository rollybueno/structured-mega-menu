<?php
/**
 * Custom post type registration.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Registers the private smm_mega_menu post type.
 */
class Post_Type {

	/**
	 * Hooks post type registration.
	 *
	 * @return void
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'register' ) );
	}

	/**
	 * Registers the mega menu post type.
	 *
	 * @return void
	 */
	public static function register() {
		$labels = array(
			'name'               => _x( 'Mega Menus', 'Post type general name', 'structured-mega-menu' ),
			'singular_name'      => _x( 'Mega Menu', 'Post type singular name', 'structured-mega-menu' ),
			'menu_name'          => _x( 'Mega Menus', 'Admin Menu text', 'structured-mega-menu' ),
			'name_admin_bar'     => _x( 'Mega Menu', 'Add New on Toolbar', 'structured-mega-menu' ),
			'add_new'            => __( 'Add New', 'structured-mega-menu' ),
			'add_new_item'       => __( 'Add New Mega Menu', 'structured-mega-menu' ),
			'new_item'           => __( 'New Mega Menu', 'structured-mega-menu' ),
			'edit_item'          => __( 'Edit Mega Menu', 'structured-mega-menu' ),
			'view_item'          => __( 'View Mega Menu', 'structured-mega-menu' ),
			'all_items'          => __( 'Mega Menus', 'structured-mega-menu' ),
			'search_items'       => __( 'Search Mega Menus', 'structured-mega-menu' ),
			'not_found'          => __( 'No mega menus found.', 'structured-mega-menu' ),
			'not_found_in_trash' => __( 'No mega menus found in Trash.', 'structured-mega-menu' ),
			'item_published'     => __( 'Mega menu published.', 'structured-mega-menu' ),
			'item_updated'       => __( 'Mega menu updated.', 'structured-mega-menu' ),
			'item_trashed'       => __( 'Mega menu trashed.', 'structured-mega-menu' ),
		);

		$args = array(
			'labels'                => $labels,
			'description'           => __( 'Reusable mega menu configurations for the Navigation block.', 'structured-mega-menu' ),
			'public'                => false,
			'publicly_queryable'    => false,
			'show_ui'               => true,
			'show_in_menu'          => false,
			'show_in_admin_bar'     => false,
			'show_in_nav_menus'     => false,
			'show_in_rest'          => true,
			'rest_base'             => 'smm-mega-menus',
			'rest_controller_class' => 'WP_REST_Posts_Controller',
			'has_archive'           => false,
			'exclude_from_search'   => true,
			'hierarchical'          => false,
			'rewrite'               => false,
			'query_var'             => false,
			'can_export'            => true,
			'delete_with_user'      => false,
			'supports'              => array( 'title' ),
			'menu_icon'             => 'dashicons-menu-alt3',
			'capability_type'       => array( 'smm_mega_menu', 'smm_mega_menus' ),
			'map_meta_cap'          => true,
			'capabilities'          => array(
				'edit_post'              => 'edit_smm_mega_menu',
				'read_post'              => 'read_smm_mega_menu',
				'delete_post'            => 'delete_smm_mega_menu',
				'edit_posts'             => 'edit_smm_mega_menus',
				'edit_others_posts'      => 'edit_others_smm_mega_menus',
				'publish_posts'          => 'publish_smm_mega_menus',
				'read_private_posts'     => 'read_private_smm_mega_menus',
				'delete_posts'           => 'delete_smm_mega_menus',
				'delete_private_posts'   => 'delete_private_smm_mega_menus',
				'delete_published_posts' => 'delete_published_smm_mega_menus',
				'delete_others_posts'    => 'delete_others_smm_mega_menus',
				'edit_private_posts'     => 'edit_private_smm_mega_menus',
				'edit_published_posts'   => 'edit_published_smm_mega_menus',
				'create_posts'           => 'create_smm_mega_menus',
			),
		);

		register_post_type( SMM_POST_TYPE, $args );
	}
}
