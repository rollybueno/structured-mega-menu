/**
 * Reusable repeater for icon links and link lists.
 */

import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import RepeaterRow from './RepeaterRow';
import { STORE_NAME } from '../store';
import { COLUMN_TYPES } from '../../shared/constants';

/**
 * @param {Object} props
 * @param {string} props.columnId
 * @param {string} props.columnType
 * @param {Array}  props.items
 * @param {number} props.columnIndex
 * @return {JSX.Element} Repeater.
 */
export default function Repeater( {
	columnId,
	columnType,
	items,
	columnIndex,
} ) {
	const {
		addItem,
		updateItem,
		removeItem,
		duplicateItem,
		moveItem,
		toggleItemExpanded,
		setFocusItemId,
	} = useDispatch( STORE_NAME );

	const { expandedMap, focusItemId, validationErrors } = useSelect(
		( select ) => {
			const store = select( STORE_NAME );
			const map = {};
			( items || [] ).forEach( ( item ) => {
				map[ item.id ] = store.isItemExpanded( item.id );
			} );
			return {
				expandedMap: map,
				focusItemId: store.getFocusItemId(),
				validationErrors: store.getValidationErrors(),
			};
		},
		[ items ]
	);

	const addLabel =
		columnType === COLUMN_TYPES.ICON_LINKS
			? __( 'Add icon link', 'structured-mega-menu' )
			: __( 'Add link', 'structured-mega-menu' );

	const columnPath = `columns.${ columnIndex }.settings`;

	return (
		<div className="smm-repeater">
			{ ( items || [] ).map( ( item, index ) => (
				<RepeaterRow
					key={ item.id }
					item={ item }
					index={ index }
					total={ items.length }
					columnType={ columnType }
					isExpanded={ !! expandedMap[ item.id ] }
					shouldFocus={ focusItemId === item.id }
					columnPath={ columnPath }
					errors={ validationErrors }
					onToggle={ () => toggleItemExpanded( item.id ) }
					onChange={ ( patch ) =>
						updateItem( columnId, item.id, patch )
					}
					onDuplicate={ () => duplicateItem( columnId, item.id ) }
					onRemove={ () => removeItem( columnId, item.id ) }
					onMove={ ( target ) =>
						moveItem( columnId, item.id, target )
					}
					onFocusHandled={ () => setFocusItemId( null ) }
				/>
			) ) }
			<Button variant="secondary" onClick={ () => addItem( columnId ) }>
				{ addLabel }
			</Button>
		</div>
	);
}
