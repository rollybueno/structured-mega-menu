<?php
/**
 * Column type interface.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu\Column_Types;

defined( 'ABSPATH' ) || exit;

/**
 * Contract for mega menu column types.
 */
interface Column_Type {

	/**
	 * Machine name for the column type.
	 *
	 * @return string
	 */
	public function get_name(): string;

	/**
	 * Human-readable label.
	 *
	 * @return string
	 */
	public function get_label(): string;

	/**
	 * JSON-schema-like field definitions for documentation and clients.
	 *
	 * @return array
	 */
	public function get_schema(): array;

	/**
	 * Default settings for a new column of this type.
	 *
	 * @return array
	 */
	public function get_defaults(): array;

	/**
	 * Sanitizes column settings.
	 *
	 * @param array $data Raw settings.
	 * @return array
	 */
	public function sanitize( array $data ): array;

	/**
	 * Validates column settings.
	 *
	 * @param array $data Sanitized settings.
	 * @return array List of errors with code, message, and path keys.
	 */
	public function validate( array $data ): array;

	/**
	 * Renders the column markup.
	 *
	 * @param array $data    Sanitized settings.
	 * @param array $context Render context.
	 * @return string
	 */
	public function render( array $data, array $context = array() ): string;
}
