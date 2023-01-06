import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import DownloadModal, {
  downloadModalSubText,
  downloadModalTitle,
  downloadModalTitleMulti,
} from "./download-modal"
import { downloadsContext } from '../persist/download-persist/downloads-persist';
import { render } from "@testing-library/react";

const mockTable = { apiId: '100100' };
const mockDataset = {
  datasetId: 'Mock-Up-Dataset',
  apis: [mockTable],
  techSpecs: {
    earliestDate: '01-01-2020',
    latestDate: '11-01-2020'
  }
};
const mockDateRange = {
  from: new Date('01/01/2020'),
  to: new Date('11/01/2020')
};

const mockDownloadsInProgress = [{
  apis: mockTable,
  dataset: mockDataset,
  dateRange: mockDateRange,
  downloadUrl: '/mockFileKey/fiscalaccounts_20190101_20200101.zip',
  filename: 'fiscalaccounts_20190101_20200101.zip',
  prepStarted: true,
  requestTime: 1000,
  selectedFileType: 'csv',
  statusPath: 'mockFileKey'
}];

const mockDownloadsQueued = [{
  apis: mockTable,
  dataset: mockDataset,
  dateRange: mockDateRange,
  downloadUrl: '/mockFileKey/queued_dataset_id_1',
  filename: 'queued_dataset_id_1',
  requestTime: 1000,
  selectedFileType: 'csv'
},
{
  apis: mockTable,
  dataset: mockDataset,
  dateRange: mockDateRange,
  downloadUrl: 'queued_dataset_id_2',
  filename: 'queued_dataset_id_2',
  requestTime: 1000,
  selectedFileType: 'csv'
}];
const onClose = jest.fn();
const mockSiteProviderValue = {
  downloadCount: 3,
    setDownloadModalIsOpen: jest.fn().mockImplementation((v) => {
      return true;
    }),
  downloadModalIsOpen: true,
  downloadsInProgress: mockDownloadsInProgress,
  downloadQueue: mockDownloadsQueued
};

describe('download modal', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Renders a modal with a title, content, close button, and subtext', () => {
    // destructuring allows for specific query functions to be made available
    // with the context of what was created in render
    const { getByTestId } = render(
      <downloadsContext.Provider value={mockSiteProviderValue}>
        <DownloadModal open={true}
                       onClose={onClose} />
      </downloadsContext.Provider>
    );
    expect(mockSiteProviderValue.setDownloadModalIsOpen.mock.calls[0]).toBeTruthy();
    expect(getByTestId('download-modal-title')).toHaveTextContent(downloadModalTitleMulti);
    expect(getByTestId('download-items-container')).toBeDefined();
    expect(getByTestId('download-modal-close-button')).toBeDefined();
    expect(getByTestId('download-modal-subtext')).toHaveTextContent(downloadModalSubText);
  });

  it('calls the close function when the close button is clicked', () => {
    const { getByTestId } = render(
      <downloadsContext.Provider value={mockSiteProviderValue}>
        <DownloadModal open={true}
                       onClose={onClose} />
      </downloadsContext.Provider>
    );
    getByTestId('download-modal-close-button').click();
    expect(onClose).toHaveBeenCalled();
  });

  it('shows a download modal item for each dataset in progress or queued for download', () => {
    const { getByTestId } = render(
      <downloadsContext.Provider value={mockSiteProviderValue}>
        <DownloadModal
          open={true}
          onClose={onClose}
        />
      </downloadsContext.Provider>
    );

    // 2 prepared, 1 preparing, 2 queued
    expect(getByTestId('download-items-container').children).toHaveLength(3);
  });
});
