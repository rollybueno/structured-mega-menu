/**
 * Generic field editor driven by a column type schema from PHP.
 *
 * Used for custom column types that do not ship a dedicated React form.
 */

import { __ } from '@wordpress/i18n';
import {
	TextControl,
	TextareaControl,
	ToggleControl,
} from '@wordpress/components';
import LinkPicker from '../LinkPicker';

/**
 * @param {string} type Column type slug.
 * @return {Object|null} Client definition from PHP.
 */
function getTypeDefinition( type ) {
	return window.smmAdmin?.columnTypes?.[ type ] || null;
}

/**
 * @param {Object}   props
 * @param {Object}   props.settings
 * @param {string}   props.columnType
 * @param {Function} props.onChange
 * @return {JSX.Element} Generic fields.
 */
export default function GenericColumnFields( {
	settings,
	columnType,
	onChange,
} ) {
	const definition = getTypeDefinition( columnType );
	const schema = definition?.schema || {};
	const entries = Object.entries( schema );

	if ( ! entries.length ) {
		return (
			<p className="smm-generic-fields__empty">
				{ __(
					'This custom column type has no editable schema fields.',
					'structured-mega-menu'
				) }
			</p>
		);
	}

	const update = ( key, value ) =>
		onChange( {
			...settings,
			[ key ]: value,
		} );

	return (
		<div className="smm-fields smm-fields--generic">
			<div className="smm-field-section">
				<h3 className="smm-field-section__title">
					{ definition?.label ||
						__( 'Column settings', 'structured-mega-menu' ) }
				</h3>
				<div className="smm-fields-grid">
					{ entries.map( ( [ key, field ] ) => {
						const type = field?.type || 'string';
						const label = field?.label || key;
						const value = settings?.[ key ];

						/* LinkPicker already exposes opensInNewTab. */
						if (
							key === 'opensInNewTab' &&
							( schema.url || schema.ctaUrl )
						) {
							return null;
						}

						if ( 'boolean' === type ) {
							return (
								<div
									key={ key }
									className="smm-fields-grid__full"
								>
									<ToggleControl
										label={ label }
										checked={ !! value }
										onChange={ ( next ) =>
											update( key, next )
										}
										__nextHasNoMarginBottom
									/>
								</div>
							);
						}

						if ( 'url' === type || key === 'url' ) {
							return (
								<div
									key={ key }
									className="smm-fields-grid__full"
								>
									<LinkPicker
										label={ label }
										url={ value || '' }
										opensInNewTab={
											!! settings?.opensInNewTab
										}
										onChange={ ( next ) =>
											onChange( {
												...settings,
												[ key ]: next.url,
												opensInNewTab:
													typeof next.opensInNewTab ===
													'boolean'
														? next.opensInNewTab
														: !! settings?.opensInNewTab,
											} )
										}
									/>
								</div>
							);
						}

						if ( 'textarea' === type || key === 'description' ) {
							return (
								<div
									key={ key }
									className="smm-fields-grid__full"
								>
									<TextareaControl
										label={ label }
										value={ value || '' }
										onChange={ ( next ) =>
											update( key, next )
										}
										__nextHasNoMarginBottom
									/>
								</div>
							);
						}

						return (
							<TextControl
								key={ key }
								label={ label }
								value={ value || '' }
								onChange={ ( next ) => update( key, next ) }
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
						);
					} ) }
				</div>
			</div>
		</div>
	);
}
