<?php
/**
 * Image and CTA column type.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu\Column_Types;

use StructuredMegaMenu\Helpers;

defined( 'ABSPATH' ) || exit;

/**
 * Image with supporting copy and call to action.
 */
class Image_Cta implements Column_Type {

	/**
	 * {@inheritdoc}
	 */
	public function get_name(): string {
		return 'image_cta';
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_label(): string {
		return __( 'Image and CTA', 'structured-mega-menu' );
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_schema(): array {
		return array(
			'imageId'          => array( 'type' => 'integer' ),
			'imageUrl'         => array( 'type' => 'string' ),
			'imageAlt'         => array( 'type' => 'string' ),
			'imageAspectRatio' => array(
				'type' => 'string',
				'enum' => array( 'original', 'landscape', 'square', 'portrait' ),
			),
			'eyebrow'          => array( 'type' => 'string' ),
			'heading'          => array( 'type' => 'string' ),
			'description'      => array( 'type' => 'string' ),
			'ctaLabel'         => array( 'type' => 'string' ),
			'url'              => array( 'type' => 'string' ),
			'opensInNewTab'    => array( 'type' => 'boolean' ),
			'layout'           => array(
				'type' => 'string',
				'enum' => array( 'image_above', 'image_beside' ),
			),
			'cardClickable'    => array( 'type' => 'boolean' ),
		);
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_defaults(): array {
		return array(
			'imageId'          => 0,
			'imageUrl'         => '',
			'imageAlt'         => '',
			'imageAspectRatio' => 'landscape',
			'eyebrow'          => '',
			'heading'          => '',
			'description'      => '',
			'ctaLabel'         => '',
			'url'              => '',
			'opensInNewTab'    => false,
			'layout'           => 'image_above',
			'cardClickable'    => true,
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

		$aspect = isset( $data['imageAspectRatio'] ) ? sanitize_key( $data['imageAspectRatio'] ) : $defaults['imageAspectRatio'];
		if ( ! in_array( $aspect, array( 'original', 'landscape', 'square', 'portrait' ), true ) ) {
			$aspect = $defaults['imageAspectRatio'];
		}

		$layout = isset( $data['layout'] ) ? sanitize_key( $data['layout'] ) : $defaults['layout'];
		if ( ! in_array( $layout, array( 'image_above', 'image_beside' ), true ) ) {
			$layout = $defaults['layout'];
		}

		$image_id  = isset( $data['imageId'] ) ? absint( $data['imageId'] ) : 0;
		$image_url = '';
		if ( $image_id > 0 ) {
			$attachment_url = wp_get_attachment_image_url( $image_id, 'large' );
			$image_url      = $attachment_url ? $attachment_url : '';
		} elseif ( ! empty( $data['imageUrl'] ) ) {
			// Fallback only when no attachment ID; still sanitize.
			$image_url = Helpers::sanitize_url( $data['imageUrl'] );
		}

		return array(
			'imageId'          => $image_id,
			'imageUrl'         => $image_url,
			'imageAlt'         => isset( $data['imageAlt'] ) ? sanitize_text_field( $data['imageAlt'] ) : '',
			'imageAspectRatio' => $aspect,
			'eyebrow'          => isset( $data['eyebrow'] ) ? sanitize_text_field( $data['eyebrow'] ) : '',
			'heading'          => isset( $data['heading'] ) ? sanitize_text_field( $data['heading'] ) : '',
			'description'      => isset( $data['description'] ) ? sanitize_textarea_field( $data['description'] ) : '',
			'ctaLabel'         => isset( $data['ctaLabel'] ) ? sanitize_text_field( $data['ctaLabel'] ) : '',
			'url'              => Helpers::sanitize_url( isset( $data['url'] ) ? $data['url'] : '' ),
			'opensInNewTab'    => Helpers::to_bool( isset( $data['opensInNewTab'] ) ? $data['opensInNewTab'] : false ),
			'layout'           => $layout,
			'cardClickable'    => Helpers::to_bool( isset( $data['cardClickable'] ) ? $data['cardClickable'] : true ),
		);
	}

	/**
	 * Validates column settings.
	 *
	 * @param array $data Sanitized settings.
	 * @return array
	 */
	public function validate( array $data ): array {
		// Image CTA fields are optional in v1; no hard required fields.
		unset( $data );
		return array();
	}

	/**
	 * Renders the column markup.
	 *
	 * @param array $data    Sanitized settings.
	 * @param array $context Render context.
	 * @return string
	 */
	public function render( array $data, array $context = array() ): string {
		// Frontend rendering is implemented in Phase 4.
		unset( $data, $context );
		return '';
	}
}
