const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

const defaultEntry =
	typeof defaultConfig.entry === 'function'
		? defaultConfig.entry()
		: defaultConfig.entry || {};

module.exports = {
	...defaultConfig,
	entry: {
		...defaultEntry,
		'admin/index': path.resolve( process.cwd(), 'src/admin/index.js' ),
		'navigation-extension/index': path.resolve(
			process.cwd(),
			'src/navigation-extension/index.js'
		),
		'blocks/menu-item/index': path.resolve(
			process.cwd(),
			'src/blocks/menu-item/index.js'
		),
	},
	plugins: [
		...defaultConfig.plugins,
		new CopyWebpackPlugin( {
			patterns: [
				{
					from: 'src/blocks/menu-item/block.json',
					to: 'blocks/menu-item/block.json',
				},
				{
					from: 'src/blocks/menu-item/render.php',
					to: 'blocks/menu-item/render.php',
				},
			],
		} ),
	],
};
