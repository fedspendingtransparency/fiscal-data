import React from 'react';
import DtgTable from './dtg-table';
import { DetailViewTestData, mockPaginatedTableProps, MoreTestData, TestData, TestDataOneRow } from './test-data';
import * as helpers from './dtg-table-helper';
import { RecoilRoot } from 'recoil';
import { render, within } from '@testing-library/react';

describe('DTG table component', () => {
  jest.useFakeTimers();

  beforeEach(() => jest.resetAllMocks());

  it('renders a table', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData }} />
      </RecoilRoot>
    );
    expect(getByRole('table')).toBeInTheDocument();
  });

  it('renders a row for each item in the data array', () => {
    const { getAllByRole } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData }} />
      </RecoilRoot>
    );
    expect(getAllByRole('row')).toHaveLength(TestData.length + 1);
  });

  it('renders a column for every item in the data', () => {
    const { getAllByRole } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData }} />
      </RecoilRoot>
    );
    expect(getAllByRole('columnheader')).toHaveLength(Object.keys(TestData[0]).length);
  });

  it('does not blow up when a column config is not provided', () => {
    const { getAllByRole } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData }} />
      </RecoilRoot>
    );
    expect(getAllByRole('columnheader').length).toBeGreaterThan(0);
  });
  it('no caption in table when caption is not provided in config', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData }} />
      </RecoilRoot>
    );
    expect(within(getByRole('table')).queryByRole('caption')).toBeFalsy();
  });
  it('caption is added to table when provided in config', () => {
    const testCaption = 'Test Caption Value';
    const { getByRole } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestDataOneRow, caption: testCaption }} />
      </RecoilRoot>
    );
    const captionInstance = within(getByRole('table')).getByRole('caption');
    expect(captionInstance).toBeInTheDocument();
    expect(within(captionInstance).getByText(testCaption)).toBeInTheDocument();
  });

  it('does not blow up when there is no data in a table', () => {
    const noDataComponent = render(
      <RecoilRoot>
        <DtgTable tableProps={{}} />
      </RecoilRoot>
    );
    expect(noDataComponent).toBeDefined();
  });

  it('sets table width to auto when width is unspecified', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData }} />
      </RecoilRoot>
    );
    expect(getByRole('table')).toHaveStyle({ width: 'auto' });
  });

  it('allows the table width to be set when specified', () => {
    const width = 2000;

    const { getByRole } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData, width }} />
      </RecoilRoot>
    );
    expect(getByRole('table')).toHaveStyle({ width: `${width}px` });
  });

  it('supports a noBorder configuration', () => {
    const { getByTestId, rerender } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData }} />
      </RecoilRoot>
    );
    expect(getByTestId('table-wrapper')).not.toHaveClass('noBorderStyle');
    rerender(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData, noBorder: true }} />
      </RecoilRoot>
    );
    expect(getByTestId('table-wrapper')).toHaveClass('noBorderStyle');
  });

  it('does not show pagination controls by default', () => {
    const { queryByText } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData }} />
      </RecoilRoot>
    );
    expect(queryByText('Rows Per Page')).not.toBeInTheDocument();
  });

  it('does not show table footer if shouldPage property is not included in tableProps', () => {
    const { queryByTestId } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData }} />
      </RecoilRoot>
    );
    expect(queryByTestId('table-footer')).not.toBeInTheDocument();
  });

  it('renders the number of rows specified in props', () => {
    const perPage = 3;
    const { getAllByRole } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData }} perPage={perPage} />
      </RecoilRoot>
    );
    expect(getAllByRole('row').length).toEqual(perPage + 1); // per page plus header
  });

  it('renders the defaultRowsPer if shouldPage === true but perPage is not specified and shows range of rows showing out of total number of rows with correct default itemsPerPage', () => {
    const perPage = 10;
    const { getAllByRole, getByTestId } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: MoreTestData, shouldPage: true }} />
      </RecoilRoot>
    );
    expect(getAllByRole('row').length).toEqual(perPage + 1); // per page plus header
    const maxRows = MoreTestData.length;
    const rowsShowing = getByTestId('rows-showing');
    expect(within(rowsShowing).getByText(`Showing 1 - 10 rows of ${maxRows} rows`)).toBeInTheDocument();
  });

  it('sets a timer for the loading indicator', async () => {
    const spy = jest.spyOn(helpers, 'loadingTimeout');
    spy.mockClear();
    render(
      <RecoilRoot>
        <DtgTable tableProps={mockPaginatedTableProps} />
      </RecoilRoot>
    );

    jest.advanceTimersByTime(helpers.loadTimerDelay * 2);
    await expect(spy).toBeCalledTimes(2);
  });

  it('sets table aria prop with a single attribute and value', () => {
    const aria = { 'aria-describedby': 'my-test-id' };
    const { getByRole } = render(
      <RecoilRoot>
        <DtgTable
          tableProps={{
            data: TestData,
            aria: aria,
          }}
        />
      </RecoilRoot>
    );
    const table = getByRole('table');
    expect(table).toHaveAttribute('aria-describedby', 'my-test-id');
  });

  describe('Pagination Controls', () => {
    it('renders pagination Controls when there are more rows than the minimum rows-per-page-option and shouldPage is set to true', () => {
      const { getByText } = render(
        <RecoilRoot>
          <DtgTable tableProps={{ data: TestData, shouldPage: true }} />
        </RecoilRoot>
      );

      expect(getByText('Rows Per Page')).toBeInTheDocument();
    });

    it(
      'renders pagination Controls when the table is configured to load page-by-page, ' +
        'so long as there are more total available rows than the minimum rows-per-page-option and shouldPage is set to true',
      async () => {
        const { getByText } = render(
          <RecoilRoot>
            <DtgTable tableProps={{ data: TestDataOneRow, shouldPage: true }} />
          </RecoilRoot>
        );

        expect(getByText('Rows Per Page')).toBeInTheDocument();
      }
    );

    it(
      'does not render pagination Controls even when the table is configured to load page-by-page,' +
        ' so long as there are not more total available rows than the minimum rows-per-page-option and shouldPage is set to true',
      async () => {
        const { getByText } = render(
          <RecoilRoot>
            <DtgTable tableProps={{ data: MoreTestData, shouldPage: true }} />
          </RecoilRoot>
        );

        expect(getByText('Rows Per Page')).toBeInTheDocument();
      }
    );
  });

  it('assigns data with a userFilterSelection', () => {
    const mockSetIsLoading = jest.fn();
    const mockSetManualPagination = jest.fn();
    const { getByRole } = render(
      <RecoilRoot>
        <DtgTable
          tableMeta={{ 'total-count': 500 }}
          userFilterSelection={{ value: 'A' }}
          tableProps={{ dePaginated: { data: ['hello'] } }}
          rawDataTable={true}
          setManualPagination={mockSetManualPagination}
          setIsLoading={mockSetIsLoading}
        />
      </RecoilRoot>
    );
    expect(getByRole('table')).toBeInTheDocument();
    expect(mockSetManualPagination).toHaveBeenCalledWith(false);
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });
});

