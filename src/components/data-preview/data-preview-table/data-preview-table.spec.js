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
import DtgTable from '../../dtg-table/dtg-table';

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

  it('caption is added to table when provided in config', () => {
    const testCaption = 'Test Caption Value';
    const captionComponent = renderer.create(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestDataOneRow, caption: testCaption }} />
      </RecoilRoot>
    );
    const captionInstance = captionComponent.root;
    expect(captionInstance.findByType('table').findAllByType('caption')[0]).toBeDefined();
    expect(captionInstance.findByType('caption').props.children).toMatch(testCaption);
  });

  it('does not blow up when there is no data in a table', () => {
    const noDataComponent = renderer.create(
      <RecoilRoot>
        <DataPreviewTable tableProps={{}} />
      </RecoilRoot>
    );
    const noDataInstance = noDataComponent.root;

    expect(noDataInstance);
  });

  it('allows the table width to be set when specified', () => {
    const width = 2000;

    renderer.act(() => {
      component.update(
        <RecoilRoot>
          <DtgTable tableProps={{ data: TestData, width }} />
        </RecoilRoot>
      );
    });

    expect(instance.findByType('table').props.style.width).toBe(`${width}px`);
  });

  it('supports a noBorder configuration', () => {
    const componentJSON = component.toJSON();
    let table = componentJSON.children.find(e => e.props['data-test-id'] === 'table-content');
    expect(table.children[0].children.filter(e => e.props.className.includes('noBorder')).length).toEqual(0);

    renderer.act(() => {
      component.update(
        <RecoilRoot>
          <DtgTable tableProps={{ data: TestData, noBorder: true }} />
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

  it('renders the number of rows specified in props', () => {
    const perPage = 3;
    const newComponent = renderer.create();
    renderer.act(() => {
      newComponent.update(
        <RecoilRoot>
          <DtgTable tableProps={{ data: TestData }} perPage={perPage} />
        </RecoilRoot>
      );
    });

    const updated = newComponent.root;
    expect(updated.findByType('tbody').findAllByType('tr').length).toEqual(perPage);
  });

  it('renders the defaultRowsPer if shouldPage === true but perPage is not specified and shows range of rows showing out of total number of rows with correct default itemsPerPage', () => {
    const newComponent = renderer.create();
    renderer.act(() => {
      newComponent.update(
        <RecoilRoot>
          <DtgTable tableProps={{ data: MoreTestData, shouldPage: true }} />
        </RecoilRoot>
      );
    });

    const updated = newComponent.root;
    expect(updated.findByType('tbody').findAllByType('tr').length).toEqual(10);
    const maxRows = MoreTestData.length;
    const rowsShowing = updated.findByProps({ 'data-test-id': 'rows-showing' });
    expect(rowsShowing.props.children).toMatch(`Showing 1 - 10 rows of ${maxRows} rows`);
  });

  it('sets a timer for the loading indicator', async () => {
    const spy = jest.spyOn(helpers, 'loadingTimeout');
    spy.mockClear();
    let newComponent = renderer.create();
    renderer.act(() => {
      newComponent = renderer.create(
        <RecoilRoot>
          <DtgTable tableProps={mockPaginatedTableProps} />
        </RecoilRoot>
      );
    });

    jest.advanceTimersByTime(helpers.loadTimerDelay * 2);
    await expect(spy).toBeCalledTimes(1);
  });

  it('sets table aria prop with a single attribute and value', () => {
    const aria = { 'aria-describedby': 'my-test-id' };
    const newComponent = renderer.create();
    renderer.act(() => {
      newComponent.update(
        <RecoilRoot>
          <DtgTable
            tableProps={{
              data: TestData,
              aria: aria,
            }}
          />
        </RecoilRoot>
      );
    });
    const updated = newComponent.root;
    const table = updated.findByType('table');
    expect(table.props['aria-describedby']).toBe('my-test-id');
  });

  it('renders pagination Controls when there are more rows than the minimum rows-per-page-option and shouldPage is set to true', () => {
    const newComponent = renderer.create();
    renderer.act(() => {
      newComponent.update(
        <RecoilRoot>
          <DtgTable tableProps={{ data: TestData, shouldPage: true }} />
        </RecoilRoot>
      );
    });
    const updated = newComponent.root;
    expect(updated.findAllByType(PaginationControls).length).toStrictEqual(1);
  });

  it('does render pagination Controls when the table is configured to load page-by-page, so long as there are more total available rows than the minimum rows-per-page-option and shouldPage is set to true', async () => {
    jest.useFakeTimers();
    const requestSpy = jest.spyOn(ApiUtils, 'pagedDatatableRequest').mockReturnValue(Promise.resolve(longerPaginatedDataResponse));

    let newComponent = renderer.create();
    await renderer.act(async () => {
      newComponent = await renderer.create(
        <RecoilRoot>
          <DtgTable tableProps={mockPaginatedTableProps} setIsLoading={jest.fn()} />
        </RecoilRoot>
      );
      jest.runAllTimers();
    });
    const updated = newComponent.root;
    expect(requestSpy).toBeCalled();
    const rowsShowing = updated.findByProps({ 'data-test-id': 'rows-showing' });
    expect(rowsShowing.props.children).toMatch('Showing 1 - 10 rows of 11 rows');
    expect(updated.findAllByType(PaginationControls).length).toStrictEqual(1);
    requestSpy.mockClear();
  });

  it('does not render pagination Controls even when the table is configured to load page-by-page, so long as there are not more total available rows than the minimum rows-per-page-option and shouldPage is set to true', async () => {
    jest.useFakeTimers();
    const requestSpy = jest.spyOn(ApiUtils, 'pagedDatatableRequest').mockReturnValue(Promise.resolve(shortPaginatedDataResponse));

    let newComponent = renderer.create();
    await renderer.act(async () => {
      newComponent = await renderer.create(
        <RecoilRoot>
          <DtgTable tableProps={mockPaginatedTableProps} setIsLoading={jest.fn()} />
        </RecoilRoot>
      );
      jest.runAllTimers();
    });
    const updated = newComponent.root;
    expect(requestSpy).toBeCalled();
    const rowsShowing = updated.findByProps({ 'data-test-id': 'rows-showing' });
    expect(rowsShowing.props.children).toMatch('Showing 1 - 3 rows of 3 rows');
    expect(updated.findAllByType(PaginationControls).length).toStrictEqual(1);
    requestSpy.mockClear();
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

// TODO: get these to work in a later ticket
// describe('DataPreviewTable component - API Error', () => {
//   let component = renderer.create();
//   renderer.act(() => {
//     component = renderer.create(
//       <RecoilRoot>
//         <DataPreviewTable tableProps={{ data: TestData, apiError: 'Error', shouldPage: true }} />{' '}
//       </RecoilRoot>
//     );
//   });
//   const componentJSON = component.toJSON();
//   const footer = componentJSON[0].children.find(e => e.props['data-test-id'] === 'table-footer');
//
//   it('shows an apiError message when apiError exists', () => {
//     const table = componentJSON[0].children.find(e => e.props['data-test-id'] === 'table-content');
//     expect(table.children.filter(e => e.props['data-test-id'] === 'api-error').length).toEqual(1);
//   });
//
//   it('displays "Showing 0 - 0 rows of 0 rows" when apiError exists', () => {
//     const rowsShowing = footer.children.find(e => e.props['data-test-id'] === 'rows-showing');
//     expect(rowsShowing.children[0]).toMatch(`Showing 0 - 0 rows of 0 rows`);
//   });
//
//   it('does not render pagination controls if apiError exists && currentPage === 1 even when shouldPage === true', () => {
//     expect(footer.children.find(e => e.type === PaginationControls)).toBeUndefined();
//   });
// });

describe('DtgTable component with shouldPage property and tableData with only one row', () => {
  let component19 = renderer.create();
  renderer.act(() => {
    component19 = renderer.create(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestDataOneRow, shouldPage: true }} />
      </RecoilRoot>
    );
  });
  const instance19 = component19.root;

  it('does show table footer if shouldPage property is included in tableProps', () => {
    expect(instance19.findByProps({ 'data-test-id': 'table-footer' })).toBeDefined();
  });
  it('shows the "x of x rows" message with correct grammar if only one row of data exists', () => {
    expect(instance19.findByProps({ 'data-test-id': 'rows-showing' }).children[0]).toBe('Showing 1 - 1  of 1 row');
  });

  it('does not render pagination controls when fewer rows than the lowest available rows-per-page option in the pagination controls', () => {
    expect(instance19.findAllByType(PaginationControls).length).toStrictEqual(1);
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
