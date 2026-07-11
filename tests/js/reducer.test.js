/**
 * Admin editor reducer unit tests.
 */

import { COLUMN_TYPES } from '../../src/shared/constants';
import { editorReducer, getDefaultEditorState } from '../../src/admin/reducer';
import { createColumn, createItem } from '../../src/admin/utilities/columns';

describe( 'editorReducer', () => {
	const withColumn = ( type = COLUMN_TYPES.LINK_LIST ) => {
		const state = getDefaultEditorState();
		const column = createColumn( type );
		return {
			state: {
				...state,
				schema: {
					...state.schema,
					columns: [ column ],
					settings: {
						...state.schema.settings,
						layoutPreset: '1',
					},
				},
			},
			column,
		};
	};

	it( 'adds columns until the limit', () => {
		let state = getDefaultEditorState();

		for ( let i = 0; i < 4; i++ ) {
			state = editorReducer( state, {
				type: 'ADD_COLUMN',
				columnType: COLUMN_TYPES.LINK_LIST,
			} );
		}

		expect( state.schema.columns ).toHaveLength( 4 );
		expect( state.saveStatus ).toBe( 'unsaved' );
		expect( state.schema.settings.layoutPreset ).toBe( '1-1-1-1' );

		const blocked = editorReducer( state, {
			type: 'ADD_COLUMN',
			columnType: COLUMN_TYPES.IMAGE_CTA,
		} );
		expect( blocked.schema.columns ).toHaveLength( 4 );
	} );

	it( 'removes a column and supports undo', () => {
		const { state, column } = withColumn();
		const removed = editorReducer( state, {
			type: 'REMOVE_COLUMN',
			columnId: column.id,
		} );

		expect( removed.schema.columns ).toHaveLength( 0 );
		expect( removed.undoNotice.kind ).toBe( 'column' );

		const restored = editorReducer( removed, { type: 'UNDO_REMOVE' } );
		expect( restored.schema.columns ).toHaveLength( 1 );
		expect( restored.schema.columns[ 0 ].id ).toBe( column.id );
		expect( restored.undoNotice ).toBeNull();
	} );

	it( 'duplicates columns', () => {
		const { state, column } = withColumn();
		const next = editorReducer( state, {
			type: 'DUPLICATE_COLUMN',
			columnId: column.id,
		} );

		expect( next.schema.columns ).toHaveLength( 2 );
		expect( next.schema.columns[ 1 ].id ).not.toBe( column.id );
		expect( next.schema.settings.layoutPreset ).toBe( '1-1' );
	} );

	it( 'removes and undoes repeater items', () => {
		const { state, column } = withColumn( COLUMN_TYPES.ICON_LINKS );
		const item = createItem( COLUMN_TYPES.ICON_LINKS );
		item.label = 'Docs';
		const withItem = {
			...state,
			schema: {
				...state.schema,
				columns: [
					{
						...column,
						settings: {
							...column.settings,
							items: [ item ],
						},
					},
				],
			},
		};

		const removed = editorReducer( withItem, {
			type: 'REMOVE_ITEM',
			columnId: column.id,
			itemId: item.id,
		} );
		expect( removed.schema.columns[ 0 ].settings.items ).toHaveLength( 0 );
		expect( removed.undoNotice.kind ).toBe( 'item' );

		const restored = editorReducer( removed, { type: 'UNDO_REMOVE' } );
		expect( restored.schema.columns[ 0 ].settings.items ).toHaveLength( 1 );
		expect( restored.schema.columns[ 0 ].settings.items[ 0 ].label ).toBe(
			'Docs'
		);
	} );

	it( 'duplicates repeater items', () => {
		const { state, column } = withColumn( COLUMN_TYPES.LINK_LIST );
		const item = createItem( COLUMN_TYPES.LINK_LIST );
		const withItem = {
			...state,
			schema: {
				...state.schema,
				columns: [
					{
						...column,
						settings: {
							...column.settings,
							items: [ item ],
						},
					},
				],
			},
		};

		const next = editorReducer( withItem, {
			type: 'DUPLICATE_ITEM',
			columnId: column.id,
			itemId: item.id,
		} );

		expect( next.schema.columns[ 0 ].settings.items ).toHaveLength( 2 );
		expect( next.schema.columns[ 0 ].settings.items[ 1 ].id ).not.toBe(
			item.id
		);
	} );

	it( 'changes column type with confirmation for destructive switches', () => {
		const { state, column } = withColumn( COLUMN_TYPES.IMAGE_CTA );
		const modal = editorReducer( state, {
			type: 'CHANGE_COLUMN_TYPE',
			columnId: column.id,
			nextType: COLUMN_TYPES.LINK_LIST,
			confirmed: false,
		} );
		expect( modal.typeChangeModal ).toEqual( {
			columnId: column.id,
			nextType: COLUMN_TYPES.LINK_LIST,
		} );

		const confirmed = editorReducer( state, {
			type: 'CHANGE_COLUMN_TYPE',
			columnId: column.id,
			nextType: COLUMN_TYPES.LINK_LIST,
			confirmed: true,
		} );
		expect( confirmed.schema.columns[ 0 ].type ).toBe(
			COLUMN_TYPES.LINK_LIST
		);
		expect( confirmed.typeChangeModal ).toBeNull();
	} );

	it( 'marks save status unsaved when title changes', () => {
		const state = getDefaultEditorState();
		const next = editorReducer( state, {
			type: 'UPDATE_TITLE',
			title: 'Main menu',
		} );
		expect( next.title ).toBe( 'Main menu' );
		expect( next.saveStatus ).toBe( 'unsaved' );
	} );
} );
