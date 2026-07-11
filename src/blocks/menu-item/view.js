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
 * Theme content width in pixels.
 *
 * @return {number} Content width.
 */
function getContentWidthPx() {
	const root = getComputedStyle( document.documentElement );
	const content =
		root.getPropertyValue( '--wp--style--global--content-size' ).trim() ||
		'40rem';
	const wide = root
		.getPropertyValue( '--wp--style--global--wide-size' )
		.trim();

	const contentPx = cssLengthToPx( content ) || 640;
	const widePx = cssLengthToPx( wide );
	/* Prefer content size; fall back to wide only if content is missing. */
	return contentPx || widePx || Math.min( window.innerWidth - 32, 640 );
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
 * Positions content/viewport panels below the trigger and on-screen.
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
	const gap = 0;
	const top = Math.max( 0, Math.round( rect.bottom + gap ) );
	const viewportPadding = 16;

	panel.style.setProperty( '--smm-panel-top', `${ top }px` );
	panel.style.top = `${ top }px`;
	panel.style.transform = 'none';

	if ( mode === 'viewport' ) {
		panel.style.left = '0';
		panel.style.right = '0';
		panel.style.width = '100%';
		panel.style.maxWidth = '100%';
		return;
	}

	/* content */
	const contentWidth = getContentWidthPx();
	const width = Math.min(
		contentWidth,
		window.innerWidth - viewportPadding * 2
	);
	const left = Math.max(
		viewportPadding,
		Math.round( ( window.innerWidth - width ) / 2 )
	);

	panel.style.left = `${ left }px`;
	panel.style.right = 'auto';
	panel.style.width = `${ Math.round( width ) }px`;
	panel.style.maxWidth = `calc(100vw - ${ viewportPadding * 2 }px)`;
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
		 * Closes when focus leaves the mega menu item (trigger + panel).
		 * Important for fixed viewport/content panels where the panel is
		 * visually detached from the nav item.
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

				/*
				 * Viewport/content: also close when focus landed on <body>
				 * after an outside click (focus may not move to a control).
				 */
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

		handleMouseLeave() {
			const context = getContext();
			if ( ! context?.isOpen ) {
				return;
			}

			const isHoverMode = context.openingMode === 'hover';
			const isFixedPanel =
				context.panelWidth === 'viewport' ||
				context.panelWidth === 'content';

			/* Click + navigation width: stay open until outside click / blur. */
			if ( ! isHoverMode && ! isFixedPanel ) {
				return;
			}

			if ( isHoverMode && ! canHover() ) {
				return;
			}

			window.setTimeout( () => {
				const { ref } = getElement();
				if ( ! context.isOpen || ! ref ) {
					return;
				}

				if ( ref.matches( ':hover' ) ) {
					return;
				}

				const panel = ref.querySelector( '.smm-menu-item__panel' );
				if ( panel?.matches?.( ':hover' ) ) {
					return;
				}

				actions.close();
			}, 150 );
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
