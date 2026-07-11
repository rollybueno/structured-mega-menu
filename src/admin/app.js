/**
 * Root admin application.
 */

import { __, sprintf } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import {
	Button,
	Spinner,
	Notice,
	Modal,
	SelectControl,
	ToggleControl,
	Panel,
	PanelBody,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';

import { STORE_NAME } from './store';
import {
	loadMenus,
	loadIcons,
	openNew,
	openMenu,
	backToList,
	saveCurrent,
	deleteCurrent,
	savePluginSetting,
} from './editor';
import { useUnsavedChangesWarning } from './hooks/useUnsavedChanges';
import EditorHeader from './components/EditorHeader';
import ColumnList from './components/ColumnList';
import ColumnLayoutPicker from './components/ColumnLayoutPicker';
import UndoNotice from './components/UndoNotice';
import ValidationSummary from './components/ValidationSummary';

/**
 * Menu list view.
 *
 * @return {JSX.Element} List.
 */
function MenuList() {
	const { menus, isLoading, error, deleteDataOnUninstall } = useSelect(
		( select ) => ( {
			menus: select( STORE_NAME ).getMenus(),
			isLoading: select( STORE_NAME ).isLoading(),
			error: select( STORE_NAME ).getError(),
			deleteDataOnUninstall:
				select( STORE_NAME ).getDeleteDataOnUninstall(),
		} ),
		[]
	);

	return (
		<div className="smm-list">
			<div className="smm-list__header">
				<h1 className="wp-heading-inline">
					{ __( 'Mega Menus', 'structured-mega-menu' ) }
				</h1>
				<Button variant="primary" onClick={ () => openNew() }>
					{ __( 'Add New', 'structured-mega-menu' ) }
				</Button>
			</div>

			<p className="smm-help">
				{ __(
					'Create reusable mega menu configurations, then attach them to the Navigation block with a Mega Menu Item.',
					'structured-mega-menu'
				) }
			</p>

			{ error && (
				<Notice status="error" isDismissible={ false }>
					{ error }
				</Notice>
			) }

			{ isLoading ? (
				<Spinner />
			) : (
				<table className="wp-list-table widefat fixed striped smm-list-table">
					<thead>
						<tr>
							<th scope="col">
								{ __( 'Title', 'structured-mega-menu' ) }
							</th>
							<th scope="col">
								{ __( 'Status', 'structured-mega-menu' ) }
							</th>
							<th scope="col">
								{ __( 'Actions', 'structured-mega-menu' ) }
							</th>
						</tr>
					</thead>
					<tbody>
						{ ! menus.length && (
							<tr>
								<td colSpan={ 3 }>
									{ __(
										'No mega menus yet. Create one to get started.',
										'structured-mega-menu'
									) }
								</td>
							</tr>
						) }
						{ menus.map( ( menu ) => (
							<tr key={ menu.id }>
								<td>
									<strong>
										{ menu.title?.raw ||
											menu.title?.rendered ||
											__(
												'(no title)',
												'structured-mega-menu'
											) }
									</strong>
								</td>
								<td>{ menu.status }</td>
								<td>
									<Button
										variant="link"
										onClick={ () => openMenu( menu.id ) }
									>
										{ __( 'Edit', 'structured-mega-menu' ) }
									</Button>
								</td>
							</tr>
						) ) }
					</tbody>
				</table>
			) }

			<Panel className="smm-settings-panel">
				<PanelBody
					title={ __( 'Plugin settings', 'structured-mega-menu' ) }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __(
							'Delete all plugin data when uninstalled',
							'structured-mega-menu'
						) }
						checked={ !! deleteDataOnUninstall }
						onChange={ ( value ) => savePluginSetting( value ) }
						help={ __(
							'Off by default. When enabled, uninstall removes mega menu posts, options, and plugin transients.',
							'structured-mega-menu'
						) }
					/>
				</PanelBody>
			</Panel>
		</div>
	);
}

/**
 * Editor view.
 *
 * @return {JSX.Element} Editor.
 */
