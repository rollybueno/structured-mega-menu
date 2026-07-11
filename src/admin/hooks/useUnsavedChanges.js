/**
 * Warns before leaving with unsaved changes.
 */

import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { STORE_NAME } from '../store';

/**
 * @return {void}
 */
export function useUnsavedChangesWarning() {
	const hasUnsaved = useSelect(
		( select ) => select( STORE_NAME ).hasUnsavedChanges(),
		[]
	);

	useEffect( () => {
		const onBeforeUnload = ( event ) => {
			if ( ! hasUnsaved ) {
				return;
			}
			event.preventDefault();
			event.returnValue = '';
		};

		window.addEventListener( 'beforeunload', onBeforeUnload );
		return () =>
			window.removeEventListener( 'beforeunload', onBeforeUnload );
	}, [ hasUnsaved ] );
}
