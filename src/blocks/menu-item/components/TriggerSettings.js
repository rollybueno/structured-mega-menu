/**
 * Trigger-type settings for the mega menu item.
 */

import { __ } from '@wordpress/i18n';
import {
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

/**
 * @param {Object}   props
 * @param {string}   props.triggerType
 * @param {string}   props.url
 * @param {boolean}  props.opensInNewTab
 * @param {Function} props.onChange
 * @return {JSX.Element} Settings.
 */
export default function TriggerSettings( {
	triggerType,
	url,
	opensInNewTab,
	onChange,
} ) {
	return (
		<>
			<SelectControl
				label={ __( 'Trigger type', 'structured-mega-menu' ) }
				value={ triggerType || 'button' }
				options={ [
					{
						label: __( 'Button', 'structured-mega-menu' ),
						value: 'button',
					},
					{
						label: __( 'Link', 'structured-mega-menu' ),
						value: 'link',
					},
				] }
				onChange={ ( value ) => onChange( { triggerType: value } ) }
				help={
					triggerType === 'link'
						? __(
								'Link triggers open the panel on first activation and keep a real destination URL. A safer default is Button.',
								'structured-mega-menu'
						  )
						: __(
								'Button is the recommended accessible default. Optional destinations can live inside the panel.',
								'structured-mega-menu'
						  )
				}
			/>
			{ triggerType === 'link' && (
				<>
					<TextControl
						label={ __(
							'Destination URL',
							'structured-mega-menu'
						) }
						value={ url || '' }
						onChange={ ( value ) => onChange( { url: value } ) }
						placeholder="https://"
					/>
					<ToggleControl
						label={ __(
							'Open in new tab',
							'structured-mega-menu'
						) }
						checked={ !! opensInNewTab }
						onChange={ ( value ) =>
							onChange( { opensInNewTab: value } )
						}
					/>
				</>
			) }
		</>
	);
}
