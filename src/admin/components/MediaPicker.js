/**
 * Media Library image picker using wp.media.
 */

import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

/**
 * Opens the media frame and returns a promise for the selection.
 *
 * @return {Promise<Object|null>} Selected media.
 */
function openMediaFrame() {
	return new Promise( ( resolve ) => {
		if ( ! window.wp?.media ) {
			resolve( null );
			return;
		}

		const frame = window.wp.media( {
			title: __( 'Select image', 'structured-mega-menu' ),
			button: { text: __( 'Use image', 'structured-mega-menu' ) },
			multiple: false,
			library: { type: 'image' },
		} );

		frame.on( 'select', () => {
			const attachment = frame
				.state()
				.get( 'selection' )
				.first()
				.toJSON();
			resolve( attachment );
		} );

		frame.open();
	} );
}

/**
 * @param {Object}   props
 * @param {number}   props.imageId
 * @param {string}   props.imageUrl
 * @param {Function} props.onChange
 * @return {JSX.Element} Media picker.
 */
export default function MediaPicker( { imageId, imageUrl, onChange } ) {
	const selectImage = async () => {
		const media = await openMediaFrame();
		if ( ! media ) {
			return;
		}
		onChange( {
			imageId: media.id || 0,
			imageUrl: media.url || '',
			imageAlt: media.alt || '',
		} );
	};

	const clearImage = () =>
		onChange( {
			imageId: 0,
			imageUrl: '',
			imageAlt: '',
		} );

	return (
		<div className="smm-media-picker">
			<span className="smm-field-label">
				{ __( 'Image', 'structured-mega-menu' ) }
			</span>
			<div className="smm-media-picker__card">
				{ imageUrl ? (
					<div className="smm-media-picker__preview">
						<img src={ imageUrl } alt="" />
					</div>
				) : (
					<div className="smm-media-picker__empty">
						{ __( 'No image selected', 'structured-mega-menu' ) }
					</div>
				) }
				<div className="smm-field-actions">
					<Button variant="secondary" onClick={ selectImage }>
						{ imageId
							? __( 'Replace image', 'structured-mega-menu' )
							: __( 'Select image', 'structured-mega-menu' ) }
					</Button>
					{ !! imageId && (
						<Button variant="tertiary" onClick={ clearImage }>
							{ __( 'Remove', 'structured-mega-menu' ) }
						</Button>
					) }
				</div>
			</div>
		</div>
	);
}
