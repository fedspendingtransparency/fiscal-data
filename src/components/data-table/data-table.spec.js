import { render, within } from '@testing-library/react';
import React from 'react';
import { fireEvent } from '@testing-library/dom';
import DataTable from './data-table';
import { RecoilRoot } from 'recoil';

const mockTableData = {
  data: [
    {
      record_date: '2023-07-12',
      debt_held_public_amt: '25633821130387.02',
      intragov_hold_amt: '6884574686385.15',
      tot_pub_debt_out_amt: '32518395816772.17',
      src_line_nbr: '1',
      record_fiscal_year: '2023',
      record_fiscal_quarter: '4',
      record_calendar_year: '2023',
      record_calendar_quarter: '3',
      record_calendar_month: '07',
      record_calendar_day: '12',
      mock_percent_string: '45%',
      mock_small_fraction: '0.00067898',
      mock_percent: '4',
      negative_currency: '-134.1',
      daily_index: '0.111111111',
      daily_int_accrual_rate: '0.222222222',
      spread: '-0.1200',
    },
    {
      record_date: '2023-07-11',
      debt_held_public_amt: '25633781683720.91',
      intragov_hold_amt: '6904685134353.32',
      tot_pub_debt_out_amt: '32538466818074.23',
      src_line_nbr: '1',
      record_fiscal_year: '2023',
      record_fiscal_quarter: '4',
      record_calendar_year: '2023',
      record_calendar_quarter: '3',
      record_calendar_month: '07',
      record_calendar_day: '11',
      mock_percent_string: '55%',
      mock_small_fraction: '0.00067898',
      mock_percent: '3',
    },
    {
      record_date: '2023-07-10',
      debt_held_public_amt: '25588803096223.83',
      intragov_hold_amt: '6892303235964.87',
      tot_pub_debt_out_amt: '32481106332188.70',
      src_line_nbr: '1',
      record_fiscal_year: '2023',
      record_fiscal_quarter: '4',
      record_calendar_year: '2023',
      record_calendar_quarter: '3',
      record_calendar_month: '07',
      record_calendar_day: '10',
      mock_percent_string: '65%',
      mock_small_fraction: '0.00067898',
      mock_percent: '2',
    },
  ],
  meta: {
    count: 2,
    labels: {
      record_date: 'Record Date',
      debt_held_public_amt: 'Debt Held by the Public',
      intragov_hold_amt: 'Intragovernmental Holdings',
      tot_pub_debt_out_amt: 'Total Public Debt Outstanding',
      src_line_nbr: 'Source Line Number',
      record_fiscal_year: 'Fiscal Year',
      record_fiscal_quarter: 'Fiscal Quarter Number',
      record_calendar_year: 'Calendar Year',
      record_calendar_quarter: 'Calendar Quarter Number',
      record_calendar_month: 'Calendar Month Number',
      record_calendar_day: 'Calendar Day Number',
      mock_small_fraction: 'Mock Small Fraction',
      mock_percent_string: 'Mock Percent String',
      mock_percent: 'Mock Percent',
      negative_currency: 'Negative Currency',
      daily_index: 'Daily Index',
      daily_int_accrual_rate: 'Daily Accrual Rate',
      spread: 'Spread',
    },
    dataTypes: {
      record_date: 'DATE',
      debt_held_public_amt: 'CURRENCY',
      intragov_hold_amt: 'CURRENCY3',
      tot_pub_debt_out_amt: 'CURRENCY',
      src_line_nbr: 'NUMBER',
      record_fiscal_year: 'YEAR',
      record_fiscal_quarter: 'QUARTER',
      record_calendar_year: 'YEAR',
      record_calendar_quarter: 'QUARTER',
      record_calendar_month: 'MONTH',
      record_calendar_day: 'DAY',
      mock_small_fraction: 'SMALL_FRACTION',
      mock_percent_string: 'STRING',
      mock_percent: 'PERCENTAGE',
      negative_currency: 'CURRENCY3',
      daily_index: 'NUMBER',
      daily_int_accrual_rate: 'NUMBER',
      spread: 'NUMBER',
    },
    dataFormats: {
      record_date: 'YYYY-MM-DD',
      debt_held_public_amt: '$10.20',
      intragov_hold_amt: '$10.20',
      tot_pub_debt_out_amt: '$10.20',
      src_line_nbr: '10.2',
      record_fiscal_year: 'YYYY',
      record_fiscal_quarter: 'Q',
      record_calendar_year: 'YYYY',
      record_calendar_quarter: 'Q',
      record_calendar_month: 'MM',
      record_calendar_day: 'DD',
    },
    'total-count': 2,
    'total-pages': 1,
  },
};

