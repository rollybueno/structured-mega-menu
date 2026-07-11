/**
 * Interactivity API store for Structured Mega Menu.
 */

import { getContext, getElement, store } from '@wordpress/interactivity';

/**
 * Whether fine pointer hover is available.
 *
 * @return {boolean} True when hover interactions are appropriate.
 */
function canHover() {
	return window.matchMedia( '(hover: hover) and (pointer: fine)' ).matches;
}

/**
 * Parses a CSS length (px/rem) to pixels.
 *
 * @param {string} value CSS length.
 * @return {number} Pixels, or 0 when unparseable.
 */
function cssLengthToPx( value ) {
	const raw = String( value || '' ).trim();
	if ( ! raw ) {
		return 0;
	}

	const px = raw.match( /^([\d.]+)px$/i );
	if ( px ) {
		return parseFloat( px[ 1 ] );
	}

	const rem = raw.match( /^([\d.]+)rem$/i );
	if ( rem ) {
		const root = parseFloat(
			getComputedStyle( document.documentElement ).fontSize
		);
		return parseFloat( rem[ 1 ] ) * ( root || 16 );
	}

	const num = parseFloat( raw );
	return Number.isFinite( num ) ? num : 0;
}

/**
 * Theme layout width in pixels from a CSS custom property.
 *
 * @param {string} property CSS variable name.
 * @param {string} fallback Fallback length when unset.
 * @return {number} Width in pixels.
 */
function getThemeSizePx( property, fallback ) {
	const root = getComputedStyle( document.documentElement );
	const raw = root.getPropertyValue( property ).trim() || fallback;
	return cssLengthToPx( raw ) || cssLengthToPx( fallback ) || 640;
}

/**
 * Theme content width in pixels.
 *
 * @return {number} Content width.
 */
function getContentWidthPx() {
	return getThemeSizePx( '--wp--style--global--content-size', '40rem' );
}

/**
 * Theme wide width in pixels.
 *
 * @return {number} Wide width.
 */
function getWideWidthPx() {
	return getThemeSizePx( '--wp--style--global--wide-size', '80rem' );
}

/**
 * Theme full width in pixels (theme.json layout.fullSize when present).
 *
 * @return {number} Full width.
 */
function getFullWidthPx() {
	const root = getComputedStyle( document.documentElement );
	const fromCore = root.getPropertyValue( '--wp--style--global--full-size' ).trim();
	const fromPlugin = root.getPropertyValue( '--smm-theme-full-size' ).trim();
	return (
		cssLengthToPx( fromCore ) ||
		cssLengthToPx( fromPlugin ) ||
		getThemeSizePx( '--wp--style--global--wide-size', '100rem' )
	);
}

/**
 * Whether this item is inside an open Navigation overlay.
 *
 * @param {Element|null} ref Menu item element.
 * @return {boolean} True in overlay mode.
 */
function isInOpenOverlay( ref ) {
	return !! ref?.closest?.(
		'.wp-block-navigation__responsive-container.is-menu-open'
	);
}

/**
 * Clears fixed positioning overrides from the panel.
 *
 * @param {HTMLElement|null} panel Panel element.
 */
function clearPanelPosition( panel ) {
	if ( ! panel ) {
		return;
	}

	panel.style.removeProperty( '--smm-panel-top' );
	panel.style.top = '';
	panel.style.left = '';
	panel.style.right = '';
	panel.style.width = '';
	panel.style.maxWidth = '';
	panel.style.transform = '';
}

/**
 * Centers a fixed panel at the given width below the trigger.
 *
 * @param {HTMLElement} panel Panel element.
 * @param {number}      targetWidth Desired width in pixels.
 * @param {number}      top         Top offset in pixels.
 */
function positionCenteredPanel( panel, targetWidth, top ) {
	const viewportPadding = 16;
	const width = Math.min(
		targetWidth,
		window.innerWidth - viewportPadding * 2
	);
	const left = Math.max(
		viewportPadding,
		Math.round( ( window.innerWidth - width ) / 2 )
	);

	panel.style.setProperty( '--smm-panel-top', `${ top }px` );
	panel.style.top = `${ top }px`;
	panel.style.transform = 'none';
	panel.style.left = `${ left }px`;
	panel.style.right = 'auto';
	panel.style.width = `${ Math.round( width ) }px`;
	panel.style.maxWidth = `calc(100vw - ${ viewportPadding * 2 }px)`;
}

/**
 * Positions content/wide/full/viewport panels below the trigger and on-screen.
 *
 * @param {Element|null} ref Menu item element.
 * @param {object}       context Interactivity context.
 */
function applyPanelPosition( ref, context ) {
	const panel = ref?.querySelector?.( '.smm-menu-item__panel' );
	if ( ! panel || ! context?.isOpen ) {
		clearPanelPosition( panel );
		return;
	}

	const mode = context.panelWidth || 'navigation';
	if (
		mode === 'navigation' ||
		isInOpenOverlay( ref ) ||
		window.matchMedia( '(max-width: 600px)' ).matches
	) {
		clearPanelPosition( panel );
		return;
	}

	const trigger =
		ref.querySelector( '.smm-menu-item__toggle, .smm-menu-item__link' ) ||
		ref;
	const rect = trigger.getBoundingClientRect();
	/* No gap for fixed panels — avoids hover/focus holes under the trigger. */
	const top = Math.max( 0, Math.round( rect.bottom ) );

	if ( mode === 'viewport' ) {
		panel.style.setProperty( '--smm-panel-top', `${ top }px` );
		panel.style.top = `${ top }px`;
		panel.style.transform = 'none';
		panel.style.left = '0';
		panel.style.right = '0';
		panel.style.width = '100%';
		panel.style.maxWidth = '100%';
		return;
	}

	if ( mode === 'wide' ) {
		positionCenteredPanel( panel, getWideWidthPx(), top );
		return;
	}

	if ( mode === 'full' ) {
		positionCenteredPanel( panel, getFullWidthPx(), top );
		return;
	}

	/* content */
	positionCenteredPanel( panel, getContentWidthPx(), top );
}

