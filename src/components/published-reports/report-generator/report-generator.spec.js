import React from 'react';
import ReportGenerator from './report-generator';
import { accountStatementFebData, accountStatementReportConfig } from './mockData';
import { render } from '@testing-library/react';

describe('Report generator component', () => {
  it('test', () => {
    const { getByText, getByRole } = render(
      <ReportGenerator reportConfig={accountStatementReportConfig} reportData={accountStatementFebData.data} />
    );
    const button = getByRole('button');
  });
});
