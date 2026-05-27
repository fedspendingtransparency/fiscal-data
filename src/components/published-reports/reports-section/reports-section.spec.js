import React from 'react';
import ReportsSection from './reports-section';
import { act, fireEvent, render, within } from '@testing-library/react';
import { mockDailyReports, mockReports } from '../published-reports-test-helper';
import { ErrorBoundary } from 'react-error-boundary';

URL.createObjectURL = URL.createObjectURL || (() => 'blob:http://localhost/mock');
URL.createObjectURL = URL.createObjectURL || (() => {});
jest.mock('../../../workers/pdfWorker', () => ({
  renderPDF: jest.fn().mockResolvedValue({
    url: 'blob:http://localhost/mock-pdf',
    size: '4 kb',
  }),
}));
describe('Reports Section component', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
  });

  it('renders a Reports and Files header', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ReportsSection dataset={{ publishedReports: null }} />
      </ErrorBoundary>
    );
    expect(getByText('Reports and Files')).toBeInTheDocument();
  });

  it('renders a date picker', () => {
    const datasetConfig = {
      publishedReports: [
        {
          report_date: new Date('8/8/2024'),
          report_group_sort_order_nbr: 1,
          report_group_desc: 'test (.pdf)',
          path: 'test/test.pdf',
          report_group_id: 1,
        },
        {
          report_date: new Date('8/7/2024'),
          report_group_sort_order_nbr: 1,
          report_group_desc: 'test (.pdf)',
          path: 'test/test.pdf',
          report_group_id: 1,
        },
      ],
    };

    const { getByText } = render(
      <ErrorBoundary>
        <ReportsSection dataset={datasetConfig} />
      </ErrorBoundary>
    );
    expect(getByText('Published Date:')).toBeInTheDocument();
  });

  it('renders a download table', () => {
    const datasetConfig = { reportSelection: 'byReport', publishedReports: mockReports };
    const { getByRole } = render(
      <ErrorBoundary>
        <ReportsSection dataset={datasetConfig} />
      </ErrorBoundary>
    );
    expect(getByRole('table')).toBeInTheDocument();
  });

  it('renders a download table with daily reports', () => {
    const datasetConfig = { reportSelection: 'byReport', publishedReports: mockDailyReports };
    const { getByRole } = render(
      <ErrorBoundary>
        <ReportsSection dataset={datasetConfig} />
      </ErrorBoundary>
    );
    expect(getByRole('table')).toBeInTheDocument();
  });

  it('renders published reports tip', () => {
    const reportTip = 'A tip for viewing the reports';
    const { getByText } = render(
      <ErrorBoundary>
        <ReportsSection dataset={{ publishedReportsTip: reportTip }} />
      </ErrorBoundary>
    );
    expect(getByText(reportTip)).toBeInTheDocument();
    expect(getByText('Note:')).toBeInTheDocument();
  });

  it('does not render the note section when a published report tip is not available', () => {
    const { queryByText } = render(
      <ErrorBoundary>
        <ReportsSection dataset={{ publishedReports: null }} />
      </ErrorBoundary>
    );
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
    const { queryByText } = render(
      <ErrorBoundary>
        <ReportsSection dataset={datasetConfig} />
      </ErrorBoundary>
    );
    expect(queryByText('Published Date:')).not.toBeInTheDocument();
  });

  describe('Reports section with report filter', () => {
    const datasetConfig = { reportSelection: 'byReport', publishedReports: mockReports };
    it('renders report filter when reportSelection is byReport', () => {
      const { getByRole } = render(
        <ErrorBoundary>
          <ReportsSection dataset={datasetConfig} />
        </ErrorBoundary>
      );
      const reportFilter = getByRole('button', { name: 'Report: The Download File.pdf' });
      expect(reportFilter).toBeInTheDocument();
    });

    it('Updates most recent date in date picker on report change', () => {
      jest.useFakeTimers();
      const { getByRole } = render(
        <ErrorBoundary>
          <ReportsSection dataset={datasetConfig} />
        </ErrorBoundary>
      );
      const dateFilter = getByRole('button', { name: 'Select Published Date' });
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

    it('Only shows selected report in the report table', async () => {
      jest.useFakeTimers();
      const { getByRole, queryByRole } = render(
        <ErrorBoundary>
          <ReportsSection dataset={datasetConfig} />
        </ErrorBoundary>
      );
      const reportFilter = getByRole('button', { name: 'Report: The Download File.pdf' });
      fireEvent.click(reportFilter);
      fireEvent.click(getByRole('button', { name: 'Another Download File.xml' }));
      act(() => {
        jest.runAllTimers();
      });
      expect(queryByRole('button', { name: 'The Download File.pdf' })).not.toBeInTheDocument();
      jest.resetModules();
    });
  });
});
