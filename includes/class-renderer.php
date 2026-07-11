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
 */
class Renderer {

	/**
	 * Renders a Navigation-compatible menu item from block attributes.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_menu_item( array $attributes ) {
		$label = isset( $attributes['label'] ) ? $attributes['label'] : '';
		$label = is_string( $label ) ? wp_strip_all_tags( $label ) : '';

		if ( '' === $label ) {
			$label = __( 'Mega menu', 'structured-mega-menu' );
		}

		$menu_id = isset( $attributes['megaMenuId'] ) ? absint( $attributes['megaMenuId'] ) : 0;

		if ( ! $menu_id || ! self::is_usable_menu( $menu_id ) ) {
			return self::render_static_label( $label, 'is-missing-config' );
		}

		$schema   = Meta::get_schema( $menu_id );
		$settings = isset( $schema['settings'] ) && is_array( $schema['settings'] ) ? $schema['settings'] : Schema::get_default_settings();
		$columns  = isset( $schema['columns'] ) && is_array( $schema['columns'] ) ? $schema['columns'] : array();

		$enabled_columns = array();
		foreach ( $columns as $column ) {
			if ( ! empty( $column['enabled'] ) ) {
				$enabled_columns[] = $column;
			}
		}

		if ( empty( $enabled_columns ) ) {
			return self::render_static_label( $label, 'is-empty-config' );
		}

		$instance      = new self();
		$panel_id      = $instance->generate_instance_id( $menu_id );
		$grid_template = Schema::layout_to_grid_template(
			isset( $settings['layoutPreset'] ) ? $settings['layoutPreset'] : '1'
		);
		$column_count  = count( $enabled_columns );
		/* Rough min width so multi-column panels are not crushed to the trigger width. */
		$panel_min_rem = max( 18, min( 56, 14 * max( 1, $column_count ) ) );

		$panel_width   = isset( $settings['panelWidth'] ) ? sanitize_key( $settings['panelWidth'] ) : 'navigation';
		$opening_mode  = isset( $settings['openingMode'] ) ? sanitize_key( $settings['openingMode'] ) : 'click';
		$mobile_mode   = isset( $settings['mobileMode'] ) ? sanitize_key( $settings['mobileMode'] ) : 'accordion';
		$close_outside = ! empty( $settings['closeOnOutsideClick'] );
		$close_escape  = ! isset( $settings['closeOnEscape'] ) || ! empty( $settings['closeOnEscape'] );

		$trigger_type     = isset( $attributes['triggerType'] ) ? sanitize_key( $attributes['triggerType'] ) : 'button';
		$url              = isset( $attributes['url'] ) ? esc_url( $attributes['url'] ) : '';
		$opens_in_new     = ! empty( $attributes['opensInNewTab'] );
		$use_link_trigger = ( 'link' === $trigger_type && '' !== $url );

		$context = array(
			'menuId'     => $menu_id,
			'panelId'    => $panel_id,
			'panelWidth' => $panel_width,
			'mobileMode' => $mobile_mode,
		);

		$panel_html = $instance->render_columns( $enabled_columns, $context );

