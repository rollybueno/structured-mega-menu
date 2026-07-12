<?php
/**
 * Sample custom column type for Structured Mega Menu.
 *
 * This file is an EXAMPLE only. It is not loaded by the plugin and is excluded
 * from the WordPress.org distribution ZIP. Copy it into a custom plugin or
 * your theme and register it on `structured_mega_menu_register_column_types`.
 *
 * @package StructuredMegaMenuExamples
 */

defined( 'ABSPATH' ) || exit;

use StructuredMegaMenu\Column_Types\Column_Type;
use StructuredMegaMenu\Helpers;
use StructuredMegaMenu\Markup;

/**
 * A simple “promo callout” column with heading, text, and button.
 */
class Sample_Promo_Column implements Column_Type {

	/**
	 * @return string
	 */
	public function get_name(): string {
		return 'sample_promo';
	}

	/**
	 * @return string
	 */
	public function get_label(): string {
		return __( 'Sample promo', 'structured-mega-menu' );
	}

	/**
	 * @return array
	 */
	public function get_schema(): array {
		return array(
			'heading'       => array(
				'type'  => 'string',
				'label' => __( 'Heading', 'structured-mega-menu' ),
			),
			'description'   => array(
				'type'  => 'textarea',
				'label' => __( 'Description', 'structured-mega-menu' ),
			),
			'ctaLabel'      => array(
				'type'  => 'string',
				'label' => __( 'Button label', 'structured-mega-menu' ),
			),
			'url'           => array(
				'type'  => 'url',
				'label' => __( 'Button link', 'structured-mega-menu' ),
			),
			'opensInNewTab' => array(
				'type'  => 'boolean',
				'label' => __( 'Open in new tab', 'structured-mega-menu' ),
			),
		);
	}

	/**
	 * @return array
	 */
	public function get_defaults(): array {
		return array(
			'heading'       => '',
			'description'   => '',
			'ctaLabel'      => '',
			'url'           => '',
			'opensInNewTab' => false,
		);
	}

	/**
	 * @param array $data Raw settings.
	 * @return array
	 */
	public function sanitize( array $data ): array {
		return array(
			'heading'       => isset( $data['heading'] ) ? sanitize_text_field( $data['heading'] ) : '',
			'description'   => isset( $data['description'] ) ? sanitize_textarea_field( $data['description'] ) : '',
			'ctaLabel'      => isset( $data['ctaLabel'] ) ? sanitize_text_field( $data['ctaLabel'] ) : '',
			'url'           => Helpers::sanitize_url( isset( $data['url'] ) ? $data['url'] : '' ),
			'opensInNewTab' => Helpers::to_bool( isset( $data['opensInNewTab'] ) ? $data['opensInNewTab'] : false ),
		);
	}

	/**
	 * @param array $data Sanitized settings.
	 * @return array
	 */
	public function validate( array $data ): array {
		$errors = array();

		if ( empty( $data['heading'] ) ) {
			$errors[] = array(
				'code'    => 'required_heading',
				'message' => __( 'Promo heading is required.', 'structured-mega-menu' ),
				'path'    => 'heading',
			);
		}

		return $errors;
	}

	/**
	 * @param array $data    Sanitized settings.
	 * @param array $context Render context.
	 * @return string
	 */
	public function render( array $data, array $context = array() ): string {
		unset( $context );

		$html  = '<div class="smm-sample-promo">';
		$html .= Markup::heading( isset( $data['heading'] ) ? $data['heading'] : '' );
		$html .= Markup::description( isset( $data['description'] ) ? $data['description'] : '' );

		$label = isset( $data['ctaLabel'] ) ? $data['ctaLabel'] : '';
		$url   = isset( $data['url'] ) ? $data['url'] : '';

		if ( $label && $url ) {
			$html .= sprintf(
				'<p class="smm-sample-promo__cta"><a class="smm-column__cta" %1$s>%2$s</a></p>',
				Markup::link_attributes(
					$url,
					! empty( $data['opensInNewTab'] )
				),
				esc_html( $label )
			);
		}

		$html .= '</div>';

		return $html;
	}
}
