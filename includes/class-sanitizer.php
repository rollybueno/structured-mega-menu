<?php
/**
 * Schema sanitization and validation.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

use StructuredMegaMenu\Column_Types\Column_Registry;

defined( 'ABSPATH' ) || exit;

/**
 * Sanitizes and validates mega menu schemas.
 */
class Sanitizer {

	/**
	 * Column type registry.
	 *
	 * @var Column_Registry
	 */
	private $registry;

	/**
	 * Constructor.
	 *
	 * @param Column_Registry $registry Column type registry.
	 */
	public function __construct( Column_Registry $registry ) {
		$this->registry = $registry;
	}

	/**
	 * Sanitizes a full schema payload.
	 *
	 * @param mixed $value Raw schema (JSON string or array).
	 * @return array
	 */
	public function sanitize_schema( $value ) {
		$data = $this->decode( $value );

		if ( empty( $data ) ) {
			return Schema::get_default();
		}

		$version = isset( $data['version'] ) ? absint( $data['version'] ) : SMM_SCHEMA_VERSION;
		if ( $version < 1 ) {
			$version = SMM_SCHEMA_VERSION;
		}

		if ( $version < SMM_SCHEMA_VERSION ) {
			$data = Migrations::migrate( $data, $version );
		}

		$settings = isset( $data['settings'] ) && is_array( $data['settings'] )
			? $data['settings']
			: array();

		$columns = isset( $data['columns'] ) && is_array( $data['columns'] )
			? $data['columns']
			: array();

		$sanitized_columns = $this->sanitize_columns( $columns );
		$enabled_count     = $this->count_enabled_columns( $sanitized_columns );
		$settings          = $this->sanitize_settings( $settings, $enabled_count );

		return array(
			'version'  => SMM_SCHEMA_VERSION,
			'settings' => $settings,
			'columns'  => $sanitized_columns,
		);
	}

	/**
	 * Sanitizes top-level settings.
	 *
	 * @param array $settings      Raw settings.
	 * @param int   $column_count  Enabled column count for layout validation.
	 * @return array
	 */
	public function sanitize_settings( array $settings, $column_count = null ) {
		$defaults = Schema::get_default_settings();

		$panel_width = isset( $settings['panelWidth'] ) ? sanitize_key( $settings['panelWidth'] ) : $defaults['panelWidth'];
		if ( ! in_array( $panel_width, Schema::get_panel_widths(), true ) ) {
			$panel_width = $defaults['panelWidth'];
		}

		$opening_mode = isset( $settings['openingMode'] ) ? sanitize_key( $settings['openingMode'] ) : $defaults['openingMode'];
		if ( ! in_array( $opening_mode, Schema::get_opening_modes(), true ) ) {
			$opening_mode = $defaults['openingMode'];
		}

		$mobile_mode = isset( $settings['mobileMode'] ) ? sanitize_key( $settings['mobileMode'] ) : $defaults['mobileMode'];
		if ( ! in_array( $mobile_mode, Schema::get_mobile_modes(), true ) ) {
			$mobile_mode = $defaults['mobileMode'];
		}

		if ( null === $column_count ) {
			$column_count = 1;
		}
		$column_count = max( 0, (int) $column_count );

		$layout = isset( $settings['layoutPreset'] ) ? sanitize_text_field( $settings['layoutPreset'] ) : '';
		if ( $column_count < 1 ) {
			$layout = '1';
		} elseif ( ! Schema::is_valid_layout_for_count( $layout, $column_count ) ) {
			$layout = Schema::get_default_layout_for_count( $column_count );
		}

		return array(
			'panelWidth'          => $panel_width,
			'openingMode'         => $opening_mode,
			'closeOnOutsideClick' => $this->to_bool( isset( $settings['closeOnOutsideClick'] ) ? $settings['closeOnOutsideClick'] : true ),
			'closeOnEscape'       => $this->to_bool( isset( $settings['closeOnEscape'] ) ? $settings['closeOnEscape'] : true ),
			'mobileMode'          => $mobile_mode,
			'layoutPreset'        => $layout,
			'appearance'          => Appearance::sanitize( isset( $settings['appearance'] ) ? $settings['appearance'] : array() ),
		);
	}

