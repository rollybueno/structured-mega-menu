/**
 * In-admin developer documentation (HTML from PHP — no Markdown in the ZIP).
 */

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * @return {{intro:string,cssApi:string,hooks:string}} Docs payload.
 */
function getDocs() {
	return (
		window.smmAdmin?.developerDocs || {
			intro: '',
			cssApi: '',
			hooks: '',
		}
	);
}

/**
 * @param {Object} props
 * @param {string} props.html
 * @return {JSX.Element|null} HTML block.
 */
function DocsHtml( { html } ) {
	if ( ! html ) {
		return null;
	}

	return (
		<div
			className="smm-developer-docs__content"
			dangerouslySetInnerHTML={ { __html: html } }
		/>
	);
}

/**
 * @return {JSX.Element} Developer docs panel.
 */
export default function DeveloperDocs() {
	const docs = getDocs();
	const [ tab, setTab ] = useState( 'css' );

	return (
		<section className="smm-surface smm-developer-docs">
			<div className="smm-surface__header">
				<h2 className="smm-surface__title">
					{ __( 'For developers', 'structured-mega-menu' ) }
				</h2>
			</div>
			<div className="smm-surface__body">
				<DocsHtml html={ docs.intro } />
				<div
					className="smm-developer-docs__tabs"
					role="tablist"
					aria-label={ __(
						'Developer documentation',
						'structured-mega-menu'
					) }
				>
					<Button
						role="tab"
						aria-selected={ tab === 'css' }
						variant={ tab === 'css' ? 'primary' : 'secondary' }
						onClick={ () => setTab( 'css' ) }
					>
						{ __( 'CSS API', 'structured-mega-menu' ) }
					</Button>
					<Button
						role="tab"
						aria-selected={ tab === 'hooks' }
						variant={ tab === 'hooks' ? 'primary' : 'secondary' }
						onClick={ () => setTab( 'hooks' ) }
					>
						{ __( 'Hooks', 'structured-mega-menu' ) }
					</Button>
				</div>
				<div
					className="smm-developer-docs__panel"
					role="tabpanel"
					aria-label={
						tab === 'css'
							? __( 'CSS API', 'structured-mega-menu' )
							: __( 'Hooks', 'structured-mega-menu' )
					}
				>
					<DocsHtml
						html={ tab === 'css' ? docs.cssApi : docs.hooks }
					/>
				</div>
				<p className="smm-developer-docs__hint">
					{ __(
						'Tip: the same documentation is available from the Help tab on this screen.',
						'structured-mega-menu'
					) }
				</p>
			</div>
		</section>
	);
}
