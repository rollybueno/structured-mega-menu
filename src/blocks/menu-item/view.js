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

		handleFocusOut( event ) {
			const context = getContext();
			if ( ! context?.isOpen ) {
				return;
			}

			const { ref } = getElement();
			const next = event.relatedTarget;
			const doc = ref?.ownerDocument || document;

			if ( ref && next && ref.contains( next ) ) {
				return;
			}

			doc.defaultView.requestAnimationFrame( () => {
				const active = ref?.ownerDocument?.activeElement;
				if ( ref && active && ref.contains( active ) ) {
					return;
				}
				if ( context.isOpen ) {
					actions.close();
				}
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
			if (
				! context ||
				context.openingMode !== 'hover' ||
				! context.isOpen
			) {
				return;
			}

			if ( ! canHover() ) {
				return;
			}

			window.setTimeout( () => {
				const { ref } = getElement();
				if ( ref?.matches?.( ':hover' ) ) {
					return;
				}
				if ( context.isOpen ) {
					actions.close();
				}
			}, 150 );
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
			}
		},
	},
} );
