/**
 * Appearance color + density controls for a mega menu configuration.
 */

import { __ } from '@wordpress/i18n';
import {
	Button,
	ColorIndicator,
	ColorPalette,
	Dropdown,
	SelectControl,
} from '@wordpress/components';

/**
 * @return {Array<{name:string,slug:string,color:string,value?:string}>} Theme palette.
 */
function getPalette() {
	return Array.isArray( window.smmAdmin?.colorPalette )
		? window.smmAdmin.colorPalette
		: [];
}

/**
 * Resolves a stored color (hex or CSS var) to a swatch color for ColorIndicator.
 *
 * @param {string} value Stored color value.
 * @return {string} Display color.
 */
function resolveSwatch( value ) {
	if ( ! value ) {
		return '';
	}
	const match = getPalette().find(
		( entry ) => entry.value === value || entry.color === value
	);
	return match?.color || value;
}

/**
 * @param {Object}   props
 * @param {string}   props.label
 * @param {string}   props.value
 * @param {Function} props.onChange
 * @return {JSX.Element} Color field.
 */
function AppearanceColorField( { label, value, onChange } ) {
	const palette = getPalette();
	const colors = palette.map( ( entry ) => ( {
		name: entry.name,
		color: entry.value || entry.color,
		slug: entry.slug,
	} ) );

	return (
		<div className="smm-appearance-color">
			<span className="smm-field-label">{ label }</span>
			<Dropdown
				className="smm-appearance-color__dropdown"
				contentClassName="smm-appearance-color__popover"
				popoverProps={ { placement: 'bottom-start' } }
				renderToggle={ ( { isOpen, onToggle } ) => (
					<Button
						variant="secondary"
						onClick={ onToggle }
						aria-expanded={ isOpen }
						className="smm-appearance-color__toggle"
					>
						<ColorIndicator colorValue={ resolveSwatch( value ) } />
						<span>
							{ value
								? __( 'Custom', 'structured-mega-menu' )
								: __(
										'Theme default',
										'structured-mega-menu'
								  ) }
						</span>
					</Button>
				) }
				renderContent={ () => (
					<div className="smm-appearance-color__panel">
						<ColorPalette
							colors={ colors }
							value={ value || undefined }
							onChange={ ( next ) => onChange( next || '' ) }
							clearable
							enableAlpha
						/>
						{ value ? (
							<Button
								variant="link"
								onClick={ () => onChange( '' ) }
							>
								{ __(
									'Reset to theme default',
									'structured-mega-menu'
								) }
							</Button>
						) : null }
					</div>
				) }
			/>
		</div>
	);
}

/**
 * @param {Object}   props
 * @param {Object}   props.appearance
 * @param {Function} props.onChange
 * @return {JSX.Element} Appearance settings.
 */
export default function AppearanceSettings( { appearance, onChange } ) {
	const value = {
		density: 'default',
		radius: 'inherit',
		panelBackground: '',
		panelText: '',
		panelBorder: '',
		...( appearance || {} ),
	};

	const update = ( patch ) => onChange( { ...value, ...patch } );

	return (
		<div className="smm-appearance-settings smm-settings-grid__full">
			<h3 className="smm-appearance-settings__title">
				{ __( 'Appearance', 'structured-mega-menu' ) }
			</h3>
			<p className="smm-appearance-settings__help">
				{ __(
					'Optional look-and-feel controls map to public CSS variables. Leave colors empty to inherit from the theme.',
					'structured-mega-menu'
				) }
			</p>
			<div className="smm-settings-grid">
				<SelectControl
					label={ __( 'Density', 'structured-mega-menu' ) }
					value={ value.density }
					options={ [
						{
							label: __( 'Compact', 'structured-mega-menu' ),
							value: 'compact',
						},
						{
							label: __( 'Default', 'structured-mega-menu' ),
							value: 'default',
						},
						{
							label: __( 'Roomy', 'structured-mega-menu' ),
							value: 'roomy',
						},
					] }
					onChange={ ( density ) => update( { density } ) }
					help={ __(
						'Controls panel padding and column gap.',
						'structured-mega-menu'
					) }
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
				<SelectControl
					label={ __( 'Corner radius', 'structured-mega-menu' ) }
					value={ value.radius }
					options={ [
						{
							label: __(
								'Theme default',
								'structured-mega-menu'
							),
							value: 'inherit',
						},
						{
							label: __( 'None', 'structured-mega-menu' ),
							value: 'none',
						},
						{
							label: __( 'Small', 'structured-mega-menu' ),
							value: 'small',
						},
						{
							label: __( 'Medium', 'structured-mega-menu' ),
							value: 'medium',
						},
						{
							label: __( 'Large', 'structured-mega-menu' ),
							value: 'large',
						},
					] }
					onChange={ ( radius ) => update( { radius } ) }
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
				<div className="smm-settings-grid__full smm-appearance-colors">
					<AppearanceColorField
						label={ __(
							'Panel background',
							'structured-mega-menu'
						) }
						value={ value.panelBackground }
						onChange={ ( panelBackground ) =>
							update( { panelBackground } )
						}
					/>
					<AppearanceColorField
						label={ __( 'Panel text', 'structured-mega-menu' ) }
						value={ value.panelText }
						onChange={ ( panelText ) => update( { panelText } ) }
					/>
					<AppearanceColorField
						label={ __( 'Panel border', 'structured-mega-menu' ) }
						value={ value.panelBorder }
						onChange={ ( panelBorder ) =>
							update( { panelBorder } )
						}
					/>
				</div>
			</div>
		</div>
	);
}
