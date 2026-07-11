<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * Deletes plugin data only when the user has explicitly enabled
 * "Delete all plugin data when uninstalled".
 *
 * @package StructuredMegaMenu
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

/**
 * Runs uninstall cleanup when data deletion is enabled.
 *
 * @return void
 */
function structured_mega_menu_uninstall() {
	$delete = get_option( 'smm_delete_data_on_uninstall', false );

	if ( ! $delete ) {
		return;
	}

	$posts = get_posts(
		array(
			'post_type'      => 'smm_mega_menu',
			'post_status'    => 'any',
			'posts_per_page' => -1,
			'fields'         => 'ids',
			'nopaging'       => true,
		)
	);

	if ( ! empty( $posts ) ) {
		foreach ( $posts as $post_id ) {
			wp_delete_post( (int) $post_id, true );
		}
	}

	delete_option( 'smm_delete_data_on_uninstall' );
	delete_option( 'smm_schema_version' );

	global $wpdb;

	// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Uninstall cleanup of prefixed transients.
	$wpdb->query(
		"DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_smm_%' OR option_name LIKE '_transient_timeout_smm_%'"
	);

	$caps = array(
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

	foreach ( array( 'administrator', 'editor' ) as $role_name ) {
		$role = get_role( $role_name );
		if ( ! $role ) {
			continue;
		}
		foreach ( $caps as $cap ) {
			$role->remove_cap( $cap );
		}
	}
}

structured_mega_menu_uninstall();
