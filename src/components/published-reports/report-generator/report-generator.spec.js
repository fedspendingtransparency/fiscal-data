import React from 'react';
import ReportGenerator from './report-generator';
import { accountStatementFebData, accountStatementReportConfig, colConfig } from './mockData';
import { render } from '@testing-library/react';

describe('Report generator component', () => {
  it('renders document title', () => {
    const { getByText } = render(
      <ReportGenerator reportConfig={accountStatementReportConfig} reportData={accountStatementFebData.data} colConfig={colConfig} />
    );
    expect(getByText(accountStatementReportConfig.documentTitle)).toBeInTheDocument();
  });

  it('renders document header information', () => {
    const { getByText } = render(
      <ReportGenerator reportConfig={accountStatementReportConfig} reportData={accountStatementFebData.data} colConfig={colConfig} />
    );
    accountStatementReportConfig.reportInfo.forEach(line => {
      if (line?.value) {
        expect(getByText(line.name + ':')).toBeInTheDocument();
        expect(getByText(line.value)).toBeInTheDocument();
      } else {
        expect(getByText(line.name)).toBeInTheDocument();
      }
    });
  });

  it('renders document tables', () => {
    const { getByText } = render(
      <ReportGenerator reportConfig={accountStatementReportConfig} reportData={accountStatementFebData.data} colConfig={colConfig} />
    );
    const tableConfig = accountStatementReportConfig.tables[0];
    tableConfig.fields.forEach(field => {
      const prettyName = accountStatementFebData.meta.labels[field.name];
      expect(getByText(prettyName)).toBeInTheDocument();
    });
  });
});
