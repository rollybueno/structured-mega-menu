<?php
/**
 * Frontend mega menu renderer (Phase 1 scaffold).
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Renders mega menu markup for the dynamic block.
 *
 * Full rendering is implemented in Phase 4.
 */
class Renderer {

	/**
	 * Renders a Phase 1 placeholder menu item for Navigation list markup.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_menu_item_placeholder( array $attributes ) {
		$label = isset( $attributes['label'] ) ? $attributes['label'] : '';
		$label = is_string( $label ) ? $label : '';

		if ( '' === $label ) {
			$label = __( 'Mega menu', 'structured-mega-menu' );
		}

		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'class' => 'wp-block-navigation-item smm-menu-item',
			)
		);

		return sprintf(
			'<li %1$s><span class="wp-block-navigation-item__label">%2$s</span></li>',
			$wrapper_attributes,
			esc_html( $label )
		);
	}

	/**
	 * Renders a mega menu configuration.
	 *
	 * @param int   $menu_id Mega menu post ID.
	 * @param array $args    Render arguments.
	 * @return string
	 */
	public function render_menu( $menu_id, array $args = array() ) {
		$menu_id = absint( $menu_id );

		if ( ! $menu_id ) {
			return '';
		}

		$post = get_post( $menu_id );

		if ( ! $post || SMM_POST_TYPE !== $post->post_type || 'publish' !== $post->post_status ) {
			return '';
		}

		$schema = Meta::get_schema( $menu_id );

		if ( empty( $schema['columns'] ) ) {
			return '';
		}

		// Phase 4 builds the full panel markup.
		unset( $args );

		return '';
	}

	/**
	 * Generates a unique frontend instance ID.
	 *
	 * @param int $menu_id Mega menu post ID.
	 * @return string
	 */
	public function generate_instance_id( $menu_id ) {
		return Helpers::generate_id( 'smm-panel-' . absint( $menu_id ) );
	}
}
