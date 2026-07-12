/**
 * Repeater row.
 */

import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import {
	Button,
	TextControl,
	TextareaControl,
	ToggleControl,
	DropdownMenu,
} from '@wordpress/components';
import SortableList from './SortableList';
import LinkPicker from './LinkPicker';
import IconPicker from './IconPicker';
import { getItemSummary } from '../utilities/summaries';
import { COLUMN_TYPES } from '../../shared/constants';

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
 * @param {Object}   props
 * @param {Object}   props.item
 * @param {number}   props.index
 * @param {number}   props.total
 * @param {string}   props.columnType
 * @param {boolean}  props.isExpanded
 * @param {boolean}  props.shouldFocus
 * @param {string}   props.columnPath
 * @param {Array}    props.errors
 * @param {Function} props.onToggle
 * @param {Function} props.onChange
 * @param {Function} props.onDuplicate
 * @param {Function} props.onRemove
 * @param {Function} props.onMove
 * @param {Function} props.onFocusHandled
 * @return {JSX.Element} Row.
 */
export default function RepeaterRow( {
	item,
	index,
	total,
	columnType,
	isExpanded,
	shouldFocus,
	columnPath,
	errors,
	onToggle,
	onChange,
	onDuplicate,
	onRemove,
	onMove,
	onFocusHandled,
} ) {
	const summary = getItemSummary( item );
	const labelFieldId = `smm-field-${ columnPath }.items.${ index }.label`;
	const labelError = errors?.find( ( e ) =>
		e.path?.endsWith( `.items.${ index }.label` )
	);
	const urlError = errors?.find( ( e ) =>
		e.path?.endsWith( `.items.${ index }.url` )
	);

	useEffect( () => {
		if ( shouldFocus && isExpanded ) {
			const field = document.getElementById( labelFieldId );
			if ( field ) {
				field.focus();
				field.scrollIntoView( {
					block: 'nearest',
					behavior: 'smooth',
				} );
			}
			onFocusHandled?.();
		}
	}, [ shouldFocus, isExpanded, labelFieldId, onFocusHandled ] );

	return (
		<div
			className={ `smm-repeater-row ${
				item.enabled === false ? 'is-disabled' : ''
			} ${ isExpanded ? 'is-expanded' : '' }` }
		>
			<div className="smm-repeater-row__header">
				<SortableList
					index={ index }
					total={ total }
					label={ summary.title }
					onMove={ onMove }
				/>
				<button
					type="button"
					className="smm-repeater-row__summary"
					onClick={ onToggle }
					aria-expanded={ isExpanded }
				>
					{ columnType === COLUMN_TYPES.ICON_LINKS && (
						<span
							className="smm-repeater-row__icon"
							aria-hidden="true"
						>
							{ item.icon?.source === 'media' &&
							item.icon?.url ? (
								<img src={ item.icon.url } alt="" />
							) : item.icon?.source === 'library' &&
							  item.icon?.value ? (
								<span
									className={ `dashicons dashicons-${ item.icon.value }` }
								/>
							) : (
								'•'
							) }
						</span>
					) }
					<span className="smm-repeater-row__text">
						<span className="smm-repeater-row__title">
							{ summary.title }
						</span>
						<span className="smm-repeater-row__subtitle">
							{ summary.subtitle }
						</span>
					</span>
				</button>
				<DropdownMenu
					icon={ moreIcon }
					label={ __( 'Row actions', 'structured-mega-menu' ) }
					controls={ [
						{
							title: __( 'Duplicate', 'structured-mega-menu' ),
							onClick: onDuplicate,
						},
						{
							title:
								item.enabled === false
									? __( 'Enable', 'structured-mega-menu' )
									: __( 'Disable', 'structured-mega-menu' ),
							onClick: () =>
								onChange( {
									enabled: item.enabled === false,
								} ),
						},
						{
							title: __( 'Move to top', 'structured-mega-menu' ),
							onClick: () => onMove( 'top' ),
						},
						{
							title: __(
								'Move to bottom',
								'structured-mega-menu'
							),
							onClick: () => onMove( 'bottom' ),
						},
						{
							title: __( 'Remove', 'structured-mega-menu' ),
							onClick: onRemove,
							isDestructive: true,
						},
					] }
				/>
				<Button
					variant="tertiary"
					onClick={ onToggle }
					aria-expanded={ isExpanded }
					label={
						isExpanded
							? __( 'Collapse row', 'structured-mega-menu' )
							: __( 'Expand row', 'structured-mega-menu' )
					}
					showTooltip
				>
					{ isExpanded ? '▾' : '▸' }
				</Button>
			</div>
			{ isExpanded && (
				<div className="smm-repeater-row__body">
					<div className="smm-fields-grid">
						{ columnType === COLUMN_TYPES.ICON_LINKS && (
							<div className="smm-fields-grid__full">
								<IconPicker
									value={ item.icon }
									onChange={ ( icon ) =>
										onChange( { icon } )
									}
								/>
							</div>
						) }
						<TextControl
							label={ __( 'Link label', 'structured-mega-menu' ) }
							value={ item.label || '' }
							onChange={ ( label ) => onChange( { label } ) }
							help={ labelError?.message }
							className={
								labelError ? 'smm-field-error' : undefined
							}
							id={ labelFieldId }
							placeholder={ __(
								'About us',
								'structured-mega-menu'
							) }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
						<div
							className="smm-fields-grid__full"
							id={ `smm-field-${ columnPath }.items.${ index }.url` }
						>
							<LinkPicker
								url={ item.url }
								opensInNewTab={ item.opensInNewTab }
								error={ urlError?.message }
								label={ __(
									'Link URL',
									'structured-mega-menu'
								) }
								onChange={ ( link ) => onChange( link ) }
							/>
						</div>
						<TextareaControl
							label={ __(
								'Description',
								'structured-mega-menu'
							) }
							value={ item.description || '' }
							onChange={ ( description ) =>
								onChange( { description } )
							}
							help={ __(
								'Optional supporting text under the label.',
								'structured-mega-menu'
							) }
							__nextHasNoMarginBottom
						/>
						<div className="smm-fields-grid__full">
							<ToggleControl
								label={ __(
									'Show this link',
									'structured-mega-menu'
								) }
								checked={ item.enabled !== false }
								onChange={ ( enabled ) =>
									onChange( { enabled } )
								}
								help={
									item.enabled === false
										? __(
												'Hidden links stay saved as drafts and will not render on the front end.',
												'structured-mega-menu'
										  )
										: undefined
								}
								__nextHasNoMarginBottom
							/>
						</div>
					</div>
				</div>
			) }
		</div>
	);
}
