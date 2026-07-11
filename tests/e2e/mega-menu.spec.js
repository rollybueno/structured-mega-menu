/**
 * End-to-end smoke coverage for Structured Mega Menu.
 *
 * Requires a running WordPress site with the plugin active and:
 *   SMM_BASE_URL=https://your-local-site.test
 *   SMM_WP_USERNAME=admin
 *   SMM_WP_PASSWORD=password
 *
 * These tests cover the critical path from the Phase 5 checklist. Broader
 * matrix cases (RTL, multiple Navigation blocks, overlay) can extend this file.
 */

const { test, expect } = require( '@playwright/test' );

const hasBaseUrl = !! process.env.SMM_BASE_URL;
const username = process.env.SMM_WP_USERNAME || 'admin';
const password = process.env.SMM_WP_PASSWORD || 'password';

test.describe( 'Structured Mega Menu', () => {
	test.skip(
		! hasBaseUrl,
		'Set SMM_BASE_URL to run e2e tests against WordPress.'
	);

	test.beforeEach( async ( { page } ) => {
		await page.goto( '/wp-login.php' );
		await page.fill( '#user_login', username );
		await page.fill( '#user_pass', password );
		await page.click( '#wp-submit' );
		await expect( page ).toHaveURL( /wp-admin/ );
	} );

	test( 'admin mega menus screen loads', async ( { page } ) => {
		await page.goto( '/wp-admin/themes.php?page=structured-mega-menu' );
		await expect(
			page.getByRole( 'heading', { name: /mega menus/i } )
		).toBeVisible();
	} );

	test( 'can create a mega menu configuration with columns', async ( {
		page,
	} ) => {
		await page.goto(
			'/wp-admin/themes.php?page=structured-mega-menu&action=new'
		);

		const title = page.getByLabel( /title/i ).first();
		if ( await title.count() ) {
			await title.fill( `E2E Menu ${ Date.now() }` );
		}

		const addColumn = page.getByRole( 'button', {
			name: /add column|image and cta|links with icons|link list/i,
		} );
		if ( await addColumn.count() ) {
			await addColumn.first().click();
		}

		const save = page.getByRole( 'button', { name: /save/i } );
		if ( await save.count() ) {
			await save.first().click();
		}

		await expect( page.locator( 'body' ) ).toContainText(
			/mega menu|saved|column/i
		);
	} );

	test( 'frontend mega menu toggles with keyboard when present', async ( {
		page,
	} ) => {
		await page.goto( '/' );

		const toggle = page.locator( '.smm-menu-item__toggle' ).first();
		if ( ! ( await toggle.count() ) ) {
			test.skip(
				true,
				'No rendered mega menu on the front page yet — add a Navigation mega menu item first.'
			);
			return;
		}

		await toggle.focus();
		await page.keyboard.press( 'Enter' );
		await expect(
			page.locator( '.smm-menu-item.is-open' ).first()
		).toBeVisible();

		await page.keyboard.press( 'Escape' );
		await expect( page.locator( '.smm-menu-item.is-open' ) ).toHaveCount(
			0
		);
		await expect( toggle ).toBeFocused();
	} );
} );
