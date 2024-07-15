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
  it('renders the desktop table headers', () => {
    const { getByRole } = render(<DownloadReportTable width={breakpointLg + 1} />);
    expect(getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(getByRole('columnheader', { name: 'Date' })).toBeInTheDocument();
    expect(getByRole('columnheader', { name: 'Size' })).toBeInTheDocument();
  });

  it('renders the desktop table rows', () => {
    const { getByRole, getAllByRole } = render(<DownloadReportTable width={breakpointLg + 1} />);
    expect(getByRole('cell', { name: 'pdf icon Entire.pdf' })).toBeInTheDocument();
    expect(getAllByRole('cell', { name: 'February 01, 2024' }).length).toBeGreaterThan(0);
    expect(getAllByRole('cell', { name: '2KB' }).length).toBeGreaterThan(0);
  });

  it('renders the mobile table headers', () => {
    const { getByRole, queryByRole } = render(<DownloadReportTable width={breakpointLg - 1} />);
    expect(getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(queryByRole('columnheader', { name: 'Date' })).not.toBeInTheDocument();
    expect(queryByRole('columnheader', { name: 'Size' })).not.toBeInTheDocument();
  });

  it('renders the mobile table rows', () => {
    const { getByRole } = render(<DownloadReportTable width={breakpointLg - 1} />);
    expect(getByRole('cell', { name: 'pdf icon Entire.pdf February 01, 2024 2KB' })).toBeInTheDocument();
  });
});
