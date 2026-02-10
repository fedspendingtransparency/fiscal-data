import React from 'react';
import { waitFor, render, within, screen } from '@testing-library/react';
import DownloadWrapper from './download-wrapper';
import downloadClickHandler from './download-wrapper'
import Analytics from '../../utils/analytics/analytics';
import { enableFetchMocks } from 'jest-fetch-mock';
import { downloadsContext } from '../persist/download-persist/downloads-persist';
import { RecoilRoot } from 'recoil';
import { disableDownloadButtonState } from '../../recoil/disableDownloadButtonState';
import userEvent from '@testing-library/user-event';

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

  it('renders the component', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DownloadWrapper selectedTable={{}} dataset={{ name: 'Mock dataset' }} setDisableDownloadBanner={jest.fn()} />
      </RecoilRoot>
    );
    const theComponent = getByTestId('wrapper');
    expect(theComponent).toBeInTheDocument();
  });

  it('updates the table name when the table object is passed into the component', () => {
    const curTableName = 'Table 1';
    const selectedTable = {
      tableName: curTableName,
    };
    const { getByText } = render(
      <RecoilRoot>
        <DownloadWrapper selectedTable={selectedTable} dataset={{ name: 'Mock Dataset' }} setDisableDownloadBanner={jest.fn()} />
      </RecoilRoot>
    );

    const tableName = getByText(curTableName);
    expect(tableName).toBeInTheDocument();
  });

  it('updates the date string when isFiltered is true (logic handled by DataTableSelect component)', () => {
    const dateRange = { from: new Date('01/01/2020'), to: new Date('11/01/2020') };
    const isFiltered = true;
    const { getByText } = render(
      <RecoilRoot>
        <DownloadWrapper
          selectedTable={{}}
          dataset={{ name: 'Mock Dataset', techSpecs: {} }}
          dateRange={dateRange}
          isFiltered={isFiltered}
          setDisableDownloadBanner={jest.fn()}
        />
      </RecoilRoot>
    );

    const expectedDateString = '01/01/2020 - 11/01/2020';
    expect(getByText(expectedDateString)).toBeInTheDocument();
  });

  it('does not update the date string when an invalid date range is given', () => {
    const dateRange = { from: new Date('01/01/2020'), to: new Date('11/01/2020') };
    const invalidDateRange = { from: new Date('00/00/2020'), to: new Date('99/99/2020') };
    const { getByText, rerender } = render(
      <RecoilRoot>
        <DownloadWrapper
          selectedTable={{}}
          dataset={{ name: 'Mock Dataset', techSpecs: {} }}
          dateRange={dateRange}
          setDisableDownloadBanner={jest.fn()}
        />
      </RecoilRoot>
    );

    rerender(
      <RecoilRoot>
        <DownloadWrapper
          selectedTable={{}}
          dataset={{ name: 'Mock Dataset', techSpecs: {} }}
          dateRange={invalidDateRange}
          setDisableDownloadBanner={jest.fn()}
        />
      </RecoilRoot>
    );

    const expectedDateString = '01/01/2020 - 11/01/2020';
    expect(getByText(expectedDateString)).toBeInTheDocument();
  });

  it('provides both the "ALL" text and date string if full date range is selected', () => {
    const dateRange = { from: new Date('01/01/2020'), to: new Date('11/01/2020') };
    const isFiltered = false;
    const { getByText } = render(
      <RecoilRoot>
        <DownloadWrapper
          selectedTable={{}}
          dataset={{ name: 'Mock Dataset', techSpecs: {} }}
          dateRange={dateRange}
          isFiltered={isFiltered}
          setDisableDownloadBanner={jest.fn()}
        />
      </RecoilRoot>
    );

    const allString = getByText(nonFilteredDate);
    const expectedDateString = '01/01/2020 - 11/01/2020';
    const dateString = getByText(expectedDateString);
    expect(allString).toBeInTheDocument();
    expect(dateString).toBeInTheDocument();
  });

  it('calls the Analytics.event when the data dictionary button is clicked', () => {
    global.fetch = jest.fn();
    const { getAllByRole } = render(
      <RecoilRoot>
        <DownloadWrapper selectedTable={{}} dataset={{ name: 'Mock Dataset' }} setDisableDownloadBanner={jest.fn()} />
      </RecoilRoot>
    );
    const metadataButton = getAllByRole('button')[0];
    const spy = jest.spyOn(Analytics, 'event');

    userEvent.click(metadataButton);
    expect(spy).toHaveBeenCalledWith({
      category: 'Dataset Dictionary Download',
      action: 'Data Dictionary Click',
      label: 'Mock Dataset',
    });
  });

  it(`correctly indicates data for all tables will be downloaded when its allTablesSelected
    prop is true`, () => {
    const mockMultiTableDataset = {
      name: 'Mock Dataset',
      apis: [{ apiId: '1' }, { apiId: '2' }],
    };
    const { getByText, getByTestId, rerender } = render(
      <RecoilRoot>
        <DownloadWrapper selectedTable={{}} dataset={{ name: 'Mock dataset' }} setDisableDownloadBanner={jest.fn()} />
      </RecoilRoot>
    );

    rerender(
      <RecoilRoot>
        <DownloadWrapper selectedTable={{}} dataset={mockMultiTableDataset} allTablesSelected={true} setDisableDownloadBanner={jest.fn()} />
      </RecoilRoot>
    );

    const tableName = getByText('All Data Tables (2)');
    const downloadDataButton = getByTestId('download-button');
    expect(tableName).toBeInTheDocument();
    expect(within(downloadDataButton).getByText('Download 2 CSV Files')).toBeInTheDocument();
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
    downloadsInProgress: [{ readyForDownload: false, status: 'incomplete' }],
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

    const { getByTestId } = render(
      <RecoilRoot>
        <downloadsContext.Provider value={mockSiteProviderValue}>
          <DownloadWrapper
            allTablesSelected={false}
            selectedTable={mockTable}
            dataset={mockDataset}
            dateRange={mockDateRange}
            setDisableDownloadBanner={jest.fn()}
          />
        </downloadsContext.Provider>
      </RecoilRoot>
    );
    userEvent.click(getByTestId('download-button'));
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

    const { getByTestId } = render(
      <RecoilRoot>
        <downloadsContext.Provider value={mockSiteProviderValue}>
          <DownloadWrapper
            allTablesSelected
            selectedTable={mockAnotherTable}
            dataset={mockDataset}
            dateRange={mockDateRange}
            setDisableDownloadBanner={jest.fn()}
          />
        </downloadsContext.Provider>
      </RecoilRoot>
    );
    userEvent.click(getByTestId('download-button'));
    expect(mockSetDownloadRequest.mock.calls[0][0]).toMatchObject(expectedArgs);
  });
  // TODO *****************************
  // it('triggers a GA event when the cancel event is triggered within the modal', async () => {
  // const modal = instance.findByType(DownloadModal);
  // const spy = jest.spyOn(Analytics, 'event');
  // spy.mockClear();
  // const { findByRole, getByTestId } = render(
  //   <RecoilRoot>
  //     <downloadsContext.Provider value={mockSiteProviderValue}>
  //       <DownloadWrapper selectedTable={mockAnotherTable} dataset={mockDataset} dateRange={mockDateRange} setDisableDownloadBanner={jest.fn()} />
  //     </downloadsContext.Provider>
  //   </RecoilRoot>
  // );
  // userEvent.click(getByTestId('download-button'));
  // const cancelButton = await findByRole('button', { name: 'Cancel Download' });
  // const gaLabel =
  //   'Table Name: undefined, Type: csv, Date Range: Wed Jan 01 2020 00:00:00 GMT-0600 (Central Standard Time)-Sun Nov 01 2020 00:00:00 GMT-0500 (Central Daylight Time)';
  // expect(spy).toHaveBeenCalled();
  // expect(spy).toHaveBeenCalledWith(expect.objectContaining({ action: cancelEventActionStr }));
  // });

  it('displays detailViewFilter selection when applied', () => {
    const curTableName = 'Table 1';
    const selectedTable = {
      tableName: curTableName,
    };
    const { getByTestId } = render(
      <RecoilRoot>
        <DownloadWrapper
          selectedTable={selectedTable}
          dataset={{ name: 'Mock Dataset' }}
          selectedDetailViewFilter={mockSelectedDetailViewFilter}
          setDisableDownloadBanner={jest.fn()}
        />
      </RecoilRoot>
    );

    const filterName = getByTestId('detailViewFilterLabel');
    expect(within(filterName).getByText('CUSIP:')).toBeInTheDocument();
    const filterValue = getByTestId('detailViewFilterValue');
    expect(within(filterValue).getByText('ABCD123')).toBeInTheDocument();
  });

  it('creates the expected download configuration when a detailViewFilter is applied', async () => {
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

    const { getByTestId } = render(
      <RecoilRoot>
        <downloadsContext.Provider value={mockSiteProviderValue}>
          <DownloadWrapper
            allTablesSelected={false}
            selectedTable={selectedTable}
            dataset={mockDataset}
            dateRange={mockDateRange}
            selectedDetailViewFilter={mockSelectedDetailViewFilter}
            setDisableDownloadBanner={jest.fn()}
          />
        </downloadsContext.Provider>
      </RecoilRoot>
    );
    userEvent.click(getByTestId('download-button'));

    await waitFor(() => expect(mockSetDownloadRequest).toHaveBeenCalledWith(expect.objectContaining(expectedArgs)));
    mockSetDownloadRequest.mockClear();
  });

  it('displays userFilter selection when applied', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DownloadWrapper
          selectedTable={mockSelectedTableWithUserFilter}
          dataset={{ name: 'Mock Dataset' }}
          selectedUserFilter={mockSelectedUserFilter}
          setDisableDownloadBanner={jest.fn()}
        />
      </RecoilRoot>
    );

    const filterName = getByTestId('userFilterLabel');
    expect(within(filterName).getByText('Country-Currency:')).toBeInTheDocument();
    const filterValue = getByTestId('userFilterValue');
    expect(within(filterValue).getByText('Atlantis-Aquabuck')).toBeInTheDocument();
  });

  it('displays (None Selected) when userFilter is available but not selected', () => {
    // with no selection at all
    const { getByTestId } = render(
      <RecoilRoot>
        <DownloadWrapper
          selectedTable={mockSelectedTableWithUserFilter}
          dataset={{ name: 'Mock Dataset' }}
          selectedUserFilter={null}
          setDisableDownloadBanner={jest.fn()}
        />
      </RecoilRoot>
    );

    const filterName = getByTestId('userFilterLabel');
    expect(within(filterName).getByText('Country-Currency:')).toBeInTheDocument();

    const filterValue = getByTestId('userFilterValue');
    expect(within(filterValue).getByText('(None selected)')).toBeInTheDocument();
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

    const { getByTestId } = render(
      <RecoilRoot>
        <downloadsContext.Provider value={mockSiteProviderValue}>
          <DownloadWrapper
            allTablesSelected={false}
            selectedTable={mockSelectedTableWithUserFilter}
            dataset={mockDataset}
            dateRange={mockDateRange}
            selectedUserFilter={mockSelectedUserFilter}
            setDisableDownloadBanner={jest.fn()}
          />
        </downloadsContext.Provider>
      </RecoilRoot>
    );
    userEvent.click(getByTestId('download-button'));

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
            setDisableDownloadBanner={jest.fn()}
          />
        </downloadsContext.Provider>
      </RecoilRoot>
    );
    expect(getByRole('button', { name: 'Download CSV File' })).toBeDisabled();
  });

  it('updates selected file type and enables download when format selected', async () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DownloadWrapper
          selectedTable={mockSelectedTableWithUserFilter}
          dataset={{ name: 'Mock Dataset' }}
          selectedUserFilter={mockSelectedUserFilter}
          setDisableDownloadBanner={jest.fn()}
        />
      </RecoilRoot>
    );
    const jsonRadio = screen.getByRole('radio', { name: /json/i });
    await userEvent.click(jsonRadio)

    expect(screen.getByText(/download\s+json\s+file/i)).toBeInTheDocument();
    expect(screen.getByTestId('download-button')).toBeInTheDocument();
  });
});
