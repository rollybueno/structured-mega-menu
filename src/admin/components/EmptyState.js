/**
 * Empty state / column type picker cards.
 */

import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { COLUMN_TYPES } from '../../shared/constants';

const CARDS = [
	{
		type: COLUMN_TYPES.IMAGE_CTA,
		title: __( 'Image and CTA', 'structured-mega-menu' ),
		description: __(
			'Featured image, supporting copy, and a call to action.',
			'structured-mega-menu'
		),
	},
	{
		type: COLUMN_TYPES.ICON_LINKS,
		title: __( 'Links with icons', 'structured-mega-menu' ),
		description: __(
			'Descriptive navigation links with visual icons.',
			'structured-mega-menu'
		),
	},
	{
		type: COLUMN_TYPES.LINK_LIST,
		title: __( 'Link list', 'structured-mega-menu' ),
		description: __(
			'Simple navigation links with optional descriptions.',
			'structured-mega-menu'
		),
	},
];

/**
 * @param {Object}   props
 * @param {Function} props.onSelect
 * @param {boolean}  props.disabled
 * @return {JSX.Element} Empty state.
 */
export default function EmptyState( { onSelect, disabled } ) {
	return (
		<div className="smm-empty-state">
			<p className="smm-empty-state__intro">
				{ __(
					'Choose a column type to get started.',
					'structured-mega-menu'
				) }
			</p>
			<div className="smm-empty-state__cards">
				{ CARDS.map( ( card ) => (
					<button
						key={ card.type }
						type="button"
						className="smm-type-card"
						disabled={ disabled }
						onClick={ () => onSelect( card.type ) }
					>
						<strong className="smm-type-card__title">
							{ card.title }
						</strong>
						<span className="smm-type-card__description">
							{ card.description }
						</span>
					</button>
				) ) }
			</div>
		</div>
	);
}

/**
 * Compact type picker for the add-column control.
 *
 * @param {Object}   props
 * @param {Function} props.onSelect
 * @param {boolean}  props.disabled
 * @return {JSX.Element} Picker.
 */
export function ColumnTypePicker( { onSelect, disabled } ) {
	return (
		<div className="smm-column-type-picker">
			{ CARDS.map( ( card ) => (
				<Button
					key={ card.type }
					variant="secondary"
					disabled={ disabled }
					onClick={ () => onSelect( card.type ) }
				>
					{ card.title }
				</Button>
			) ) }
		</div>
	);
}