const { state, actions } = store( 'structured-mega-menu', {
	state: {
		/** @type {string|null} */
		openPanelId: null,
		get isOpen() {
			const context = getContext();
			return !! context?.isOpen;
		},
	},
	actions: {
		toggle() {
			const context = getContext();
			if ( ! context ) {
				return;
			}

			if ( context.isOpen ) {
				actions.close();
			} else {
				actions.open();
			}
		},

		open() {
			const context = getContext();
			if ( ! context ) {
				return;
			}

			state.openPanelId = context.panelId;
			context.isOpen = true;

			const { ref } = getElement();
			window.requestAnimationFrame( () => {
				applyPanelPosition( ref, context );
			} );
		},

		close() {
			const context = getContext();
			if ( ! context ) {
				return;
			}

			if ( state.openPanelId === context.panelId ) {
				state.openPanelId = null;
			}
			context.isOpen = false;

			const { ref } = getElement();
			const panel = ref?.querySelector?.( '.smm-menu-item__panel' );
			clearPanelPosition( panel );
		},

		/**
		 * Link trigger: first click opens when closed; later clicks navigate.
		 *
		 * @param {Event} event Click event.
		 */
		handleLinkClick( event ) {
			const context = getContext();
			if ( ! context ) {
				return;
			}

			if ( ! context.isOpen ) {
				event.preventDefault();
				actions.open();
			}
		},

		handleKeydown( event ) {
			const context = getContext();
			if ( ! context?.closeOnEscape ) {
				return;
			}

			if ( event.key !== 'Escape' || ! context.isOpen ) {
				return;
			}

			event.preventDefault();
			actions.close();

			const { ref } = getElement();
			const toggle = ref?.querySelector?.( '.smm-menu-item__toggle' );
			toggle?.focus?.();
		},

		handleOutsideClick( event ) {
			const context = getContext();
			if ( ! context?.closeOnOutsideClick || ! context.isOpen ) {
				return;
			}

			const { ref } = getElement();
			if ( ! ref || ref.contains( event.target ) ) {
				return;
			}

			actions.close();
		},

		/**
		 * Close when the pointer moves onto anything outside this menu item.
		 * More reliable than mouseleave alone with position:fixed panels.
		 *
		 * @param {MouseEvent} event Mouse over event.
		 */
		handleOutsideHover( event ) {
			const context = getContext();
			if ( ! context?.isOpen || ! canHover() ) {
				return;
			}

			const { ref } = getElement();
			const target = event.target;
			if ( ! ref || ! target || ref.contains( target ) ) {
				return;
			}

			actions.close();
		},

		/**
		 * Closes when focus leaves the mega menu item (trigger + panel).
		 *
		 * @param {FocusEvent} event Focus out event.
		 */
		handleFocusOut( event ) {
			const context = getContext();
			if ( ! context?.isOpen ) {
				return;
			}

			const { ref } = getElement();
			if ( ! ref ) {
				return;
			}

			const next = event.relatedTarget;
			if ( next && ref.contains( next ) ) {
				return;
			}

			const doc = ref.ownerDocument || document;
			doc.defaultView.requestAnimationFrame( () => {
				if ( ! context.isOpen ) {
					return;
				}

				const active = ref.ownerDocument?.activeElement;
				if ( active && ref.contains( active ) ) {
					return;
				}

				actions.close();
			} );
		},

		handleMouseEnter() {
			const context = getContext();
			if ( ! context || context.openingMode !== 'hover' ) {
				return;
			}

			if ( canHover() ) {
				actions.open();
			}
		},

		/**
		 * Backup close when mouseleave fires on the menu item wrapper.
		 *
		 * @param {MouseEvent} event Mouse leave event.
		 */
		handleMouseLeave( event ) {
			const context = getContext();
			if ( ! context?.isOpen || ! canHover() ) {
				return;
			}

			const { ref } = getElement();
			const next = event.relatedTarget;
			if ( next && ref?.contains( next ) ) {
				return;
			}

			window.setTimeout( () => {
				if ( ! context.isOpen || ! ref ) {
					return;
				}

				if ( ref.matches( ':hover' ) ) {
					return;
				}

				actions.close();
			}, 80 );
		},

		handleReposition() {
			const context = getContext();
			if ( ! context?.isOpen ) {
				return;
			}

			const { ref } = getElement();
			applyPanelPosition( ref, context );
		},
	},
	callbacks: {
		/**
		 * Closes this instance when another panel becomes the open one.
		 */
		syncOpenState() {
			const context = getContext();
			if ( ! context?.isOpen ) {
				return;
			}

			if ( state.openPanelId && state.openPanelId !== context.panelId ) {
				context.isOpen = false;
				const { ref } = getElement();
				const panel = ref?.querySelector?.( '.smm-menu-item__panel' );
				clearPanelPosition( panel );
			}
		},

		/**
		 * Keeps content/viewport panels aligned when open state changes.
		 */
		positionPanel() {
			const context = getContext();
			const { ref } = getElement();
			applyPanelPosition( ref, context );
		},
	},
} );
