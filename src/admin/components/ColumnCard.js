/**
 * Single column card with collapse, actions, and fields.
 */

import { __ } from '@wordpress/i18n';
import {
	Button,
	DropdownMenu,
	Modal,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import SortableList from './SortableList';
import ImageCtaFields from './column-types/ImageCtaFields';
import IconLinksFields from './column-types/IconLinksFields';
import LinkListFields from './column-types/LinkListFields';
import GenericColumnFields from './column-types/GenericColumnFields';
import { getColumnSummary } from '../utilities/summaries';
import { getRegisteredColumnTypes } from '../utilities/columns';
import { STORE_NAME } from '../store';
import { COLUMN_TYPES, MAX_COLUMNS } from '../../shared/constants';

const moreIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		aria-hidden="true"
		focusable="false"
	>
		<path d="M13 19h-2v-2h2v2zm0-6h-2v-2h2v2zm0-6h-2V5h2v2z" />
	</svg>
);

/**
 * @param {Object} props
 * @param {Object} props.column
 * @param {number} props.index
 * @param {number} props.total
 * @return {JSX.Element} Card.
 */
export default function ColumnCard( { column, index, total } ) {
	const {
		toggleColumnExpanded,
		updateColumn,
		removeColumn,
		duplicateColumn,
		moveColumn,
		changeColumnType,
		setTypeChangeModal,
	} = useDispatch( STORE_NAME );

	const { isExpanded, typeChangeModal, canDuplicate } = useSelect(
		( select ) => {
			const store = select( STORE_NAME );
			return {
				isExpanded: store.isColumnExpanded( column.id ),
				typeChangeModal: store.getTypeChangeModal(),
				canDuplicate:
					( store.getSchema().columns || [] ).length < MAX_COLUMNS,
			};
		},
		[ column.id ]
	);

	const summary = getColumnSummary( column, index );
	const showTypeModal =
		typeChangeModal && typeChangeModal.columnId === column.id;

	const updateSettings = ( settings ) => {
		updateColumn( column.id, ( current ) => ( {
			...current,
			settings,
		} ) );
	};

	return (
		<div
			className={ `smm-column-card ${
				column.enabled === false ? 'is-disabled' : ''
			} ${ isExpanded ? 'is-expanded' : '' }` }
		>
			<div className="smm-column-card__header">
				<SortableList
					index={ index }
					total={ total }
					label={ summary }
					onMove={ ( direction ) =>
						moveColumn(
							column.id,
							direction === 'up' ? 'left' : 'right'
						)
					}
				/>
				<button
					type="button"
					className="smm-column-card__summary"
					onClick={ () => toggleColumnExpanded( column.id ) }
					aria-expanded={ isExpanded }
				>
					<span className="smm-column-card__title">{ summary }</span>
				</button>
				<ToggleControl
					label={ __( 'Enabled', 'structured-mega-menu' ) }
					checked={ column.enabled !== false }
					onChange={ ( enabled ) =>
						updateColumn( column.id, { enabled } )
					}
					className="smm-column-card__enabled"
				/>
				<DropdownMenu
					icon={ moreIcon }
					label={ __( 'Column actions', 'structured-mega-menu' ) }
					controls={ [
						{
							title: __( 'Duplicate', 'structured-mega-menu' ),
							onClick: () => duplicateColumn( column.id ),
							isDisabled: ! canDuplicate,
						},
						{
							title: __( 'Move left', 'structured-mega-menu' ),
							onClick: () => moveColumn( column.id, 'left' ),
							isDisabled: index === 0,
						},
						{
							title: __( 'Move right', 'structured-mega-menu' ),
							onClick: () => moveColumn( column.id, 'right' ),
							isDisabled: index >= total - 1,
						},
						{
							title: __( 'Remove', 'structured-mega-menu' ),
							onClick: () => removeColumn( column.id ),
							isDestructive: true,
						},
					] }
				/>
				<Button
					variant="tertiary"
					onClick={ () => toggleColumnExpanded( column.id ) }
					aria-expanded={ isExpanded }
					label={
						isExpanded
							? __( 'Collapse column', 'structured-mega-menu' )
							: __( 'Expand column', 'structured-mega-menu' )
					}
					showTooltip
				>
					{ isExpanded ? '▾' : '▸' }
				</Button>
			</div>

			{ isExpanded && (
				<div className="smm-column-card__body">
					<SelectControl
						label={ __( 'Column type', 'structured-mega-menu' ) }
						value={ column.type }
						options={ getRegisteredColumnTypes().map(
							( type ) => ( {
								label: type.label,
								value: type.name,
							} )
						) }
						onChange={ ( nextType ) =>
							changeColumnType( column.id, nextType, false )
						}
					/>

					{ column.type === COLUMN_TYPES.IMAGE_CTA && (
						<ImageCtaFields
							settings={ column.settings }
							columnId={ column.id }
							onChange={ updateSettings }
						/>
					) }
					{ column.type === COLUMN_TYPES.ICON_LINKS && (
						<IconLinksFields
							settings={ column.settings }
							columnId={ column.id }
							columnIndex={ index }
							onChange={ updateSettings }
						/>
					) }
					{ column.type === COLUMN_TYPES.LINK_LIST && (
						<LinkListFields
							settings={ column.settings }
							columnId={ column.id }
							columnIndex={ index }
							onChange={ updateSettings }
						/>
					) }
					{ column.type !== COLUMN_TYPES.IMAGE_CTA &&
						column.type !== COLUMN_TYPES.ICON_LINKS &&
						column.type !== COLUMN_TYPES.LINK_LIST && (
							<GenericColumnFields
								settings={ column.settings }
								columnType={ column.type }
								onChange={ updateSettings }
							/>
						) }
				</div>
			) }

			{ showTypeModal && (
				<Modal
					title={ __(
						'Change column type?',
						'structured-mega-menu'
					) }
					onRequestClose={ () => setTypeChangeModal( null ) }
				>
					<p>
						{ __(
							'Switching to Image and CTA will replace the current column fields. This cannot be undone automatically.',
							'structured-mega-menu'
						) }
					</p>
					<div className="smm-modal-actions">
						<Button
							variant="secondary"
							onClick={ () => setTypeChangeModal( null ) }
						>
							{ __( 'Cancel', 'structured-mega-menu' ) }
						</Button>
						<Button
							variant="primary"
							isDestructive
							onClick={ () =>
								changeColumnType(
									column.id,
									typeChangeModal.nextType,
									true
								)
							}
						>
							{ __( 'Change type', 'structured-mega-menu' ) }
						</Button>
					</div>
				</Modal>
			) }
		</div>
	);
}