const mockGenericTableData = {
  data: [
    [
      {
        name: 'Title',
        definition: '120 Day Delinquent Debt Referral Compliance Report',
      },
      {
        name: 'Description (Long)',
        definition:
          "The 120 Day Delinquent Debt Referral Compliance Report provides tracking and benchmarking information on federal agencies' compliance with the Digital Accountability and Transparency Act of 2014 (the DATA Act). The DATA Act requires federal agencies to refer to the Treasury Offset Program legally enforceable non-tax debts that are greater than 120 days delinquent for Administrative Offset. This dataset was designed to increase transparency and provide quick insights into federal agency compliance rates, as well as information on the number of eligible debts, debts referred, and debts not referred each quarter, beginning in Fiscal Year 2016.",
      },
      {
        name: 'Description (Short)',
        definition:
          'Tracking federal agency compliance with DATA Act requirements on referring delinquent debt and the number of eligible and referred debts quarterly. ',
      },
      {
        name: 'Update Frequency',
        definition: 'Updated Quarterly',
      },
      {
        name: 'Date Range',
        definition: '12/31/2015 - 06/30/2023',
      },
      {
        name: 'Topics',
        definition: 'Debt',
      },
      {
        name: 'Publisher',
        definition: 'Debt Management Services',
      },
    ],
  ],
};

const mockGenericTableColumns = [
  {
    property: 'name',
    name: 'Name',
    order: 1,
    width: 25,
  },
  {
    property: 'definition',
    name: 'Definition',
    order: 2,
    width: 18,
  },
];

const defaultSelectedColumnsMock = ['record_date', 'src_line_nbr', 'record_calendar_quarter'];
const defaultColumnsTypeCheckMock = [
  'record_date',
  'intragov_hold_amt',
  'src_line_nbr',
  'mock_small_fraction',
  'mock_percent',
  'mock_percent_string',
  'negative_currency',
];
const defaultColLabels = ['Record Date', 'Source Line Number', 'Calendar Quarter Number'];
const additionalColLabels = Object.values(mockTableData.meta.labels).filter(label => !defaultColLabels.includes(label));
const allColLabels = defaultColLabels.concat(additionalColLabels);

