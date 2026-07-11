<?php
/**
 * Server-side render for the mega menu item block.
 *
 * Full markup is implemented in Phase 4.
 *
 * @package StructuredMegaMenu
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content.
 * @var WP_Block $block      Block instance.
 */

defined( 'ABSPATH' ) || exit;

echo \StructuredMegaMenu\Renderer::render_menu_item_placeholder( $attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Renderer escapes output.
