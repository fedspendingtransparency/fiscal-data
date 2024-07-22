import { DownloadReportTable } from './download-report-table';
import { render } from '@testing-library/react';
import React from 'react';

const breakpointLg = 993;

jest.mock('../../variables.module.scss', () => {
  return {
    breakpointLg: `${breakpointLg}px`,
  };
});

describe('Download Report Table', () => {
  const mockReports = [
    { path: '/test/file/path/file.pdf', report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500', report_group_desc: 'The Download File (.pdf)' },
    { path: '/test/file/path/another_file.xml', report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500', report_group_desc: 'Another Download File (.xml)' },
  ];

  it('renders the desktop table headers', () => {
    const { getByRole } = render(<DownloadReportTable width={breakpointLg + 1} />);
    expect(getByRole('columnheader', { name: 'Name Date Size' })).toBeInTheDocument();
  });

  it('renders the desktop table rows', () => {
    const { getByRole, getAllByRole } = render(<DownloadReportTable reports={mockReports} width={breakpointLg + 1} />);
    expect(getByRole('button', { name: 'Download file.pdf' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Download another_file.xml' })).toBeInTheDocument();
  });

  it('renders the mobile table headers', () => {
    const { getByRole, queryByRole } = render(<DownloadReportTable width={breakpointLg - 1} />);
    expect(getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(queryByRole('columnheader', { name: 'Date' })).not.toBeInTheDocument();
    expect(queryByRole('columnheader', { name: 'Size' })).not.toBeInTheDocument();
  });

  it('renders the mobile table rows', () => {
    const { getByRole } = render(<DownloadReportTable width={breakpointLg - 1} reports={mockReports} />);
    expect(getByRole('button', { name: 'Download file.pdf' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Download another_file.xml' })).toBeInTheDocument();
  });
});
