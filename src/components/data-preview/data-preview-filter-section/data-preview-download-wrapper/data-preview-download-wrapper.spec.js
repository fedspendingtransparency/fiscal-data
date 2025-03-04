import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import DataPreviewDownloadWrapper from './data-preview-download-wrapper';
import { enableFetchMocks } from 'jest-fetch-mock';
import { RecoilRoot } from 'recoil';
import userEvent from '@testing-library/user-event';
import { downloadsContext } from '../../../persist/download-persist/downloads-persist';

jest.mock('../../../../components/truncate/truncate.jsx', function() {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(({ children }) => children),
  };
});

jest.useFakeTimers();

describe('data preview download', () => {
  enableFetchMocks();
  let createObjectURL;

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

  it('renders a placeholder', () => {
    const { getByRole, getAllByTestId } = render(
      <RecoilRoot>
        <downloadsContext.Provider value={mockSiteProviderValue}>
          <DataPreviewDownloadWrapper selectedTable={{}} dataset={{ name: 'Mock dataset' }} dateRange={{ from: new Date(), to: new Date() }} />
        </downloadsContext.Provider>
      </RecoilRoot>
    );
    const downloadButton = getByRole('button', {
      name: 'Download',
    });
    expect(downloadButton).toBeInTheDocument();
    userEvent.click(downloadButton);

    const downloadLinks = getAllByTestId('download-button');
    fireEvent.click(downloadLinks[0]);
  });
});