function MenuEditor() {
	useUnsavedChangesWarning();

	const {
		title,
		schema,
		saveStatus,
		error,
		validationErrors,
		undoNotice,
		deleteModal,
		enabledCount,
	} = useSelect(
		( select ) => ( {
			title: select( STORE_NAME ).getTitle(),
			schema: select( STORE_NAME ).getSchema(),
			saveStatus: select( STORE_NAME ).getSaveStatus(),
			error: select( STORE_NAME ).getError(),
			validationErrors: select( STORE_NAME ).getValidationErrors(),
			undoNotice: select( STORE_NAME ).getUndoNotice(),
			deleteModal: select( STORE_NAME ).getDeleteModal(),
			enabledCount: select( STORE_NAME ).getEnabledColumnCount(),
		} ),
		[]
	);

	const {
		updateTitle,
		updateSettings,
		undoRemove,
		setUndoNotice,
		setDeleteModal,
	} = useDispatch( STORE_NAME );

	const onSave = async () => {
		const result = await saveCurrent();
		if ( ! result.ok && result.errors?.length ) {
			const el = document.querySelector( '.smm-validation-summary' );
			el?.focus();
		}
	};

	const onBack = async () => {
		const unsaved = window.wp?.data
			?.select?.( STORE_NAME )
			?.hasUnsavedChanges?.();
		if ( unsaved ) {
			// eslint-disable-next-line no-alert
			const ok = window.confirm(
				__(
					'You have unsaved changes. Leave without saving?',
					'structured-mega-menu'
				)
			);
			if ( ! ok ) {
				return;
			}
		}
		await backToList();
	};

	return (
		<div className="smm-editor">
			<EditorHeader
				title={ title }
				saveStatus={ saveStatus }
				isSaving={ saveStatus === 'saving' }
				onTitleChange={ updateTitle }
				onSave={ onSave }
				onBack={ onBack }
				onDelete={ () => setDeleteModal( { open: true } ) }
			/>

			{ error && (
				<Notice status="error" isDismissible={ false }>
					{ error }
				</Notice>
			) }

			<ValidationSummary errors={ validationErrors } />
			<UndoNotice
				notice={ undoNotice }
				onUndo={ () => undoRemove() }
				onDismiss={ () => setUndoNotice( null ) }
			/>

			<Panel>
				<PanelBody
					title={ __( 'Menu settings', 'structured-mega-menu' ) }
					initialOpen={ true }
				>
					<SelectControl
						label={ __( 'Panel width', 'structured-mega-menu' ) }
						value={ schema.settings?.panelWidth || 'navigation' }
						options={ [
							{
								label: __(
									'Match navigation width',
									'structured-mega-menu'
								),
								value: 'navigation',
							},
							{
								label: __(
									'Match content width',
									'structured-mega-menu'
								),
								value: 'content',
							},
							{
								label: __(
									'Full viewport width',
									'structured-mega-menu'
								),
								value: 'viewport',
							},
						] }
						onChange={ ( panelWidth ) =>
							updateSettings( { panelWidth } )
						}
					/>
					<SelectControl
						label={ __( 'Opening mode', 'structured-mega-menu' ) }
						value={ schema.settings?.openingMode || 'click' }
						options={ [
							{
								label: __( 'Click', 'structured-mega-menu' ),
								value: 'click',
							},
							{
								label: __(
									'Hover and focus',
									'structured-mega-menu'
								),
								value: 'hover',
							},
						] }
						onChange={ ( openingMode ) =>
							updateSettings( { openingMode } )
						}
						help={ __(
							'Hover mode still supports keyboard, touch, click, and Escape.',
							'structured-mega-menu'
						) }
					/>
					<SelectControl
						label={ __( 'Mobile mode', 'structured-mega-menu' ) }
						value={ schema.settings?.mobileMode || 'accordion' }
						options={ [
							{
								label: __(
									'Accordion',
									'structured-mega-menu'
								),
								value: 'accordion',
							},
							{
								label: __(
									'Expanded stacked content',
									'structured-mega-menu'
								),
								value: 'expanded',
							},
						] }
						onChange={ ( mobileMode ) =>
							updateSettings( { mobileMode } )
						}
					/>
					<ToggleControl
						label={ __(
							'Close on outside click',
							'structured-mega-menu'
						) }
						checked={
							schema.settings?.closeOnOutsideClick !== false
						}
						onChange={ ( closeOnOutsideClick ) =>
							updateSettings( { closeOnOutsideClick } )
						}
					/>
					<ToggleControl
						label={ __(
							'Close on Escape',
							'structured-mega-menu'
						) }
						checked={ schema.settings?.closeOnEscape !== false }
						onChange={ ( closeOnEscape ) =>
							updateSettings( { closeOnEscape } )
						}
					/>
					<ColumnLayoutPicker
						columnCount={ enabledCount }
						value={ schema.settings?.layoutPreset || '1' }
						onChange={ ( layoutPreset ) =>
							updateSettings( { layoutPreset } )
						}
					/>
				</PanelBody>
			</Panel>

			<ColumnList />

			{ deleteModal && (
				<Modal
					title={ __( 'Delete mega menu?', 'structured-mega-menu' ) }
					onRequestClose={ () => setDeleteModal( null ) }
				>
					<p>
						{ sprintf(
							/* translators: %s: mega menu title */
							__(
								'“%s” will be permanently deleted. This cannot be undone.',
								'structured-mega-menu'
							),
							title ||
								__(
									'Untitled mega menu',
									'structured-mega-menu'
								)
						) }
					</p>
					<div className="smm-modal-actions">
						<Button
							variant="secondary"
							onClick={ () => setDeleteModal( null ) }
						>
							{ __( 'Cancel', 'structured-mega-menu' ) }
						</Button>
						<Button
							variant="primary"
							isDestructive
							onClick={ () => deleteCurrent() }
						>
							{ __( 'Delete', 'structured-mega-menu' ) }
						</Button>
					</div>
				</Modal>
			) }
		</div>
	);
}

/**
 * @return {JSX.Element} App.
 */
export default function App() {
	const view = useSelect( ( select ) => select( STORE_NAME ).getView(), [] );

	useEffect( () => {
		loadMenus();
		loadIcons();
	}, [] );

	return (
		<div className="smm-admin">
			{ view === 'list' ? <MenuList /> : <MenuEditor /> }
		</div>
	);
}
