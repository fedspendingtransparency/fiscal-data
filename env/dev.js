module.exports = {
  ENV_ID: 'dev',
  BASE_URL: 'https://dev.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.dev.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://dev.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.dev.fiscaldata.treasury.gov/main',
  STRICT_SSL: true,
  EXPERIMENTAL_ALLOWLIST: ['experimental-page', 'not-found-md', 'apiNKL', 'publishedReportsSection', 'chartingConfigurationTool', 'featured-content'],
  LOWER_ENV_FEATURE_ALLOWLIST: ['fipReportsSection'],
  ADDITIONAL_DATASETS: {
    '015-BFS-2025Q2-002': {
      slug: '/monthly-treasury-disbursements/',
      seoConfig: {
        pageTitle: 'Monthly Treasury Disbursements',
        description:
          'The Monthly Treasury Disbursements dataset provides information on Treasury payments disbursed on behalf of government agencies each month.',
        keywords: 'Spending, Financial Summaries',
      },
      topics: ['spending', 'financial-summaries'],
      relatedDatasets: ['015-BFS-2014Q1-13', '015-BFS-2014Q1-03', '015-BFS-2014Q1-07'],
      hideRawDataTable: true,
      hideReportDatePicker: true,
    },
  },
  USE_MOCK_RELEASE_CALENDAR_DATA_ON_API_FAIL: true,
  ADDITIONAL_ENDPOINTS: {
    322: {
      endpoint: '',
    },
    329: {
      endpoint: 'v1/accounting/od/treasury_securities_auctions_v2',
      downloadName: 'Auctions_TreasurySecurities_v2',
      alwaysSortWith: ['-comp_auction_close_date', '-noncomp_auction_close_date', '-issue_date', '-maturity_date'],
      selectColumns: [
        'cusip',
        'security_type',
        'security_desc',
        'comp_auction_close_date',
        'noncomp_auction_close_date',
        'issue_date',
        'price_per_amt',
        'maturity_date',
        'pdf_filenm_announcemt',
        'pdf_filenm_spec_announcement',
        'pdf_filenm_comp_results',
        'pdf_filenm_noncomp_results',
        'xml_filenm_announcemt',
        'xml_filenm_comp_results',
        'xml_filenm_noncomp_results',
      ],
    },
    330: {
      endpoint: 'v1/accounting/od/upcoming_auctions_v2',
      downloadName: 'Upcoming_Auctions_v2',
      alwaysSortWith: ['-announcemt_date', '-comp_auction_close_date', '-issue_date'],
    },
    331: {
      endpoint: 'v1/accounting/od/tips_cpi_data_summary_v2',
      downloadName: 'TIPSandCPIdata_Summary_v2',
      alwaysSortWith: ['-comp_auction_close_date'],
    },
    332: {
      endpoint: 'v1/accounting/od/tips_cpi_data_detail_v2',
      downloadName: 'TIPSandCPIdata_Details_v2',
      alwaysSortWith: ['-index_date'],
      selectColumns: ['index_date', 'ref_cpi', 'index_ratio', 'pdf_link', 'xml_link'],
    },
    334: {
      endpoint: 'v1/accounting/od/frn_daily_indexes_v2',
      downloadName: 'frn_daily_indexes_v2',
      alwaysSortWith: ['cusip', 'start_of_accrual_period'],
      customFormatting: [
        {
          type: 'NUMBER',
          fields: ['spread'],
          decimalPlaces: 3,
        },
        {
          type: 'NUMBER',
          fields: ['daily_index', 'daily_int_accrual_rate'],
          noFormatting: true,
        },
      ],
    },
  },
};
