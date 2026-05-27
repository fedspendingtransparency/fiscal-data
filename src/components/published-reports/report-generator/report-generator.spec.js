import React from 'react';
import { render, screen } from '@testing-library/react';
import ReportGenerator from './report-generator';
import { accountStatementFebData, accountStatementReportConfig, colConfig } from './mockData';

const generatedReport = {
  config: accountStatementReportConfig,
  data: accountStatementFebData.data,
  summaryData: accountStatementFebData.summaryData ?? [],
  colConfig,
};

describe('Report generator component', () => {
  it('renders document title', () => {
    render(<ReportGenerator generatedReport={generatedReport} />);
    expect(screen.getByText(accountStatementReportConfig.documentTitle)).toBeInTheDocument();
  });

  it('renders document header information', () => {
    render(<ReportGenerator generatedReport={generatedReport} />);

    accountStatementReportConfig.reportInfo.forEach(({ name, value }) => {
      const headerRegex = new RegExp(`${name}:?\\s*$`, 'i');
      expect(screen.getByText(headerRegex, { exact: false })).toBeInTheDocument();

      if (value) {
        expect(screen.getByText(value)).toBeInTheDocument();
      }
    });
  });

  it('renders the reportSummary lines (if supplied)', () => {
    if (!accountStatementReportConfig.reportSummary) return;

    render(<ReportGenerator generatedReport={generatedReport} />);

    accountStatementReportConfig.reportSummary.forEach(({ name }) => {
      expect(screen.getByText(new RegExp(name, 'i'), { exact: false })).toBeInTheDocument();
    });
  });

  it('renders document tables', () => {
    render(<ReportGenerator generatedReport={generatedReport} />);

    accountStatementReportConfig.tables.forEach(({ fields }) => {
      fields.forEach(({ name }) => {
        const pretty = accountStatementFebData.meta.labels[name];
        expect(screen.getByText(pretty)).toBeInTheDocument();
      });
    });
  });
});
