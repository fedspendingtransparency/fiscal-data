import React from 'react';
import ReportsSection from './reports-section';
import { act, fireEvent, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockReports = [
  {
    path: '/test/file/path/file.pdf',
    report_date: new Date('Fri Jul 19 2024 00:00:00 GMT-0500'),
    report_group_desc: 'The Download File.pdf',
    report_group_sort_order_nbr: '01',
    report_group_id: '01',
  },
  {
    path: '/test/file/path/another_file.pdf',
    report_date: new Date('Fri Jul 19 2023 00:00:00 GMT-0500'),
    report_group_desc: 'Another Download File.xml',
    report_group_sort_order_nbr: '02',
    report_group_id: '02',
  },
];

const mockDailyReports = [
  {
    path: '/test/file/path/file.pdf',
    report_date: new Date('Fri Jul 19 2024 00:00:00 GMT-0500'),
    report_group_desc: 'The Download File (.pdf)',
    report_group_sort_order_nbr: '01',
    report_group_id: '01',
  },
  {
    path: '/test/file/path/file.pdf',
    report_date: new Date('Fri Jul 19 2023 00:00:00 GMT-0500'),
    report_group_desc: 'The Download File (.pdf)',
    report_group_sort_order_nbr: '01',
    report_group_id: '01',
  },
];

describe('Reports Section component', () => {
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

  it('does not render the report date picker when hideReportDatePicker is true', () => {
    const { queryByText } = render(
      <ReportsSection
        publishedReportsProp={[
          { report_date: new Date('8/8/2024'), report_group_sort_order_nbr: 1, report_group_desc: 'test (.pdf)', path: 'test/test.pdf' },
          { report_date: new Date('8/7/2024'), report_group_sort_order_nbr: 1, report_group_desc: 'test (.pdf)', path: 'test/test.pdf' },
        ]}
        dataset={{ hideReportDatePicker: true }}
      />
    );
    expect(queryByText('Published Date:')).not.toBeInTheDocument();
  });

  describe('Reports section with report filter', () => {
    it('renders report filter when reportSelection is byReport', () => {
      const datasetConfig = { reportSelection: 'byReport' };
      const { getByRole } = render(<ReportsSection dataset={datasetConfig} publishedReportsProp={mockReports} />);
      const reportFilter = getByRole('button', { name: 'Report: The Download File.pdf' });
      expect(reportFilter).toBeInTheDocument();
    });

    it('Updates most recent date in date picker on report change', () => {
      jest.useFakeTimers();
      const datasetConfig = { reportSelection: 'byReport' };
      const { getByRole } = render(<ReportsSection dataset={datasetConfig} publishedReportsProp={mockReports} />);
      const dateFilter = getByRole('button', { name: 'Select Published Report Date' });
      expect(within(dateFilter).getByText('July 2024')).toBeInTheDocument();
      const reportFilter = getByRole('button', { name: 'Report: The Download File.pdf' });
      fireEvent.click(reportFilter);
      fireEvent.click(getByRole('button', { name: 'Another Download File.xml' }));
      act(() => {
        jest.runAllTimers();
      });
      expect(within(dateFilter).getByText('July 2023')).toBeInTheDocument();
      jest.resetModules();
    });

    it('Only shows selected report in the report table', () => {
      const datasetConfig = { reportSelection: 'byReport' };
      jest.useFakeTimers();
      const { getByRole, queryByRole } = render(<ReportsSection dataset={datasetConfig} publishedReportsProp={mockReports} />);
      const dateFilter = getByRole('button', { name: 'Select Published Report Date' });
      expect(within(dateFilter).getByText('July 2024')).toBeInTheDocument();
      const reportFilter = getByRole('button', { name: 'Report: The Download File.pdf' });
      userEvent.click(reportFilter);
      userEvent.click(getByRole('button', { name: 'Another Download File.xml' }));
      act(() => {
        jest.runAllTimers();
      });
      expect(queryByRole('button', { name: 'The Download File.pdf' })).not.toBeInTheDocument();
      jest.resetModules();
    });
  });
});
