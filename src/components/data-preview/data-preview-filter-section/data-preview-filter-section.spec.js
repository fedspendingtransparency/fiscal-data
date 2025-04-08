import { render } from '@testing-library/react';
import React from 'react';
import DataPreviewFilterSection from './data-preview-filter-section';
import { RecoilRoot } from 'recoil';
import { selectedTable } from '../../api-quick-guide/test-helpers/test-helpers';
import { DataTableContext } from '../data-preview-context';

const mockContextValue = {
  defaultColumns: [],
  additionalColumns: [],
  allColumns: new Array(17).fill({}),
  defaultSelectedColumns: [],
  tableState: {
    getVisibleFlatColumns: () => [],
    getAllLeafColumns: () => new Array(17).fill({}),
  },
};

describe('Data preview filter section', () => {
  it('Renders all components', () => {
    const selectedTable = {
      dataDisplays: [{ chartType: 'none', title: 'Complete Table' }],
    };
    const { getByRole, queryByRole } = render(
      <DataTableContext.Provider value={mockContextValue}>
        <RecoilRoot>
          <DataPreviewFilterSection dataset={{ name: 'Mock dataset' }} selectedTable={selectedTable} />
        </RecoilRoot>
      </DataTableContext.Provider>
    );
    expect(getByRole('button', { name: 'Columns: 0/17' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Filters: 0 applied' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Download' })).toBeInTheDocument();
    expect(queryByRole('radio', { name: 'Table' })).not.toBeInTheDocument();
    expect(queryByRole('radio', { name: 'Chart' })).not.toBeInTheDocument();
  });

  it('Renders chart/table toggle when data display charting is available', () => {
    const selectedTable = {
      dataDisplays: [
        { chartType: 'none', title: 'Complete Table' },
        { chartType: null, title: 'By Type of Account' },
      ],
    };
    const { getByRole } = render(
      <DataTableContext.Provider value={mockContextValue}>
        <RecoilRoot>
          <DataPreviewFilterSection dataset={{ name: 'Mock dataset' }} selectedTable={selectedTable} />
        </RecoilRoot>
      </DataTableContext.Provider>
    );
    expect(getByRole('button', { name: 'Columns: 0/17' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Filters: 0 applied' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Download' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Table' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Chart' })).toBeInTheDocument();
  });

  it('Renders chart/table toggle when user filter charting is available', () => {
    const selectedTable = {
      userFilter: {},
    };
    const userFilterSelection = { value: 'Euro Zone-Euro' };

    const { getByRole } = render(
      <DataTableContext.Provider value={mockContextValue}>
        <RecoilRoot>
          <DataPreviewFilterSection dataset={{ name: 'Mock dataset' }} selectedTable={selectedTable} selectedUserFilter={userFilterSelection} />
        </RecoilRoot>
      </DataTableContext.Provider>
    );
    expect(getByRole('button', { name: 'Columns: 0/17' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Filters: 0 applied' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Download' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Table' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Chart' })).toBeInTheDocument();
  });

  it('Renders chart/table toggle when date range charting is available', () => {
    const dateRange = {
      from: new Date('4/1/2024'),
      to: new Date('4/1/2025'),
    };
    const dataset = { name: '', techSpecs: { earliestDate: new Date('4/1/2024'), latestDate: new Date('4/1/2024') } };

    const { getByRole } = render(
      <DataTableContext.Provider value={mockContextValue}>
        <RecoilRoot>
          <DataPreviewFilterSection dataset={dataset} dateRange={dateRange} selectedTable={selectedTable} />
        </RecoilRoot>
      </DataTableContext.Provider>
    );
    expect(getByRole('button', { name: 'Columns: 0/17' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Filters: 0 applied' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Download' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Table' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Chart' })).toBeInTheDocument();
  });

  it('Renders chart/table toggle when date range charting is not available', () => {
    const dateRange = {
      from: new Date('4/1/2024'),
      to: new Date('4/1/2024'),
    };
    const dataset = { name: '', techSpecs: { earliestDate: new Date('4/1/2024'), latestDate: new Date('4/1/2024') } };

    const { getByRole, queryByRole } = render(
      <DataTableContext.Provider value={mockContextValue}>
        <RecoilRoot>
          <DataPreviewFilterSection dataset={dataset} dateRange={dateRange} selectedTable={selectedTable} />
        </RecoilRoot>
      </DataTableContext.Provider>
    );
    expect(getByRole('button', { name: 'Columns: 0/17' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Filters: 0 applied' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Download' })).toBeInTheDocument();
    expect(queryByRole('radio', { name: 'Table' })).not.toBeInTheDocument();
    expect(queryByRole('radio', { name: 'Chart' })).not.toBeInTheDocument();
  });
});
