# Structured Mega Menu — public CSS API

> Contributor mirror. The WordPress.org ZIP does not include Markdown files.
> Shipped documentation is available in wp-admin under **Appearance → Mega Menus → For developers**
> (and the screen Help tabs), rendered from `includes/class-developer-docs.php`.

These CSS custom properties are a **stable public contract** for themes and custom CSS.
Prefer overriding variables over replacing plugin selectors.

## Where to set them

1. **Per menu (UI):** Appearance → Mega Menus → Appearance section  
2. **Theme / custom CSS:** target `.smm-menu-item` or `.smm-menu-item__panel`  
3. **PHP:** filter `structured_mega_menu_appearance_css_vars`

Variables set on the menu item wrapper (`.smm-menu-item`) cascade into the panel.

## Public variables

| Variable | Purpose | Default / notes |
| --- | --- | --- |
| `--smm-panel-bg` | Panel background | Theme `base` / `background` preset when unset |
| `--smm-panel-color` | Panel text color | Theme `contrast` / `foreground` preset when unset |
| `--smm-panel-border` | Panel border color | Subtle mix of text color when unset |
| `--smm-panel-radius` | Panel corner radius | Theme custom radius or `0.5rem` |
| `--smm-panel-padding` | Panel inner padding | Fluid clamp |
| `--smm-panel-shadow` | Panel box shadow | Soft layered shadow |
| `--smm-panel-min-width` | Navigation-width floor | Set by renderer from column count |
| `--smm-panel-top` | Fixed-panel top offset | Set by Interactivity for content/wide/full/viewport |
| `--smm-grid-template` | Column track template | From layout preset (`1-2`, `1-1-1`, …) |
| `--smm-grid-gap` | Gap between columns | Fluid clamp |
| `--smm-image-radius` | Image CTA media radius | Derived from panel radius |
| `--smm-stacked-image-max-height` | Max image height when stacked | Used on tablet/mobile |
| `--smm-theme-full-size` | Theme `fullSize` bridge | Emitted when theme.json defines it |

Internal aliases (`--smm-surface`, `--smm-ink`, `--smm-hairline`, …) are derived from the public panel variables. Override the **public** names when possible.

## Density & radius classes

When set in the Appearance UI, the wrapper may also receive:

- `smm-density-compact` / `smm-density-roomy`
- `smm-radius-none` / `smm-radius-small` / `smm-radius-medium` / `smm-radius-large`

These are optional hooks for theme CSS; values are primarily applied via the variables above.

## Theme.json example

```css
/* In a child theme or Customizer Additional CSS */
.smm-menu-item {
	--smm-panel-bg: var(--wp--preset--color--base);
	--smm-panel-color: var(--wp--preset--color--contrast);
	--smm-panel-radius: var(--wp--custom--border-radius, 0.5rem);
	--smm-panel-padding: 1.5rem;
}
```

## PHP example

```php
add_filter(
	'structured_mega_menu_appearance_css_vars',
	static function ( $vars, $settings, $menu_id ) {
		$vars['--smm-panel-radius'] = '0';
		$vars['--smm-grid-gap']     = '1.25rem';
		return $vars;
	},
	10,
	3
);
```
