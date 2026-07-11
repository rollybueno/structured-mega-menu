/**
 * Mega Menu Item block editor UI.
 */

import { __, sprintf } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, Notice } from '@wordpress/components';
import { useEntityRecords, useEntityRecord } from '@wordpress/core-data';
import MegaMenuSelector from './components/MegaMenuSelector';
import MenuPreview from './components/MenuPreview';
import TriggerSettings from './components/TriggerSettings';
import { getMenuStatus, getMenuTitle } from './utils';

/**
 * @return {Object} Localized block editor config.
 */
function getBlockConfig() {
	return window.smmBlockEditor || {};
}

/**
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @param {boolean}  props.isSelected    Whether the block is selected.
 * @return {JSX.Element} Editor element.
 */
export default function Edit( { attributes, setAttributes, isSelected } ) {
	const { label, megaMenuId, triggerType, url, opensInNewTab } = attributes;
	const config = getBlockConfig();

	const { records: menus, hasResolved: menusResolved } = useEntityRecords(
		'postType',
		'smm_mega_menu',
		{
			per_page: 100,
			status: 'publish,draft,private',
			context: 'edit',
			orderby: 'title',
			order: 'asc',
		}
	);

	const { record: selectedPost, hasResolved: selectedResolved } =
		useEntityRecord( 'postType', 'smm_mega_menu', megaMenuId || undefined );

	const status = getMenuStatus(
		selectedPost,
		megaMenuId ? selectedResolved : true,
		megaMenuId
	);

	const menuTitle = getMenuTitle( selectedPost );
	const editUrl =
		megaMenuId && config.adminUrl
			? `${ config.adminUrl }&menu=${ megaMenuId }`
			: '';

	const blockProps = useBlockProps( {
		className: `wp-block-navigation-item smm-menu-item ${
			status === 'missing' || status === 'trashed'
				? 'is-missing-config'
				: ''
		} ${ ! megaMenuId ? 'is-empty-config' : '' }`,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Mega menu', 'structured-mega-menu' ) }
					initialOpen={ true }
				>
					<MegaMenuSelector
						megaMenuId={ megaMenuId }
						menus={ menus || [] }
						hasResolved={ menusResolved }
						status={ status }
						selectedPost={ selectedPost }
						label={ label }
						adminUrl={ config.adminUrl || '' }
						editUrl={ editUrl }
						onSelect={ ( id ) =>
							setAttributes( { megaMenuId: id } )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Trigger', 'structured-mega-menu' ) }
					initialOpen={ true }
				>
					<TriggerSettings
						triggerType={ triggerType }
						url={ url }
						opensInNewTab={ opensInNewTab }
						onChange={ ( patch ) => setAttributes( patch ) }
					/>
				</PanelBody>
			</InspectorControls>

			<li { ...blockProps }>
				<div className="smm-menu-item__trigger wp-block-navigation-item__content">
					<RichText
						tagName="span"
						className="wp-block-navigation-item__label"
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
						placeholder={ __(
							'Add label…',
							'structured-mega-menu'
						) }
						allowedFormats={ [] }
						withoutInteractiveFormatting
					/>
					<span className="smm-menu-item__chevron" aria-hidden="true">
						▾
					</span>
				</div>

				{ ( isSelected || megaMenuId > 0 ) && (
					<div className="smm-menu-item__editor-panel">
						{ ! megaMenuId && (
							<Notice status="info" isDismissible={ false }>
								{ __(
									'No mega menu selected. Choose or create a configuration in the sidebar.',
									'structured-mega-menu'
								) }
							</Notice>
						) }
						{ status === 'ok' && menuTitle && (
							<p className="smm-menu-item__config-name">
								{ sprintf(
									/* translators: %s: mega menu title */
									__( 'Using: %s', 'structured-mega-menu' ),
									menuTitle
								) }
							</p>
						) }
						<MenuPreview
							post={ selectedPost }
							isLoading={ !! megaMenuId && ! selectedResolved }
							status={ status }
							menuTitle={ menuTitle }
						/>
					</div>
				) }
			</li>
		</>
	);
}
