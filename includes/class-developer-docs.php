<?php
/**
 * Developer documentation rendered in wp-admin (no Markdown in the distribution).
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Stores and outputs developer docs for Help tabs and the admin UI.
 */
class Developer_Docs {

	/**
	 * Returns docs payloads for the React admin app.
	 *
	 * @return array{cssApi:string,hooks:string,intro:string}
	 */
	public static function get_client_payload() {
		return array(
			'intro'  => self::get_intro_html(),
			'cssApi' => self::get_css_api_html(),
			'hooks'  => self::get_hooks_html(),
		);
	}

	/**
	 * Short intro for Help / Developers panel.
	 *
	 * @return string
	 */
	public static function get_intro_html() {
		return '<p>' . esc_html__(
			'Structured Mega Menu exposes a public CSS variable API and PHP hooks for themes and custom plugins. Prefer these contracts over forking plugin files. A sample custom column type is available in the plugin’s GitHub repository under /examples (not included in the WordPress.org ZIP).',
			'structured-mega-menu'
		) . '</p>' .
		'<p><a href="https://github.com/rollybueno/structured-mega-menu" target="_blank" rel="noopener noreferrer">' .
		esc_html__( 'View source on GitHub', 'structured-mega-menu' ) .
		'</a></p>';
	}

	/**
	 * CSS API documentation as trusted admin HTML.
	 *
	 * @return string
	 */
	public static function get_css_api_html() {
		ob_start();
		?>
		<p><?php echo esc_html__( 'These CSS custom properties are a stable public contract. Prefer overriding variables over replacing plugin selectors. Variables set on .smm-menu-item cascade into the panel.', 'structured-mega-menu' ); ?></p>
		<h4><?php echo esc_html__( 'Where to set them', 'structured-mega-menu' ); ?></h4>
		<ol>
			<li><?php echo esc_html__( 'Per menu: Appearance → Mega Menus → Appearance section.', 'structured-mega-menu' ); ?></li>
			<li><?php echo esc_html__( 'Theme or custom CSS: target .smm-menu-item or .smm-menu-item__panel.', 'structured-mega-menu' ); ?></li>
			<li><code>structured_mega_menu_appearance_css_vars</code></li>
		</ol>
		<h4><?php echo esc_html__( 'Public variables', 'structured-mega-menu' ); ?></h4>
		<table class="widefat striped smm-docs-table">
			<thead>
				<tr>
					<th scope="col"><?php echo esc_html__( 'Variable', 'structured-mega-menu' ); ?></th>
					<th scope="col"><?php echo esc_html__( 'Purpose', 'structured-mega-menu' ); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ( self::get_css_variable_rows() as $row ) : ?>
					<tr>
						<td><code><?php echo esc_html( $row[0] ); ?></code></td>
						<td><?php echo esc_html( $row[1] ); ?></td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
		<p><?php echo esc_html__( 'Internal aliases such as --smm-surface and --smm-ink are derived from the public panel variables. Override the public names when possible.', 'structured-mega-menu' ); ?></p>
		<h4><?php echo esc_html__( 'Density and radius classes', 'structured-mega-menu' ); ?></h4>
		<p><?php echo esc_html__( 'Optional wrapper classes: smm-density-compact, smm-density-roomy, smm-radius-none, smm-radius-small, smm-radius-medium, smm-radius-large. Values are primarily applied via CSS variables.', 'structured-mega-menu' ); ?></p>
		<h4><?php echo esc_html__( 'Theme CSS example', 'structured-mega-menu' ); ?></h4>
		<pre class="smm-docs-code"><?php echo esc_html(
			".smm-menu-item {\n" .
			"\t--smm-panel-bg: var(--wp--preset--color--base);\n" .
			"\t--smm-panel-color: var(--wp--preset--color--contrast);\n" .
			"\t--smm-panel-radius: 0.5rem;\n" .
			"\t--smm-panel-padding: 1.5rem;\n" .
			'}'
		); ?></pre>
		<h4><?php echo esc_html__( 'PHP example', 'structured-mega-menu' ); ?></h4>
		<pre class="smm-docs-code"><?php echo esc_html(
			"add_filter( 'structured_mega_menu_appearance_css_vars', function( \$vars, \$settings, \$menu_id ) {\n" .
			"\t\$vars['--smm-panel-radius'] = '0';\n" .
			"\t\$vars['--smm-grid-gap'] = '1.25rem';\n" .
			"\treturn \$vars;\n" .
			'}, 10, 3 );'
		); ?></pre>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Hooks documentation as trusted admin HTML.
	 *
	 * @return string
	 */
	public static function get_hooks_html() {
		ob_start();
		?>
		<p><?php echo esc_html__( 'All hooks use the structured_mega_menu_ prefix. Slugs used in CSS class names must remain sanitize_key-safe.', 'structured-mega-menu' ); ?></p>
		<h4><?php echo esc_html__( 'Actions', 'structured-mega-menu' ); ?></h4>
		<ul>
			<li><code>structured_mega_menu_register_column_types</code> — <?php echo esc_html__( 'Register custom column types implementing Column_Type.', 'structured-mega-menu' ); ?></li>
		</ul>
		<pre class="smm-docs-code"><?php echo esc_html(
			"add_action( 'structured_mega_menu_register_column_types', function( \$registry ) {\n" .
			"\t\$registry->register( new Sample_Promo_Column() );\n" .
			'} );'
		); ?></pre>
		<h4><?php echo esc_html__( 'Option list filters', 'structured-mega-menu' ); ?></h4>
		<?php echo self::render_hook_table( self::get_option_hook_rows() ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped in helper. ?>
		<h4><?php echo esc_html__( 'Schema filters', 'structured-mega-menu' ); ?></h4>
		<?php echo self::render_hook_table( self::get_schema_hook_rows() ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped in helper. ?>
		<h4><?php echo esc_html__( 'Rendering filters', 'structured-mega-menu' ); ?></h4>
		<?php echo self::render_hook_table( self::get_render_hook_rows() ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped in helper. ?>
		<h4><?php echo esc_html__( 'JavaScript / Interactivity', 'structured-mega-menu' ); ?></h4>
		<p><?php echo esc_html__( 'Frontend behavior uses the Interactivity API store structured-mega-menu. Prefer CSS and PHP filters. For open/close signals, observe the is-open class on .smm-menu-item or aria-expanded on the toggle — avoid forking view.js.', 'structured-mega-menu' ); ?></p>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * CSS variable rows for the docs table.
	 *
	 * @return array<int, array{0:string,1:string}>
	 */
	private static function get_css_variable_rows() {
		return array(
			array( '--smm-panel-bg', __( 'Panel background', 'structured-mega-menu' ) ),
			array( '--smm-panel-color', __( 'Panel text color', 'structured-mega-menu' ) ),
			array( '--smm-panel-border', __( 'Panel border color', 'structured-mega-menu' ) ),
			array( '--smm-panel-radius', __( 'Panel corner radius', 'structured-mega-menu' ) ),
			array( '--smm-panel-padding', __( 'Panel inner padding', 'structured-mega-menu' ) ),
			array( '--smm-panel-shadow', __( 'Panel box shadow', 'structured-mega-menu' ) ),
			array( '--smm-panel-min-width', __( 'Navigation-width floor', 'structured-mega-menu' ) ),
			array( '--smm-panel-top', __( 'Fixed-panel top offset', 'structured-mega-menu' ) ),
			array( '--smm-grid-template', __( 'Column track template', 'structured-mega-menu' ) ),
			array( '--smm-grid-gap', __( 'Gap between columns', 'structured-mega-menu' ) ),
			array( '--smm-image-radius', __( 'Image CTA media radius', 'structured-mega-menu' ) ),
			array( '--smm-stacked-image-max-height', __( 'Max image height when stacked', 'structured-mega-menu' ) ),
			array( '--smm-theme-full-size', __( 'Theme fullSize bridge', 'structured-mega-menu' ) ),
		);
	}

	/**
	 * @return array<int, array{0:string,1:string}>
	 */
	private static function get_option_hook_rows() {
		return array(
			array( 'structured_mega_menu_panel_widths', __( 'Allowed panel width slugs', 'structured-mega-menu' ) ),
			array( 'structured_mega_menu_opening_modes', __( 'Allowed opening modes', 'structured-mega-menu' ) ),
			array( 'structured_mega_menu_mobile_modes', __( 'Allowed mobile modes', 'structured-mega-menu' ) ),
			array( 'structured_mega_menu_layout_presets', __( 'Layout presets by column count', 'structured-mega-menu' ) ),
			array( 'structured_mega_menu_appearance_densities', __( 'Appearance density slugs', 'structured-mega-menu' ) ),
			array( 'structured_mega_menu_appearance_radii', __( 'Appearance radius slugs', 'structured-mega-menu' ) ),
			array( 'structured_mega_menu_icon_registry', __( 'Dashicons library keyed by slug', 'structured-mega-menu' ) ),
		);
	}

	/**
	 * @return array<int, array{0:string,1:string}>
	 */
	private static function get_schema_hook_rows() {
		return array(
			array( 'structured_mega_menu_column_schema', __( 'Adjust column schema for admin clients', 'structured-mega-menu' ) ),
			array( 'structured_mega_menu_menu_schema', __( 'Adjust sanitized schema before save', 'structured-mega-menu' ) ),
		);
	}

	/**
	 * @return array<int, array{0:string,1:string}>
	 */
	private static function get_render_hook_rows() {
		return array(
			array( 'structured_mega_menu_render_context', __( 'Context passed to column render()', 'structured-mega-menu' ) ),
			array( 'structured_mega_menu_menu_item_classes', __( 'Classes on the menu item wrapper', 'structured-mega-menu' ) ),
			array( 'structured_mega_menu_panel_classes', __( 'Classes on the mega panel', 'structured-mega-menu' ) ),
			array( 'structured_mega_menu_appearance_css_vars', __( 'CSS custom properties on the menu item', 'structured-mega-menu' ) ),
			array( 'structured_mega_menu_rendered_column', __( 'Filter each column’s HTML', 'structured-mega-menu' ) ),
		);
	}

	/**
	 * Renders a two-column hook reference table.
	 *
	 * @param array<int, array{0:string,1:string}> $rows Rows.
	 * @return string
	 */
	private static function render_hook_table( array $rows ) {
		$html  = '<table class="widefat striped smm-docs-table"><thead><tr>';
		$html .= '<th scope="col">' . esc_html__( 'Hook', 'structured-mega-menu' ) . '</th>';
		$html .= '<th scope="col">' . esc_html__( 'Purpose', 'structured-mega-menu' ) . '</th>';
		$html .= '</tr></thead><tbody>';

		foreach ( $rows as $row ) {
			$html .= '<tr><td><code>' . esc_html( $row[0] ) . '</code></td><td>' . esc_html( $row[1] ) . '</td></tr>';
		}

		$html .= '</tbody></table>';
		return $html;
	}
}
