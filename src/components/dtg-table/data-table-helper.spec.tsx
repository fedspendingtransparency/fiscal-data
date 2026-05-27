import React from 'react';
import { render } from '@testing-library/react';
import {
  columnsConstructorData,
  getColumnFilter,
  rightAlign,
  columnHeaderFilterActive,
  columnHeaderFilterApplied,
  columnBodyFilterActive,
  columnBodyFilterApplied,
  getSortedColumnsData,
  constructDateHeader,
  constructDefaultColumnsFromTableData,
  getInvisibleColumns,
} from './data-table-helper';

const buildRawData = dataTypes => ({ meta: { dataTypes }, data: [] });
const buildColumn = (property, type, tableName = 'tbl', customFormatConfig = []) =>
  columnsConstructorData(buildRawData({ [property]: type }), [], tableName, [{ property, name: property }], customFormatConfig)[0];
const renderJSX = jsx => render(jsx);

describe('columnsConstructorData', () => {
  it('returns [] when meta or columnConfig is missing', () => {
    expect(columnsConstructorData({}, [], 'tbl', [{ property: 'a', name: 'A' }], [])).toEqual([]);
    expect(columnsConstructorData({ meta: { dataTypes: { a: 'STRING' } } }, [], 'tbl', undefined, [])).toEqual([]);
  });

  it('filters out hideColumns', () => {
    const cols = columnsConstructorData(
      buildRawData({ a: 'STRING', b: 'STRING' }),
      ['b'],
      'tbl',
      [
        { property: 'a', name: 'A' },
        { property: 'b', name: 'B' },
      ],
      []
    );
    expect(cols.map(c => c.accessorKey)).toEqual(['a']);
  });

  it('handles cusip as a basic-sortable column and unknown types as default', () => {
    expect(buildColumn('cusip', 'STRING')).toMatchObject({ accessorKey: 'cusip', sortingFn: 'basic' });
    expect(buildColumn('x', 'YEAR')).toEqual({ accessorKey: 'x', header: 'x' });
  });

  it('formats DATE columns with default and custom formats', () => {
    expect(buildColumn('d', 'DATE').cell({ getValue: () => '2024-01-15' })).toBe('1/15/2024');
    expect(buildColumn('d', 'DATE', 'tbl', [{ type: 'DATE', fields: ['d'], dateFormat: 'YYYY-MM-DD' }]).cell({ getValue: () => '2024-01-15' })).toBe(
      '2024-01-15'
    );
  });

  it('handles NUMBER columns across all formatting branches', () => {
    expect(buildColumn('n', 'NUMBER').cell({ getValue: () => '1500' })).toBe('1,500');
    expect(buildColumn('n', 'NUMBER', 'tbl', [{ type: 'NUMBER', fields: ['n'], decimalPlaces: 2 }]).cell({ getValue: () => '1234.5' })).toBe(
      '1,234.50'
    );
    const noFmt = buildColumn('n', 'NUMBER', 'tbl', [{ type: 'NUMBER', fields: ['n'], noFormatting: true }]).cell;
    expect(noFmt({ getValue: () => '7' })).toBe('7');
    expect(noFmt({ getValue: () => '' })).toBe('');
    const spread = buildColumn('spread', 'NUMBER', 'FRN Daily Indexes').cell;
    expect(spread({ getValue: () => '1.234567' })).toBe('1.235');
    expect(spread({ getValue: () => '' })).toBe('');
    expect(buildColumn('daily_factor', 'NUMBER', 'Demand Deposit Rate').cell({ getValue: () => '0.000123' })).toBe(0.000123);
    const accessor = buildColumn('n', 'NUMBER').accessorFn;
    expect(accessor({ n: 'null' })).toBe('');
    expect(accessor({ n: '5' })).toBe('5');
  });

  it('formats PERCENTAGE, SMALL_FRACTION, CURRENCY, and CURRENCYx columns', () => {
    const pct = buildColumn('p', 'PERCENTAGE').cell;
    expect(pct({ getValue: () => undefined })).toBe('');
    expect(pct({ getValue: () => '5' })).toBe('5%');

    expect(buildColumn('f', 'SMALL_FRACTION').cell({ getValue: () => '0.00067898' })).toBe('0.00067898');

    const currency = buildColumn('c', 'CURRENCY').cell;
    expect(currency({ getValue: () => '*' })).toBe('*');
    expect(currency({ getValue: () => '(*)' })).toBe('*');
    expect(currency({ getValue: () => '1234.56' })).toBe('$1,234.56');

    const c3 = buildColumn('c', 'CURRENCY3').cell;
    expect(c3({ getValue: () => '*' })).toBe('*');
    expect(c3({ getValue: () => '1234.5678' })).toBe('$1,234.568');
    expect(c3({ getValue: () => '-12.5' })).toBe('-$12.500');
  });
});

