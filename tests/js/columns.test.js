/**
 * Column helper unit tests.
 */

import { COLUMN_TYPES, MAX_COLUMNS } from '../../src/shared/constants';
import {
	canAddColumn,
	createColumn,
	createItem,
	duplicateColumn,
	duplicateItem,
	moveIndex,
	switchRepeaterType,
	syncLayoutPreset,
} from '../../src/admin/utilities/columns';

describe( 'columns utilities', () => {
	it( 'creates columns with stable unique ids', () => {
		const a = createColumn( COLUMN_TYPES.IMAGE_CTA );
		const b = createColumn( COLUMN_TYPES.LINK_LIST );

		expect( a.id ).toMatch( /^smm-col-/ );
		expect( b.id ).toMatch( /^smm-col-/ );
		expect( a.id ).not.toBe( b.id );
		expect( a.type ).toBe( COLUMN_TYPES.IMAGE_CTA );
	} );

	it( 'enforces the four-column limit', () => {
		const columns = Array.from( { length: MAX_COLUMNS }, () =>
			createColumn( COLUMN_TYPES.LINK_LIST )
		);
		expect( canAddColumn( columns ) ).toBe( false );
		expect( canAddColumn( columns.slice( 0, 3 ) ) ).toBe( true );
	} );

	it( 'duplicates columns with new ids for nested items', () => {
		const column = createColumn( COLUMN_TYPES.ICON_LINKS );
		column.settings.items = [
			createItem( COLUMN_TYPES.ICON_LINKS ),
			createItem( COLUMN_TYPES.ICON_LINKS ),
		];
		const copy = duplicateColumn( column );

		expect( copy.id ).not.toBe( column.id );
		expect( copy.settings.items[ 0 ].id ).not.toBe(
			column.settings.items[ 0 ].id
		);
		expect( copy.settings.items ).toHaveLength( 2 );
	} );

	it( 'duplicates items with a new id', () => {
		const item = createItem( COLUMN_TYPES.LINK_LIST );
		item.label = 'Docs';
		const copy = duplicateItem( item );

		expect( copy.id ).not.toBe( item.id );
		expect( copy.label ).toBe( 'Docs' );
	} );

	it( 'moves indexes safely', () => {
		expect( moveIndex( [ 'a', 'b', 'c' ], 0, 2 ) ).toEqual( [
			'b',
			'c',
			'a',
		] );
		expect( moveIndex( [ 'a', 'b' ], 0, 0 ) ).toEqual( [ 'a', 'b' ] );
		expect( moveIndex( [ 'a', 'b' ], -1, 1 ) ).toEqual( [ 'a', 'b' ] );
	} );

	it( 'syncs layout presets when column count changes', () => {
		const schema = {
			settings: { layoutPreset: '1-1-1-1' },
			columns: [
				createColumn( COLUMN_TYPES.LINK_LIST ),
				createColumn( COLUMN_TYPES.LINK_LIST ),
			],
		};
		const next = syncLayoutPreset( schema );
		expect( next.settings.layoutPreset ).toBe( '1-1' );
	} );

	it( 'switches repeater types while preserving labels', () => {
		const column = createColumn( COLUMN_TYPES.ICON_LINKS );
		column.settings.items = [
			{
				...createItem( COLUMN_TYPES.ICON_LINKS ),
				label: 'Guide',
				url: '/guide',
			},
		];

		const asList = switchRepeaterType( column, COLUMN_TYPES.LINK_LIST );
		expect( asList.type ).toBe( COLUMN_TYPES.LINK_LIST );
		expect( asList.settings.items[ 0 ].label ).toBe( 'Guide' );
		expect( asList.settings.items[ 0 ].icon ).toBeUndefined();

		const back = switchRepeaterType( asList, COLUMN_TYPES.ICON_LINKS );
		expect( back.type ).toBe( COLUMN_TYPES.ICON_LINKS );
		expect( back.settings.items[ 0 ].icon ).toBeTruthy();
	} );
} );
