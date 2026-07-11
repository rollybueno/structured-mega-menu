/**
 * Validation summary with focusable links to fields.
 */

import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';

/**
 * @param {Object} props
 * @param {Array}  props.errors
 * @return {JSX.Element|null} Summary.
 */
export default function ValidationSummary( { errors } ) {
	const ref = useRef( null );

	useEffect( () => {
		if ( errors?.length && ref.current ) {
			ref.current.focus();
		}
	}, [ errors ] );

	if ( ! errors?.length ) {
		return null;
	}

	return (
		<div
			className="smm-validation-summary"
			tabIndex={ -1 }
			ref={ ref }
			role="alert"
		>
			<strong>
				{ __(
					'Please fix the following issues before saving:',
					'structured-mega-menu'
				) }
			</strong>
			<ul>
				{ errors.map( ( error ) => (
					<li key={ `${ error.path }-${ error.code }` }>
						<a href={ `#smm-field-${ error.path }` }>
							{ error.message }
						</a>
					</li>
				) ) }
			</ul>
		</div>
	);
}
