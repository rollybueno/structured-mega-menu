/**
 * Image and CTA column fields.
 */

import { __ } from '@wordpress/i18n';
import {
	TextControl,
	TextareaControl,
	SelectControl,
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
			<div className="smm-field-section">
				<h3 className="smm-field-section__title">
					{ __( 'Image', 'structured-mega-menu' ) }
				</h3>
				<MediaPicker
					imageId={ settings.imageId }
					imageUrl={ settings.imageUrl }
					onChange={ ( media ) => update( media ) }
				/>
				<div className="smm-fields-grid">
					<TextControl
						label={ __(
							'Alternative text',
							'structured-mega-menu'
						) }
						value={ settings.imageAlt || '' }
						onChange={ ( imageAlt ) => update( { imageAlt } ) }
						help={ __(
							'Leave empty for decorative images.',
							'structured-mega-menu'
						) }
						id={ `smm-field-${ path( 'imageAlt' ) }` }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label={ __( 'Aspect ratio', 'structured-mega-menu' ) }
						value={ settings.imageAspectRatio || 'landscape' }
						options={ [
							{
								label: __( 'Original', 'structured-mega-menu' ),
								value: 'original',
							},
							{
								label: __(
									'Landscape',
									'structured-mega-menu'
								),
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
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</div>
			</div>

			<div className="smm-field-section">
				<h3 className="smm-field-section__title">
					{ __( 'Copy', 'structured-mega-menu' ) }
				</h3>
				<div className="smm-fields-grid">
					<TextControl
						label={ __( 'Eyebrow', 'structured-mega-menu' ) }
						value={ settings.eyebrow || '' }
						onChange={ ( eyebrow ) => update( { eyebrow } ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label={ __( 'Heading', 'structured-mega-menu' ) }
						value={ settings.heading || '' }
						onChange={ ( heading ) => update( { heading } ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<div className="smm-fields-grid__full">
						<TextareaControl
							label={ __(
								'Description',
								'structured-mega-menu'
							) }
							value={ settings.description || '' }
							onChange={ ( description ) =>
								update( { description } )
							}
							__nextHasNoMarginBottom
						/>
					</div>
				</div>
			</div>

			<div className="smm-field-section">
				<h3 className="smm-field-section__title">
					{ __( 'Call to action', 'structured-mega-menu' ) }
				</h3>
				<div className="smm-button-fields">
					<TextControl
						label={ __( 'Button label', 'structured-mega-menu' ) }
						value={ settings.ctaLabel || '' }
						onChange={ ( ctaLabel ) => update( { ctaLabel } ) }
						placeholder={ __(
							'Learn more',
							'structured-mega-menu'
						) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<LinkPicker
						url={ settings.url }
						opensInNewTab={ settings.opensInNewTab }
						label={ __( 'Button link', 'structured-mega-menu' ) }
						onChange={ ( link ) => update( link ) }
					/>
				</div>
				<div className="smm-fields-grid">
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
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</div>
			</div>
		</div>
	);
}