	/**
	 * Sanitizes the columns array.
	 *
	 * @param array $columns Raw columns.
	 * @return array
	 */
	public function sanitize_columns( array $columns ) {
		$sanitized = array();
		$seen_ids  = array();

		foreach ( $columns as $column ) {
			if ( ! is_array( $column ) ) {
				continue;
			}

			if ( count( $sanitized ) >= SMM_MAX_COLUMNS ) {
				break;
			}

			$type = isset( $column['type'] ) ? sanitize_key( $column['type'] ) : '';
			if ( ! $this->registry->has( $type ) ) {
				continue;
			}

			$column_type = $this->registry->get( $type );
			$id          = $this->sanitize_id( isset( $column['id'] ) ? $column['id'] : '', 'smm-col' );

			if ( isset( $seen_ids[ $id ] ) ) {
				$id = $this->generate_id( 'smm-col' );
			}
			$seen_ids[ $id ] = true;

			$raw_settings = isset( $column['settings'] ) && is_array( $column['settings'] )
				? $column['settings']
				: array();

			$sanitized[] = array(
				'id'       => $id,
				'type'     => $type,
				'width'    => max( 1, absint( isset( $column['width'] ) ? $column['width'] : 1 ) ),
				'enabled'  => $this->to_bool( isset( $column['enabled'] ) ? $column['enabled'] : true ),
				'settings' => $column_type->sanitize( $raw_settings ),
			);
		}

		return $sanitized;
	}

	/**
	 * Validates a sanitized schema and returns field errors.
	 *
	 * @param array $schema Sanitized schema.
	 * @return array List of error arrays with code, message, and path.
	 */
	public function validate( array $schema ) {
		$errors = array();

		$columns = isset( $schema['columns'] ) && is_array( $schema['columns'] ) ? $schema['columns'] : array();

		if ( count( $columns ) > SMM_MAX_COLUMNS ) {
			$errors[] = array(
				'code'    => 'too_many_columns',
				/* translators: %d: maximum number of columns */
				'message' => sprintf( __( 'A maximum of %d columns is allowed.', 'structured-mega-menu' ), SMM_MAX_COLUMNS ),
				'path'    => 'columns',
			);
		}

		$enabled_count = $this->count_enabled_columns( $columns );
		$settings      = isset( $schema['settings'] ) && is_array( $schema['settings'] ) ? $schema['settings'] : array();
		$layout        = isset( $settings['layoutPreset'] ) ? $settings['layoutPreset'] : '';

		if ( $enabled_count > 0 && ! Schema::is_valid_layout_for_count( $layout, $enabled_count ) ) {
			$errors[] = array(
				'code'    => 'invalid_layout',
				'message' => __( 'The selected layout does not match the number of enabled columns.', 'structured-mega-menu' ),
				'path'    => 'settings.layoutPreset',
			);
		}

		foreach ( $columns as $index => $column ) {
			$type = isset( $column['type'] ) ? $column['type'] : '';
			if ( ! $this->registry->has( $type ) ) {
				$errors[] = array(
					'code'    => 'invalid_column_type',
					/* translators: %s: column type slug */
					'message' => sprintf( __( 'Unknown column type: %s.', 'structured-mega-menu' ), $type ),
					'path'    => 'columns.' . $index . '.type',
				);
				continue;
			}

			$column_errors = $this->registry->get( $type )->validate(
				isset( $column['settings'] ) && is_array( $column['settings'] ) ? $column['settings'] : array()
			);

			foreach ( $column_errors as $error ) {
				$path     = isset( $error['path'] ) ? $error['path'] : '';
				$errors[] = array(
					'code'    => isset( $error['code'] ) ? $error['code'] : 'column_error',
					'message' => isset( $error['message'] ) ? $error['message'] : '',
					'path'    => 'columns.' . $index . '.settings' . ( $path ? '.' . $path : '' ),
				);
			}
		}

		return $errors;
	}

	/**
	 * Counts enabled columns.
	 *
	 * @param array $columns Columns.
	 * @return int
	 */
	public function count_enabled_columns( array $columns ) {
		$count = 0;

		foreach ( $columns as $column ) {
			if ( ! empty( $column['enabled'] ) ) {
				++$count;
			}
		}

		return $count;
	}

	/**
	 * Sanitizes a stable client ID.
	 *
	 * @param string $id     Raw ID.
	 * @param string $prefix Fallback prefix.
	 * @return string
	 */
	public function sanitize_id( $id, $prefix = 'smm' ) {
		return Helpers::sanitize_id( $id, $prefix );
	}

	/**
	 * Generates a stable unique ID.
	 *
	 * @param string $prefix ID prefix.
	 * @return string
	 */
	public function generate_id( $prefix = 'smm' ) {
		return Helpers::generate_id( $prefix );
	}

	/**
	 * Sanitizes a URL for storage.
	 *
	 * @param string $url Raw URL.
	 * @return string
	 */
	public function sanitize_url( $url ) {
		return Helpers::sanitize_url( $url );
	}

	/**
	 * Casts a value to boolean.
	 *
	 * @param mixed $value Raw value.
	 * @return bool
	 */
	public function to_bool( $value ) {
		return Helpers::to_bool( $value );
	}

	/**
	 * Decodes a schema value into an array.
	 *
	 * @param mixed $value Raw value.
	 * @return array
	 */
	private function decode( $value ) {
		if ( is_array( $value ) ) {
			return $value;
		}

		if ( ! is_string( $value ) || '' === $value ) {
			return array();
		}

		$decoded = json_decode( $value, true );

		return is_array( $decoded ) ? $decoded : array();
	}
}
