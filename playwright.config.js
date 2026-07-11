/**
 * Playwright configuration for Structured Mega Menu e2e tests.
 *
 * Set SMM_BASE_URL (and optional SMM_WP_USERNAME / SMM_WP_PASSWORD) to run
 * against a local WordPress site. Tests skip when SMM_BASE_URL is unset.
 */

const config = {
	testDir: './tests/e2e',
	timeout: 120000,
	expect: {
		timeout: 15000,
	},
	fullyParallel: false,
	forbidOnly: !! process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: 1,
	reporter: [ [ 'list' ], [ 'html', { open: 'never' } ] ],
	use: {
		baseURL: process.env.SMM_BASE_URL || 'http://localhost',
		trace: 'on-first-retry',
		video: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			use: { browserName: 'chromium' },
		},
	],
};

export default config;
