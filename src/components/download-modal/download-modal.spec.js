import '@testing-library/jest-dom';

const mockTable = { apiId: '100100' };
const mockDataset = {
  datasetId: 'Mock-Up-Dataset',
  apis: [mockTable],
  techSpecs: {
    earliestDate: '01-01-2020',
    latestDate: '11-01-2020',
  },
};
const mockDateRange = {
  from: new Date('01/01/2020'),
  to: new Date('11/01/2020'),
};

const mockDownloadsInProgress = [
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
    selectedUserFilter: { label: 'Atlantis-Aquabuck', value: 'Atlantis-Aquabuck' },
  },
];

const mockDownloadsQueued = [
  {
    apis: mockTable,
    dataset: mockDataset,
    dateRange: mockDateRange,
    downloadUrl: '/mockFileKey/queued_dataset_id_1',
    filename: 'queued_dataset_id_1',
    requestTime: 1000,
    selectedFileType: 'csv',
    selectedUserFilter: { label: 'Atlantis-Aquabuck', value: 'Atlantis-Aquabuck' },
  },
  {
    apis: mockTable,
    dataset: mockDataset,
    dateRange: mockDateRange,
    downloadUrl: 'queued_dataset_id_2',
    filename: 'queued_dataset_id_2',
    requestTime: 1000,
    selectedFileType: 'csv',
  },
];
const onClose = jest.fn();
const mockSiteProviderValue = {
  downloadCount: 3,
  setDownloadModalIsOpen: jest.fn().mockImplementation(v => {
    return true;
  }),
  downloadModalIsOpen: true,
  downloadsInProgress: mockDownloadsInProgress,
  downloadQueue: mockDownloadsQueued,
};

describe('download modal', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should ', () => {
    expect(true);
  });
});
