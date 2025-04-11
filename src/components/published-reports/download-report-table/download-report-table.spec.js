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

  it('renders generated report table rows', () => {
    const { getByRole } = render(<DownloadReportTable width={breakpointLg - 1} generatedReports={mockGeneratedReports} />);
    expect(getByRole('link', { name: '.pdf icon Name 5/1/2021 Download' })).toBeInTheDocument();
    expect(getByRole('link', { name: '.pdf icon Name 2 5/1/2022 Download' })).toBeInTheDocument();
  });
});
