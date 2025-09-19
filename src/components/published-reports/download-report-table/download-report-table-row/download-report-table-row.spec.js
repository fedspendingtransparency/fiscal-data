import React from 'react';
import { render } from '@testing-library/react';
import DownloadReportTableRow from './download-report-table-row';
import DownloadButton from '../download-button/download-button';
import userEvent from '@testing-library/user-event';

// mocks the web worker
URL.createObjectURL = URL.createObjectURL || (() => 'blob:http://localhost/mock');
URL.createObjectURL = URL.createObjectURL || (() => {});
jest.mock('../../../../workers/pdfWorker', () => ({
  renderPDF: jest.fn().mockResolvedValue({
    url: 'blob:http://localhost/mock-pdf',
    size: '4 KB',
  }),
}));

describe('Download report table row component', () => {
  const mockReports = [
    { path: '/test/file/path/file.pdf', report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500', report_group_desc: 'The Download File (.pdf)' },
    { path: '/test/file/path/another_file.xml', report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500', report_group_desc: 'Another Download File (.xml)' },
    { path: '/test/file/path/another_file.xls', report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500', report_group_desc: 'Another Download File (.xls)' },
    { path: '/test/file/path/another_file.txt', report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500', report_group_desc: 'Another Download File (.txt)' },
    { path: '/test/file/path/TST.txt', report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500', report_group_desc: 'TST (.txt)' },
  ];

  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
  });

  it('renders a file row', () => {
    const { getByTestId } = render(<DownloadReportTableRow reportFile={mockReports[0]} />);
    expect(getByTestId('file-download-row')).toBeInTheDocument();
  });

  it('renders a clickable download button', async () => {
    const { getByRole } = render(<DownloadButton reportFile={mockReports[0]} />);
    const downloadButton = getByRole('link', { name: 'Download file.pdf' });
    downloadButton.click();
  });

  it('renders a keyboard accessible download button', () => {
    const { getByRole } = render(<DownloadReportTableRow reportFile={mockReports[0]} />);
    const downloadButton = getByRole('link', { name: 'Download file.pdf' });
    userEvent.tab();
    expect(downloadButton).toHaveFocus();
    userEvent.keyboard('Enter');
  });
});
