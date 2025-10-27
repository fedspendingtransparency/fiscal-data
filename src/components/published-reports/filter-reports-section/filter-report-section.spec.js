import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FilterReportsSection from './filter-reports-section';
import { runTimeFilterDatasetConfig } from '../published-reports-test-helper';
import * as ApiUtils from '../../../utils/api-utils';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock';

// mocks the web worker
URL.createObjectURL = URL.createObjectURL || (() => 'blob:http://localhost/mock');
URL.createObjectURL = URL.createObjectURL || (() => {});
jest.mock('../../../workers/pdfWorker', () => ({
  renderPDF: jest.fn().mockResolvedValue({
    url: 'blob:http://localhost/mock-pdf',
    size: '2kb',
  }),
}));

const apiMock = {
  apiId: 302,
  dateFiled: 'recordDate',
  earliestDate: '2024-07-04',
  latestDate: '2024-07-01',
  tableName: 'mockTable',
  endpoint: 'v1/accounting/od/auctions_query',
};

jest.spyOn(ApiUtils, 'basicFetch');

describe('Run Time Filter Report Section', () => {
  fetchMock.get(`https://www.transparency.treasury.gov/services/dtg/publishedfiles?dataset_id=015-BFS-2014Q3-051&path_contains=1234202406`, {});
  fetchMock.get(
    `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/od/auctions_query?filter=auction_date:eq:2024-06-30,account:eq:1234&fields=pdf_filenm_announcemt,pdf_filenm_comp_results,pdf_filenm_noncomp_results,xml_filenm_announcemt,xml_filenm_comp_results`,
    {
      data: [
        {
          pdf_filenm_announcemt: 'A_20251023_2.pdf',
          pdf_filenm_comp_results: 'R_20251027_1.pdf',
          pdf_filenm_noncomp_results: 'null',
          xml_filenm_announcemt: 'null',
          xml_filenm_comp_results: 'R_20251027_1.xml',
        },
      ],
    }
  );
  fetchMock.get(`https://www.transparency.treasury.gov/services/dtg/publishedfiles?dataset_id=015-BFS-2014Q3-051&path_contains=spec-ann`, [
    {
      report_date: '2025-10-27',
      path: '/static-data/published-reports/auctions-query/spec-ann/A_20251027_1.pdf',
      report_group_desc: 'Special Announcement (.pdf)',
      report_group_id: '24',
      report_group_sort_order_nbr: '5',
    },
  ]);
  fetchMock.get(`https://www.transparency.treasury.gov/services/dtg/publishedfiles?dataset_id=015-BFS-2014Q3-051&path_contains=/A_20251023_2.pdf`, [
    {
      report_date: '2025-10-27',
      path: '/static-data/published-reports/auctions-query/results/A_20251027_1.pdf',
      report_group_desc: 'Auction Announcement (.pdf)',
      report_group_id: '24',
      report_group_sort_order_nbr: '5',
    },
  ]);
  fetchMock.get(`https://www.transparency.treasury.gov/services/dtg/publishedfiles?dataset_id=015-BFS-2014Q3-051&path_contains=/R_20251027_1.pdf`, [
    {
      report_date: '2025-10-27',
      path: '/static-data/published-reports/auctions-query/results/R_20251027_1.pdf',
      report_group_desc: 'Auction Results (.pdf)',
      report_group_id: '24',
      report_group_sort_order_nbr: '5',
    },
  ]);
  fetchMock.get(`https://www.transparency.treasury.gov/services/dtg/publishedfiles?dataset_id=015-BFS-2014Q3-051&path_contains=/R_20251027_1.xml`, [
    {
      report_date: '2025-10-27',
      path: '/static-data/published-reports/auctions-query/results/R_20251027_1.xml',
      report_group_desc: 'Auction Results (.xml)',
      report_group_id: '24',
      report_group_sort_order_nbr: '5',
    },
  ]);
  fetchMock.get(
    `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/od/auctions_query?filter=account:eq:1234&fields=auction_date&sort=-auction_date&page[size]=10000`,
    [
      {
        data: [{ auction_date: '2024-06-30' }, { auction_date: '2024-09-30' }],
      },
    ]
  );
  fetchMock.head(`/static-data/published-reports/auctions-query/results/A_20251027_1.pdf`, [{}]);
  fetchMock.head(`/static-data/published-reports/auctions-query/results/R_20251027_1.pdf`, [{}]);
  fetchMock.head(`/static-data/published-reports/auctions-query/results/R_20251027_1.xml`, [{}]);

  it('Should check to see if the api call was fetched', async () => {
    const mockResponse = [{ file_name: 'mock-file.csv', report_Date: '2024-06-04' }];
    jest.spyOn(ApiUtils, 'basicFetch').mockRejectedValueOnce(mockResponse);

    render(
      <FilterReportsSection
        dataset={{
          runTimeReportConfig: { ...runTimeFilterDatasetConfig.runTimeReportConfig, optionValues: ['1234'] },
          apis: [apiMock],
          datasetId: '015-BFS-2014Q3-051',
        }}
        width={1024}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Account/i }));
    fireEvent.click(screen.getByText('1234'));

    await waitFor(() => {
      expect(ApiUtils.basicFetch).toHaveBeenCalledTimes(1);
    });
  });
  it('CusipFirst selecting a cusip does not auto pick a date and only loads available dates', async () => {
    jest.spyOn(ApiUtils, 'basicFetch').mockClear();

    render(
      <FilterReportsSection
        dataset={{
          runTimeReportConfig: {
            ...runTimeFilterDatasetConfig.runTimeReportConfig,
            optionValues: ['1234'],
            cusipFirst: true,
            dataTableRequest: {
              fields: 'pdf_filenm_announcemt,pdf_filenm_comp_results,pdf_filenm_noncomp_results,xml_filenm_announcemt,xml_filenm_comp_results',
              dateField: 'auction_date',
            },
            filterField: 'account',
          },
          apis: [apiMock],
          datasetId: '015-BFS-2014Q3-051',
        }}
        width={1024}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Account/i }));
    fireEvent.click(screen.getByText('1234'));

    expect(screen.getByRole('button', { name: /Published Date: \(None Selected\)/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(ApiUtils.basicFetch).toHaveBeenCalledTimes(1);
      const cusipURL = ApiUtils.basicFetch.mock.calls[0][0];
      expect(cusipURL).toMatch(/fields=auction_date/);
    });
  });

  it('cusipFirst date dropdown is disabled before cusip', async () => {
    render(
      <FilterReportsSection
        dataset={{
          runTimeReportConfig: {
            ...runTimeFilterDatasetConfig.runTimeReportConfig,
            optionValues: ['1234'],
            cusipFirst: true,
            dataTableRequest: {
              fields: 'pdf_filenm_announcemt,pdf_filenm_comp_results,pdf_filenm_noncomp_results,xml_filenm_announcemt,xml_filenm_comp_results',
              dateField: 'auction_date',
            },
            dateFilterLabel: 'Auction Date',
            filterField: 'account',
          },
          apis: [apiMock],
          datasetId: '015-BFS-2014Q3-051',
        }}
        width={1024}
      />
    );
    const dateButton = screen.getByRole('button', { name: /Auction Date:/i });
    expect(dateButton).toHaveAttribute('disabled');
    fireEvent.click(screen.getByRole('button', { name: /Account/i }));
    fireEvent.click(screen.getByText('1234'));

    expect(dateButton).not.toHaveAttribute('disabled');
  });

  it('should render an empty table by default', () => {
    const { getByText } = render(
      <FilterReportsSection
        dataset={{ runTimeReportConfig: runTimeFilterDatasetConfig.runTimeReportConfig, apis: [], datasetId: '015-BFS-2014Q3-051' }}
        width={1024}
      />
    );
    const { defaultHeader, defaultMessage } = runTimeFilterDatasetConfig.runTimeReportConfig;
    expect(getByText(defaultHeader)).toBeInTheDocument();
    expect(getByText(defaultMessage)).toBeInTheDocument();
  });
  it('show the date picker when apis array supplied', () => {
    render(
      <FilterReportsSection
        dataset={{
          runTimeReportConfig: runTimeFilterDatasetConfig.runTimeReportConfig,
          apis: [apiMock],
          datasetId: '015-BFS-2014Q3-051',
        }}
        width={1024}
      />
    );
    expect(screen.getByRole('button', { name: /Published Date/i })).toBeInTheDocument();
  });
  it('keep "(none selected)" until user picks an account', () => {
    render(
      <FilterReportsSection
        dataset={{
          runTimeReportConfig: { ...runTimeFilterDatasetConfig.runTimeReportConfig, optionValues: ['1234', '5678'] },
          apis: [apiMock],
          datasetId: '015-BFS-2014Q3-051',
        }}
        width={1024}
      />
    );
    expect(screen.getByRole('button', { name: /\(None selected\)/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Account/i }));
    fireEvent.click(screen.getByText('1234'));
    expect(screen.getByRole('button', { name: 'Account: 1234' })).toBeInTheDocument();
  });

  it('should render an unmatched message when no filters match', async () => {
    ApiUtils.basicFetch.mockRejectedValueOnce(new Error('error'));
    render(
      <FilterReportsSection
        dataset={{
          runTimeReportConfig: { ...runTimeFilterDatasetConfig.runTimeReportConfig, optionValues: ['1234', '5678'] },
          apis: [apiMock],
          datasetId: '015-BFS-2014Q3-051',
        }}
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
        dataset={{
          runTimeReportConfig: { ...runTimeFilterDatasetConfig.runTimeReportConfig, optionValues: ['1234', '5678'] },
          apis: [apiMock],
          datasetId: '015-BFS-2014Q3-051',
        }}
        width={1024}
      />
    );
    expect(screen.getByRole('button', { name: /\(None selected\)/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Account/i }));
    fireEvent.click(screen.getByText('1234'));
    expect(screen.getByText(/2024/i)).toBeInTheDocument();
  });

  it('renders custom filter within the dropdown', () => {
    const { getByRole } = render(
      <FilterReportsSection
        dataset={{
          runTimeReportConfig: {
            ...runTimeFilterDatasetConfig.runTimeReportConfig,
            optionValues: ['1234', '5678'],
            specialAnnouncement: {
              label: 'No CUSIP - Special Announcement',
              value: 'spec-ann',
            },
          },
          apis: [apiMock],
          datasetId: '015-BFS-2014Q3-051',
        }}
        width={1024}
      />
    );
    const accountDropdown = getByRole('button', { name: 'Account: (None selected)' });
    expect(accountDropdown).toBeInTheDocument();
    userEvent.click(accountDropdown);
    expect(getByRole('button', { name: 'No CUSIP - Special Announcement' })).toBeInTheDocument();
  });

  it('fetches special announcement reports', async () => {
    const { getByRole, findByRole } = render(
      <FilterReportsSection
        dataset={{
          runTimeReportConfig: {
            ...runTimeFilterDatasetConfig.runTimeReportConfig,
            optionValues: ['1234', '5678'],
            specialAnnouncement: {
              label: 'No CUSIP - Special Announcement',
              value: 'spec-ann',
            },
          },
          apis: [apiMock],
          datasetId: '015-BFS-2014Q3-051',
        }}
        width={1024}
      />
    );
    userEvent.click(getByRole('button', { name: 'Account: (None selected)' }));
    userEvent.click(getByRole('button', { name: 'No CUSIP - Special Announcement' }));
    await waitFor(() => {
      findByRole('cell', { name: 'Download A_20251027_1.pdf' });
    });
  });

  it('fetches report names from raw data table', async () => {
    const { getByRole, findByRole } = render(
      <FilterReportsSection
        dataset={{
          runTimeReportConfig: {
            ...runTimeFilterDatasetConfig.runTimeReportConfig,
            optionValues: ['1234', '5678'],
            dataTableRequest: {
              fields: 'pdf_filenm_announcemt,pdf_filenm_comp_results,pdf_filenm_noncomp_results,xml_filenm_announcemt,xml_filenm_comp_results',
              dateField: 'auction_date',
            },
          },
          apis: [apiMock],
          datasetId: '015-BFS-2014Q3-051',
        }}
        width={1024}
      />
    );
    userEvent.click(getByRole('button', { name: 'Account: (None selected)' }));
    userEvent.click(getByRole('button', { name: '1234' }));
    await waitFor(() => {
      findByRole('cell', { name: 'Download A_20251027_1.pdf' });
      findByRole('cell', { name: 'Download R_20251027_1.pdf' });
      findByRole('cell', { name: 'Download R_20251027_1.xml' });
    });
  });
});
