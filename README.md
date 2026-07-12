# Structured Mega Menu

Create responsive mega menus with structured image, icon-link, and link-list columns for the WordPress Navigation block.

**License:** GPL-2.0-or-later  
**Requires at least:** WordPress 6.5  
**Tested up to:** WordPress 7.0  
**Requires PHP:** 7.4  

## Architecture overview

The plugin does **not** unregister, fork, or replace `core/navigation`.

Administrators create reusable configurations as a private CPT (`smm_mega_menu`) under **Appearance → Mega Menus**. The custom dynamic block `structured-mega-menu/menu-item` is insertable only as a direct child of `core/navigation` and stores a reference (`megaMenuId`) plus trigger settings—not the full schema.

Canonical schema data is stored in post meta (`_smm_menu_schema`) as sanitized JSON. The server always decodes, migrates, validates, and sanitizes before persistence.

### Independence from ACF

The admin UX is conceptually similar to flexible content / repeaters. That is a UX analogy only. This plugin:

* Does not require ACF
* Does not copy ACF code
* Implements all fields natively

## Development setup

```bash
cd wp-content/plugins/structured-mega-menu
composer install
npm install
npm run build
```

## Build commands

| Command | Description |
| --- | --- |
| `npm start` | Watch mode via `@wordpress/scripts` |
| `npm run build` | Production build |
| `npm run lint:js` | ESLint |
| `npm run lint:css` | Stylelint |
| `npm run format` | Format JS/CSS |
| `npm run plugin-zip` | Create distribution ZIP |

## Testing commands

| Command | Description |
| --- | --- |
| `npm run test:unit` | JavaScript unit tests (Jest) |
| `npm run test:e2e` | Playwright end-to-end tests (`SMM_BASE_URL` required) |
| `composer test` / `vendor/bin/phpunit` | PHPUnit |
| `vendor/bin/phpcs` | PHP Coding Standards |

Translations are handled by WordPress.org language packs. This plugin does not ship a `/languages` folder or call `load_plugin_textdomain()`.

## Phase status

* **Phase 1 (complete):** bootstrap, CPT, capabilities, meta, schema/sanitizer/migrations, column registry, build tooling
* **Phase 2 (complete):** Admin flexible editor (list, columns, repeaters, validation, save, undo)
* **Phase 3 (complete):** Navigation menu-item block editor UX (selector, preview, create/edit shortcuts)
* **Phase 4 (complete):** Frontend renderer + Interactivity API + responsive CSS
* **Phase 5 (complete):** PHPUnit, Jest, Playwright smoke tests, distribution polish

## Data model

* **CPT:** `smm_mega_menu` (private, UI under Appearance, REST-enabled for authenticated editors)
* **Meta:** `_smm_menu_schema`, `_smm_schema_version`, `_smm_menu_settings`
* **Schema version:** starts at `1`
* **Max columns:** 4
* **Column types:** `image_cta`, `icon_links`, `link_list`

## Block integration

* Block name: `structured-mega-menu/menu-item`
* Parent: `core/navigation`
* `blocks.registerBlockType` filter appends the block to Navigation `allowedBlocks`
* Dynamic render via `render.php` as an `<li>` compatible with Navigation list markup

## Column registry

Built-in types implement `StructuredMegaMenu\Column_Types\Column_Type`.

```php
do_action( 'structured_mega_menu_register_column_types', $registry );
```

See [`docs/hooks.md`](docs/hooks.md) for the full hook list and [`docs/css-api.md`](docs/css-api.md) for the public CSS variable contract. An example custom column lives in [`examples/sample-promo-column/`](examples/sample-promo-column/) (excluded from the WordPress.org ZIP).

### Public hooks

| Hook | Type | Purpose |
| --- | --- | --- |
| `structured_mega_menu_register_column_types` | action | Register custom column types |
| `structured_mega_menu_column_schema` | filter | Adjust column schema for clients |
| `structured_mega_menu_menu_schema` | filter | Adjust sanitized schema before save |
| `structured_mega_menu_icon_registry` | filter | Extend curated Dashicons slugs |
| `structured_mega_menu_panel_widths` | filter | Allowed panel width modes |
| `structured_mega_menu_opening_modes` | filter | Allowed opening modes |
| `structured_mega_menu_mobile_modes` | filter | Allowed mobile modes |
| `structured_mega_menu_layout_presets` | filter | Layout presets by column count |
| `structured_mega_menu_menu_item_classes` | filter | Classes on the menu item wrapper |
| `structured_mega_menu_panel_classes` | filter | Classes on the mega panel |
| `structured_mega_menu_appearance_css_vars` | filter | CSS variables for appearance |
| `structured_mega_menu_render_context` | filter | Context passed to column renderers |
| `structured_mega_menu_rendered_column` | filter | Filter rendered column HTML |

## For developers

* **In wp-admin:** Appearance → Mega Menus → **For developers** (also Help → CSS API / Developer hooks)
* **Source:** https://github.com/rollybueno/structured-mega-menu
* **Repo-only docs (not in the WordPress.org ZIP):** [`docs/css-api.md`](docs/css-api.md), [`docs/hooks.md`](docs/hooks.md)
* **Example column (repo only):** [`examples/sample-promo-column/`](examples/sample-promo-column/)

Appearance settings (density, radius, panel colors) map to the public `--smm-panel-*` variables — prefer those over selector overrides.

## Accessibility behavior

* Default opening mode is click (not hover-only)
* Escape closes panels and restores focus (Phase 4)
* Correct `aria-expanded` / `aria-controls` (Phase 4)
* No `role="menu"` / `role="menuitem"` for site navigation
* Keyboard alternatives for reorder actions (Phase 2)

## Browser support

Follows WordPress admin/editor support targets. Frontend uses modern CSS (grid, logical properties, container queries where practical) with media-query fallbacks.

## Release procedure

1. Update version in `structured-mega-menu.php`, `package.json`, `readme.txt`, and block metadata.
2. `npm run build`
3. `vendor/bin/phpcs` and lint scripts must pass
4. Run unit and e2e tests
5. `npm run plugin-zip`
6. Verify ZIP against Plugin Check

## Known limitations (v1)

* Maximum four columns
* No arbitrary Gutenberg blocks inside columns
* No classic `wp_nav_menu()` integration
* No raw SVG / custom CSS / custom JS fields
* No WooCommerce-specific integrations
* No analytics or remote services
