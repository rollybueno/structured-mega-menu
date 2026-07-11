/**
 * Undo notice after removals.
 */

import { __ } from '@wordpress/i18n';
import { Button, Notice } from '@wordpress/components';

/**
 * @param {Object}   props
 * @param {Object}   props.notice
 * @param {Function} props.onUndo
 * @param {Function} props.onDismiss
 * @return {JSX.Element|null} Notice.
 */
export default function UndoNotice( { notice, onUndo, onDismiss } ) {
	if ( ! notice ) {
		return null;
	}

	return (
		<Notice
			status="info"
			isDismissible
			onRemove={ onDismiss }
			className="smm-undo-notice"
		>
			<span>{ notice.message }</span>{ ' ' }
			<Button variant="link" onClick={ onUndo }>
				{ __( 'Undo', 'structured-mega-menu' ) }
			</Button>
		</Notice>
	);
}
