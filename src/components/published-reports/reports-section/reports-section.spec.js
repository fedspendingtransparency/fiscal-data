import React from 'react';
import ReportsSection from './reports-section';
import { render } from '@testing-library/react';

describe('Reports Section component', () => {
  const mockReports = [
    { path: '/test/file/path/file.pdf', report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500', report_group_desc: 'The Download File (.pdf)' },
    { path: '/test/file/path/another_file.pdf', report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500', report_group_desc: 'Another Download File (.xml)' },
  ];
  const mockDailyReports = [
    { path: '/test/file/path/file.pdf', report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500', report_group_desc: 'The Download File (.pdf)' },
    { path: '/test/file/path/file.pdf', report_date: 'Fri Jul 19 2023 00:00:00 GMT-0500', report_group_desc: 'The Download File (.pdf)' },
  ];

  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
  });

  it('renders a Reports and Files header', () => {
    const { getByText } = render(<ReportsSection />);
    expect(getByText('Reports and Files')).toBeInTheDocument();
  });

  it('renders a date picker', () => {
    const { getByText } = render(<ReportsSection />);
    expect(getByText('Published Date')).toBeInTheDocument();
  });

  it('renders a download table', () => {
    const { getByRole } = render(<ReportsSection publishedReportsProp={mockReports} />);
    expect(getByRole('table')).toBeInTheDocument();
  });

  it('renders a download table with daily reports', () => {
    const { getByRole } = render(<ReportsSection publishedReportsProp={mockDailyReports} />);
    expect(getByRole('table')).toBeInTheDocument();
  });

  it('renders published reports tip', () => {
    const reportTip = 'A tip for viewing the reports';
    const { getByText } = render(<ReportsSection dataset={{ publishedReportsTip: reportTip }} />);
    expect(getByText(reportTip)).toBeInTheDocument();
    expect(getByText('Note:')).toBeInTheDocument();
  });

  it('does not render the note section when a published report tip is not available', () => {
    const { queryByText } = render(<ReportsSection />);
    expect(queryByText('Note:')).not.toBeInTheDocument();
  });
});
