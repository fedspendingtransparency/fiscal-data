import React from 'react';
import renderer from 'react-test-renderer';
import DtgTableRow from "./dtg-table-row";

describe('DtgTableRow', () => {
  const data1 = {row1: 123};
  const data2 = {row1: null};
  const data3 = {row1: undefined};
  const data4 = {row1: 'null'};
  const data5 = {row1: '*'};
  const data6 = {row1: 0.00067898};
  const data7 = {row1: '3-3/8%'};
  const data8 = {row1: '-123'};

  const columns = [
    {name: 'row1', order: 1, property: 'row1', width: 12},
  ];

  it('displays the data it is given in a td within the tr', () => {
    const component = renderer.create(
      <DtgTableRow columns={columns} data={data1} />);
    const instance = component.root;
    expect(instance.findByType('td').props.children).toBe(123);
  });
  it('changes the td to display empty string if given a null value', () => {
    const component = renderer.create(
      <DtgTableRow columns={columns} data={data2} />);
    const instance = component.root;
    expect(instance.findByType('td').props.children).toBe('');
  });
  it('changes the td to display empty string if given an undefined value', () => {
    const component = renderer.create(
      <DtgTableRow columns={columns} data={data3} />);
    const instance = component.root;
    expect(instance.findByType('td').props.children).toBe('');
  });
  it('changes the td to display empty string if given a value of null string', () => {
    const component = renderer.create(
      <DtgTableRow columns={columns} data={data4} />);
    const instance = component.root;
    expect(instance.findByType('td').props.children).toBe('');
  });
  it('changes the td to display empty string if given a value of string asterisk', () => {
    const component = renderer.create(
      <DtgTableRow columns={columns} data={data5} />);
    const instance = component.root;
    expect(instance.findByType('td').props.children).toBe('');
  });
  it('formats PERCENTAGE types correctly', () => {
    const cols = columns;
    cols[0].type = 'PERCENTAGE';
    const component = renderer.create(
        <DtgTableRow columns={cols} data={data1} />
    );
    expect(component.root.findByType('td').props.children).toBe(`${data1.row1}%`);
  });
  it('formats SMALL_FRACTION types correctly', () => {
    const cols = columns;
    cols[0].type = 'SMALL_FRACTION';
    const component = renderer.create(
        <DtgTableRow columns={cols} data={data6} />
    );
    expect(component.root.findByType('td').props.children).toBe(`${data6.row1}`);
  });
  it('formats STRING types that are percentage values correctly', () => {
    const cols = columns;
    cols[0].type = 'STRING';
    const component = renderer.create(
      <DtgTableRow columns={cols} data={data7} />
    );
    const formattedValue = data7.row1.replace(/-/g, '\u2011');
    expect(component.root.findByType('td').props.children).toBe(formattedValue);
  });
  it('formats CURRENCY3 types correctly', () => {
    const cols = columns;
    cols[0].type = 'CURRENCY3';
    const component = renderer.create(
      <DtgTableRow columns={cols} data={data1} />
    );
    expect(component.root.findByType('td').props.children).toBe('$123.000');
  });
  it('formats negative CURRENCY3 types correctly', () => {
    const cols = columns;
    cols[0].type = 'CURRENCY3';
    const component = renderer.create(
      <DtgTableRow columns={cols} data={data8} />
    );
    expect(component.root.findByType('td').props.children).toBe('-$123.000');
  });

  it('formats FRN Daily Indexes Daily Index col data correctly', () => {
    const dailyIndexData = {daily_index: 0.111111111};
    const col = [
      {name: 'daily_index', order: 1, property: 'daily_index', width: 12}
    ];
    const component = renderer.create(
      <DtgTableRow columns={col} data={dailyIndexData} tableName={"FRN Daily Indexes"}/>
    );
    expect(component.root.findByType('td').props.children).toBe(0.111111111);
  });

  it('formats FRN Daily Indexes Daily Int Accrual Rate data correctly', () => {
    const dailyIntAccrualRateData = {daily_int_accrual_rate: 0.222222222};
    const cols = [
      {name: 'daily_int_accrual_rate', order: 2, property: 'daily_int_accrual_rate', width: 12},
    ];
    const component = renderer.create(
      <DtgTableRow columns={cols} data={dailyIntAccrualRateData} />
    );
    expect(component.root.findByType('td').props.children).toBe(0.222222222);
  });

  it('formats FRN Daily Indexes Spread data correctly', () => {
    const spreadData = {spread: 0.0120};
    const cols = [
      {name: 'spread', order: 3, property: 'spread', width: 12},
    ];
    const component = renderer.create(
      <DtgTableRow columns={cols} data={spreadData} />
    );
    expect(component.root.findByType('td').props.children).toBe(0.012);
  });
});