describe('DtgTable component - API Error', () => {
  it('shows an apiError message when apiError exists', () => {
    const { getByText } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData, apiError: 'Error', shouldPage: true }} />
      </RecoilRoot>
    );
    expect(getByText('Table failed to load.')).toBeInTheDocument();
  });

  it('displays "Showing 0 - 0 rows of 0 rows" when apiError exists', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData, apiError: 'Error', shouldPage: true }} />
      </RecoilRoot>
    );
    const rowsShowing = getByTestId('rows-showing');
    expect(within(rowsShowing).getByText(`Showing 0 - 0 rows of 0 rows`));
  });

  it('does not render pagination controls if apiError exists && currentPage === 1 even when shouldPage === true', () => {
    const { queryByRole } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData, apiError: 'Error', shouldPage: true }} />
      </RecoilRoot>
    );
    expect(queryByRole('button', { name: 'Previous Page' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: 'Next Page' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: '1' })).not.toBeInTheDocument();
  });
});

describe('DtgTable component with shouldPage property and tableData with only one row', () => {
  it('does show table footer if shouldPage property is included in tableProps', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestDataOneRow, shouldPage: true }} />
      </RecoilRoot>
    );
    expect(getByTestId('table-footer')).toBeDefined();
  });
  it('shows the "x of x rows" message with correct grammar if only one row of data exists', () => {
    const { getByText } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestDataOneRow, shouldPage: true }} />
      </RecoilRoot>
    );
    expect(getByText('Showing 1 - 1  of 1 row', { collapseWhitespace: false })).toBeInTheDocument();
  });

  it('does not render pagination controls when fewer rows than the lowest available rows-per-page option in the pagination controls', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestDataOneRow, shouldPage: true }} />
      </RecoilRoot>
    );
    const footer = getByTestId('table-footer');
    expect(within(footer).getByText('Rows Per Page')).toBeInTheDocument();
  });

  //handle per page change

  // hide cols

  // exclude cols

  //record date colymn filter

  //
});

describe('DTG Table Nested Table Detail View', () => {
  it('renders table with detail view', () => {
    const detailViewState = { value: 'Brennah', secondary: 'Smith' };
    const mockSetIsLoading = jest.fn();
    const mockSetManualPagination = jest.fn();
    const { getByRole } = render(
      <RecoilRoot>
        <DtgTable
          tableProps={{
            rawData: { data: DetailViewTestData },
            selectedTable: { rowCount: 12 },
            shouldPage: true,
            config: { detailView: { field: 'first', secondaryField: 'last', apiId: 1 }, apis: [{ apiId: 1 }] },
          }}
          detailViewState={detailViewState}
          setManualPagination={mockSetManualPagination}
          setIsLoading={mockSetIsLoading}
        />
      </RecoilRoot>
    );

    expect(getByRole('table')).toBeInTheDocument();
  });
});