describe('publishedReports link rendering (via STRING cell)', () => {
  const cell = (tableName, property) => buildColumn(property, 'STRING', tableName).cell;
  const linkCases = [
    ['Treasury Securities Auctions Data', 'pdf_filenm_announcemt', 'auctions-query/announcements'],
    ['Treasury Securities Auctions Data', 'xml_filenm_announcemt', 'auctions-query/announcements'],
    ['Treasury Securities Auctions Data', 'pdf_filenm_comp_results', 'auctions-query/results'],
    ['Treasury Securities Auctions Data', 'xml_filenm_comp_results', 'auctions-query/results'],
    ['Treasury Securities Auctions Data', 'pdf_filenm_noncomp_results', 'auctions-query/ncr'],
    ['Treasury Securities Auctions Data', 'pdf_filenm_spec_announcemt', 'auctions-query/spec-ann'],
    ['Reference CPI Numbers and Daily Index Ratios Summary Table', 'pdf_link', 'tips-cpi'],
    ['Reference CPI Numbers and Daily Index Ratios Summary Table', 'xml_link', 'tips-cpi'],
    ['Buybacks Operations', 'results_pdf', 'buybacks/result'],
    ['Buybacks Operations', 'results_xml', 'buybacks/result'],
    ['Buybacks Operations', 'final_ann_pdf', 'buybacks/announcement'],
    ['Buybacks Operations', 'final_ann_xml', 'buybacks/announcement'],
    ['Buybacks Operations', 'preliminary_ann_xml', 'buybacks/preliminary'],
    ['Buybacks Operations', 'preliminary_ann_pdf', 'buybacks/preliminary'],
    ['Buybacks Operations', 'special_ann_pdf', 'buybacks/special-announcement'],
  ];

  it('renders links for every mapped property across all 3 published-report tables', () => {
    linkCases.forEach(([tableName, property, subdir]) => {
      const { container } = renderJSX(cell(tableName, property)({ getValue: () => 'fileA.pdf' }));
      const link = container.querySelector('a');
      expect(link?.getAttribute('href')).toContain(`/static-data/published-reports/${subdir}/`);
      expect(link?.getAttribute('href')).toContain('fileA.pdf');
    });
  });

  it('returns the value unchanged for unmapped switch/branch cases on each table', () => {
    expect(cell('Treasury Securities Auctions Data', 'unmapped')({ getValue: () => 'val' })).toBe('val');
    expect(cell('Reference CPI Numbers and Daily Index Ratios Summary Table', 'unmapped')({ getValue: () => 'val' })).toBe('val');
    expect(cell('Buybacks Operations', 'unmapped')({ getValue: () => 'val' })).toBe('val');
  });

  it('renders multiple anchors for a comma-separated list of files', () => {
    const { container } = renderJSX(cell('Treasury Securities Auctions Data', 'pdf_filenm_announcemt')({ getValue: () => 'a.pdf, b.pdf' }));
    expect(container.querySelectorAll('a')).toHaveLength(2);
  });

  it.each([
    ['ofbbr12345p1.pdf', 'Summary'],
    ['BBSR_12345_1.pdf', 'Summary'],
    ['ofbbr12345p2.pdf', 'Detail'],
    ['BBDR_12345_1.pdf', 'Detail'],
  ])('overrides Buybacks alias for %s to %s', (filename, expected) => {
    const { getByText } = renderJSX(cell('Buybacks Operations', 'results_pdf')({ getValue: () => filename }));
    expect(getByText(expected)).toBeInTheDocument();
  });
});

