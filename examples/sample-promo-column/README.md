# Sample promo column

Example custom column type for **Structured Mega Menu**.

This folder is **not** loaded by the plugin and is excluded from the WordPress.org ZIP. Copy it into a custom plugin (or your theme’s `inc/` folder) and register it.

## Register

```php
<?php
/**
 * Plugin Name: SMM Sample Promo Column
 * Description: Example custom column for Structured Mega Menu.
 */

add_action(
	'structured_mega_menu_register_column_types',
	static function ( $registry ) {
		require_once __DIR__ . '/class-sample-promo-column.php';
		$registry->register( new Sample_Promo_Column() );
	}
);
```

## Contract

Implement `StructuredMegaMenu\Column_Types\Column_Type`:

1. `get_name()` / `get_label()`
2. `get_schema()` — drives the admin generic field editor (`type` + optional `label`)
3. `get_defaults()` / `sanitize()` / `validate()`
4. `render()` — trusted, escaped HTML only

Supported schema field types in the generic editor: `string`, `textarea`, `url`, `boolean`.

See also:

- [`docs/hooks.md`](../../docs/hooks.md)
- [`docs/css-api.md`](../../docs/css-api.md)
