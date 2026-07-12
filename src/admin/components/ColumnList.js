/**
 * Column list with add control.
 */

import { __, sprintf } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import ColumnCard from './ColumnCard';
import EmptyState from './EmptyState';
import { STORE_NAME } from '../store';
import { MAX_COLUMNS } from '../../shared/constants';
import { canAddColumn, getRegisteredColumnTypes } from '../utilities/columns';

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
	const types = getRegisteredColumnTypes();

	if ( ! columns.length ) {
		return <EmptyState onSelect={ ( type ) => addColumn( type ) } />;
	}

	return (
		<section className="smm-surface smm-column-list">
			<div className="smm-surface__header">
				<h2 className="smm-surface__title">
					{ __( 'Columns', 'structured-mega-menu' ) }
				</h2>
				<p className="smm-column-list__count">
					{ sprintf(
						/* translators: 1: current column count, 2: maximum columns */
						__( '%1$d of %2$d used', 'structured-mega-menu' ),
						columns.length,
						MAX_COLUMNS
					) }
				</p>
			</div>
			<div className="smm-surface__body">
				<div className="smm-column-list__toolbar">
					<span className="screen-reader-text">
						{ __( 'Add column', 'structured-mega-menu' ) }
					</span>
					<div className="smm-column-list__add">
						{ types.map( ( type ) => (
							<Button
								key={ type.name }
								variant="secondary"
								disabled={ atMax }
								onClick={ () => addColumn( type.name ) }
							>
								{ type.label }
							</Button>
						) ) }
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
		</section>
	);
}
