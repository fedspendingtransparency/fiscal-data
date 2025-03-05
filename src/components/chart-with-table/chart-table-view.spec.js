import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChartTableView from './chart-table-view';
import '@testing-library/jest-dom';

const mockDtgTable = jest.fn();
jest.mock('../dtg-table/dtg-table', () => {
  return props => {
    mockDtgTable(props);
    return (
      <div data-testid="dtg-table">
        <button onClick={() => props.setSorting('newSorting')}>Sort</button>
      </div>
    );
  };
});

describe('ChartTableView Component', () => {
  const mergedTableData = [{ id: 1, value: 100 }];
  const columnConfig = [{ accessor: 'value', Header: 'Value' }];
  const sorting = 'initialSorting';
  const setSorting = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders DtgTable with correct props', () => {
    render(<ChartTableView mergedTableData={mergedTableData} columnConfig={columnConfig} sorting={sorting} setSorting={setSorting} />);

    expect(screen.getByTestId('dtg-table')).toBeInTheDocument();

    expect(mockDtgTable).toHaveBeenCalledTimes(1);
    const propsPassed = mockDtgTable.mock.calls[0][0];

    expect(propsPassed.tableProps).toEqual({
      data: mergedTableData,
      columnConfig,
      tableName: 'Interest Expense Details',
      caption: 'Interest Expense and Rates Table',
      shouldPage: true,
      width: '99%',
      chartTable: false,
      noBorder: true,
    });
    expect(propsPassed.reactTable).toBe(true);
    expect(propsPassed.sorting).toBe(sorting);
    expect(propsPassed.setSorting).toBe(setSorting);
    expect(propsPassed.width).toBeTruthy();
  });

  it('calls setSorting with "newSorting" when the Sort button is clicked', () => {
    render(<ChartTableView mergedTableData={mergedTableData} columnConfig={columnConfig} sorting={sorting} setSorting={setSorting} />);

    const sortButton = screen.getByText('Sort');
    fireEvent.click(sortButton);
    expect(setSorting).toHaveBeenCalledWith('newSorting');
  });
});
