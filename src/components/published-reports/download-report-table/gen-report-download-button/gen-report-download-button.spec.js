import { render } from '@testing-library/react';
import React from 'react';
import GenReportDownloadButton from './gen-report-download-button';

describe('Generated report table row', () => {
  const mockGeneratedReport = {
    name: 'Name',
    downloadName: 'Download Name',
    date: '5/1/2021',
    size: '5K',
    config: {},
    data: [],
    colConfig: {},
  };

  it('renders a file row', async () => {
    const setApiError = jest.fn();
    const setIsLoading = jest.fn();
    const { findByTestId } = render(
      <GenReportDownloadButton generatedReport={mockGeneratedReport} setApiErrorMessage={setApiError} setIsLoading={setIsLoading} />
    );
    expect(await findByTestId('file-download-row')).toBeInTheDocument();
  });

  it('renders a download link', async () => {
    const setApiError = jest.fn();
    const setIsLoading = jest.fn();
    const { findByRole } = render(
      <GenReportDownloadButton generatedReport={mockGeneratedReport} setApiErrorMessage={setApiError} setIsLoading={setIsLoading} />
    );
    const downloadLink = await findByRole('link');
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute('download', 'Download Name');
  });
});
