import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import DownloadModalItem from './download-modal-item';
import globalConstants from '../../../helpers/constants';
import { exportsForUnitTests } from '../../../helpers/download-service/download-service';

jest.useFakeTimers();

describe('download modal item', () => {
  let component;

  const testId = 'test_id';
  const name = 'test_file_name_2000_2020.zip';
  const fileName = 'test_file_name.zip';
  const requestHash = 'test_request_hash';
  const apiIds = {
    downloadName: name,
  };
  const mockDataset = {
    datasetId: 'Mock-Up-Dataset',
    apis: [apiIds],
    techSpecs: {
      earliestDate: '01-01-2020',
      latestDate: '11-01-2020',
    },
  };
  const from = '01/01/2000';
  const to = '01/01/2020';
  const dateRange = {
    from: new Date(from),
    to: new Date(to),
  };

  const fileType = 'XML';

  const downloadLink = `${exportsForUnitTests.baseSiteUrl}${globalConstants.DOWNLOAD_CHECK_PAGE_PATH}/${requestHash}`;

  const mockDownload = {
    apis: apiIds,
    dataset: mockDataset,
    dateRange: dateRange,
    downloadUrl: downloadLink,
    filename: name,
    prepStarted: true,
    requestTime: 1000,
    selectedFileType: fileType,
    statusPath: downloadLink,
  };

  const mockPreparedDownload = {
    apis: apiIds,
    dataset: mockDataset,
    dateRange: dateRange,
    downloadUrl: downloadLink,
    filename: name,
    prepStarted: true,
    readyForDownload: true,
    requestTime: 1000,
    selectedFileType: fileType,
    statusPath: downloadLink,
  };

  const mockQueuedDownload = {
    apis: apiIds,
    dataset: mockDataset,
    dateRange: dateRange,
    downloadUrl: downloadLink,
    filename: name,
    requestTime: 1000,
    selectedFileType: fileType,
  };

  it('Renders a "prepared" download item', async () => {
    component = <DownloadModalItem datasetId={testId} download={mockPreparedDownload} />;
    const { getByTestId, queryByTestId } = render(component);

    expect(getByTestId('title')).toHaveTextContent('Ready for download.');
    expect(getByTestId('progress-indicator')).toBeDefined();
    expect(getByTestId('name')).toHaveTextContent(fileName);
    expect(getByTestId('date-range')).toHaveTextContent(`${from} - ${to}`);
    expect(getByTestId('file-type')).toHaveTextContent(fileType);
    expect(queryByTestId('cancel-download-button')).toBeNull();
  });

  it('Renders a "preparing" download item', async () => {
    component = <DownloadModalItem download={mockDownload} />;
    const { getByTestId } = render(component);

    expect(getByTestId('title')).toHaveTextContent('Currently preparing:');
    expect(getByTestId('progress-indicator')).toBeDefined();
    expect(getByTestId('name')).toHaveTextContent(fileName);
    expect(getByTestId('date-range')).toHaveTextContent(`${from} - ${to}`);
    expect(getByTestId('file-type')).toHaveTextContent(fileType);
    expect(getByTestId('download-link')).toHaveTextContent("Don't have time to wait? Don't forget to copy the link below before you leave the site!");
    expect(getByTestId('download-link-name')).toHaveTextContent(downloadLink);
    expect(getByTestId('cancel-download-button')).toBeDefined();
    expect(getByTestId('copy-link-button')).toBeDefined();
  });

  it('renders a an indefinite spinner for a resumed "preparing" download item', async () => {
    component = <DownloadModalItem download={mockDownload} resumed />;
    const { queryAllByTestId } = render(component);
    expect(queryAllByTestId('spinner-icon').length).toBeTruthy();
  });

  it('does not render a an indefinite spinner for a regular "preparing" download item', async () => {
    component = <DownloadModalItem download={mockDownload} />;
    const { queryAllByTestId } = render(component);
    expect(queryAllByTestId('spinner-icon').length).toStrictEqual(0);
  });

  it('Renders a "queued" download item', async () => {
    component = <DownloadModalItem download={mockQueuedDownload} />;
    const { getByTestId } = render(component);

    expect(getByTestId('title')).toHaveTextContent('Queued for download next:');
    expect(getByTestId('progress-indicator')).toBeDefined();
    expect(getByTestId('name')).toHaveTextContent(fileName);
    expect(getByTestId('date-range')).toHaveTextContent(`${from} - ${to}`);
    expect(getByTestId('file-type')).toHaveTextContent(fileType);
    expect(getByTestId('cancel-download-button')).toBeDefined();
  });
});
