module.exports = {
  ENV_ID: 'uat',
  BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.uat.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.uat.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['experimental-page', 'react-table-poc', 'afg-overview'],
  ADDITIONAL_DATASETS: {
    '015-BFS-2014Q3-050': {
      slug: '/tips-cpi-data/',
      seoConfig: {
        pageTitle: 'TIPS and CPI Data',
        description:
          'Treasury Inflation Protected Securities (TIPS) issued by the U.S. Treasury and Consumer Price Index (CPI) numbers released by the Bureau of Labor Statistics (BLS).',
        keywords: 'Consumer Price Index, CPI',
      },
      topics: ['auctions', 'interest-exchange-rates'],
      relatedDatasets: ['015-BFS-2014Q3-045', '015-BFS-2014Q3-056', '015-BFS-2014Q3-048', '015-BFS-2014Q3-049'],
      currentDateButton: 'byMonth',
    },
  },
  ADDITIONAL_ENDPOINTS: {
    '160': {
      endpoint: 'v2/accounting/od/balance_sheets',
      downloadName: 'USFR_BalSheet',
      // 'Pivot View' in UI; 'Pivot View (Field)' and 'Pivot View (Name)' on form
      dataDisplays: [
        {
          title: 'By Assets',
          dimensionField: 'line_item_desc',
          filters: [
            {
              key: 'account_desc',
              value: 'Assets',
            },
          ],
        },
        {
          title: 'By Liabilities',
          dimensionField: 'line_item_desc',
          filters: [
            {
              key: 'account_desc',
              value: 'Liabilities',
            },
          ],
        },
        {
          title: 'By Net Position',
          dimensionField: 'line_item_desc',
          filters: [
            {
              key: 'account_desc',
              value: 'Net position',
            },
          ],
        },
      ],
      // 'Pivot Value' in UI, 'Pivot Value (Field)' on form
      valueFieldOptions: ['position_bil_amt'],
    },
    '264': {
      endpoint: 'v1/accounting/od/tips_cpi_data_summary',
      downloadName: 'TIPSandCPIdata_Summary',
      dateField: 'original_issue_date',
      alwaysSortWith: ['-original_issue_date'],
      selectColumns: [],
    },
    '300': {
      endpoint: 'v1/accounting/od/tips_cpi_data_details',
      downloadName: 'TIPSandCPIdata_Details',
      dateField: 'index_date',
      alwaysSortWith: ['-index_date'],
      selectColumns: [],
    },
  },
};