describe('react-table', () => {
  const setTableColumnSortData = jest.fn();

  it('table renders', () => {
    const instance = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(instance).toBeTruthy();
  });

  it('table renders generic non raw data table', () => {
    const instance = render(
      <RecoilRoot>
        <DataTable
          rawData={mockGenericTableData}
          nonRawDataColumns={mockGenericTableColumns}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(instance).toBeTruthy();
  });

  it('renders headers', () => {
    const mostResetFilter = jest.fn();
    const { getByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          resetFilters
          setResetFilters={mostResetFilter}
          setFiltersActive={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(getByRole('columnheader', { name: 'Record Date' })).toBeInTheDocument();
  });

  it('Able to interact with headers for column sort', () => {
    const { getAllByTestId, getByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
        />
      </RecoilRoot>
    );
    // Column header
    expect(getByRole('columnheader', { name: 'Record Date' })).toBeInTheDocument();
    // Rows render
    expect(getAllByTestId('row').length).toEqual(3);
    const header = getByRole('columnheader', { name: 'Record Date' });
    const sortButton = within(header).getAllByRole('img', { hidden: true })[0];
    expect(sortButton).toHaveClass('defaultSortArrow');
    expect(getAllByTestId('row')[0].innerHTML).toContain('7/12/2023');
    fireEvent.click(sortButton);
    // Now sorted in desc order
    expect(getAllByTestId('row')[0].innerHTML).toContain('7/10/2023');
    fireEvent.click(sortButton);
    fireEvent.click(sortButton);
    //Sorting should be reset
    expect(getAllByTestId('row')[0].innerHTML).toContain('7/12/2023');
  });

  it('column sort keyboard accessibility', () => {
    const { getAllByTestId, getByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
        />
      </RecoilRoot>
    );
    // Column header
    expect(getByRole('columnheader', { name: 'Record Date' })).toBeInTheDocument();
    // Rows render
    expect(getAllByTestId('row').length).toEqual(3);
    const header = getByRole('columnheader', { name: 'Record Date' });
    const sortButton = within(header).getAllByRole('img', { hidden: true })[0];
    expect(sortButton).toHaveClass('defaultSortArrow');
    expect(getAllByTestId('row')[0].innerHTML).toContain('7/12/2023');
    fireEvent.keyDown(sortButton, { key: 'Enter' });
    // Now sorted in desc order
    expect(getAllByTestId('row')[0].innerHTML).toContain('7/10/2023');
    fireEvent.keyDown(sortButton, { key: 'Enter' });
    fireEvent.keyDown(sortButton, { key: 'Enter' });
    //Sorting should be reset
    expect(getAllByTestId('row')[0].innerHTML).toContain('7/12/2023');
  });

  it('Filter column by text search', () => {
    const { getAllByTestId, getByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
        />
      </RecoilRoot>
    );
    // Column header
    const header = getByRole('columnheader', { name: 'Debt Held by the Public' });
    expect(header).toBeInTheDocument();
    // Rows render
    expect(getAllByTestId('row').length).toEqual(3);
    const columnFilter = within(header).getByRole('textbox');
    expect(columnFilter).toBeInTheDocument();
    fireEvent.change(columnFilter, { target: { value: '25633821130387.02' } });
    // Rows filtered down to 1
    expect(getAllByTestId('row').length).toEqual(1);
    expect(getAllByTestId('row')[0].innerHTML).toContain('$25,633,821,130,387.02');

    //clear results to view full table
    const clearButton = within(header).getAllByRole('button', { hidden: true })[1];
    expect(clearButton).toHaveClass('fa-circle-xmark');
    fireEvent.click(clearButton);
    expect(getAllByTestId('row').length).toEqual(3);
  });

  it('pagination', () => {
    const { getAllByTestId, getByText, getByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 2 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
        />
      </RecoilRoot>
    );

    const header = getByRole('columnheader', { name: 'Record Date' });
    expect(header).toBeInTheDocument();
    // Rows render
    expect(getAllByTestId('row').length).toEqual(2);

    expect(getByText('Showing', { exact: false })).toBeInTheDocument();
    expect(getByText('1 - 2', { exact: false })).toBeInTheDocument();
    expect(getByText('rows of 3 rows', { exact: false })).toBeInTheDocument();
  });

  it('initially renders all columns showing when no defaults specified', () => {
    const instance = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
        />
      </RecoilRoot>
    );

    allColLabels.forEach(label => {
      expect(instance.getAllByRole('columnheader', { name: label })[0]).toBeInTheDocument();
    });
  });

  it('hides specified columns', () => {
    const { getAllByRole, queryByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          hideColumns={['src_line_nbr']}
        />
      </RecoilRoot>
    );
    const hiddenCol = 'Source Line Number';
    expect(queryByRole('columnheader', { name: hiddenCol })).not.toBeInTheDocument();
    allColLabels
      .filter(x => x !== hiddenCol)
      .forEach(label => {
        expect(getAllByRole('columnheader', { name: label })[0]).toBeInTheDocument();
      });
  });

  it('initially renders only default columns showing when defaults specified', () => {
    const { getAllByRole, queryAllByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={defaultSelectedColumnsMock}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
        />
      </RecoilRoot>
    );

    // default col in table
    defaultColLabels.forEach(index => {
      expect(getAllByRole('columnheader', { name: index })[0]).toBeInTheDocument();
    });

    // additional col not in table
    expect(queryAllByRole('columnheader').length).toEqual(3);
    additionalColLabels.forEach(index => {
      expect(queryAllByRole('columnheader', { name: index })[0]).not.toBeDefined();
    });
  });
  it('formats PERCENTAGE types correctly', () => {
    const { getAllByTestId } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={defaultColumnsTypeCheckMock}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(getAllByTestId('row')[0].innerHTML).toContain('4%');
  });
  it('formats SMALL_FRACTION types correctly', () => {
    const { getAllByTestId } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={defaultColumnsTypeCheckMock}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(getAllByTestId('row')[0].innerHTML).toContain('0.00067898');
  });
  it('formats STRING types that are percentage values correctly', () => {
    const { getAllByTestId } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={defaultColumnsTypeCheckMock}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(getAllByTestId('row')[0].innerHTML).toContain('45%');
  });

  it('formats CURRENCY3 types correctly', () => {
    const { getAllByTestId } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={defaultColumnsTypeCheckMock}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(getAllByTestId('row')[0].innerHTML).toContain('$6,884,574,686,385.150');
  });
  it('formats negative CURRENCY3 types correctly', () => {
    const { getAllByTestId } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={defaultColumnsTypeCheckMock}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          pagingProps={{ itemsPerPage: 10 }}
        />
      </RecoilRoot>
    );
    expect(getAllByTestId('row')[0].innerHTML).toContain('-$134.100');
  });

  it('formats FRN Daily Index number values correctly', () => {
    const { getAllByTestId } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          tableName="FRN Daily Indexes"
        />
      </RecoilRoot>
    );

    expect(getAllByTestId('row')[0].innerHTML).toContain('0.111111111');
    expect(getAllByTestId('row')[0].innerHTML).toContain('0.222222222');
    expect(getAllByTestId('row')[0].innerHTML).toContain('-0.120');
  });
});