describe('getColumnFilter', () => {
  const header = { column: { id: 'col-1' } };
  it('returns DateRangeFilter for DATE and TextFilter otherwise', () => {
    const dateFilter = getColumnFilter(header, 'DATE', false, [], jest.fn(), false, false, false);
    const textFilter = getColumnFilter(header, 'STRING', false, [], jest.fn(), false, false, false);
    expect(dateFilter.type.name || dateFilter.type.displayName).toMatch(/DateRangeFilter/);
    expect(textFilter.type.name || textFilter.type.displayName).toMatch(/TextFilter/);
  });
});

describe('rightAlign', () => {
  it('returns true for right-aligned types and falsy otherwise', () => {
    ['DATE', 'CURRENCY', 'NUMBER', 'PERCENTAGE', 'CURRENCY3'].forEach(t => expect(rightAlign(t)).toBe(true));
    expect(rightAlign('STRING')).toBe(false);
    expect(rightAlign(undefined)).toBeFalsy();
  });
});

describe('column header / body filter helpers', () => {
  it.each([
    ['columnHeaderFilterActive', columnHeaderFilterActive, ['foo-x'], 'foo'],
    ['columnHeaderFilterApplied', columnHeaderFilterApplied, ['foo'], 'foo'],
    ['columnBodyFilterActive', columnBodyFilterActive, ['foo-x'], 'foobar'],
    ['columnBodyFilterApplied', columnBodyFilterApplied, ['foo'], 'foobar'],
  ])('%s returns true on match, undefined on miss and on falsy filters', (_name, fn, match, columnName) => {
    expect(fn(match, columnName)).toBe(true);
    expect(fn(['nope'], columnName)).toBeUndefined();
    expect(fn(undefined, columnName)).toBeUndefined();
  });
});

describe('getSortedColumnsData', () => {
  it('returns undefined when there are no visible columns', () => {
    expect(getSortedColumnsData(undefined, [], [])).toBeUndefined();
    expect(getSortedColumnsData({ getVisibleFlatColumns: () => undefined }, [], [])).toBeUndefined();
  });

  it('maps columns with sorted/filter/row data and respects hideColumns for allColumnsSelected', () => {
    const filteredRows = [{ original: { a: 1, b: 'x' } }, { original: { a: 2, b: 'y' } }];
    const table = {
      getVisibleFlatColumns: () => [
        { id: 'a', getIsSorted: () => 'asc', getFilterValue: () => 'fv-a' },
        { id: 'b', getIsSorted: () => false, getFilterValue: () => undefined },
      ],
      getFilteredRowModel: () => ({ flatRows: filteredRows }),
      getIsAllColumnsVisible: () => true,
    };
    expect(getSortedColumnsData(table, undefined, { a: 'NUMBER', b: 'DATE' })).toEqual([
      { id: 'a', sorted: 'asc', filterValue: 'fv-a', downloadFilter: true, rowValues: [1, 2], allColumnsSelected: true },
      { id: 'b', sorted: false, filterValue: undefined, downloadFilter: false, rowValues: ['x', 'y'], allColumnsSelected: true },
    ]);
    expect(getSortedColumnsData(table, ['a'])[0].allColumnsSelected).toBe(false);
  });
});

describe('miscellaneous helpers', () => {
  it('constructDateHeader returns a labeled "As of" string with a 2-digit-formatted date', () => {
    const result = constructDateHeader('My Dataset', { to: '2024-03-15' });
    expect(result[0]).toBe('My Dataset.');
    expect(result[1]).toMatch(/^As of \d{2}\/\d{2}\/\d{4}$/);
  });

  it('constructDefaultColumnsFromTableData partitions columns and alphabetizes additionals', () => {
    const table = { getAllLeafColumns: () => [{ id: 'beta' }, { id: 'alpha' }, { id: 'record_date' }, { id: 'gamma' }] };
    const { defaults, additional } = constructDefaultColumnsFromTableData(table, ['record_date']);
    expect(defaults.map(c => c.id)).toEqual(['record_date']);
    expect(additional.map(c => c.id)).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('getInvisibleColumns flags non-default columns and returns {} when defaults are empty/undefined', () => {
    expect(getInvisibleColumns([], [{ accessorKey: 'a' }])).toEqual({});
    expect(getInvisibleColumns(undefined, [{ accessorKey: 'a' }])).toEqual({});
    expect(getInvisibleColumns(['a'], [{ accessorKey: 'a' }, { accessorKey: 'b' }, { accessorKey: 'c' }])).toEqual({ b: false, c: false });
  });
});
