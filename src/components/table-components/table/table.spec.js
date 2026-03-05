import React from 'react';
import Table from './table';
import { MoreTestData, TestData, TestDataOneRow } from '../../dtg-table/test-data';
import { act, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Table component', () => {
  jest.useFakeTimers();

  beforeEach(() => jest.resetAllMocks());

  it('renders a table', () => {
    const { getByRole } = render(<Table tableProps={{ data: TestData }} />);
    expect(getByRole('table')).toBeInTheDocument();
  });

  it('renders a row for each item in the data array', () => {
    const { getAllByRole } = render(<Table tableProps={{ data: TestData }} />);
    expect(getAllByRole('row')).toHaveLength(TestData.length + 1);
  });

  it('renders a column for every item in the data', () => {
    const { getAllByRole } = render(<Table tableProps={{ data: TestData }} />);
    expect(getAllByRole('columnheader')).toHaveLength(Object.keys(TestData[0]).length);
  });

  it('does not blow up when a column config is not provided', () => {
    const { getAllByRole } = render(<Table tableProps={{ data: TestData }} />);
    expect(getAllByRole('columnheader').length).toBeGreaterThan(0);
  });
  it('no caption in table when caption is not provided in config', () => {
    const { getByRole } = render(<Table tableProps={{ data: TestData }} />);
    expect(within(getByRole('table')).queryByRole('caption')).toBeFalsy();
  });
  it('caption is added to table when provided in config', () => {
    const testCaption = 'Test Caption Value';
    const { getByRole } = render(<Table tableProps={{ data: TestDataOneRow, caption: testCaption }} />);
    const captionInstance = within(getByRole('table')).getByRole('caption');
    expect(captionInstance).toBeInTheDocument();
    expect(within(captionInstance).getByText(testCaption)).toBeInTheDocument();
  });

  it('does not blow up when there is no data in a table', () => {
    const noDataComponent = render(<Table tableProps={{}} />);
    expect(noDataComponent).toBeDefined();
  });

  it('sets table width to auto when width is unspecified', () => {
    const { getByRole } = render(<Table tableProps={{ data: TestData }} />);
    expect(getByRole('table')).toHaveStyle({ width: 'auto' });
  });

  it('allows the table width to be set when specified', () => {
    const width = 2000;

    const { getByRole } = render(<Table tableProps={{ data: TestData, width }} />);
    expect(getByRole('table')).toHaveStyle({ width: `${width}px` });
  });

  it('supports a noBorder configuration', () => {
    const { getByTestId, rerender } = render(<Table tableProps={{ data: TestData }} />);
    expect(getByTestId('table-wrapper')).not.toHaveClass('noBorderStyle');
    rerender(<Table tableProps={{ data: TestData, noBorder: true }} />);
    expect(getByTestId('table-wrapper')).toHaveClass('noBorderStyle');
  });

  it('does not show pagination controls by default', () => {
    const { queryByText } = render(<Table tableProps={{ data: TestData }} />);
    expect(queryByText('Rows Per Page')).not.toBeInTheDocument();
  });

  it('does not show table footer if shouldPage property is not included in tableProps', () => {
    const { queryByTestId } = render(<Table tableProps={{ data: TestData }} />);
    expect(queryByTestId('table-footer')).not.toBeInTheDocument();
  });

  it('renders the number of rows specified in props', () => {
    const perPage = 3;
    const { getAllByRole } = render(<Table tableProps={{ data: TestData }} perPage={perPage} />);
    expect(getAllByRole('row').length).toEqual(perPage + 1); // per page plus header
  });

  it('renders the defaultRowsPer if shouldPage === true but perPage is not specified and shows range of rows showing out of total number of rows with correct default itemsPerPage', () => {
    const perPage = 10;
    const { getAllByRole, getByTestId } = render(<Table tableProps={{ data: MoreTestData, shouldPage: true }} />);
    expect(getAllByRole('row').length).toEqual(perPage + 1); // per page plus header
    const maxRows = MoreTestData.length;
    const rowsShowing = getByTestId('rows-showing');
    expect(within(rowsShowing).getByText(`Showing 1 - 10 rows of ${maxRows} rows`)).toBeInTheDocument();
  });

  it('sets table aria prop with a single attribute and value', () => {
    const aria = { 'aria-describedby': 'my-test-id' };
    const { getByRole } = render(
      <Table
        tableProps={{
          data: TestData,
          aria: aria,
        }}
      />
    );
    const table = getByRole('table');
    expect(table).toHaveAttribute('aria-describedby', 'my-test-id');
  });

  describe('Pagination Controls', () => {
    it('renders pagination Controls when there are more rows than the minimum rows-per-page-option and shouldPage is set to true', () => {
      const { getByText, getByRole } = render(<Table tableProps={{ data: MoreTestData, shouldPage: true, tableName: 'tableName' }} />);

      expect(getByText('Rows Per Page')).toBeInTheDocument();

      const nextPage = getByRole('button', { name: 'tableName-page2' });
      act(() => {
        userEvent.click(nextPage);
      });
      expect(getByText('Showing 11 - 11 rows of 11 rows')).toBeInTheDocument();
    });

    it(
      'renders pagination Controls when the table is configured to load page-by-page, ' +
        'so long as there are more total available rows than the minimum rows-per-page-option and shouldPage is set to true',
      async () => {
        const { getByText } = render(<Table tableProps={{ data: TestDataOneRow, shouldPage: true }} />);

        expect(getByText('Rows Per Page')).toBeInTheDocument();
      }
    );

    it(
      'does not render pagination Controls even when the table is configured to load page-by-page,' +
        ' so long as there are not more total available rows than the minimum rows-per-page-option and shouldPage is set to true',
      async () => {
        const { getByText } = render(<Table tableProps={{ data: MoreTestData, shouldPage: true }} />);

        expect(getByText('Rows Per Page')).toBeInTheDocument();
      }
    );

    it('should call handlePerPageChange', () => {
      const { getByRole, getByText } = render(<Table tableProps={{ data: MoreTestData, shouldPage: true }} />);

      const perPageButton = getByRole('button', { name: 'rows-per-page-menu' });
      within(perPageButton).getByText('10');
      userEvent.click(perPageButton);
      const perPageCountButton = getByText('5');
      userEvent.click(perPageCountButton);
      within(perPageButton).getByText('5');
    });
  });
});

describe('Table component with shouldPage property and tableData with only one row', () => {
  it('does show table footer if shouldPage property is included in tableProps', () => {
    const { getByTestId } = render(<Table tableProps={{ data: TestDataOneRow, shouldPage: true }} />);
    expect(getByTestId('table-footer')).toBeDefined();
  });
  it('shows the "x of x rows" message with correct grammar if only one row of data exists', () => {
    const { getByText } = render(<Table tableProps={{ data: TestDataOneRow, shouldPage: true }} />);
    expect(getByText('Showing 1 - 1  of 1 row', { collapseWhitespace: false })).toBeInTheDocument();
  });

  it('does not render pagination controls when fewer rows than the lowest available rows-per-page option in the pagination controls', () => {
    const { getByTestId } = render(<Table tableProps={{ data: TestDataOneRow, shouldPage: true }} />);
    const footer = getByTestId('table-footer');
    expect(within(footer).getByText('Rows Per Page')).toBeInTheDocument();
  });
});
