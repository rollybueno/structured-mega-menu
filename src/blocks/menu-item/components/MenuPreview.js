/**
 * Read-only preview of a mega menu configuration in the block editor.
 */

import { __, sprintf } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
import { parseMenuSchema } from '../utils';

const TYPE_LABELS = {
	image_cta: __( 'Image and CTA', 'structured-mega-menu' ),
	icon_links: __( 'Links with icons', 'structured-mega-menu' ),
	link_list: __( 'Link list', 'structured-mega-menu' ),
};

/**
 * @param {Object} props
 * @param {Object} props.column Column data.
 * @param {number} props.index  Index.
 * @return {JSX.Element} Preview column.
 */
function PreviewColumn( { column, index } ) {
	const settings = column.settings || {};
	const typeLabel = TYPE_LABELS[ column.type ] || column.type;
	const enabled = column.enabled !== false;

	let detail = '';
	if ( column.type === 'image_cta' ) {
		detail = settings.heading || settings.ctaLabel || '';
	} else if ( Array.isArray( settings.items ) ) {
		const count = settings.items.filter(
			( item ) => item.enabled !== false
		).length;
		detail = sprintf(
			/* translators: %d: number of links */
			__( '%d links', 'structured-mega-menu' ),
			count
		);
	}

	return (
		<div
			className={ `smm-preview-column ${ enabled ? '' : 'is-disabled' }` }
		>
			<strong className="smm-preview-column__type">
				{ sprintf(
					/* translators: 1: column number, 2: column type */
					__( 'Column %1$d · %2$s', 'structured-mega-menu' ),
					index + 1,
					typeLabel
				) }
			</strong>
			{ detail ? (
				<span className="smm-preview-column__detail">{ detail }</span>
			) : null }
			{ ! enabled && (
				<span className="smm-preview-column__badge">
					{ __( 'Disabled', 'structured-mega-menu' ) }
				</span>
			) }
			{ column.type === 'image_cta' && settings.imageUrl ? (
				<img
					src={ settings.imageUrl }
					alt=""
					className="smm-preview-column__image"
				/>
			) : null }
			{ Array.isArray( settings.items ) && settings.items.length > 0 && (
				<ul className="smm-preview-column__links">
					{ settings.items
						.filter( ( item ) => item.enabled !== false )
						.slice( 0, 5 )
						.map( ( item ) => (
							<li key={ item.id }>
								{ item.label ||
									__(
										'Untitled link',
										'structured-mega-menu'
									) }
							</li>
						) ) }
				</ul>
			) }
		</div>
	);
}

/**
 * @param {Object}      props
 * @param {Object|null} props.post      Menu post.
 * @param {boolean}     props.isLoading Loading state.
 * @param {string}      props.status    Menu status key.
 * @param {string}      props.menuTitle Display title.
 * @return {JSX.Element} Preview panel.
 */
export default function MenuPreview( { post, isLoading, status, menuTitle } ) {
	if ( isLoading || status === 'loading' ) {
		return (
			<div className="smm-menu-preview is-loading">
				<Spinner />
				<span>
					{ __(
						'Loading mega menu preview…',
						'structured-mega-menu'
					) }
				</span>
			</div>
		);
	}

	if ( status === 'empty' ) {
		return (
			<div className="smm-menu-preview is-empty">
				<p>
					{ __(
						'Select a mega menu configuration to preview it here.',
						'structured-mega-menu'
					) }
				</p>
			</div>
		);
	}

	if ( status === 'missing' ) {
		return (
			<div className="smm-menu-preview is-error">
				<p>
					{ __(
						'The selected mega menu could not be found. It may have been deleted.',
						'structured-mega-menu'
					) }
				</p>
			</div>
		);
	}

	if ( status === 'trashed' ) {
		return (
			<div className="smm-menu-preview is-error">
				<p>
					{ __(
						'The selected mega menu is in the Trash and will not render on the frontend.',
						'structured-mega-menu'
					) }
				</p>
			</div>
		);
	}

	const schema = parseMenuSchema( post );
	const columns = Array.isArray( schema?.columns ) ? schema.columns : [];

	return (
		<div className="smm-menu-preview">
			<div className="smm-menu-preview__header">
				<strong>
					{ menuTitle ||
						__( 'Mega menu preview', 'structured-mega-menu' ) }
				</strong>
				<span className="smm-menu-preview__meta">
					{ sprintf(
						/* translators: %d: column count */
						__( '%d columns', 'structured-mega-menu' ),
						columns.length
					) }
				</span>
			</div>
			{ ! columns.length ? (
				<p className="smm-menu-preview__empty-columns">
					{ __(
						'This configuration has no columns yet.',
						'structured-mega-menu'
					) }
				</p>
			) : (
				<div className="smm-menu-preview__grid">
					{ columns.map( ( column, index ) => (
						<PreviewColumn
							key={ column.id || index }
							column={ column }
							index={ index }
						/>
					) ) }
				</div>
			) }
		</div>
	);
}
