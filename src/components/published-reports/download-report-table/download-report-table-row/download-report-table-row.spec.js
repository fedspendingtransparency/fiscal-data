import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import DownloadReportTableRow from './download-report-table-row';
import userEvent from '@testing-library/user-event';

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

  it('renders a short file name in the row', async () => {
    const { findByText } = render(<DownloadReportTableRow reportFile={mockReports[4]} />);
    const downloadText = await waitFor(() => findByText('TST.txt'));
    expect(downloadText).toBeInTheDocument();
  });

  it('renders a pdf icon with a pdf filename', () => {
    const { getByAltText } = render(<DownloadReportTableRow reportFile={mockReports[0]} />);
    expect(getByAltText('.pdf icon')).toBeInTheDocument();
  });

  it('renders a xml icon with a xls filename', () => {
    const { getByAltText } = render(<DownloadReportTableRow reportFile={mockReports[1]} />);
    expect(getByAltText('.xml icon')).toBeInTheDocument();
  });

  it('renders a txt icon with a txt filename', () => {
    const { getByAltText } = render(<DownloadReportTableRow reportFile={mockReports[3]} />);
    expect(getByAltText('.txt icon')).toBeInTheDocument();
  });

  it('renders a xls icon with a xls filename', () => {
    const { getByAltText } = render(<DownloadReportTableRow reportFile={mockReports[2]} />);
    expect(getByAltText('.xls icon')).toBeInTheDocument();
  });

  it('renders a clickable download button', async () => {
    const { getByRole } = render(<DownloadReportTableRow reportFile={mockReports[0]} />);
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

  it('changes download icon color on click', () => {
    jest.useFakeTimers();
    const { getByRole, getByTestId, getByText } = render(<DownloadReportTableRow reportFile={mockReports[0]} />);
    let icon = getByTestId('download-icon');
    expect(icon).not.toHaveClass('downloadedIcon');
    expect(getByText('Download')).toBeInTheDocument();
    expect(getByRole('img', { hidden: true, name: '' })).toHaveClass('fa-cloud-arrow-down');

    const downloadButton = getByRole('link', { name: 'Download file.pdf' });
    act(() => {
      fireEvent.click(downloadButton);
      jest.runAllTimers();
    });
    //Changes download icon style and text after click
    icon = getByTestId('download-icon');
    expect(getByText('Downloaded')).toBeInTheDocument();
    expect(getByRole('img', { hidden: true, name: '' })).toHaveClass('fa-circle-check');
    expect(icon).toHaveClass('downloadedIcon');

    //Icon resets after 3 seconds
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    icon = getByTestId('download-icon');
    expect(icon).not.toHaveClass('downloadedIcon');
    expect(getByText('Download')).toBeInTheDocument();
    expect(getByRole('img', { hidden: true, name: '' })).toHaveClass('fa-cloud-arrow-down');
  });
});
