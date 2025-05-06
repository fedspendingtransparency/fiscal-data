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

  it('formats FRN Daily Indexes Daily Index col data correctly', () => {
    const dailyIndexData = { daily_index: 0.111111111 };
    const col = [{ name: 'daily_index', order: 1, property: 'daily_index', width: 12 }];
    const { getByRole } = render(<DtgTableRow columns={col} data={dailyIndexData} tableName="FRN Daily Indexes" />);
    expect(within(getByRole('cell')).getByText('0.111111111')).toBeInTheDocument();
  });

  it('formats FRN Daily Indexes Daily Int Accrual Rate data correctly', () => {
    const dailyIntAccrualRateData = { daily_int_accrual_rate: 0.222222222 };
    const cols = [{ name: 'daily_int_accrual_rate', order: 2, property: 'daily_int_accrual_rate', width: 12 }];
    const { getByRole } = render(<DtgTableRow columns={cols} data={dailyIntAccrualRateData} />);
    expect(within(getByRole('cell')).getByText('0.222222222')).toBeInTheDocument();
  });

  it('formats FRN Daily Indexes Spread data correctly', () => {
    const spreadData = { spread: 0.012 };
    const cols = [{ name: 'spread', order: 3, property: 'spread', width: 12 }];
    const { getByRole } = render(<DtgTableRow columns={cols} data={spreadData} />);
    expect(within(getByRole('cell')).getByText('0.012')).toBeInTheDocument();
  });

  it('formats custom NUMBER correctly', () => {
    const customFormatter = [{ type: 'NUMBER', fields: ['spread'], decimalPlaces: 6 }];
    const formattedData = formatCellValue(0.012345, 'NUMBER', null, 'spread', customFormatter);
    expect(formattedData).toBe('0.012345');
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
