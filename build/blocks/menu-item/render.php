<?php
/**
 * Server-side render for the mega menu item block.
 *
 * @package StructuredMegaMenu
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content.
 * @var WP_Block $block      Block instance.
 */

defined( 'ABSPATH' ) || exit;

echo \StructuredMegaMenu\Renderer::render_menu_item( $attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Renderer escapes output.
