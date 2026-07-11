/**
 * Save status indicator.
 */

import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';

/**
 * @param {Object} props
 * @param {string} props.status Save status.
 * @return {JSX.Element} Status element.
 */
export default function SaveStatus( { status } ) {
	let label = __( 'Saved', 'structured-mega-menu' );
	let className = 'smm-save-status is-saved';

	if ( status === 'unsaved' ) {
		label = __( 'Unsaved changes', 'structured-mega-menu' );
		className = 'smm-save-status is-unsaved';
	} else if ( status === 'saving' ) {
		label = __( 'Saving…', 'structured-mega-menu' );
		className = 'smm-save-status is-saving';
	} else if ( status === 'error' ) {
		label = __( 'Save failed', 'structured-mega-menu' );
		className = 'smm-save-status is-error';
	}

	return (
		<span className={ className } role="status">
			{ status === 'saving' && <Spinner /> }
			{ label }
		</span>
	);
}
