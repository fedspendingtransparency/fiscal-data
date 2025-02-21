import React from 'react';
import renderer from 'react-test-renderer';
import DtgTable from './dtg-table';
import {
  longerPaginatedDataResponse,
  mockPaginatedTableProps,
  shortPaginatedDataResponse,
  TestData,
  TestDataOneRow,
  MoreTestData,
  DetailViewTestData,
} from './test-data';
import PaginationControls from '../pagination/pagination-controls';
import * as ApiUtils from '../../utils/api-utils';
import * as helpers from './dtg-table-helper';
import { RecoilRoot } from 'recoil';
import { render } from '@testing-library/react';

describe('DTG table component', () => {
  jest.useFakeTimers();

  beforeEach(() => jest.resetAllMocks());

  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData }} />
      </RecoilRoot>
    );
  });
  const instance = component.root;

  it('renders a table', () => {
    expect(instance.findByType('table')).toBeDefined();
  });

  it('renders a row for each item in the data array', () => {
    expect(instance.findByType('tbody').findAllByType('tr').length).toEqual(TestData.length);
  });

  it('renders a column for every item in the data', () => {
    expect(instance.findByType('thead').findAllByType('th').length).toEqual(Object.keys(TestData[0]).length);
  });

  it('does not blow up when a column config is not provided', () => {
    const liteComponent = renderer.create(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData }} />
      </RecoilRoot>
    );
    const liteInstance = liteComponent.root;

    expect(liteInstance.findByType('thead')).toBeDefined();
  });
  it('no caption in table when caption is not provided in config', () => {
    expect(instance.findByType('table').findAllByType('caption')[0]).toBeUndefined();
  });
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
        <DtgTable tableProps={{}} />
      </RecoilRoot>
    );
    const noDataInstance = noDataComponent.root;

    expect(noDataInstance);
  });

  it('sets table width to auto when width is unspecified', () => {
    expect(instance.findByType('table').props.style.width).toBe('auto');
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
    const perPage = 7;
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
    await expect(spy).toBeCalledTimes(2);
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
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <RecoilRoot>
        <DtgTable tableProps={{ data: TestData, apiError: 'Error', shouldPage: true }} />{' '}
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
});
describe('DTG table pagination tests', () => {
  // A small dataset (fewer than the minimum per-page option)
  const smallTestData = [{ first: 'Brennah', middle: 'McRae', last: 'Francis' }];

  // A big dataset (more than the minimum per-page option, assume defaultPerPageOptions[0] is 10)
  const bigTestData = Array.from({ length: 15 }, (_, i) => ({
    first: `Test${i}`,
    middle: `Middle${i}`,
    last: `User${i}`,
  }));

  it('does not render pagination controls when total rows are less than or equal to the lowest default per-page option', () => {
    const component = renderer.create(
      <RecoilRoot>
        <DtgTable tableProps={{ data: smallTestData, shouldPage: true }} />
      </RecoilRoot>
    );
    const instance = component.root;
    expect(instance.findAllByType(PaginationControls)).toHaveLength(0);
  });

  it('renders pagination controls when total rows exceed the lowest default per-page option', () => {
    const component = renderer.create(
      <RecoilRoot>
        <DtgTable tableProps={{ data: bigTestData, shouldPage: true }} />
      </RecoilRoot>
    );
    const instance = component.root;
    // Expect the PaginationControls to render
    expect(instance.findAllByType(PaginationControls)).toHaveLength(1);
    // Also check that the rows showing text correctly reflects the total number of rows
    const rowsShowing = instance.findByProps({ 'data-test-id': 'rows-showing' });
    // It should show rows 1-10 out of 15 rows
    expect(rowsShowing.props.children).toMatch(`Showing 1 - 10 rows of ${bigTestData.length} rows`);
  });
});

describe('DTG Table detail view', () => {
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
