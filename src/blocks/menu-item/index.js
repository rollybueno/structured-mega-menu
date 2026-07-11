/**
 * Mega Menu Item block registration.
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import metadata from './block.json';
import './editor.scss';
import './style.scss';

registerBlockType( metadata.name, {
	...metadata,
	title: __( 'Mega Menu Item', 'structured-mega-menu' ),
	description: __(
		'A Navigation item that opens a Structured Mega Menu configuration.',
		'structured-mega-menu'
	),
	edit: Edit,
	save,
} );
