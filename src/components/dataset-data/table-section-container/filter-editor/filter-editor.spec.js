import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import FilterEditor from './filter-editor';

describe('FilterEditor Component', () => {

  const mockColumns = ['rec_date', 'desc', 'amount'];
  const mockDefaultBlankFilter = [{'key': 'rec_date', 'operator': 'eq', 'value': ''}];
  it('produces an Add Filter button that creates a filter entry when clicked', () => {
    const updateSpy = jest.fn();

    const { getByTestId } = render(
      <FilterEditor
        filters={[]} columnNames={mockColumns} onUpdate={updateSpy}
      />);
    getByTestId('add-filter').click();
    expect(updateSpy).toBeCalledWith(mockDefaultBlankFilter);
  });

  it('allows a user to select from all fields for the filter key', async () => {
    const updateSpy = jest.fn();
    const { getByTestId } = render(
      <FilterEditor
        filters={mockDefaultBlankFilter}
        columnNames={mockColumns}
        onUpdate={updateSpy}
      />);

      fireEvent.blur(getByTestId('select-key-0'), {
        target: {
          getAttribute: () => 'key',
          value: 'desc'
        }});

    expect(updateSpy).toBeCalledWith([{'key': 'desc', 'operator': 'eq', 'value': ''}]);
  });

  it('allows a user to select from available operators for a filter row', () => {
    const updateSpy = jest.fn();
    const { getByTestId } = render(
      <FilterEditor
        filters={mockDefaultBlankFilter}
        columnNames={mockColumns}
        onUpdate={updateSpy}
      />);

    fireEvent.blur(getByTestId('select-operator-0'), {
      target: {
        getAttribute: () => 'operator',
        value: 'in'
      }});

    expect(updateSpy).toBeCalledWith([{'key': 'rec_date', 'operator': 'in', 'value': ''}]);
  });

  it('allows a user to indicate the value to test against for a filter', () => {
    const updateSpy = jest.fn();
    const { getByTestId } = render(
      <FilterEditor
        filters={mockDefaultBlankFilter}
        columnNames={mockColumns}
        onUpdate={updateSpy}
      />);

    fireEvent.blur(getByTestId('input-value-0'), {
      target: {
        getAttribute: () => 'value',
        value: '2020-11-25'
      }});

    expect(updateSpy)
      .toBeCalledWith([{'key': 'rec_date', 'operator': 'eq', 'value': '2020-11-25'}]);
  });

  it('allows a user to remove a filter row', () => {
    const updateSpy = jest.fn();
    const { getByTestId } = render(
      <FilterEditor
        filters={mockDefaultBlankFilter}
        columnNames={mockColumns}
        onUpdate={updateSpy}
      />);

    getByTestId('remove-row-0').click();

    expect(updateSpy).toBeCalledWith([]);
  });
});
