import React from 'react';
import ReportsSection from './reports-section';
import { render, within } from '@testing-library/react';
import { mockDailyReports, mockReports } from '../published-reports-test-helper';

describe('Reports Section component', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
  });

  it('renders a Reports and Files header', () => {
    const { getByText } = render(<ReportsSection dataset={{ publishedReports: null }} />);
    expect(getByText('Reports and Files')).toBeInTheDocument();
  });

  it('renders a date picker', () => {
    const datasetConfig = {
      publishedReports: [
        { report_date: new Date('8/8/2024'), report_group_sort_order_nbr: 1, report_group_desc: 'test (.pdf)', path: 'test/test.pdf' },
        { report_date: new Date('8/7/2024'), report_group_sort_order_nbr: 1, report_group_desc: 'test (.pdf)', path: 'test/test.pdf' },
      ],
    };

    const { getByText } = render(<ReportsSection dataset={datasetConfig} />);
    expect(getByText('Published Date:')).toBeInTheDocument();
  });

  it('renders a download table', () => {
    const datasetConfig = { reportSelection: 'byReport', publishedReports: mockReports };
    const { getByRole } = render(<ReportsSection dataset={datasetConfig} />);
    expect(getByRole('table')).toBeInTheDocument();
  });

  it('renders a download table with daily reports', () => {
    const datasetConfig = { reportSelection: 'byReport', publishedReports: mockDailyReports };
    const { getByRole } = render(<ReportsSection dataset={datasetConfig} />);
    expect(getByRole('table')).toBeInTheDocument();
  });

  it('renders published reports tip', () => {
    const reportTip = 'A tip for viewing the reports';
    const { getByText } = render(<ReportsSection dataset={{ publishedReportsTip: reportTip }} />);
    expect(getByText(reportTip)).toBeInTheDocument();
    expect(getByText('Note:')).toBeInTheDocument();
  });

  it('does not render the note section when a published report tip is not available', () => {
    const { queryByText } = render(<ReportsSection dataset={{ publishedReports: null }} />);
    expect(queryByText('Note:')).not.toBeInTheDocument();
  });

  it('does not render the report date picker when hideReportDatePicker is true', () => {
    const datasetConfig = {
      hideReportDatePicker: true,
      publishedReports: [
        { report_date: new Date('8/8/2024'), report_group_sort_order_nbr: 1, report_group_desc: 'test (.pdf)', path: 'test/test.pdf' },
        { report_date: new Date('8/7/2024'), report_group_sort_order_nbr: 1, report_group_desc: 'test (.pdf)', path: 'test/test.pdf' },
      ],
    };
    const { queryByText } = render(<ReportsSection dataset={datasetConfig} />);
    expect(queryByText('Published Date:')).not.toBeInTheDocument();
  });

  describe('Reports section with report filter', () => {
    const datasetConfig = { reportSelection: 'byReport', publishedReports: mockReports };
    it('renders report filter when reportSelection is byReport', () => {
      const { getByRole } = render(<ReportsSection dataset={datasetConfig} />);
      const reportFilter = getByRole('button', { name: 'Report: The Download File.pdf' });
      expect(reportFilter).toBeInTheDocument();
    });

    it('Updates most recent date in date picker on report change', () => {
      jest.useFakeTimers();
      const { getByRole } = render(<ReportsSection dataset={datasetConfig} />);
      const dateFilter = getByRole('button', { name: 'Select Published Report Date' });
      expect(within(dateFilter).getByText('July 2024')).toBeInTheDocument();
      const reportFilter = getByRole('button', { name: 'Report: The Download File.pdf' });
      reportFilter.click();
      getByRole('button', { name: 'Another Download File.xml' }).click();
      expect(getByRole('button', { name: 'Report: Another Download File.xml' })).toBeInTheDocument();
      jest.runAllTimers();
      expect(within(dateFilter).getByText('July 2023')).toBeInTheDocument();
      jest.resetModules();
    });

    it('Only shows selected report in the report table', () => {
      jest.useFakeTimers();
      const { getByRole, queryByRole } = render(<ReportsSection dataset={datasetConfig} />);
      const dateFilter = getByRole('button', { name: 'Select Published Report Date' });
      expect(within(dateFilter).getByText('July 2024')).toBeInTheDocument();
      const reportFilter = getByRole('button', { name: 'Report: The Download File.pdf' });
      reportFilter.click();
      getByRole('button', { name: 'Another Download File.xml' }).click();
      jest.runAllTimers();
      expect(queryByRole('button', { name: 'The Download File.pdf' })).not.toBeInTheDocument();
      jest.resetModules();
    });
  });
});
