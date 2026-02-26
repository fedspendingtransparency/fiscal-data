import { DownloadReportTable } from './download-report-table';
import { act, render, within } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

const breakpointLg = 993;

// mocks the web worker
URL.createObjectURL = URL.createObjectURL || (() => 'blob:http://localhost/mock');
URL.createObjectURL = URL.createObjectURL || (() => {});
jest.mock('../../../workers/pdfWorker', () => ({
  renderPDF: jest.fn().mockResolvedValue({
    url: 'blob:http://localhost/mock-pdf',
    size: '4 KB',
  }),
}));
jest.mock('../../variables.module.scss', () => {
  return {
    breakpointLg: `${breakpointLg}px`,
  };
});

// Mocks for react-pdf components can be found at __mocks__/react-pdf.js
describe('Download Report Table', () => {
  const mockReports = [
    { path: '/test/file/path/file.pdf', report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500', report_group_desc: 'The Download File (.pdf)' },
    { path: '/test/file/path/another_file.xml', report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500', report_group_desc: 'Another Download File (.xml)' },
  ];

  const mockPaginatedReports = [
    { path: '/test/file/path/file.xml', report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500', report_group_desc: 'The Download File (.xml)' },
    { path: '/test/file/path/file.pdf', report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500', report_group_desc: 'The Download File (.pdf)' },
    { path: '/test/file/path/another_file.xml', report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500', report_group_desc: 'Another Download File (.xml)' },
    { path: '/test/file/path/another_file.pdf', report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500', report_group_desc: 'Another Download File (.pdf)' },
    {
      path: '/test/file/path/and_another_file.xml',
      report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500',
      report_group_desc: 'And Another Download File (.xml)',
    },
    {
      path: '/test/file/path/and_another_file.pdf',
      report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500',
      report_group_desc: 'And Another Download File (.pdf)',
    },
  ];

  const mockGeneratedReports = [
    {
      name: 'Name',
      downloadName: 'Download Name',
      date: '5/1/2021',
      size: '5K',
      config: {},
      data: [],
      colConfig: {},
    },
    {
      name: 'Name 2',
      downloadName: 'Download Name 2',
      date: '5/1/2022',
      size: '5K',
      config: {},
      data: [],
      colConfig: {},
    },
  ];

  it('renders the desktop table headers', () => {
    const { getByRole } = render(<DownloadReportTable width={breakpointLg + 1} />);
    expect(getByRole('columnheader', { name: 'Name Date Size' })).toBeInTheDocument();
  });

  it('renders the desktop table rows', () => {
    const { getByRole } = render(<DownloadReportTable reports={mockReports} width={breakpointLg + 1} />);
    expect(getByRole('link', { name: 'Download file.pdf' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'Download another_file.xml' })).toBeInTheDocument();
  });

  it('renders the mobile table headers', () => {
    const { getByRole, queryByRole } = render(<DownloadReportTable width={breakpointLg - 1} />);
    expect(getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(queryByRole('columnheader', { name: 'Date' })).not.toBeInTheDocument();
    expect(queryByRole('columnheader', { name: 'Size' })).not.toBeInTheDocument();
  });

  it('renders the mobile table rows', () => {
    const { getByRole } = render(<DownloadReportTable width={breakpointLg - 1} reports={mockReports} />);
    expect(getByRole('link', { name: 'Download file.pdf' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'Download another_file.xml' })).toBeInTheDocument();
  });

  it('renders generated report table rows', async () => {
    const setApiError = jest.fn();
    const setIsLoading = jest.fn();
    const { findAllByRole } = render(
      <DownloadReportTable
        width={breakpointLg - 1}
        generatedReports={mockGeneratedReports}
        setApiErrorMessage={setApiError}
        setIsLoading={setIsLoading}
      />
    );
    const downloadLinks = await findAllByRole('link');
    expect(within(downloadLinks[0]).getByText('4 KB')).toBeInTheDocument();
    expect(within(downloadLinks[0]).getByText('5/1/2021')).toBeInTheDocument();
    expect(within(downloadLinks[0]).getByText('Name')).toBeInTheDocument();

    expect(within(downloadLinks[1]).getByText('4 KB')).toBeInTheDocument();
    expect(within(downloadLinks[1]).getByText('5/1/2022')).toBeInTheDocument();
    expect(within(downloadLinks[1]).getByText('Name 2')).toBeInTheDocument();
    expect(setApiError).toHaveBeenCalledWith(false);
  });

  it('renders pagination Controls when there are more than five reports', () => {
    const { getByText, getByRole } = render(<DownloadReportTable reports={mockPaginatedReports} width={breakpointLg + 1} />);

    expect(getByText('Rows Per Page')).toBeInTheDocument();

    const nextPage = getByRole('button', { name: 'published-report-table-page2' });
    act(() => {
      userEvent.click(nextPage);
    });
    expect(getByText('6 - 6')).toBeInTheDocument();
    expect(getByText('rows of 6 rows', { exact: false })).toBeInTheDocument();
  });

  it('does not render pagination Controls when there are less than five reports', () => {
    const { getByText, queryByRole } = render(<DownloadReportTable reports={mockReports} width={breakpointLg + 1} />);

    expect(getByText('Rows Per Page')).toBeInTheDocument();

    const nextPage = queryByRole('button', { name: 'published-report-table-page2' });

    expect(nextPage).not.toBeInTheDocument();
  });
});
