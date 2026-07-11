/**
 * Mega menu configuration selector for the block inspector.
 */

import { __, sprintf } from '@wordpress/i18n';
import { Button, SelectControl, Spinner, Notice } from '@wordpress/components';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { getMenuTitle } from '../utils';

/**
 * @param {Object}   props
 * @param {number}   props.megaMenuId
 * @param {Array}    props.menus
 * @param {boolean}  props.hasResolved
 * @param {string}   props.status
 * @param {Object}   props.selectedPost
 * @param {string}   props.label
 * @param {Function} props.onSelect
 * @param {string}   props.adminUrl
 * @param {string}   props.editUrl
 * @return {JSX.Element} Selector.
 */
export default function MegaMenuSelector( {
	megaMenuId,
	menus,
	hasResolved,
	status,
	selectedPost,
	label,
	onSelect,
	adminUrl,
	editUrl,
} ) {
	const [ isCreating, setIsCreating ] = useState( false );
	const [ createError, setCreateError ] = useState( null );

	const options = [
		{
			label: __( 'Select a mega menu…', 'structured-mega-menu' ),
			value: '0',
		},
		...( menus || [] ).map( ( menu ) => ( {
			label:
				getMenuTitle( menu ) ||
				sprintf(
					/* translators: %d: mega menu post ID */
					__( 'Untitled (#%d)', 'structured-mega-menu' ),
					menu.id
				),
			value: String( menu.id ),
		} ) ),
	];

	if ( megaMenuId && status === 'missing' ) {
		options.push( {
			label: sprintf(
				/* translators: %d: missing mega menu ID */
				__( 'Missing configuration (#%d)', 'structured-mega-menu' ),
				megaMenuId
			),
			value: String( megaMenuId ),
		} );
	}

	const createMenu = async () => {
		setIsCreating( true );
		setCreateError( null );

		try {
			const title =
				label?.replace( /<[^>]+>/g, '' ).trim() ||
				__( 'Untitled mega menu', 'structured-mega-menu' );

			const post = await apiFetch( {
				path: '/wp/v2/smm-mega-menus',
				method: 'POST',
				data: {
					title,
					status: 'publish',
					meta: {
						_smm_menu_schema: JSON.stringify( {
							version: 1,
							settings: {
								panelWidth: 'navigation',
								openingMode: 'click',
								closeOnOutsideClick: true,
								closeOnEscape: true,
								mobileMode: 'accordion',
								layoutPreset: '1',
							},
							columns: [],
						} ),
						_smm_schema_version: 1,
						_smm_menu_settings: JSON.stringify( {
							panelWidth: 'navigation',
							openingMode: 'click',
							closeOnOutsideClick: true,
							closeOnEscape: true,
							mobileMode: 'accordion',
							layoutPreset: '1',
						} ),
					},
				},
			} );

			onSelect( post.id );
		} catch ( error ) {
			setCreateError(
				error?.message ||
					__(
						'Unable to create a mega menu.',
						'structured-mega-menu'
					)
			);
		}

		setIsCreating( false );
	};

	return (
		<div className="smm-mega-menu-selector">
			{ ! hasResolved ? (
				<div className="smm-mega-menu-selector__loading">
					<Spinner />
					<span>
						{ __( 'Loading mega menus…', 'structured-mega-menu' ) }
					</span>
				</div>
			) : (
				<SelectControl
					label={ __(
						'Mega menu configuration',
						'structured-mega-menu'
					) }
					value={ String( megaMenuId || 0 ) }
					options={ options }
					onChange={ ( value ) =>
						onSelect( parseInt( value, 10 ) || 0 )
					}
					help={
						status === 'trashed'
							? __(
									'This configuration is trashed and will not render.',
									'structured-mega-menu'
							  )
							: __(
									'Choose a reusable configuration created under Appearance → Mega Menus.',
									'structured-mega-menu'
							  )
					}
				/>
			) }

			{ status === 'missing' && (
				<Notice status="warning" isDismissible={ false }>
					{ __(
						'The selected configuration is missing. Choose another or create a new one.',
						'structured-mega-menu'
					) }
				</Notice>
			) }

			{ createError && (
				<Notice
					status="error"
					isDismissible
					onRemove={ () => setCreateError( null ) }
				>
					{ createError }
				</Notice>
			) }

			<div className="smm-mega-menu-selector__actions">
				<Button
					variant="secondary"
					onClick={ createMenu }
					isBusy={ isCreating }
					disabled={ isCreating }
				>
					{ __( 'Create new', 'structured-mega-menu' ) }
				</Button>
				{ megaMenuId > 0 && status === 'ok' && editUrl ? (
					<Button
						variant="link"
						href={ editUrl }
						target="_blank"
						rel="noopener noreferrer"
					>
						{ sprintf(
							/* translators: %s: mega menu title */
							__( 'Edit “%s”', 'structured-mega-menu' ),
							getMenuTitle( selectedPost ) ||
								__( 'configuration', 'structured-mega-menu' )
						) }
					</Button>
				) : null }
				{ adminUrl ? (
					<Button
						variant="link"
						href={ adminUrl }
						target="_blank"
						rel="noopener noreferrer"
					>
						{ __( 'Manage mega menus', 'structured-mega-menu' ) }
					</Button>
				) : null }
			</div>
		</div>
	);
}
