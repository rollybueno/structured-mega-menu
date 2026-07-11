<?php
/**
 * Frontend mega menu renderer.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Renders mega menu markup for the dynamic block.
 *
 * Full panel markup is implemented in Phase 4. Phase 3 improves
 * missing-configuration handling for Navigation list output.
 */
class Renderer {

	/**
	 * Renders a Navigation-compatible menu item from block attributes.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_menu_item_placeholder( array $attributes ) {
		$label = isset( $attributes['label'] ) ? $attributes['label'] : '';
		$label = is_string( $label ) ? wp_strip_all_tags( $label ) : '';

		if ( '' === $label ) {
			$label = __( 'Mega menu', 'structured-mega-menu' );
		}

		$menu_id = isset( $attributes['megaMenuId'] ) ? absint( $attributes['megaMenuId'] ) : 0;

		// Missing or unusable configurations render a non-interactive label only.
		if ( $menu_id > 0 && ! self::is_usable_menu( $menu_id ) ) {
			$wrapper_attributes = get_block_wrapper_attributes(
				array(
					'class' => 'wp-block-navigation-item smm-menu-item is-missing-config',
				)
			);

			return sprintf(
				'<li %1$s><span class="wp-block-navigation-item__content"><span class="wp-block-navigation-item__label">%2$s</span></span></li>',
				$wrapper_attributes,
				esc_html( $label )
			);
		}

		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'class' => 'wp-block-navigation-item smm-menu-item',
			)
		);

		// Phase 4 replaces this with the interactive toggle + panel.
		return sprintf(
			'<li %1$s><span class="wp-block-navigation-item__content"><span class="wp-block-navigation-item__label">%2$s</span></span></li>',
			$wrapper_attributes,
			esc_html( $label )
		);
	}

	/**
	 * Whether a mega menu configuration can be rendered.
	 *
	 * @param int $menu_id Mega menu post ID.
	 * @return bool
	 */
	public static function is_usable_menu( $menu_id ) {
		$menu_id = absint( $menu_id );

		if ( ! $menu_id ) {
			return false;
		}

		$post = get_post( $menu_id );

		if ( ! $post || SMM_POST_TYPE !== $post->post_type ) {
			return false;
		}

		if ( 'publish' !== $post->post_status ) {
			return false;
		}

		$schema = Meta::get_schema( $menu_id );

		return ! empty( $schema['columns'] );
	}

	/**
	 * Renders a mega menu configuration panel.
	 *
	 * @param int   $menu_id Mega menu post ID.
	 * @param array $args    Render arguments.
	 * @return string
	 */
	public function render_menu( $menu_id, array $args = array() ) {
		$menu_id = absint( $menu_id );

		if ( ! self::is_usable_menu( $menu_id ) ) {
			return '';
		}

		$schema = Meta::get_schema( $menu_id );

		// Phase 4 builds the full panel markup.
		unset( $args, $schema );

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
