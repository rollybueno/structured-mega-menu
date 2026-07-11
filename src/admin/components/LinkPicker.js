/**
 * Link destination picker.
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
	Button,
	TextControl,
	ToggleControl,
	Spinner,
	Popover,
} from '@wordpress/components';
import { searchLinks } from '../api';

/**
 * @param {Object}   props
 * @param {string}   props.url
 * @param {boolean}  props.opensInNewTab
 * @param {string}   props.labelId
 * @param {string}   props.error
 * @param {Function} props.onChange
 * @return {JSX.Element} Link picker.
 */
export default function LinkPicker( {
	url,
	opensInNewTab,
	labelId,
	error,
	onChange,
} ) {
	const [ search, setSearch ] = useState( '' );
	const [ results, setResults ] = useState( [] );
	const [ isSearching, setIsSearching ] = useState( false );
	const [ isOpen, setIsOpen ] = useState( false );

	useEffect( () => {
		if ( ! isOpen || search.length < 2 ) {
			setResults( [] );
			return;
		}

		let cancelled = false;
		const timer = setTimeout( async () => {
			setIsSearching( true );
			try {
				const data = await searchLinks( search );
				if ( ! cancelled ) {
					setResults( Array.isArray( data ) ? data : [] );
				}
			} catch ( e ) {
				if ( ! cancelled ) {
					setResults( [] );
				}
			}
			if ( ! cancelled ) {
				setIsSearching( false );
			}
		}, 300 );

		return () => {
			cancelled = true;
			clearTimeout( timer );
		};
	}, [ search, isOpen ] );

	return (
		<div className="smm-link-picker" id={ labelId }>
			<div className="smm-link-picker__row">
				<TextControl
					label={ __( 'Destination', 'structured-mega-menu' ) }
					value={ url || '' }
					onChange={ ( value ) =>
						onChange( { url: value, opensInNewTab } )
					}
					onFocus={ () => setIsOpen( true ) }
					placeholder={ __(
						'Search or paste a URL',
						'structured-mega-menu'
					) }
					help={ error }
					className={ error ? 'smm-field-error' : undefined }
				/>
				<Button
					variant="secondary"
					onClick={ () => setIsOpen( ( value ) => ! value ) }
				>
					{ __( 'Search', 'structured-mega-menu' ) }
				</Button>
			</div>
			{ isOpen && (
				<Popover
					onClose={ () => setIsOpen( false ) }
					placement="bottom-start"
				>
					<div className="smm-link-picker__popover">
						<TextControl
							label={ __(
								'Search content',
								'structured-mega-menu'
							) }
							value={ search }
							onChange={ setSearch }
						/>
						{ isSearching && <Spinner /> }
						<ul className="smm-link-picker__results">
							{ results.map( ( result ) => (
								<li key={ `${ result.kind }-${ result.id }` }>
									<Button
										variant="link"
										onClick={ () => {
											onChange( {
												url: result.url,
												opensInNewTab,
											} );
											setIsOpen( false );
										} }
									>
										{ result.title }
										<span className="smm-link-picker__meta">
											{ result.type }
										</span>
									</Button>
								</li>
							) ) }
						</ul>
						<TextControl
							label={ __( 'Custom URL', 'structured-mega-menu' ) }
							value={ url || '' }
							onChange={ ( value ) =>
								onChange( { url: value, opensInNewTab } )
							}
						/>
					</div>
				</Popover>
			) }
			<ToggleControl
				label={ __( 'Open in new tab', 'structured-mega-menu' ) }
				checked={ !! opensInNewTab }
				onChange={ ( value ) =>
					onChange( { url, opensInNewTab: value } )
				}
			/>
		</div>
	);
}
