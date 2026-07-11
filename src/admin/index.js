/**
 * Admin application entry.
 */

import { createElement, render } from '@wordpress/element';
import App from './app';
import './styles/admin.scss';

/**
 * Mounts the admin application when the root element exists.
 *
 * @return {void}
 */
function bootstrapAdmin() {
	const rootElement = document.getElementById( 'smm-admin-root' );

	if ( ! rootElement ) {
		return;
	}

	render( createElement( App ), rootElement );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', bootstrapAdmin );
} else {
	bootstrapAdmin();
}
