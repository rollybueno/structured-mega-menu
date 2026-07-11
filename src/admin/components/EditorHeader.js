/**
 * Editor header with title and actions.
 */

import { __ } from '@wordpress/i18n';
import { Button, TextControl } from '@wordpress/components';
import SaveStatus from './SaveStatus';

/**
 * @param {Object}   props
 * @param {string}   props.title
 * @param {string}   props.saveStatus
 * @param {boolean}  props.isSaving
 * @param {Function} props.onTitleChange
 * @param {Function} props.onSave
 * @param {Function} props.onBack
 * @param {Function} props.onDelete
 * @return {JSX.Element} Header.
 */
export default function EditorHeader( {
	title,
	saveStatus,
	isSaving,
	onTitleChange,
	onSave,
	onBack,
	onDelete,
} ) {
	return (
		<div className="smm-editor-header">
			<div className="smm-editor-header__leading">
				<Button variant="tertiary" onClick={ onBack }>
					{ __( '← All mega menus', 'structured-mega-menu' ) }
				</Button>
				<TextControl
					label={ __( 'Menu title', 'structured-mega-menu' ) }
					hideLabelFromVision
					value={ title }
					onChange={ onTitleChange }
					placeholder={ __(
						'Mega menu title',
						'structured-mega-menu'
					) }
					className="smm-editor-header__title"
				/>
			</div>
			<div className="smm-editor-header__actions">
				<SaveStatus status={ saveStatus } />
				<Button
					variant="primary"
					onClick={ onSave }
					disabled={ isSaving || saveStatus === 'saving' }
					isBusy={ saveStatus === 'saving' }
				>
					{ __( 'Save', 'structured-mega-menu' ) }
				</Button>
				<Button variant="secondary" isDestructive onClick={ onDelete }>
					{ __( 'Delete', 'structured-mega-menu' ) }
				</Button>
			</div>
		</div>
	);
}
