const webpackConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

const copyPlugin = new CopyWebpackPlugin( {
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
} );

/**
 * @param {import('webpack').Configuration} config Webpack config.
 * @return {Object} Entry map.
 */
function resolveEntry( config ) {
	return typeof config.entry === 'function'
		? config.entry()
		: config.entry || {};
}

/**
 * @param {import('webpack').Configuration} config Webpack config.
 * @return {boolean} Whether this is the script-module config.
 */
function isModuleConfig( config ) {
	return !! ( config?.experiments?.outputModule || config?.output?.module );
}

/**
 * @param {import('webpack').Configuration} config Webpack config.
 * @return {import('webpack').Configuration} Enhanced config.
 */
function enhanceConfig( config ) {
	const entry = resolveEntry( config );

	if ( isModuleConfig( config ) ) {
		return {
			...config,
			entry: {
				...entry,
				'blocks/menu-item/view': path.resolve(
					process.cwd(),
					'src/blocks/menu-item/view.js'
				),
			},
		};
	}

	return {
		...config,
		entry: {
			...entry,
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
		plugins: [ ...( config.plugins || [] ), copyPlugin ],
	};
}

if ( Array.isArray( webpackConfig ) ) {
	module.exports = webpackConfig.map( enhanceConfig );
} else {
	module.exports = enhanceConfig( webpackConfig );
}
