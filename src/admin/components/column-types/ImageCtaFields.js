/**
 * Image and CTA column fields.
 */

import { __ } from '@wordpress/i18n';
import {
	TextControl,
	TextareaControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import MediaPicker from '../MediaPicker';
import LinkPicker from '../LinkPicker';

/**
 * @param {Object}   props
 * @param {Object}   props.settings
 * @param {string}   props.columnId
 * @param {Function} props.onChange
 * @return {JSX.Element} Fields.
 */
export default function ImageCtaFields( { settings, columnId, onChange } ) {
	const update = ( patch ) => onChange( { ...settings, ...patch } );
	const path = ( field ) => `columns.${ columnId }.settings.${ field }`;

	return (
		<div className="smm-fields smm-fields--image-cta">
			<MediaPicker
				imageId={ settings.imageId }
				imageUrl={ settings.imageUrl }
				onChange={ ( media ) => update( media ) }
			/>
			<TextControl
				label={ __( 'Image alternative text', 'structured-mega-menu' ) }
				value={ settings.imageAlt || '' }
				onChange={ ( imageAlt ) => update( { imageAlt } ) }
				help={ __(
					'Leave empty for decorative images.',
					'structured-mega-menu'
				) }
				id={ `smm-field-${ path( 'imageAlt' ) }` }
			/>
			<SelectControl
				label={ __( 'Image aspect ratio', 'structured-mega-menu' ) }
				value={ settings.imageAspectRatio || 'landscape' }
				options={ [
					{
						label: __( 'Original', 'structured-mega-menu' ),
						value: 'original',
					},
					{
						label: __( 'Landscape', 'structured-mega-menu' ),
						value: 'landscape',
					},
					{
						label: __( 'Square', 'structured-mega-menu' ),
						value: 'square',
					},
					{
						label: __( 'Portrait', 'structured-mega-menu' ),
						value: 'portrait',
					},
				] }
				onChange={ ( imageAspectRatio ) =>
					update( { imageAspectRatio } )
				}
			/>
			<TextControl
				label={ __( 'Eyebrow', 'structured-mega-menu' ) }
				value={ settings.eyebrow || '' }
				onChange={ ( eyebrow ) => update( { eyebrow } ) }
			/>
			<TextControl
				label={ __( 'Heading', 'structured-mega-menu' ) }
				value={ settings.heading || '' }
				onChange={ ( heading ) => update( { heading } ) }
			/>
			<TextareaControl
				label={ __( 'Description', 'structured-mega-menu' ) }
				value={ settings.description || '' }
				onChange={ ( description ) => update( { description } ) }
			/>
			<TextControl
				label={ __( 'CTA label', 'structured-mega-menu' ) }
				value={ settings.ctaLabel || '' }
				onChange={ ( ctaLabel ) => update( { ctaLabel } ) }
			/>
			<LinkPicker
				url={ settings.url }
				opensInNewTab={ settings.opensInNewTab }
				onChange={ ( link ) => update( link ) }
			/>
			<SelectControl
				label={ __( 'Layout', 'structured-mega-menu' ) }
				value={ settings.layout || 'image_above' }
				options={ [
					{
						label: __(
							'Image above content',
							'structured-mega-menu'
						),
						value: 'image_above',
					},
					{
						label: __(
							'Image beside content',
							'structured-mega-menu'
						),
						value: 'image_beside',
					},
				] }
				onChange={ ( layout ) => update( { layout } ) }
			/>
			<ToggleControl
				label={ __(
					'Make entire card clickable',
					'structured-mega-menu'
				) }
				checked={ settings.cardClickable !== false }
				onChange={ ( cardClickable ) => update( { cardClickable } ) }
				help={ __(
					'When enabled, the CTA label is shown as text inside a single link.',
					'structured-mega-menu'
				) }
			/>
		</div>
	);
}
