import { render } from '@testing-library/react';
import React from 'react';
import GenReportDownloadTableRow from './gen-report-download-table-row';

URL.createObjectURL = URL.createObjectURL || (() => 'blob:http://localhost/mock');
URL.createObjectURL = URL.createObjectURL || (() => {});
jest.mock('../../../../workers/pdfWorker', () => ({
  renderPDF: jest.fn().mockResolvedValue({
    url: 'blob:http://localhost/mock-pdf',
    size: '2kb',
  }),
}));
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
      <table>
        <tbody>
          <GenReportDownloadTableRow generatedReport={mockGeneratedReport} setApiErrorMessage={setApiError} setIsLoading={setIsLoading} />
        </tbody>
      </table>
    );
    expect(await findByTestId('file-download-row')).toBeInTheDocument();
  });

  it('renders a download link', async () => {
    const setApiError = jest.fn();
    const setIsLoading = jest.fn();
    const { findByRole } = render(
      <table>
        <tbody>
          <GenReportDownloadTableRow
            generatedReport={mockGeneratedReport}
            setApiErrorMessage={setApiError}
            setIsLoading={setIsLoading}
            mobileView={false}
          />
        </tbody>
      </table>
    );
    const downloadLink = await findByRole('link');
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute('download', 'Download Name');
    expect(downloadLink).toHaveAttribute('href', 'blob:http://localhost/mock-pdf');
  });
});
