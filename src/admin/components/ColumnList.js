/**
 * Column list with add control.
 */

import { __, sprintf } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import ColumnCard from './ColumnCard';
import EmptyState from './EmptyState';
import { STORE_NAME } from '../store';
import { MAX_COLUMNS, COLUMN_TYPES } from '../../shared/constants';
import { canAddColumn } from '../utilities/columns';

/**
 * @return {JSX.Element} Column list.
 */
export default function ColumnList() {
	const { addColumn } = useDispatch( STORE_NAME );
	const columns = useSelect(
		( select ) => select( STORE_NAME ).getSchema().columns || [],
		[]
	);

	const atMax = ! canAddColumn( columns );

	if ( ! columns.length ) {
		return <EmptyState onSelect={ ( type ) => addColumn( type ) } />;
	}

	return (
		<div className="smm-column-list">
			<div className="smm-column-list__toolbar">
				<p className="smm-column-list__count">
					{ sprintf(
						/* translators: 1: current column count, 2: maximum columns */
						__( 'Columns: %1$d of %2$d', 'structured-mega-menu' ),
						columns.length,
						MAX_COLUMNS
					) }
				</p>
				<div className="smm-column-list__add">
					<span className="screen-reader-text">
						{ __( 'Add column', 'structured-mega-menu' ) }
					</span>
					<Button
						variant="secondary"
						disabled={ atMax }
						onClick={ () => addColumn( COLUMN_TYPES.IMAGE_CTA ) }
					>
						{ __( 'Image and CTA', 'structured-mega-menu' ) }
					</Button>
					<Button
						variant="secondary"
						disabled={ atMax }
						onClick={ () => addColumn( COLUMN_TYPES.ICON_LINKS ) }
					>
						{ __( 'Links with icons', 'structured-mega-menu' ) }
					</Button>
					<Button
						variant="secondary"
						disabled={ atMax }
						onClick={ () => addColumn( COLUMN_TYPES.LINK_LIST ) }
					>
						{ __( 'Link list', 'structured-mega-menu' ) }
					</Button>
				</div>
			</div>
			{ atMax && (
				<p className="smm-column-list__max" role="status">
					{ __(
						'Maximum of four columns reached.',
						'structured-mega-menu'
					) }
				</p>
			) }
			{ columns.map( ( column, index ) => (
				<ColumnCard
					key={ column.id }
					column={ column }
					index={ index }
					total={ columns.length }
				/>
			) ) }
		</div>
	);
}
