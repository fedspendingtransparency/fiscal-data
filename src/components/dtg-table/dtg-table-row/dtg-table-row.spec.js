import React from 'react';
import { render, within } from '@testing-library/react';
import DtgTableRow, { formatCellValue } from './dtg-table-row';

describe('DtgTableRow', () => {
  const data1 = { row1: 123 };
  const data2 = { row1: null };
  const data3 = { row1: undefined };
  const data4 = { row1: 'null' };
  const data5 = { row1: '*' };
  const data6 = { row1: 0.00067898 };
  const data7 = { row1: '3-3/8%' };
  const data8 = { row1: '-123' };
  const data9 = { row1: '2025-01-01' };

  const columns = [{ name: 'row1', order: 1, property: 'row1', width: 12 }];

  const metaData = { name: 'Description (Long)', definition: 'This is a [link](https://fiscaldata.treasury.gov)' };
  const metaDataColumns = [
    { name: 'Name', order: 1, property: 'name', width: 12 },
    { name: 'Definition', order: 2, property: 'definition', width: 12 },
  ];

  it('displays the data it is given in a td within the tr', () => {
    const { getByRole } = render(<DtgTableRow columns={columns} data={data1} />);
    expect(within(getByRole('cell')).getByText(123)).toBeInTheDocument();
  });

  it('changes the td to display empty string if given a null value', () => {
    const { getByRole } = render(<DtgTableRow columns={columns} data={data2} />);
    expect(within(getByRole('cell')).getByText('')).toBeInTheDocument();
  });

  it('changes the td to display empty string if given an undefined value', () => {
    const { getByRole } = render(<DtgTableRow columns={columns} data={data3} />);
    expect(within(getByRole('cell')).getByText('')).toBeInTheDocument();
  });

  it('changes the td to display empty string if given a value of null string', () => {
    const { getByRole } = render(<DtgTableRow columns={columns} data={data4} />);
    expect(within(getByRole('cell')).getByText('')).toBeInTheDocument();
  });

  it('changes the td to display empty string if given a value of string asterisk', () => {
    const { getByRole } = render(<DtgTableRow columns={columns} data={data5} />);
    expect(within(getByRole('cell')).getByText('')).toBeInTheDocument();
  });

  it('formats PERCENTAGE types correctly', () => {
    const cols = columns;
    cols[0].type = 'PERCENTAGE';
    const { getByRole } = render(<DtgTableRow columns={cols} data={data1} />);
    expect(within(getByRole('cell')).getByText(`${data1.row1}%`)).toBeInTheDocument();
  });

  it('formats SMALL_FRACTION types correctly', () => {
    const cols = columns;
    cols[0].type = 'SMALL_FRACTION';
    const { getByRole } = render(<DtgTableRow columns={cols} data={data6} />);
    expect(within(getByRole('cell')).getByText(`${data6.row1}`)).toBeInTheDocument();
  });

  it('formats STRING types that are percentage values correctly', () => {
    const cols = columns;
    cols[0].type = 'STRING';
    const formattedValue = data7.row1.replace(/-/g, '\u2011');
    const { getByRole } = render(<DtgTableRow columns={cols} data={data7} />);
    expect(within(getByRole('cell')).getByText(formattedValue)).toBeInTheDocument();
  });

  it('formats CURRENCY types correctly', () => {
    const cols = columns;
    cols[0].type = 'CURRENCY';
    const { getByRole } = render(<DtgTableRow columns={cols} data={data1} />);
    expect(within(getByRole('cell')).getByText('$123.00')).toBeInTheDocument();
  });
  it('formats CURRENCY3 types correctly', () => {
    const cols = columns;
    cols[0].type = 'CURRENCY3';
    const { getByRole } = render(<DtgTableRow columns={cols} data={data1} />);
    expect(within(getByRole('cell')).getByText('$123.000')).toBeInTheDocument();
  });
  it('formats negative CURRENCY3 types correctly', () => {
    const cols = columns;
    cols[0].type = 'CURRENCY3';
    const { getByRole } = render(<DtgTableRow columns={cols} data={data8} />);
    expect(within(getByRole('cell')).getByText('-$123.000')).toBeInTheDocument();
  });

  it('formats NUMBER types correctly', () => {
    const formattedData = formatCellValue('0.0123', 'NUMBER', null, 'spread');
    expect(formattedData).toBe('0.012');
  });

  it('applies no formatting to NUMBER types when noFormatting is true', () => {
    const customFormatter = [{ type: 'NUMBER', fields: ['daily_int_accrual_rate'], noFormatting: true }];
    const formattedData = formatCellValue('0.222222222', 'NUMBER', null, 'daily_int_accrual_rate', customFormatter);
    expect(formattedData).toBe('0.222222222');
  });

  it('formats custom NUMBER correctly', () => {
    const customFormatter = [{ type: 'NUMBER', fields: ['spread'], decimalPlaces: 6 }];
    const formattedData = formatCellValue(0.01234532, 'NUMBER', null, 'spread', customFormatter);
    expect(formattedData).toBe('0.012345');
  });

  it('formats custom NUMBER correctly with currency formatting', () => {
    const customFormatter = [{ type: 'NUMBER', fields: ['spread'], currency: true }];
    const formattedData = formatCellValue(0.01234532, 'NUMBER', null, 'spread', customFormatter);
    expect(formattedData).toBe('$0.01');
  });

  it('formats DATE types correctly', () => {
    const cols = columns;
    cols[0].type = 'DATE';
    const { getByRole } = render(<DtgTableRow columns={cols} data={data9} />);
    expect(within(getByRole('cell')).getByText('1/1/2025')).toBeInTheDocument();
  });

  it('formats custom STRING dateList correctly', () => {
    const customFormatter = [{ type: 'STRING', fields: ['spread'], breakChar: ',', customType: 'dateList' }];
    const formattedData = formatCellValue('2024-1-1, 2023-2-2', 'STRING', null, 'spread', customFormatter);
    expect(formattedData).toBe('1/1/2024, 2/2/2023');
  });

  it('formats row as markdown if the row is the long description', () => {
    const { getByText } = render(<DtgTableRow columns={metaDataColumns} data={metaData} />);
    expect(getByText('Description (Long)')).toBeInTheDocument();
    expect(getByText('link', { exact: false })).toBeInTheDocument();
  });
});
