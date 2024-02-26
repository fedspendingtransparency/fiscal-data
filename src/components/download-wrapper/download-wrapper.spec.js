import React from 'react';
import renderer from 'react-test-renderer';
import { act, render } from '@testing-library/react';
import DownloadWrapper, { cancelEventLabelStr } from './download-wrapper';
import DownloadItemButton from './download-item-button/download-item-button';
import Analytics from '../../utils/analytics/analytics';
import { enableFetchMocks } from 'jest-fetch-mock';
import { downloadsContext } from '../persist/download-persist/downloads-persist';
import DownloadModal from '../download-modal/download-modal';
import { RecoilRoot } from 'recoil';
import { disableDownloadButtonState } from '../../recoil/disableDownloadButtonState';

jest.mock('../truncate/truncate.jsx', function() {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(({ children }) => children),
  };
});

jest.useFakeTimers();

describe('DownloadWrapper', () => {
  enableFetchMocks();
  let createObjectURL;

  const mockSelectedTableWithUserFilter = {
    tableName: 'Table 1',
    userFilter: {
      label: 'Country-Currency',
      field: 'country_currency_desc',
    },
  };

  const mockSelectedUserFilter = {
    label: 'Atlantis-Aquabuck',
    value: 'Atlantis-Aquabuck',
  };

  const mockSelectedDetailViewFilter = {
    label: 'CUSIP',
    field: 'cusip',
    value: 'ABCD123',
  };

  beforeAll(() => {
    createObjectURL = global.URL.createObjectURL;
    global.URL.createObjectURL = jest.fn();
  });

  afterAll(() => {
    global.URL.createObjectURL = createObjectURL;
  });

  // Jest gives an error about the following not being implemented even though the tests pass.
  HTMLCanvasElement.prototype.getContext = jest.fn();

  const nonFilteredDate = 'ALL';
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <RecoilRoot>
        <DownloadWrapper selectedTable={{}} dataset={{ name: 'Mock dataset' }} />
      </RecoilRoot>
    );
  });
  const instance = component.root;

  const downloadItemButtons = instance.findAllByType(DownloadItemButton);

  it('renders the component', () => {
    const theComponent = instance.findByProps({ 'data-test-id': 'wrapper' });
    expect(theComponent).toBeDefined();
  });

  it('updates the table name when the table object is passed into the component', () => {
    const curTableName = 'Table 1';
    const selectedTable = {
      tableName: curTableName,
    };
    renderer.act(() => {
      component.update(
        <RecoilRoot>
          <DownloadWrapper selectedTable={selectedTable} dataset={{ name: 'Mock Dataset' }} />
        </RecoilRoot>
      );
    });

    const tableName = instance.findByProps({ 'data-test-id': 'tableNameText' });
    expect(tableName.props.children).toEqual(curTableName);
  });

  it('updates the date string when isFiltered is true (logic handled by DataTableSelect component)', () => {
    const dateRange = { from: new Date('01/01/2020'), to: new Date('11/01/2020') };
    const isFiltered = true;
    renderer.act(() => {
      component.update(
        <RecoilRoot>
          <DownloadWrapper selectedTable={{}} dataset={{ name: 'Mock Dataset', techSpecs: {} }} dateRange={dateRange} isFiltered={isFiltered} />
        </RecoilRoot>
      );
    });

    const expectedDateString = '01/01/2020 - 11/01/2020';
    const tableName = instance.findByProps({ 'data-test-id': 'dateString' });
    expect(tableName.children).toContain(expectedDateString);
  });

  it('does not update the date string when an invalid date range is given', () => {
    const dateRange = { from: new Date('00/00/2020'), to: new Date('99/99/2020') };
    renderer.act(() => {
      component.update(
        <RecoilRoot>
          <DownloadWrapper selectedTable={{}} dataset={{ name: 'Mock Dataset', techSpecs: {} }} dateRange={dateRange} />
        </RecoilRoot>
      );
    });

    const expectedDateString = '01/01/2020 - 11/01/2020';
    const tableName = instance.findByProps({ 'data-test-id': 'dateString' });
    expect(tableName.children).toContain(expectedDateString);
  });

  it('provides both the "ALL" text and date string if full date range is selected', () => {
    const dateRange = { from: new Date('01/01/2020'), to: new Date('11/01/2020') };
    const isFiltered = false;
    renderer.act(() => {
      component.update(
        <RecoilRoot>
          <DownloadWrapper selectedTable={{}} dataset={{ name: 'Mock Dataset', techSpecs: {} }} dateRange={dateRange} isFiltered={isFiltered} />
        </RecoilRoot>
      );
    });

    const allString = instance.findByProps({ 'data-test-id': 'allString' });
    const tableName = instance.findByProps({ 'data-test-id': 'dateString' });
    const expectedDateString = '01/01/2020 - 11/01/2020';
    expect(allString.children).toContain(nonFilteredDate);
    expect(tableName.children).toContain(expectedDateString);
  });

  it('passes an asyncAction to the data dictionary button', () => {
    expect(downloadItemButtons[1].props.asyncAction).toBeDefined();
  });

  it('calls the Analytics.event when the data dictionary button is clicked', () => {
    global.fetch = jest.fn();
    const metadataButton = downloadItemButtons[1];
    const spy = jest.spyOn(Analytics, 'event');

    renderer.act(() => {
      metadataButton.props.asyncAction();
    });
    expect(spy).toHaveBeenCalledWith({
      category: 'Dataset Dictionary Download',
      action: 'Mock Dataset',
    });
  });

  it(`correctly indicates data for all tables will be downloaded when its allTablesSelected
    prop is true`, () => {
    const mockMultiTableDataset = {
      name: 'Mock Dataset',
      apis: [{ apiId: '1' }, { apiId: '2' }],
    };
    renderer.act(() => {
      component.update(
        <RecoilRoot>
          <DownloadWrapper selectedTable={{}} dataset={mockMultiTableDataset} allTablesSelected={true} />
        </RecoilRoot>
      );
    });

    const tableName = instance.findByProps({ 'data-test-id': 'tableNameText' });
    const downloadDataButton = instance.findAllByType(DownloadItemButton)[0];
    expect(tableName.children).toContain('All Data Tables (2)');
    expect(downloadDataButton.props.label).toEqual('Download 2 CSV Files');
  });
  /* TODO: rearrange the following code that's confusingly situated between it() blocks */
  // without only one table selected
  const mockDownloadQueue = []; // so that it can accumulate
  const mockSetDownloadRequest = jest.fn();

  const mockSiteProviderValue = {
    setDownloadModalIsOpen: () => {},
    setDownloadReadyLocation: () => {},
    setDownloadsPrepared: () => {},
    setDatasetsInProgress: () => {},
    downloadsInProgress: [],
    downloadQueue: mockDownloadQueue,
    setDownloadRequest: mockSetDownloadRequest,
  };

  const mockTable = { apiId: '100100', downloadName: 'mocktableable' };
  const mockAnotherTable = { apiId: '200200' };
  const mockDataset = {
    datasetId: 'Mock-Up-Dataset',
    apis: [mockTable, mockAnotherTable],
    techSpecs: {
      earliestDate: '01-01-2020',
      latestDate: '11-01-2020',
    },
    slug: '/mock-dataset/',
  };
  const mockDateRange = {
    from: new Date('01/01/2020'),
    to: new Date('11/01/2020'),
  };

  it('adds a well-formed download request to the downloadsContext downloadQueue', () => {
    const expectedArgs = {
      apis: mockTable,
      dateRange: mockDateRange,
      filename: 'mocktableable_20200101_20201101.zip',
      selectedFileType: 'csv',
    };

    let component = null;
    act(() => {
      component = render(
        <RecoilRoot>
          <downloadsContext.Provider value={mockSiteProviderValue}>
            <DownloadWrapper allTablesSelected={false} selectedTable={mockTable} dataset={mockDataset} dateRange={mockDateRange} />
          </downloadsContext.Provider>
        </RecoilRoot>
      );
      component.getByTestId('download-button').click();
    });
    expect(mockSetDownloadRequest.mock.calls[0][0]).toMatchObject(expectedArgs);
    mockSetDownloadRequest.mockClear();
  });

  it(`adds a well-formed download request to the downloadsContext downloadQueue when the
    allTablesSelected prop is true`, () => {
    const expectedArgs = {
      apis: [mockTable, mockAnotherTable],
      datasetId: mockDataset.datasetId,
      dateRange: mockDateRange,
      filename: 'mock-dataset_all_tables_20200101_20201101.zip',
      selectedFileType: 'csv',
    };

    let component = null;
    act(() => {
      component = render(
        <RecoilRoot>
          <downloadsContext.Provider value={mockSiteProviderValue}>
            <DownloadWrapper allTablesSelected selectedTable={mockAnotherTable} dataset={mockDataset} dateRange={mockDateRange} />
          </downloadsContext.Provider>
        </RecoilRoot>
      );
      component.getByTestId('download-button').click();
    });
    expect(mockSetDownloadRequest.mock.calls[0][0]).toMatchObject(expectedArgs);
  });

  it('triggers a GA event when the cancel event is triggered within the modal', () => {
    const modal = instance.findByType(DownloadModal);
    const spy = jest.spyOn(Analytics, 'event');
    spy.mockClear();
    renderer.act(() => {
      modal.props.setCancelDownloadRequest(true);
    });

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ label: cancelEventLabelStr }));
  });

  it('displays detailViewFilter selection when applied', () => {
    const curTableName = 'Table 1';
    const selectedTable = {
      tableName: curTableName,
    };
    renderer.act(() => {
      component.update(
        <RecoilRoot>
          <DownloadWrapper selectedTable={selectedTable} dataset={{ name: 'Mock Dataset' }} selectedDetailViewFilter={mockSelectedDetailViewFilter} />
        </RecoilRoot>
      );
    });

    const filterName = instance.findByProps({ 'data-testid': 'detailViewFilterLabel' });
    expect(filterName.props.children).toEqual(['CUSIP', ':']);
    const filterValue = instance.findByProps({ 'data-testid': 'detailViewFilterValue' });
    expect(filterValue.props.children).toEqual('ABCD123');
  });

  it('creates the expected download configuration when a detailViewFilter is applied', () => {
    const curTableName = 'Table 1';
    const selectedTable = {
      tableName: curTableName,
    };
    mockSetDownloadRequest.mockClear();

    const expectedArgs = {
      apis: selectedTable,
      datasetId: mockDataset.datasetId,
      dateRange: mockDateRange,
      selectedFileType: 'csv',
      selectedDetailViewFilter: mockSelectedDetailViewFilter,
    };

    let component = null;
    act(() => {
      component = render(
        <RecoilRoot>
          <downloadsContext.Provider value={mockSiteProviderValue}>
            <DownloadWrapper
              allTablesSelected={false}
              selectedTable={selectedTable}
              dataset={mockDataset}
              dateRange={mockDateRange}
              selectedDetailViewFilter={mockSelectedDetailViewFilter}
            />
          </downloadsContext.Provider>
        </RecoilRoot>
      );
      component.getByTestId('download-button').click();
    });
    expect(mockSetDownloadRequest.mock.calls[0][0]).toMatchObject(expectedArgs);
    mockSetDownloadRequest.mockClear();
  });

  it('displays userFilter selection when applied', () => {
    renderer.act(() => {
      component.update(
        <RecoilRoot>
          <DownloadWrapper
            selectedTable={mockSelectedTableWithUserFilter}
            dataset={{ name: 'Mock Dataset' }}
            selectedUserFilter={mockSelectedUserFilter}
          />
        </RecoilRoot>
      );
    });

    const filterName = instance.findByProps({ 'data-testid': 'userFilterLabel' });
    expect(filterName.props.children).toEqual(['Country-Currency', ':']);
    const filterValue = instance.findByProps({ 'data-testid': 'userFilterValue' });
    expect(filterValue.props.children).toEqual('Atlantis-Aquabuck');
  });

  it('displays (None Selected) when userFilter is available but not selected', () => {
    // with no selection at all
    renderer.act(() => {
      component.update(
        <RecoilRoot>
          <DownloadWrapper selectedTable={mockSelectedTableWithUserFilter} dataset={{ name: 'Mock Dataset' }} selectedUserFilter={null} />
        </RecoilRoot>
      );
    });

    const filterName = instance.findByProps({ 'data-testid': 'userFilterLabel' });
    expect(filterName.props.children).toEqual(['Country-Currency', ':']);
    const filterValue = instance.findByProps({ 'data-testid': 'userFilterValue' });
    expect(filterValue.props.children).toEqual('(None selected)');
  });

  it('creates the expected download configuration when a userFilter is applied', () => {
    mockSetDownloadRequest.mockClear();

    const expectedArgs = {
      apis: mockSelectedTableWithUserFilter,
      datasetId: mockDataset.datasetId,
      dateRange: mockDateRange,
      selectedFileType: 'csv',
      selectedUserFilter: mockSelectedUserFilter,
    };

    let component = null;
    act(() => {
      component = render(
        <RecoilRoot>
          <downloadsContext.Provider value={mockSiteProviderValue}>
            <DownloadWrapper
              allTablesSelected={false}
              selectedTable={mockSelectedTableWithUserFilter}
              dataset={mockDataset}
              dateRange={mockDateRange}
              selectedUserFilter={mockSelectedUserFilter}
            />
          </downloadsContext.Provider>
        </RecoilRoot>
      );
      component.getByTestId('download-button').click();
    });
    expect(mockSetDownloadRequest.mock.calls[0][0]).toMatchObject(expectedArgs);
    mockSetDownloadRequest.mockClear();
  });

  it('disables the download button when the recoil state is set to true', () => {
    const mockedState = { disableDownloadButtonState: false };
    const { getByRole } = render(
      <RecoilRoot initializeState={snapshot => snapshot.set(disableDownloadButtonState, mockedState)}>
        <downloadsContext.Provider value={mockSiteProviderValue}>
          <DownloadWrapper
            allTablesSelected={false}
            selectedTable={mockSelectedTableWithUserFilter}
            dataset={mockDataset}
            dateRange={mockDateRange}
            selectedUserFilter={mockSelectedUserFilter}
          />
        </downloadsContext.Provider>
      </RecoilRoot>
    );
    expect(getByRole('button', { name: 'Download CSV File' })).toBeDisabled();
  });
});
