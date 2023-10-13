import React from 'react';
import { act, render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import DownloadSticky, { dsTextContent } from './download-sticky';
import { downloadsContext } from '../persist/download-persist/downloads-persist';
import * as styles from './download-sticky.module.scss';
import '@testing-library/jest-dom';
import { StickyFooterComponent } from '../sticky-footer/sticky-footer';
import * as gaHelper from '../../layouts/dataset-detail/helper';

jest.useFakeTimers();
describe('DownloadSticky component', () => {
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

  const mockDownload = [
    {
      apis: mockTable,
      dataset: mockDataset,
      dateRange: mockDateRange,
      downloadUrl: '/mockFileKey/fiscalaccounts_20190101_20200101.zip',
      filename: 'fiscalaccounts_20190101_20200101.zip',
      prepStarted: true,
      requestTime: 1000,
      selectedFileType: 'csv',
      statusPath: 'mockFileKey',
    },
  ];

  it('renders when the downloadModal is not open, and a download is being prepared', () => {
    const mockSiteProviderValue = {
      downloadModalIsOpen: false,
      setDownloadModalIsOpen: jest.fn(),
      downloadQueue: [],
      downloadsInProgress: mockDownload,
      downloadsPrepared: [],
    };

    let component = null;
    act(() => {
      component = render(
        <downloadsContext.Provider value={mockSiteProviderValue}>
          <DownloadSticky />
        </downloadsContext.Provider>
      );
    });
    jest.runAllTimers();
    expect(component.queryByTestId('download-sticky-content')).toBeTruthy();
  });

  it('displays nothing when the downloadModal is open', () => {
    const mockSiteProviderValue = {
      downloadModalIsOpen: true,
      setDownloadModalIsOpen: jest.fn(),
      downloadQueue: [],
      downloadFilePath: '',
      downloadStatusPath: '',
      preparingDownload: true,
      downloadsPrepared: [],
    };

    let component = null;
    act(() => {
      component = render(
        <downloadsContext.Provider value={mockSiteProviderValue}>
          <DownloadSticky />
        </downloadsContext.Provider>
      );
    });
    jest.runAllTimers();
    expect(component.queryByTestId('download-sticky-content')).toEqual(null);
  });

  it('displays nothing when the no downloads are in progress or queued', () => {
    const mockSiteProviderValue = {
      downloadModalIsOpen: false,
      setDownloadModalIsOpen: jest.fn(),
      downloadQueue: [],
      downloadFilePath: '',
      downloadStatusPath: '',
      preparingDownload: false,
      downloadsPrepared: [],
    };

    let component = null;
    act(() => {
      component = render(
        <downloadsContext.Provider value={mockSiteProviderValue}>
          <DownloadSticky />
        </downloadsContext.Provider>
      );
    });
    jest.runAllTimers();

    expect(component.queryByTestId('download-sticky-content')).toEqual(null);
  });

  it('contains the expected text content when a single download is being prepared', () => {
    const mockSiteProviderValue = {
      downloadModalIsOpen: false,
      setDownloadModalIsOpen: jest.fn(),
      downloadQueue: [],
      downloadsInProgress: mockDownload,
      downloadsPrepared: [],
    };

    let component = null;

    act(() => {
      component = render(
        <downloadsContext.Provider value={mockSiteProviderValue}>
          <DownloadSticky />
        </downloadsContext.Provider>
      );
    });
    jest.runAllTimers();

    expect(component.queryByText(dsTextContent.prepSingle)).toBeTruthy();
    expect(component.queryByText(dsTextContent.finishedSingle)).not.toBeTruthy();
    expect(component.queryByText(dsTextContent.prepMulti)).not.toBeTruthy();
    expect(component.queryByText(dsTextContent.planToLeaveSingle)).toBeTruthy();
    expect(component.queryByText(dsTextContent.copyLinkLabel)).toBeTruthy();
    expect(component.queryByText('fiscalaccounts_20190101_20200101.zip')).toBeTruthy();
  });

  it('contains the expected text content when a single download is ready', () => {
    const mockSiteProviderValue = {
      downloadModalIsOpen: false,
      setDownloadModalIsOpen: jest.fn(),
      downloadQueue: [],
      downloadsInProgress: [],
      downloadsPrepared: mockDownload,
      displayForTestCase: true,
    };

    const { queryByText, queryByTestId } = render(
      <downloadsContext.Provider value={mockSiteProviderValue}>
        <DownloadSticky />
      </downloadsContext.Provider>
    );
    jest.runAllTimers();

    expect(queryByText(dsTextContent.finishedSingle)).toBeTruthy();
    expect(queryByText(dsTextContent.prepSingle)).not.toBeTruthy();
    expect(queryByText(dsTextContent.finishedMulti)).not.toBeTruthy();
    expect(queryByText(dsTextContent.finishedNoteLinkLabel)).toBeTruthy();
    expect(queryByTestId('finished-downloading-notice-single')).toBeTruthy();
    expect(queryByText(dsTextContent.finishedNoteLinkLabel)).toBeTruthy();
  });

  it('appropriately toggles between minimized or not', () => {
    const mockSiteProviderValue = {
      downloadModalIsOpen: false,
      setDownloadModalIsOpen: jest.fn(),
      downloadQueue: [],
      downloadsInProgress: mockDownload,
      downloadsPrepared: [],
    };
    const gaSpy = jest.spyOn(gaHelper, 'generateAnalyticsEvent');

    const { queryByText, queryByTestId, getByTestId } = render(
      <downloadsContext.Provider value={mockSiteProviderValue}>
        <DownloadSticky />
      </downloadsContext.Provider>
    );
    jest.runAllTimers();

    expect(getByTestId('download-sticky-content')).not.toHaveClass(styles.minimized);
    expect(queryByTestId('minimize-symbol')).toBeTruthy();
    expect(queryByTestId('maximize-symbol')).not.toBeTruthy();

    const minimizeToggle = getByTestId('minimize-toggle');

    act(() => {
      minimizeToggle.click();
    });

    expect(gaSpy).toHaveBeenCalledWith(dsTextContent.gaMinimizeSticky);
    expect(getByTestId('download-sticky-content')).toHaveClass(styles.minimized);
    expect(queryByTestId('minimize-symbol')).not.toBeTruthy();
    expect(queryByTestId('maximize-symbol')).toBeTruthy();

    expect(queryByText(dsTextContent.hideLabel)).not.toBeTruthy();
    expect(queryByText(dsTextContent.finishedNote)).not.toBeTruthy();
    expect(queryByText(dsTextContent.finishedNoteLinkLabel)).not.toBeTruthy();
    expect(queryByText(dsTextContent.planToLeaveSingle)).not.toBeTruthy();
    expect(queryByText(dsTextContent.planToLeaveMulti)).not.toBeTruthy();
    expect(queryByText(dsTextContent.finishedNoteLinkLabel)).not.toBeTruthy();

    act(() => {
      minimizeToggle.click();
    });

    expect(gaSpy).toHaveBeenCalledWith(dsTextContent.gaMaximizeSticky);
  });

  it('contains the expected text content with one or more downloads waiting in the queue', () => {
    const mockQueue = [
      {
        apis: mockTable,
        dataset: mockDataset,
        dateRange: mockDateRange,
        filename: 'mocktableable_20200101_20201101.zip',
        selectedFileType: 'json',
      },
      {
        apis: [mockTable, mockAnotherTable],
        dataset: mockDataset,
        dateRange: mockDateRange,
        filename: 'mock-dataset_all_tables_20200101_20201101.zip',
        selectedFileType: 'csv',
      },
    ];

    const mockSiteProviderValue = {
      downloadModalIsOpen: false,
      setDownloadModalIsOpen: jest.fn(),
      downloadQueue: mockQueue,
      downloadsInProgress: mockDownload,
      resumedDownloads: [],
      downloadsPrepared: [],
    };

    const { queryByText, queryAllByText } = render(
      <downloadsContext.Provider value={mockSiteProviderValue}>
        <DownloadSticky />
      </downloadsContext.Provider>
    );
    jest.runAllTimers();

    expect(queryByText(dsTextContent.prepMulti)).toBeTruthy();
    expect(queryByText(dsTextContent.prepSingle)).not.toBeTruthy();
    expect(queryByText(dsTextContent.finishedMulti)).not.toBeTruthy();
    expect(queryByText(dsTextContent.planToLeaveMulti)).toBeTruthy();
    expect(queryAllByText(dsTextContent.queuedStatus).length).toEqual(2);
    expect(queryAllByText(dsTextContent.copyLinkLabel).length).toEqual(1);
  });

  it('contains the expected text content with more than one download in the prepared state and none still in progress', () => {
    const mockPreparedDownloads = [
      {
        apis: mockTable,
        dataset: mockDataset,
        dateRange: mockDateRange,
        fileUrl: '/someTable_someDateRange.type.zip',
        filename: '/someTable_someDateRange.type.zip',
        selectedFileType: 'csv',
      },
      {
        apis: mockTable,
        dataset: mockDataset,
        dateRange: mockDateRange,
        fileUrl: '/someTable_someDateRange2.type.zip',
        filename: '/someTable_someDateRange2.type.zip',
        selectedFileType: 'xml',
      },
    ];

    const mockSiteProviderValue = {
      downloadModalIsOpen: false,
      setDownloadModalIsOpen: jest.fn(),
      downloadQueue: [],
      downloadsInProgress: [],
      resumedDownloads: [],
      downloadsPrepared: mockPreparedDownloads,
      displayForTestCase: true,
    };

    const { queryByText, queryAllByText } = render(
      <downloadsContext.Provider value={mockSiteProviderValue}>
        <DownloadSticky />
      </downloadsContext.Provider>
    );
    jest.runAllTimers();

    expect(queryByText(dsTextContent.prepMulti)).not.toBeTruthy();
    expect(queryByText(dsTextContent.finishedMulti)).toBeTruthy();
    expect(queryByText(dsTextContent.planToLeaveMulti)).not.toBeTruthy();
    expect(queryByText(mockPreparedDownloads[0].filename)).toBeTruthy();
    expect(queryByText(mockPreparedDownloads[1].filename)).toBeTruthy();
  });

  it('contains the expected text content with one or more downloads in the prepared state along with one or more queued downloads', () => {
    const mockPreparedDownloads = [
      {
        apis: mockTable,
        dataset: mockDataset,
        dateRange: mockDateRange,
        fileUrl: '/someTable_someDateRange.type.zip',
        filename: '/someTable_someDateRange.type.zip',
        selectedFileType: 'csv',
      },
      {
        apis: mockTable,
        dataset: mockDataset,
        dateRange: mockDateRange,
        fileUrl: '/someTable_someDateRange.type.zip',
        filename: '/someTable_someDateRange.type.zip',
        selectedFileType: 'xml',
      },
    ];

    const mockQueue = [
      {
        apis: mockTable,
        dataset: mockDataset,
        dateRange: mockDateRange,
        filename: 'mocktableable_20200101_20201101.zip',
        selectedFileType: 'json',
      },
      {
        apis: [mockTable, mockAnotherTable],
        dataset: mockDataset,
        dateRange: mockDateRange,
        filename: 'mock-dataset_all_tables_20200101_20201101.zip',
        selectedFileType: 'csv',
      },
    ];

    const mockSiteProviderValue = {
      downloadModalIsOpen: false,
      setDownloadModalIsOpen: jest.fn(),
      downloadQueue: mockQueue,
      downloadsInProgress: mockDownload,
      resumedDownloads: [],
      downloadsPrepared: mockPreparedDownloads,
    };

    const { queryByText, queryAllByText } = render(
      <downloadsContext.Provider value={mockSiteProviderValue}>
        <DownloadSticky />
      </downloadsContext.Provider>
    );
    jest.runAllTimers();

    expect(queryByText(dsTextContent.prepMulti)).toBeTruthy();
    expect(queryByText(dsTextContent.finishedMulti)).not.toBeTruthy();
    expect(queryByText(dsTextContent.planToLeaveMulti)).toBeTruthy();
  });

  it('collapses / uncollapses the list of downloads when the "hide" toggle button is clicked', () => {
    const mockQueue = [
      {
        apis: mockTable,
        dataset: mockDataset,
        dateRange: mockDateRange,
        filename: 'mocktableable_20200101_20201101.zip',
        selectedFileType: 'json',
      },
      {
        apis: [mockTable, mockAnotherTable],
        dataset: mockDataset,
        dateRange: mockDateRange,
        filename: 'mock-dataset_all_tables_20200101_20201101.zip',
        selectedFileType: 'csv',
      },
    ];
    const gaSpy = jest.spyOn(gaHelper, 'generateAnalyticsEvent');

    const mockSiteProviderValue = {
      downloadModalIsOpen: false,
      setDownloadModalIsOpen: jest.fn(),
      downloadQueue: mockQueue,
      resumedDownloads: [],
      downloadsInProgress: mockDownload,
      downloadsPrepared: [],
    };

    const { queryByText, queryAllByText, getByTestId } = render(
      <downloadsContext.Provider value={mockSiteProviderValue}>
        <DownloadSticky />
      </downloadsContext.Provider>
    );
    jest.runAllTimers();

    const collapseToggleButton = getByTestId('collapse-toggle');

    expect(queryByText(dsTextContent.hideLabel)).not.toBeTruthy();
    expect(queryByText(dsTextContent.showLabel)).toBeTruthy();
    expect(getByTestId('downloads-list')).toHaveClass(styles.collapsed);

    act(() => {
      collapseToggleButton.click();
    });

    expect(gaSpy).toHaveBeenCalledWith(dsTextContent.gaShowDetails);
    expect(queryByText(dsTextContent.hideLabel)).toBeTruthy();
    expect(queryByText(dsTextContent.showLabel)).not.toBeTruthy();
    expect(queryAllByText(dsTextContent.queuedStatus).length).toEqual(2);
    expect(getByTestId('downloads-list')).not.toHaveClass(styles.collapsed);

    act(() => {
      collapseToggleButton.click();
    });
    jest.runAllTimers();

    expect(getByTestId('downloads-list')).toHaveClass(styles.collapsed);
    expect(gaSpy).toHaveBeenCalledWith(dsTextContent.gaHideDetails);
  });

  it('contains the expected text content with one item complete when returning to site', () => {
    const mockResumedPrepared = [
      {
        apis: mockTable,
        dataset: mockDataset,
        dateRange: mockDateRange,
        fileUrl: '/someTable_someDateRange.type.zip',
        filename: '/someTable_someDateRange.type.zip',
        selectedFileType: 'csv',
      },
    ];

    const mockSiteProviderValue = {
      downloadModalIsOpen: false,
      setDownloadModalIsOpen: jest.fn(),
      downloadQueue: [],
      downloadsInProgress: [],
      resumedDownloads: mockResumedPrepared,
      downloadsPrepared: [],
    };

    const { queryByText, queryAllByText } = render(
      <downloadsContext.Provider value={mockSiteProviderValue}>
        <DownloadSticky />
      </downloadsContext.Provider>
    );
    jest.runAllTimers();

    expect(queryByText(dsTextContent.finishedNote)).not.toBeTruthy();
  });

  it('passes an onClosed function to StickyFooter that clears all prepared downloads', () => {
    const mockPrepared = [
      {
        apis: mockTable,
        datasetId: mockDataset.datasetId,
        dateRange: mockDateRange,
        fileUrl: '/someTable_someDateRange.type.zip',
        filename: '/someTable_someDateRange.type.zip',
        selectedFileType: 'json',
      },
      {
        apis: mockTable,
        datasetId: mockDataset.datasetId,
        dateRange: mockDateRange,
        fileUrl: '/someTable_someDateRange.type.zip',
        filename: '/someTable_someDateRange.type.zip',
        selectedFileType: 'csv',
      },
    ];
    const mockCancellationFn = jest.fn();
    const mockSiteProviderValue = {
      downloadModalIsOpen: false,
      setDownloadModalIsOpen: jest.fn(),
      downloadQueue: [],
      downloadsInProgress: [],
      resumedDownloads: [],
      downloadsPrepared: mockPrepared,
      setCancelDownloadRequest: mockCancellationFn,
    };

    jest.useFakeTimers();
    let component = null;
    renderer.act(() => {
      component = renderer.create(
        <downloadsContext.Provider value={mockSiteProviderValue}>
          <DownloadSticky />
        </downloadsContext.Provider>
      );
    });
    jest.runAllTimers();

    const stickyFooter = component.root.findByType(StickyFooterComponent);
    const callback = stickyFooter.props.onClosed;

    renderer.act(() => {
      callback();
      jest.runAllTimers();
    });

    expect(mockCancellationFn).toHaveBeenNthCalledWith(1, mockPrepared[0]);
    expect(mockCancellationFn).toHaveBeenNthCalledWith(2, mockPrepared[1]);
  });

  it('no duplicate downloads when resumed downloads complete', () => {
    const mockDownloadsPrepared = [
      {
        apis: mockTable,
        dataset: mockDataset,
        dateRange: mockDateRange,
        fileUrl: '/someTable_someDateRange.type.zip',
        filename: 'someTable_someDateRange.type.zip',
        selectedFileType: 'csv',
        status: 'completed',
      },
      {
        apis: mockTable,
        dataset: mockDataset,
        dateRange: mockDateRange,
        fileUrl: '/someTable_someDateRange2.type.zip',
        filename: 'someTable_someDateRange2.type.zip',
        selectedFileType: 'csv',
        status: 'completed',
      },
    ];

    const mockResumedPrepared = [mockDownloadsPrepared[1]];

    const mockDownloadsInProgress = [
      {
        apis: mockTable,
        dataset: mockDataset,
        dateRange: mockDateRange,
        fileUrl: '/someTable_someDateRange55.type.zip',
        filename: 'someTable_someDateRange55.type.zip',
        selectedFileType: 'csv',
      },
    ];

    const mockSiteProviderValue = {
      downloadModalIsOpen: false,
      setDownloadModalIsOpen: jest.fn(),
      downloadQueue: [],
      downloadsInProgress: mockDownloadsInProgress,
      resumedDownloads: mockResumedPrepared,
      downloadsPrepared: mockDownloadsPrepared,
    };

    const { queryByText, queryAllByText } = render(
      <downloadsContext.Provider value={mockSiteProviderValue}>
        <DownloadSticky />
      </downloadsContext.Provider>
    );
    jest.runAllTimers();

    expect(queryAllByText('someTable_someDateRange2.type.zip').length).toEqual(1);
  });
});
