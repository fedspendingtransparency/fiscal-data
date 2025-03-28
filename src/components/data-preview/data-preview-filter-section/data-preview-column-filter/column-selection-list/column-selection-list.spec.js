import React from 'react';
import ColumnSelectionList from './column-selection-list';
import { render } from '@testing-library/react';

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
    const { getByRole } = render(
      <ColumnSelectionList defaultSelectedColumns={[]} defaultColumns={mockColumns} additionalColumns={[]} table={mockTable} displayDefault={false} />
    );
    expect(getByRole('checkbox', { name: 'Select All' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'col1' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'col2' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'col3' })).toBeInTheDocument();
  });

  it('renders separate default and additional columns', () => {
    const { getByText } = render(
      <ColumnSelectionList
        defaultSelectedColumns={mockColumns}
        defaultColumns={mockColumnConfigs}
        additionalColumns={mockAdditionalColumnConfigs}
        table={mockTable}
        displayDefault={true}
      />
    );
    expect(getByText('DEFAULTS')).toBeInTheDocument();
    expect(getByText('ADDITIONAL')).toBeInTheDocument();
  });

  it('does not render separate default and additional columns when no default columns are specified', () => {
    const { queryByText } = render(
      <ColumnSelectionList defaultSelectedColumns={[]} defaultColumns={mockColumns} additionalColumns={[]} table={mockTable} displayDefault={false} />
    );
    expect(queryByText('DEFAULTS')).not.toBeInTheDocument();
    expect(queryByText('ADDITIONAL')).not.toBeInTheDocument();
  });
});
