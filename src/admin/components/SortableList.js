/**
 * Accessible list with keyboard move controls (no heavy DnD dependency).
 */

import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

/**
 * @param {Object}   props
 * @param {number}   props.index
 * @param {number}   props.total
 * @param {Function} props.onMove
 * @param {string}   props.label
 * @return {JSX.Element} Sort controls.
 */
export default function SortableList( { index, total, onMove, label } ) {
	return (
		<div className="smm-sortable-controls">
			<span
				className="smm-drag-handle"
				aria-hidden="true"
				title={ __( 'Use buttons to reorder', 'structured-mega-menu' ) }
			>
				⋮⋮
			</span>
			<Button
				variant="tertiary"
				size="small"
				disabled={ index <= 0 }
				onClick={ () => onMove( 'up' ) }
				label={
					__( 'Move up', 'structured-mega-menu' ) + ` (${ label })`
				}
				showTooltip
			>
				↑
			</Button>
			<Button
				variant="tertiary"
				size="small"
				disabled={ index >= total - 1 }
				onClick={ () => onMove( 'down' ) }
				label={
					__( 'Move down', 'structured-mega-menu' ) + ` (${ label })`
				}
				showTooltip
			>
				↓
			</Button>
		</div>
	);
}
