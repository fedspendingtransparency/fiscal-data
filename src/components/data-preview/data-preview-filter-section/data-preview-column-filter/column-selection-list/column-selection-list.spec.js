import React from 'react';
import ColumnSelectionList from './column-selection-list';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Column Selection List', () => {
  const mockColumns = ['col1', 'col2', 'col3'];
  const mockColumnConfigs = [
    { id: 'col1', getIsVisible: jest.fn(), getToggleVisibilityHandler: jest.fn(), columnDef: { header: 'col1' } },
    { id: 'col2', getIsVisible: jest.fn(), getToggleVisibilityHandler: jest.fn(), columnDef: { header: 'col2' } },
    { id: 'col3', getIsVisible: jest.fn(), getToggleVisibilityHandler: jest.fn(), columnDef: { header: 'col3' } },
  ];
  const mockAdditionalColumnConfigs = [
    { id: 'col4', getIsVisible: jest.fn(), getToggleVisibilityHandler: jest.fn(), columnDef: { header: 'col4' } },
    { id: 'col5', getIsVisible: jest.fn(), getToggleVisibilityHandler: jest.fn(), columnDef: { header: 'col5' } },
  ];

  const mockTable = {
    getAllLeafColumns: jest.fn().mockImplementation(() => mockColumnConfigs),
    getVisibleFlatColumns: jest.fn().mockImplementation(() => mockColumnConfigs),
    getIsAllColumnsVisible: jest.fn(),
    getIsSomeColumnsVisible: jest.fn(),
  };

  it('renders column selection list', () => {
    const { getByRole, queryByText } = render(
      <ColumnSelectionList selectedColumns={[]} filteredColumns={mockColumnConfigs} table={mockTable} displayDefault={false} filter="" />
    );
    expect(getByRole('checkbox', { name: 'All Columns' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'col1' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'col2' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'col3' })).toBeInTheDocument();

    expect(queryByText('DEFAULTS')).not.toBeInTheDocument();
    expect(queryByText('ADDITIONAL')).not.toBeInTheDocument();
  });

  it('renders separate default and additional columns', () => {
    const { getByText } = render(
      <ColumnSelectionList
        selectedColumns={[]}
        defaultSelectedColumns={mockColumns}
        defaultColumns={mockColumnConfigs}
        additionalColumns={mockAdditionalColumnConfigs}
        table={mockTable}
        displayDefault={true}
        filter=""
      />
    );
    expect(getByText('DEFAULTS')).toBeInTheDocument();
    expect(getByText('ADDITIONAL')).toBeInTheDocument();
  });
  it('renders just the filtered results when there is a filter', () => {
    const { queryByText } = render(
      <ColumnSelectionList
        selectedColumns={[]}
        defaultSelectedColumns={mockColumns}
        filteredColumns={mockColumnConfigs}
        defaultColumns={mockColumnConfigs}
        additionalColumns={mockAdditionalColumnConfigs}
        table={mockTable}
        displayDefault={true}
        filter="test"
      />
    );
    expect(queryByText('DEFAULTS')).not.toBeInTheDocument();
    expect(queryByText('ADDITIONAL')).not.toBeInTheDocument();
  });

  it('updates pendingColumnSelection on checkbox click', () => {
    const setPendingColumnSelection = jest.fn();
    const { getAllByRole } = render(
      <ColumnSelectionList
        selectedColumns={mockColumnConfigs}
        defaultSelectedColumns={mockColumns}
        defaultColumns={mockColumnConfigs}
        additionalColumns={mockAdditionalColumnConfigs}
        pendingColumnSelection={[]}
        setPendingColumnSelection={setPendingColumnSelection}
        table={mockTable}
        displayDefault={true}
        filter=""
      />
    );
    const checkboxes = getAllByRole('checkbox');
    userEvent.click(checkboxes[3]);
    expect(setPendingColumnSelection).toHaveBeenCalledWith([mockColumnConfigs[2]]);
  });

  it('removes checked column from pendingColumnSelection on checkbox click', () => {
    const setPendingColumnSelection = jest.fn();
    const { getAllByRole } = render(
      <ColumnSelectionList
        selectedColumns={mockColumnConfigs}
        defaultSelectedColumns={mockColumns}
        defaultColumns={mockColumnConfigs}
        additionalColumns={mockAdditionalColumnConfigs}
        pendingColumnSelection={[mockColumnConfigs[2]]}
        setPendingColumnSelection={setPendingColumnSelection}
        table={mockTable}
        displayDefault={true}
        filter=""
      />
    );
    const checkboxes = getAllByRole('checkbox');
    userEvent.click(checkboxes[3]);
    expect(setPendingColumnSelection).toHaveBeenCalledWith([]);
  });
});
