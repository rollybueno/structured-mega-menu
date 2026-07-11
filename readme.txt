=== Structured Mega Menu ===
Contributors:      structuredmegamenu
Tags:            mega menu, navigation, block menu, full site editing, site editor
Requires at least: 6.5
Tested up to:      7.0
Requires PHP:      7.4
Stable tag:        1.0.0
License:           GPLv2 or later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Create responsive mega menus with structured image, icon-link, and link-list columns for the WordPress Navigation block.

== Description ==

Structured Mega Menu lets you build reusable mega menu configurations and attach them to the Core Navigation block without replacing or forking Navigation.

Each configuration supports up to four columns with controlled types:

* Image and CTA
* Links with icons
* Link list without icons

Configurations are managed under Appearance → Mega Menus using a native WordPress admin experience inspired by flexible content and repeater patterns. The plugin does not require ACF, Elementor, or any other plugin.

= Key features =

* Works with block themes and the Core Navigation block
* Custom `structured-mega-menu/menu-item` block insertable only inside Navigation
* Click-first opening with accessible keyboard and touch support
* Theme-aware panel widths (navigation, content, viewport)
* Locally bundled icon library (no CDN, no external APIs)
* No tracking, telemetry, ads, or remote services

= Version 1 limitations =

* Maximum of four columns
* No arbitrary blocks inside columns
* No classic `wp_nav_menu()` integration
* No custom CSS/JS fields or raw SVG input

== Installation ==

1. Upload the `structured-mega-menu` folder to the `/wp-content/plugins/` directory, or install the plugin through the WordPress plugins screen.
2. Activate the plugin through the Plugins screen.
3. Go to Appearance → Mega Menus to create a configuration.
4. In the Site Editor or a Navigation block, add a Mega Menu Item and select your configuration.

== Frequently Asked Questions ==

= Does this replace the Core Navigation block? =

No. The plugin adds a custom child block that works inside `core/navigation`.

= Does this require ACF? =

No. The flexible editing experience is a native implementation. ACF is not required and is not bundled.

= Will uninstalling delete my mega menus? =

By default, no. Data is removed on uninstall only if you explicitly enable “Delete all plugin data when uninstalled”.

= Can I use more than four columns? =

Not in version 1. The maximum is four columns.

== Screenshots ==

1. Mega Menus list under Appearance
2. Flexible column editor
3. Mega Menu Item inside the Navigation block
4. Frontend mega menu panel

== Changelog ==

= 1.0.0 =
* Initial release: mega menu configurations, Navigation block item, Interactivity frontend, admin editor, and test suite.

== Upgrade Notice ==

= 1.0.0 =
Initial release.
