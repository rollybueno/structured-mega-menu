<?php
/**
 * Column type registry.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu\Column_Types;

defined( 'ABSPATH' ) || exit;

/**
 * Registers and resolves column type handlers.
 */
class Column_Registry {

	/**
	 * Registered column types keyed by name.
	 *
	 * @var array<string, Column_Type>
	 */
	private $types = array();

	/**
	 * Registers the built-in column types.
	 *
	 * @return void
	 */
	public function register_defaults() {
		$this->register( new Image_Cta() );
		$this->register( new Icon_Links() );
		$this->register( new Link_List() );
	}

	/**
	 * Registers a column type.
	 *
	 * @param Column_Type $type Column type instance.
	 * @return void
	 */
	public function register( Column_Type $type ) {
		$name = sanitize_key( $type->get_name() );

		if ( '' === $name ) {
			return;
		}

		$this->types[ $name ] = $type;
	}

	/**
	 * Whether a column type is registered.
	 *
	 * @param string $name Type name.
	 * @return bool
	 */
	public function has( $name ) {
		return isset( $this->types[ sanitize_key( $name ) ] );
	}

	/**
	 * Returns a registered column type.
	 *
	 * @param string $name Type name.
	 * @return Column_Type|null
	 */
	public function get( $name ) {
		$name = sanitize_key( $name );

		return isset( $this->types[ $name ] ) ? $this->types[ $name ] : null;
	}

	/**
	 * Returns all registered column types.
	 *
	 * @return array<string, Column_Type>
	 */
	public function all() {
		return $this->types;
	}

	/**
	 * Returns type metadata for the admin/editor clients.
	 *
	 * @return array
	 */
	public function get_client_definitions() {
		$definitions = array();

		foreach ( $this->types as $name => $type ) {
			$schema = $type->get_schema();

			/**
			 * Filters a column type schema exposed to clients.
			 *
			 * @since 1.0.0
			 *
			 * @param array  $schema Column schema.
			 * @param string $name   Column type name.
			 */
			$schema = apply_filters( 'structured_mega_menu_column_schema', $schema, $name );

			$definitions[ $name ] = array(
				'name'     => $name,
				'label'    => $type->get_label(),
				'schema'   => $schema,
				'defaults' => $type->get_defaults(),
			);
		}

		return $definitions;
	}
}
