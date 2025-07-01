import React from 'react';
import { render } from '@testing-library/react';
import FilterReportsSection from './filter-reports-section';
import { runTimeFilterDatasetConfig } from '../published-reports-test-helper';

describe('Run Time Filter Report Section', () => {
  it('should render an empty table by default', () => {
    const { getByText } = render(<FilterReportsSection reportConfig={runTimeFilterDatasetConfig.runTimeReportConfig} apis={[]} width={1024} />);
    const { defaultHeader, defaultMessage } = runTimeFilterDatasetConfig.runTimeReportConfig;
    expect(getByText(defaultHeader)).toBeInTheDocument();
    expect(getByText(defaultMessage)).toBeInTheDocument();
  });
});
