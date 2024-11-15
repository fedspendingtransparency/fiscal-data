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
import * as helpers from '../../dtg-table/dtg-table-helper';
import { RecoilRoot } from 'recoil';
import { render } from '@testing-library/react';
import DataPreviewTable from './data-preview-table';

describe('DataPreviewTable component', () => {
  jest.useFakeTimers();

  beforeEach(() => jest.resetAllMocks());

  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <RecoilRoot>
        <DataPreviewTable tableProps={{ data: TestData }} />
      </RecoilRoot>
    );
  });
  const instance = component.root;

  it('does not blow up when there is no data in a table', () => {
    const noDataComponent = renderer.create(
      <RecoilRoot>
        <DataPreviewTable tableProps={{}} />
      </RecoilRoot>
    );
    const noDataInstance = noDataComponent.root;

    expect(noDataInstance);
  });

  it('supports a noBorder configuration', () => {
    const componentJSON = component.toJSON();
    let table = componentJSON.children.find(e => e.props['data-test-id'] === 'table-content');
    expect(table.children[0].children.filter(e => e.props.className.includes('noBorder')).length).toEqual(0);

    renderer.act(() => {
      component.update(
        <RecoilRoot>
          <DataPreviewTable tableProps={{ data: TestData, noBorder: true }} />
        </RecoilRoot>
      );
    });

    const updatedJSON = component.toJSON();
    table = updatedJSON.children.find(e => e.props['data-test-id'] === 'table-content');
    expect(table.children[0].children.filter(e => e.props.className.includes('noBorder')).length).toEqual(1);
  });

  it('does not show pagination controls by default', () => {
    expect(instance.findAllByType(PaginationControls)).toStrictEqual([]);
  });

  it('does not show table footer if shouldPage property is not included in tableProps', () => {
    expect(instance.findAllByProps({ 'data-test-id': 'table-footer' })).toHaveLength(0);
  });

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

describe('DataPreviewTable component - API Error', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <RecoilRoot>
        <DataPreviewTable tableProps={{ data: TestData, apiError: 'Error', shouldPage: true }} />{' '}
      </RecoilRoot>
    );
  });
  const componentJSON = component.toJSON();
  const footer = componentJSON[0].children.find(e => e.props['data-test-id'] === 'table-footer');

  it('shows an apiError message when apiError exists', () => {
    const table = componentJSON[0].children.find(e => e.props['data-test-id'] === 'table-content');
    expect(table.children.filter(e => e.props['data-test-id'] === 'api-error').length).toEqual(1);
  });

  it('displays "Showing 0 - 0 rows of 0 rows" when apiError exists', () => {
    const rowsShowing = footer.children.find(e => e.props['data-test-id'] === 'rows-showing');
    expect(rowsShowing.children[0]).toMatch(`Showing 0 - 0 rows of 0 rows`);
  });

  it('does not render pagination controls if apiError exists && currentPage === 1 even when shouldPage === true', () => {
    expect(footer.children.find(e => e.type === PaginationControls)).toBeUndefined();
  });
});

describe('DTG Table detail view', () => {
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
