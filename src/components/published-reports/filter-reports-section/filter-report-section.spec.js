import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FilterReportsSection from './filter-reports-section';
import { runTimeFilterDatasetConfig } from '../published-reports-test-helper';
import * as ApiUtils from '../../../utils/api-utils';

const apiMock = {
  apiId: 302,
  dateFiled: 'recordDate',
  earliestDate: '2024-07-04',
  latestDate: '2024-07-01',
  tableName: 'mockTable',
};

jest.spyOn(ApiUtils, 'basicFetch');

describe('Run Time Filter Report Section', () => {
  it('Should check to see if the api call was fetched', async () => {
    const mockReponse = [{ file_name: 'mock-file.csv', report_Date: '2024-06-04' }];
    jest.spyOn(ApiUtils, 'basicFetch').mockRejectedValueOnce(mockReponse);

    render(
      <FilterReportsSection
        reportConfig={{ ...runTimeFilterDatasetConfig.runTimeReportConfig, optionValues: ['1234'] }}
        apis={[apiMock]}
        width={1024}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Account/i }));
    fireEvent.click(screen.getByText('1234'));

    await waitFor(() => {
      expect(ApiUtils.basicFetch).toHaveBeenCalledTimes(1);
    });
  });

  it('should render an empty table by default', () => {
    const { getByText } = render(<FilterReportsSection reportConfig={runTimeFilterDatasetConfig.runTimeReportConfig} apis={[]} width={1024} />);
    const { defaultHeader, defaultMessage } = runTimeFilterDatasetConfig.runTimeReportConfig;
    expect(getByText(defaultHeader)).toBeInTheDocument();
    expect(getByText(defaultMessage)).toBeInTheDocument();
  });
  it('show the date picker when apis array supplied', () => {
    render(<FilterReportsSection reportConfig={runTimeFilterDatasetConfig.runTimeReportConfig} apis={[apiMock]} width={1024} />);
    expect(screen.getByRole('button', { name: /Published Date/i })).toBeInTheDocument();
  });
  it('keep "(none selected)" until user picks an account', () => {
    render(
      <FilterReportsSection
        reportConfig={{ ...runTimeFilterDatasetConfig.runTimeReportConfig, optionValues: ['1234', '5678'] }}
        apis={[apiMock]}
        width={1024}
      />
    );
    expect(screen.getByRole('button', { name: /\(None selected\)/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Account/i }));
    fireEvent.click(screen.getByText('1234'));
    expect(screen.getByRole('button', { name: '1234' })).toBeInTheDocument();
  });

  it('should render an unmatched message when no filters match', async () => {
    ApiUtils.basicFetch.mockRejectedValueOnce(new Error('error'));
    const { getByText } = render(
      <FilterReportsSection
        reportConfig={{ ...runTimeFilterDatasetConfig.runTimeReportConfig, optionValues: ['1234', '5678'] }}
        apis={[apiMock]}
        width={1024}
      />
    );
    expect(screen.getByRole('button', { name: /\(None selected\)/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Account/i }));
    fireEvent.click(screen.getByText('1234'));
    const { unmatchedHeader, unmatchedMessage } = runTimeFilterDatasetConfig.runTimeReportConfig;
    await waitFor(() => {
      expect(screen.getByText(unmatchedHeader)).toBeInTheDocument();
      expect(screen.getByText(unmatchedMessage)).toBeInTheDocument();
    });
  });

  it('display the correct date year', () => {
    render(
      <FilterReportsSection
        reportConfig={{ ...runTimeFilterDatasetConfig.runTimeReportConfig, optionValues: ['1234', '5678'] }}
        apis={[apiMock]}
        width={1024}
      />
    );
    expect(screen.getByRole('button', { name: /\(None selected\)/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Account/i }));
    fireEvent.click(screen.getByText('1234'));
    expect(screen.getByText(/2024/i)).toBeInTheDocument();
  });
});
