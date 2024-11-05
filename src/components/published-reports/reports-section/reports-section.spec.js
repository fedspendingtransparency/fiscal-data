import React from 'react';
import ReportsSection from './reports-section';
import { render } from '@testing-library/react';

describe('Reports Section component', () => {
  const mockReports = [
    {
      path: '/test/file/path/file.pdf',
      report_date: new Date('Fri Jul 19 2024 00:00:00 GMT-0500'),
      report_group_desc: 'The Download File (.pdf)',
      report_group_sort_order_nbr: '01',
      report_group_id: '01',
    },
    {
      path: '/test/file/path/another_file.pdf',
      report_date: new Date('Fri Jul 19 2024 00:00:00 GMT-0500'),
      report_group_desc: 'Another Download File (.xml)',
      report_group_sort_order_nbr: '02',
      report_group_id: '01',
    },
  ];

  const mockDailyReports = [
    {
      path: '/test/file/path/file.pdf',
      report_date: 'Fri Jul 19 2024 00:00:00 GMT-0500',
      report_group_desc: 'The Download File (.pdf)',
      report_group_sort_order_nbr: '01',
      report_group_id: '01',
    },
    {
      path: '/test/file/path/file.pdf',
      report_date: 'Fri Jul 19 2023 00:00:00 GMT-0500',
      report_group_desc: 'The Download File (.pdf)',
      report_group_sort_order_nbr: '02',
      report_group_id: '01',
    },
  ];

  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
  });

  it('renders a Reports and Files header', () => {
    const { getByText } = render(<ReportsSection />);
    expect(getByText('Reports and Files')).toBeInTheDocument();
  });

  it('renders a date picker', () => {
    const { getByText } = render(
      <ReportsSection
        publishedReportsProp={[
          { report_date: new Date('8/8/2024'), report_group_sort_order_nbr: 1, report_group_desc: 'test (.pdf)', path: 'test/test.pdf' },
          { report_date: new Date('8/7/2024'), report_group_sort_order_nbr: 1, report_group_desc: 'test (.pdf)', path: 'test/test.pdf' },
        ]}
      />
    );
    expect(getByText('Published Date:')).toBeInTheDocument();
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

  it('renders report filter when reportSelection is byReport', () => {
    const { getByRole } = render(<ReportsSection dataset={{ reportSelection: 'byReport' }} />);
    const reportFilter = getByRole('button', { name: 'filter by report ...' });
    expect(reportFilter).toBeInTheDocument();
    //TODO: test the all reports are avilable within the dropdown
  });
});
