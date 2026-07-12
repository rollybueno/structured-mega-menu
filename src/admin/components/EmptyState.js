/**
 * Empty state / column type picker cards.
 */

import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { COLUMN_TYPES } from '../../shared/constants';
import { getRegisteredColumnTypes } from '../utilities/columns';

const BUILTIN_META = {
	[ COLUMN_TYPES.IMAGE_CTA ]: {
		eyebrow: __( 'Featured', 'structured-mega-menu' ),
		description: __(
			'Featured image, supporting copy, and a call to action.',
			'structured-mega-menu'
		),
	},
	[ COLUMN_TYPES.ICON_LINKS ]: {
		eyebrow: __( 'Visual', 'structured-mega-menu' ),
		description: __(
			'Descriptive navigation links with visual icons.',
			'structured-mega-menu'
		),
	},
	[ COLUMN_TYPES.LINK_LIST ]: {
		eyebrow: __( 'Simple', 'structured-mega-menu' ),
		description: __(
			'Simple navigation links with optional descriptions.',
			'structured-mega-menu'
		),
	},
};

/**
 * @return {Array<Object>} Cards for the empty state.
 */
function getCards() {
	return getRegisteredColumnTypes().map( ( type ) => {
		const meta = BUILTIN_META[ type.name ] || {
			eyebrow: __( 'Custom', 'structured-mega-menu' ),
			description: __(
				'Custom column type registered by a theme or plugin.',
				'structured-mega-menu'
			),
		};

		return {
			type: type.name,
			title: type.label,
			...meta,
		};
	} );
}

/**
 * @param {Object}   props
 * @param {Function} props.onSelect
 * @param {boolean}  props.disabled
 * @return {JSX.Element} Empty state.
 */
export default function EmptyState( { onSelect, disabled } ) {
	const cards = getCards();

	return (
		<div className="smm-surface">
			<div className="smm-surface__header">
				<h2 className="smm-surface__title">
					{ __( 'Columns', 'structured-mega-menu' ) }
				</h2>
			</div>
			<div className="smm-empty-state">
				<p className="smm-empty-state__intro">
					{ __(
						'Start with a column type. You can add up to four columns and rearrange them anytime.',
						'structured-mega-menu'
					) }
				</p>
				<div className="smm-empty-state__cards">
					{ cards.map( ( card ) => (
						<button
							key={ card.type }
							type="button"
							className="smm-type-card"
							disabled={ disabled }
							onClick={ () => onSelect( card.type ) }
						>
							<span className="smm-type-card__eyebrow">
								{ card.eyebrow }
							</span>
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
			{ getCards().map( ( card ) => (
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
