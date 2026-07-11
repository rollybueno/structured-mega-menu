/**
 * Link destination control.
 *
 * One URL field for paste/type, plus an optional content browser.
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
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
 * @param {string}   props.label
 * @param {Function} props.onChange
 * @return {JSX.Element} Link picker.
 */
export default function LinkPicker( {
	url,
	opensInNewTab,
	labelId,
	error,
	label,
	onChange,
} ) {
	const [ search, setSearch ] = useState( '' );
	const [ results, setResults ] = useState( [] );
	const [ isSearching, setIsSearching ] = useState( false );
	const [ isBrowseOpen, setIsBrowseOpen ] = useState( false );
	const [ selectedTitle, setSelectedTitle ] = useState( '' );
	const browseAnchorRef = useRef( null );

	useEffect( () => {
		if ( ! isBrowseOpen || search.trim().length < 2 ) {
			setResults( [] );
			setIsSearching( false );
			return;
		}

		let cancelled = false;
		const timer = setTimeout( async () => {
			setIsSearching( true );
			try {
				const data = await searchLinks( search.trim() );
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
		}, 280 );

		return () => {
			cancelled = true;
			clearTimeout( timer );
		};
	}, [ search, isBrowseOpen ] );

	const closeBrowse = () => {
		setIsBrowseOpen( false );
		setSearch( '' );
		setResults( [] );
	};

	const applyResult = ( result ) => {
		onChange( {
			url: result.url,
			opensInNewTab,
		} );
		setSelectedTitle( result.title || '' );
		closeBrowse();
	};

	const clearLink = () => {
		onChange( { url: '', opensInNewTab } );
		setSelectedTitle( '' );
	};

	return (
		<div className="smm-link-control" id={ labelId }>
			<span className="smm-field-label">
				{ label || __( 'Link URL', 'structured-mega-menu' ) }
			</span>

			{ selectedTitle && url ? (
				<div className="smm-link-control__selected" role="status">
					<span className="smm-link-control__selected-title">
						{ selectedTitle }
					</span>
					<span className="smm-link-control__selected-url">
						{ url }
					</span>
				</div>
			) : null }

			<div className="smm-link-control__row">
				<div className="smm-link-control__input">
					<TextControl
						label={
							label || __( 'Link URL', 'structured-mega-menu' )
						}
						hideLabelFromVision
						value={ url || '' }
						onChange={ ( value ) => {
							setSelectedTitle( '' );
							onChange( { url: value, opensInNewTab } );
						} }
						placeholder={ __(
							'https://example.com/page',
							'structured-mega-menu'
						) }
						help={ error }
						className={ error ? 'smm-field-error' : undefined }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</div>
				<div className="smm-field-actions smm-link-control__actions">
					<div
						className="smm-link-control__browse"
						ref={ browseAnchorRef }
					>
						<Button
							variant="secondary"
							aria-expanded={ isBrowseOpen }
							onClick={ () =>
								setIsBrowseOpen( ( open ) => ! open )
							}
						>
							{ __( 'Browse', 'structured-mega-menu' ) }
						</Button>
						{ isBrowseOpen && (
							<Popover
								anchor={ browseAnchorRef.current }
								onClose={ closeBrowse }
								placement="bottom-end"
								focusOnMount="firstElement"
							>
								<div className="smm-link-control__popover">
									<p className="smm-link-control__popover-title">
										{ __(
											'Link to existing content',
											'structured-mega-menu'
										) }
									</p>
									<TextControl
										label={ __(
											'Search pages and posts',
											'structured-mega-menu'
										) }
										value={ search }
										onChange={ setSearch }
										placeholder={ __(
											'Type at least 2 characters…',
											'structured-mega-menu'
										) }
										__nextHasNoMarginBottom
										__next40pxDefaultSize
									/>
									{ isSearching ? (
										<div className="smm-link-control__loading">
											<Spinner />
										</div>
									) : null }
									{ ! isSearching &&
									search.trim().length >= 2 &&
									! results.length ? (
										<p className="smm-link-control__empty">
											{ __(
												'No matching content found.',
												'structured-mega-menu'
											) }
										</p>
									) : null }
									{ results.length > 0 ? (
										<ul className="smm-link-control__results">
											{ results.map( ( result ) => (
												<li
													key={ `${ result.kind }-${ result.id }` }
												>
													<button
														type="button"
														className="smm-link-control__result"
														onClick={ () =>
															applyResult(
																result
															)
														}
													>
														<span className="smm-link-control__result-title">
															{ result.title }
														</span>
														<span className="smm-link-control__result-meta">
															{ result.type }
															{ result.url
																? ` · ${ result.url }`
																: '' }
														</span>
													</button>
												</li>
											) ) }
										</ul>
									) : null }
									<p className="smm-link-control__hint">
										{ __(
											'Or paste any URL in the field beside Browse.',
											'structured-mega-menu'
										) }
									</p>
								</div>
							</Popover>
						) }
					</div>
					{ url ? (
						<Button variant="tertiary" onClick={ clearLink }>
							{ __( 'Clear', 'structured-mega-menu' ) }
						</Button>
					) : null }
				</div>
			</div>

			<ToggleControl
				label={ __( 'Open in new tab', 'structured-mega-menu' ) }
				checked={ !! opensInNewTab }
				onChange={ ( value ) =>
					onChange( { url, opensInNewTab: value } )
				}
				__nextHasNoMarginBottom
			/>
		</div>
	);
}
