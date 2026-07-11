<?php
/**
 * Icon links column type.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu\Column_Types;

use StructuredMegaMenu\Helpers;

defined( 'ABSPATH' ) || exit;

/**
 * Descriptive navigation links with icons.
 */
class Icon_Links implements Column_Type {

	/**
	 * {@inheritdoc}
	 */
	public function get_name(): string {
		return 'icon_links';
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_label(): string {
		return __( 'Links with icons', 'structured-mega-menu' );
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
				'enum' => array( 'compact', 'descriptive' ),
			),
			'iconPosition' => array(
				'type' => 'string',
				'enum' => array( 'left', 'above' ),
			),
			'items'        => array(
				'type'  => 'array',
				'items' => array(
					'id'            => array( 'type' => 'string' ),
					'enabled'       => array( 'type' => 'boolean' ),
					'icon'          => array( 'type' => 'object' ),
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
			'displayStyle' => 'descriptive',
			'iconPosition' => 'left',
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
		if ( ! in_array( $display, array( 'compact', 'descriptive' ), true ) ) {
			$display = $defaults['displayStyle'];
		}

		$icon_position = isset( $data['iconPosition'] ) ? sanitize_key( $data['iconPosition'] ) : $defaults['iconPosition'];
		if ( ! in_array( $icon_position, array( 'left', 'above' ), true ) ) {
			$icon_position = $defaults['iconPosition'];
		}

		$items = isset( $data['items'] ) && is_array( $data['items'] ) ? $data['items'] : array();

		return array(
			'heading'      => isset( $data['heading'] ) ? sanitize_text_field( $data['heading'] ) : '',
			'description'  => isset( $data['description'] ) ? sanitize_textarea_field( $data['description'] ) : '',
			'displayStyle' => $display,
			'iconPosition' => $icon_position,
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
		unset( $data, $context );
		return '';
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

			$icon   = isset( $item['icon'] ) && is_array( $item['icon'] ) ? $item['icon'] : array();
			$source = isset( $icon['source'] ) ? sanitize_key( $icon['source'] ) : 'library';
			if ( ! in_array( $source, array( 'library', 'media' ), true ) ) {
				$source = 'library';
			}

			$value = '';
			if ( 'media' === $source ) {
				$value = (string) absint( isset( $icon['value'] ) ? $icon['value'] : 0 );
			} else {
				$value = isset( $icon['value'] ) ? sanitize_key( $icon['value'] ) : '';
			}

			$sanitized[] = array(
				'id'            => $id,
				'enabled'       => Helpers::to_bool( isset( $item['enabled'] ) ? $item['enabled'] : true ),
				'icon'          => array(
					'source' => $source,
					'value'  => $value,
				),
				'label'         => isset( $item['label'] ) ? sanitize_text_field( $item['label'] ) : '',
				'description'   => isset( $item['description'] ) ? sanitize_textarea_field( $item['description'] ) : '',
				'url'           => Helpers::sanitize_url( isset( $item['url'] ) ? $item['url'] : '' ),
				'opensInNewTab' => Helpers::to_bool( isset( $item['opensInNewTab'] ) ? $item['opensInNewTab'] : false ),
			);
		}

		return $sanitized;
	}
}
