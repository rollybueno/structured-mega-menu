/**
 * Shared schema and validation unit tests.
 */

import { validateSchema } from '../../src/shared/validation';
import {
	countEnabledColumns,
	isValidLayoutForCount,
	layoutToGridTemplate,
	normalizeSchemaShell,
} from '../../src/shared/schema';
import { createColumn, createItem } from '../../src/admin/utilities/columns';
import { COLUMN_TYPES } from '../../src/shared/constants';

describe( 'shared schema helpers', () => {
	it( 'counts enabled columns', () => {
		const columns = [
			{ enabled: true },
			{ enabled: false },
			{ enabled: true },
		];
		expect( countEnabledColumns( columns ) ).toBe( 2 );
		expect( countEnabledColumns( null ) ).toBe( 0 );
	} );

	it( 'validates layout presets', () => {
		expect( isValidLayoutForCount( '1-2', 2 ) ).toBe( true );
		expect( isValidLayoutForCount( '1-1-1', 2 ) ).toBe( false );
	} );

	it( 'builds grid templates', () => {
		expect( layoutToGridTemplate( '1-2' ) ).toBe(
			'minmax(0, 1fr) minmax(0, 2fr)'
		);
	} );

	it( 'normalizes schema shells', () => {
		const normalized = normalizeSchemaShell( {
			settings: { openingMode: 'hover' },
			columns: [ createColumn( COLUMN_TYPES.IMAGE_CTA ) ],
		} );
		expect( normalized.version ).toBe( 1 );
		expect( normalized.settings.openingMode ).toBe( 'hover' );
		expect( normalized.columns ).toHaveLength( 1 );
	} );
} );

describe( 'validateSchema', () => {
	it( 'flags too many columns', () => {
		const columns = Array.from( { length: 5 }, () =>
			createColumn( COLUMN_TYPES.LINK_LIST )
		);
		const errors = validateSchema( {
			settings: { layoutPreset: '1' },
			columns,
		} );
		expect(
			errors.some( ( error ) => error.code === 'too_many_columns' )
		).toBe( true );
	} );

	it( 'flags invalid layouts', () => {
		const errors = validateSchema( {
			settings: { layoutPreset: '1-1-1-1' },
			columns: [
				createColumn( COLUMN_TYPES.LINK_LIST ),
				createColumn( COLUMN_TYPES.LINK_LIST ),
			],
		} );
		expect(
			errors.some( ( error ) => error.code === 'invalid_layout' )
		).toBe( true );
	} );

	it( 'requires labels and urls on enabled items', () => {
		const column = createColumn( COLUMN_TYPES.LINK_LIST );
		column.settings.items = [
			{ ...createItem( COLUMN_TYPES.LINK_LIST ), label: '', url: '' },
		];
		const errors = validateSchema( {
			settings: { layoutPreset: '1' },
			columns: [ column ],
		} );
		const codes = errors.map( ( error ) => error.code );
		expect( codes ).toContain( 'required_label' );
		expect( codes ).toContain( 'required_url' );
	} );
} );
