import React from 'react';
import renderer from 'react-test-renderer';
import {
  longerPaginatedDataResponse,
  mockPaginatedTableProps,
  shortPaginatedDataResponse,
  TestData,
  TestDataOneRow,
  MoreTestData,
  DetailViewTestData,
} from '../../dtg-table/test-data';
import PaginationControls from '../../pagination/pagination-controls';
import * as ApiUtils from '../../../utils/api-utils';
import { RecoilRoot } from 'recoil';
import { render } from '@testing-library/react';
import DataPreviewTable from './data-preview-table';

describe('DataPreviewTable component', () => {
  jest.useFakeTimers();

  beforeEach(() => jest.resetAllMocks());

  it('does not blow up when there is no data in a table', () => {
    const instance = render(
      <RecoilRoot>
        <DataPreviewTable tableProps={{}} setManualPagination={jest.fn()} />
      </RecoilRoot>
    );

    expect(instance).toBeDefined();
  });

  it('does not show pagination controls by default', () => {
    const { queryByRole } = render(
      <RecoilRoot>
        <DataPreviewTable tableProps={{ data: TestData }} />
      </RecoilRoot>
    );
    expect(queryByRole('button', { name: 'Previous Page' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: 'Next Page' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: '1' })).not.toBeInTheDocument();
  });

  it('does not show table footer if shouldPage property is not included in tableProps', () => {
    const { queryByText } = render(
      <RecoilRoot>
        <DataPreviewTable tableProps={{ data: TestData }} />
      </RecoilRoot>
    );
    expect(queryByText('Rows Per Page')).not.toBeInTheDocument();
    expect(queryByText('Showing', { exact: false })).not.toBeInTheDocument();
  });

  it('renders pagination Controls when there are more rows than the minimum rows-per-page-option and shouldPage is set to true', async () => {
    const { getByText } = render(
      <RecoilRoot>
        <DataPreviewTable
          tableProps={{ rawData: { data: MoreTestData }, selectedTable: { rowCount: 11 }, shouldPage: true }}
          setManualPagination={jest.fn()}
          isLoading={false}
        />
      </RecoilRoot>
    );
    expect(getByText('Rows Per Page')).toBeInTheDocument();
    expect(getByText('Showing', { exact: false })).toBeInTheDocument();
  });

  // it('does render pagination Controls when the table is configured to load page-by-page, so long as there are more total available rows than the minimum rows-per-page-option and shouldPage is set to true', async () => {
  //   jest.useFakeTimers();
  //   const requestSpy = jest.spyOn(ApiUtils, 'pagedDatatableRequest').mockReturnValue(Promise.resolve(longerPaginatedDataResponse));
  //
  //   let newComponent = renderer.create();
  //   await renderer.act(async () => {
  //     newComponent = await renderer.create(
  //       <RecoilRoot>
  //         <DataPreviewTable tableProps={mockPaginatedTableProps} setIsLoading={jest.fn()} />
  //       </RecoilRoot>
  //     );
  //     jest.runAllTimers();
  //   });
  //   const updated = newComponent.root;
  //   expect(requestSpy).toBeCalled();
  //   const rowsShowing = updated.findByProps({ 'data-test-id': 'rows-showing' });
  //   expect(rowsShowing.props.children).toMatch('Showing 1 - 10 rows of 11 rows');
  //   expect(updated.findAllByType(PaginationControls).length).toStrictEqual(1);
  //   requestSpy.mockClear();
  // });

  // it('does not render pagination Controls even when the table is configured to load page-by-page, so long as there are not more total available rows than the minimum rows-per-page-option and shouldPage is set to true', async () => {
  //   jest.useFakeTimers();
  //   const requestSpy = jest.spyOn(ApiUtils, 'pagedDatatableRequest').mockReturnValue(Promise.resolve(shortPaginatedDataResponse));
  //
  //   let newComponent = renderer.create();
  //   await renderer.act(async () => {
  //     newComponent = await renderer.create(
  //       <RecoilRoot>
  //         <DataPreviewTable tableProps={mockPaginatedTableProps} setIsLoading={jest.fn()} />
  //       </RecoilRoot>
  //     );
  //     jest.runAllTimers();
  //   });
  //   const updated = newComponent.root;
  //   expect(requestSpy).toBeCalled();
  //   const rowsShowing = updated.findByProps({ 'data-test-id': 'rows-showing' });
  //   expect(rowsShowing.props.children).toMatch('Showing 1 - 3 rows of 3 rows');
  //   expect(updated.findAllByType(PaginationControls).length).toStrictEqual(1);
  //   requestSpy.mockClear();
  // });

  it('assigns data with a userFilterSelection', () => {
    const mockSetIsLoading = jest.fn();
    const mockSetManualPagination = jest.fn();
    const { getByRole } = render(
      <RecoilRoot>
        <DataPreviewTable
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

// TODO: get these to work in a later ticket
describe('DataPreviewTable component - API Error', () => {
  it('shows an apiError message when apiError exists', () => {
    const { getByText } = render(
      <RecoilRoot>
        <DataPreviewTable
          tableProps={{ rawData: { data: TestData }, selectedTable: { rowCount: 10 }, apiError: 'Error', shouldPage: true }}
          setManualPagination={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(getByText('Table failed to load.')).toBeInTheDocument();
  });

  it('displays "Showing 0 - 0 rows of 0 rows" when apiError exists', () => {
    const { getByText } = render(
      <RecoilRoot>
        <DataPreviewTable
          tableProps={{ rawData: { data: MoreTestData }, selectedTable: { rowCount: 11 }, apiError: 'Error', shouldPage: true }}
          setManualPagination={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(getByText(`Showing 0 - 0 rows of 0 rows`)).toBeInTheDocument();
  });

  it('does not render pagination controls if apiError exists && currentPage === 1 even when shouldPage === true', () => {
    const { queryByRole } = render(
      <RecoilRoot>
        <DataPreviewTable
          tableProps={{ rawData: { data: MoreTestData }, selectedTable: { rowCount: 11 }, apiError: 'Error', shouldPage: true }}
          setManualPagination={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(queryByRole('button', { name: 'Previous Page' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: 'Next Page' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: '1' })).not.toBeInTheDocument();
  });
});

describe('Data Preview Table detail view', () => {
  it('renders table with detail view', () => {
    const detailViewState = { value: 'Brennah', secondary: 'Smith' };
    const mockSetIsLoading = jest.fn();
    const mockSetManualPagination = jest.fn();
    const { getByRole } = render(
      <RecoilRoot>
        <DataPreviewTable
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
