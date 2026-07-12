# Structured Mega Menu — hooks

All hooks use the `structured_mega_menu_` prefix.

## Actions

### `structured_mega_menu_register_column_types`

Register custom column types that implement `StructuredMegaMenu\Column_Types\Column_Type`.

```php
add_action(
	'structured_mega_menu_register_column_types',
	static function ( $registry ) {
		require_once __DIR__ . '/class-sample-promo-column.php';
		$registry->register( new Sample_Promo_Column() );
	}
);
```

See `/examples/sample-promo-column/` for a complete sample (not shipped in the WordPress.org ZIP).

## Filters

### Option lists

| Hook | Args | Purpose |
| --- | --- | --- |
| `structured_mega_menu_panel_widths` | `$widths` | Allowed panel width slugs |
| `structured_mega_menu_opening_modes` | `$modes` | Allowed opening modes |
| `structured_mega_menu_mobile_modes` | `$modes` | Allowed mobile modes |
| `structured_mega_menu_layout_presets` | `$presets` | Layout presets keyed by column count |
| `structured_mega_menu_appearance_densities` | `$densities` | Appearance density slugs |
| `structured_mega_menu_appearance_radii` | `$radii` | Appearance radius slugs |
| `structured_mega_menu_icon_registry` | `$icons` | Dashicons library keyed by slug |

Slugs used in CSS class names must remain `sanitize_key`-safe.

### Schema & data

| Hook | Args | Purpose |
| --- | --- | --- |
| `structured_mega_menu_column_schema` | `$schema`, `$name` | Adjust column schema for admin clients |
| `structured_mega_menu_menu_schema` | `$schema` | Adjust sanitized schema before save |

### Rendering

| Hook | Args | Purpose |
| --- | --- | --- |
| `structured_mega_menu_render_context` | `$context`, `$settings`, `$attributes` | Context passed to column `render()` |
| `structured_mega_menu_menu_item_classes` | `$classes`, `$settings`, `$attributes`, `$menu_id` | Classes on the `li.smm-menu-item` |
| `structured_mega_menu_panel_classes` | `$classes`, `$settings`, `$menu_id` | Classes on `.smm-menu-item__panel` |
| `structured_mega_menu_appearance_css_vars` | `$vars`, `$settings`, `$menu_id` | CSS custom properties on the menu item |
| `structured_mega_menu_rendered_column` | `$html`, `$column`, `$context` | Filter each column’s HTML |

### Example: add a body-like class on wide panels

```php
add_filter(
	'structured_mega_menu_menu_item_classes',
	static function ( $classes, $settings ) {
		if ( isset( $settings['panelWidth'] ) && 'wide' === $settings['panelWidth'] ) {
			$classes[] = 'is-smm-wide';
		}
		return $classes;
	},
	10,
	2
);
```

## JavaScript / Interactivity

Frontend behavior uses the Interactivity API store `structured-mega-menu`. Prefer CSS and PHP filters for customization. If you need open/close signals, observe the `is-open` class on `.smm-menu-item` or `aria-expanded` on the toggle — avoid forking `view.js`.
