/**
 * Default schema values mirrored from PHP Schema class.
 */

import { SCHEMA_VERSION } from './constants';

/**
 * @return {Object} Default top-level settings.
 */
export function getDefaultSettings() {
	return {
		panelWidth: 'navigation',
		openingMode: 'click',
		closeOnOutsideClick: true,
		closeOnEscape: true,
		mobileMode: 'accordion',
		layoutPreset: '1',
		appearance: {
			density: 'default',
			radius: 'inherit',
			panelBackground: '',
			panelText: '',
			panelBorder: '',
		},
	};
}

/**
 * @return {Object} Complete default schema.
 */
export function getDefaultSchema() {
	return {
		version: SCHEMA_VERSION,
		settings: getDefaultSettings(),
		columns: [],
	};
}

/**
 * @param {string} type Column type slug.
 * @return {Object} Default column settings for the type.
 */
export function getColumnDefaults( type ) {
	switch ( type ) {
		case 'image_cta':
			return {
				imageId: 0,
				imageUrl: '',
				imageAlt: '',
				imageAspectRatio: 'landscape',
				eyebrow: '',
				heading: '',
				description: '',
				ctaLabel: '',
				url: '',
				opensInNewTab: false,
				layout: 'image_above',
				cardClickable: false,
			};
		case 'icon_links':
			return {
				heading: '',
				description: '',
				displayStyle: 'descriptive',
				iconPosition: 'left',
				items: [],
			};
		case 'link_list':
			return {
				heading: '',
				description: '',
				displayStyle: 'simple',
				items: [],
			};
		default:
			return {};
	}
}
