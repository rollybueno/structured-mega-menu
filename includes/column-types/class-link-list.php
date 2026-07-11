<?php
/**
 * Link list column type.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu\Column_Types;

use StructuredMegaMenu\Helpers;
use StructuredMegaMenu\Markup;

defined( 'ABSPATH' ) || exit;

/**
 * Simple navigation links with optional descriptions.
 */
class Link_List implements Column_Type {

	/**
	 * {@inheritdoc}
	 */
	public function get_name(): string {
		return 'link_list';
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_label(): string {
		return __( 'Link list', 'structured-mega-menu' );
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_schema(): array {
		return array(
			'heading'      => array( 'type' => 'string' ),
			'description'  => array( 'type' => 'string' ),
			'displayStyle' => array(
				'type' => 'string',
				'enum' => array( 'simple', 'with_descriptions' ),
			),
			'items'        => array(
				'type'  => 'array',
				'items' => array(
					'id'            => array( 'type' => 'string' ),
					'enabled'       => array( 'type' => 'boolean' ),
					'label'         => array( 'type' => 'string' ),
					'description'   => array( 'type' => 'string' ),
					'url'           => array( 'type' => 'string' ),
					'opensInNewTab' => array( 'type' => 'boolean' ),
				),
			),
		);
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_defaults(): array {
		return array(
			'heading'      => '',
			'description'  => '',
			'displayStyle' => 'simple',
			'items'        => array(),
		);
	}

	/**
	 * Sanitizes column settings.
	 *
	 * @param array $data Raw settings.
	 * @return array
	 */
	public function sanitize( array $data ): array {
		$defaults = $this->get_defaults();

		$display = isset( $data['displayStyle'] ) ? sanitize_key( $data['displayStyle'] ) : $defaults['displayStyle'];
		if ( ! in_array( $display, array( 'simple', 'with_descriptions' ), true ) ) {
			$display = $defaults['displayStyle'];
		}

		$items = isset( $data['items'] ) && is_array( $data['items'] ) ? $data['items'] : array();

		return array(
			'heading'      => isset( $data['heading'] ) ? sanitize_text_field( $data['heading'] ) : '',
			'description'  => isset( $data['description'] ) ? sanitize_textarea_field( $data['description'] ) : '',
			'displayStyle' => $display,
			'items'        => $this->sanitize_items( $items ),
		);
	}

	/**
	 * Validates column settings.
	 *
	 * @param array $data Sanitized settings.
	 * @return array
	 */
	public function validate( array $data ): array {
		$errors = array();
		$items  = isset( $data['items'] ) && is_array( $data['items'] ) ? $data['items'] : array();

		foreach ( $items as $index => $item ) {
			if ( empty( $item['enabled'] ) ) {
				continue;
			}

			if ( empty( $item['label'] ) ) {
				$errors[] = array(
					'code'    => 'required_label',
					'message' => __( 'Link label is required.', 'structured-mega-menu' ),
					'path'    => 'items.' . $index . '.label',
				);
			}

			if ( empty( $item['url'] ) ) {
				$errors[] = array(
					'code'    => 'required_url',
					'message' => __( 'Link destination is required.', 'structured-mega-menu' ),
					'path'    => 'items.' . $index . '.url',
				);
			}
		}

		return $errors;
	}

	/**
	 * Renders the column markup.
	 *
	 * @param array $data    Sanitized settings.
	 * @param array $context Render context.
	 * @return string
	 */
	public function render( array $data, array $context = array() ): string {
		unset( $context );

		$display = isset( $data['displayStyle'] ) ? $data['displayStyle'] : 'simple';
		$items   = isset( $data['items'] ) && is_array( $data['items'] ) ? $data['items'] : array();

		$html  = '<div class="smm-link-list smm-link-list--' . esc_attr( $display ) . '">';
		$html .= Markup::heading( isset( $data['heading'] ) ? $data['heading'] : '' );
		$html .= Markup::description( isset( $data['description'] ) ? $data['description'] : '' );
		$html .= '<ul class="smm-link-list__list">';

		foreach ( $items as $item ) {
			if ( empty( $item['enabled'] ) ) {
				continue;
			}

			$label = isset( $item['label'] ) ? $item['label'] : '';
			$url   = isset( $item['url'] ) ? $item['url'] : '';

			if ( '' === $label || '' === $url ) {
				continue;
			}

			$desc = '';
			if ( 'with_descriptions' === $display && ! empty( $item['description'] ) ) {
				$desc = Markup::description( $item['description'], 'smm-link-list__item-description' );
			}

			$html .= '<li class="smm-link-list__item">';
			$html .= sprintf(
				'<a class="smm-link-list__link" %1$s><span class="smm-link-list__label">%2$s</span>%3$s</a>',
				Markup::link_attributes( $url, ! empty( $item['opensInNewTab'] ) ),
				esc_html( $label ),
				$desc
			);
			$html .= '</li>';
		}

		$html .= '</ul></div>';

		return $html;
	}

	/**
	 * Sanitizes repeater items.
	 *
	 * @param array $items Raw items.
	 * @return array
	 */
	private function sanitize_items( array $items ) {
		$sanitized = array();
		$seen_ids  = array();

		foreach ( $items as $item ) {
			if ( ! is_array( $item ) ) {
				continue;
			}

			$id = Helpers::sanitize_id( isset( $item['id'] ) ? $item['id'] : '', 'smm-item' );
			if ( isset( $seen_ids[ $id ] ) ) {
				$id = Helpers::generate_id( 'smm-item' );
			}
			$seen_ids[ $id ] = true;

			$sanitized[] = array(
				'id'            => $id,
				'enabled'       => Helpers::to_bool( isset( $item['enabled'] ) ? $item['enabled'] : true ),
				'label'         => isset( $item['label'] ) ? sanitize_text_field( $item['label'] ) : '',
				'description'   => isset( $item['description'] ) ? sanitize_textarea_field( $item['description'] ) : '',
				'url'           => Helpers::sanitize_url( isset( $item['url'] ) ? $item['url'] : '' ),
				'opensInNewTab' => Helpers::to_bool( isset( $item['opensInNewTab'] ) ? $item['opensInNewTab'] : false ),
			);
		}

		return $sanitized;
	}
}