		if ( '' === $panel_html ) {
			return self::render_static_label( $label, 'is-empty-config' );
		}

		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'class' => implode(
					' ',
					array_filter(
						array(
							'wp-block-navigation-item',
							'smm-menu-item',
							'has-child',
							'smm-panel-width-' . $panel_width,
							'smm-opening-' . $opening_mode,
							'smm-mobile-' . $mobile_mode,
						)
					)
				),
			)
		);

		$interactivity = wp_interactivity_data_wp_context(
			array(
				'panelId'             => $panel_id,
				'isOpen'              => false,
				'openingMode'         => $opening_mode,
				'closeOnOutsideClick' => $close_outside,
				'closeOnEscape'       => $close_escape,
				'menuId'              => $menu_id,
			)
		);

		$chevron = '<span class="smm-menu-item__icon" aria-hidden="true" focusable="false"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12" fill="currentColor" aria-hidden="true" focusable="false"><path d="M6 8.5L1.5 4 2.6 2.9 6 6.3 9.4 2.9 10.5 4z"/></svg></span>';

		ob_start();
		?>
		<li
			<?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() escapes. ?>
			data-wp-interactive="structured-mega-menu"
			<?php echo $interactivity; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_interactivity_data_wp_context() escapes. ?>
			data-wp-class--is-open="context.isOpen"
			data-wp-watch="callbacks.syncOpenState"
			data-wp-on--focusout="actions.handleFocusOut"
			data-wp-on--keydown="actions.handleKeydown"
			<?php if ( 'hover' === $opening_mode ) : ?>
				data-wp-on--mouseenter="actions.handleMouseEnter"
				data-wp-on--mouseleave="actions.handleMouseLeave"
			<?php endif; ?>
			<?php if ( $close_outside ) : ?>
				data-wp-on-window--click="actions.handleOutsideClick"
			<?php endif; ?>
		>
			<?php if ( $use_link_trigger ) : ?>
				<a
					class="smm-menu-item__link wp-block-navigation-item__content"
					href="<?php echo esc_url( $url ); ?>"
					<?php echo $opens_in_new ? 'target="_blank" rel="noopener noreferrer"' : ''; ?>
					data-wp-on--click="actions.handleLinkClick"
				>
					<span class="wp-block-navigation-item__label"><?php echo esc_html( $label ); ?></span>
				</a>
				<button
					class="smm-menu-item__toggle smm-menu-item__toggle--adjacent"
					type="button"
					aria-expanded="false"
					aria-controls="<?php echo esc_attr( $panel_id ); ?>"
					data-wp-bind--aria-expanded="context.isOpen"
					data-wp-on--click="actions.toggle"
				>
					<span class="screen-reader-text">
						<?php
						echo esc_html(
							sprintf(
								/* translators: %s: menu label */
								__( 'Toggle %s submenu', 'structured-mega-menu' ),
								$label
							)
						);
						?>
					</span>
					<?php echo $chevron; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Trusted SVG. ?>
				</button>
			<?php else : ?>
				<button
					class="smm-menu-item__toggle wp-block-navigation-item__content"
					type="button"
					aria-expanded="false"
					aria-controls="<?php echo esc_attr( $panel_id ); ?>"
					data-wp-bind--aria-expanded="context.isOpen"
					data-wp-on--click="actions.toggle"
				>
					<span class="wp-block-navigation-item__label"><?php echo esc_html( $label ); ?></span>
					<?php echo $chevron; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Trusted SVG. ?>
				</button>
			<?php endif; ?>

			<div
				id="<?php echo esc_attr( $panel_id ); ?>"
				class="smm-menu-item__panel"
				hidden
				data-wp-bind--hidden="!context.isOpen"
				style="<?php echo esc_attr( '--smm-panel-min-width: ' . $panel_min_rem . 'rem;' ); ?>"
			>
				<div class="smm-menu-item__panel-inner">
					<div
						class="smm-menu-item__grid smm-menu-item__grid--cols-<?php echo esc_attr( (string) $column_count ); ?>"
						style="<?php echo esc_attr( 'grid-template-columns: ' . $grid_template . ';' ); ?>"
					>
						<?php echo $panel_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Column renderers escape. ?>
					</div>
				</div>
			</div>
		</li>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Backward-compatible alias used by render.php.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_menu_item_placeholder( array $attributes ) {
		return self::render_menu_item( $attributes );
	}

	/**
	 * Renders a non-interactive Navigation label.
	 *
	 * @param string $label Label text.
	 * @param string $extra_class Extra class name.
	 * @return string
	 */
	private static function render_static_label( $label, $extra_class = '' ) {
		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'class' => trim( 'wp-block-navigation-item smm-menu-item ' . $extra_class ),
			)
		);

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

		if ( empty( $schema['columns'] ) || ! is_array( $schema['columns'] ) ) {
			return false;
		}

		foreach ( $schema['columns'] as $column ) {
			if ( ! empty( $column['enabled'] ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Renders enabled columns.
	 *
	 * @param array $columns Enabled columns.
	 * @param array $context Render context.
	 * @return string
	 */
	public function render_columns( array $columns, array $context = array() ) {
		$registry = Plugin::instance()->get_column_registry();
		$html     = '';

		foreach ( $columns as $index => $column ) {
			$type = isset( $column['type'] ) ? $column['type'] : '';
			if ( ! $registry->has( $type ) ) {
				continue;
			}

			$settings       = isset( $column['settings'] ) && is_array( $column['settings'] ) ? $column['settings'] : array();
			$column_context = array_merge(
				$context,
				array(
					'columnId'    => isset( $column['id'] ) ? $column['id'] : '',
					'columnIndex' => $index,
				)
			);

			$column_html = $registry->get( $type )->render( $settings, $column_context );

			/**
			 * Filters rendered column HTML.
			 *
			 * @since 1.0.0
			 *
			 * @param string $column_html Rendered markup.
			 * @param array  $column      Column data.
			 * @param array  $context     Render context.
			 */
			$column_html = apply_filters( 'structured_mega_menu_rendered_column', $column_html, $column, $column_context );

			if ( '' === $column_html ) {
				continue;
			}

			$html .= sprintf(
				'<div class="smm-column smm-column--%1$s" data-column-type="%1$s">%2$s</div>',
				esc_attr( $type ),
				$column_html
			);
		}

		return $html;
	}

	/**
	 * Renders a mega menu configuration panel (programmatic API).
	 *
	 * @param int   $menu_id Mega menu post ID.
	 * @param array $args    Render arguments.
	 * @return string
	 */
	public function render_menu( $menu_id, array $args = array() ) {
		unset( $args );

		return self::render_menu_item(
			array(
				'label'       => '',
				'megaMenuId'  => absint( $menu_id ),
				'triggerType' => 'button',
			)
		);
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
