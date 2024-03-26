module.exports = {
  ENV_ID: 'uat',
  BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.uat.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.uat.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['experimental-page', 'react-table-poc', 'afg-overview'],
  ADDITIONAL_DATASETS: {
    '015-BFS-2014Q3-051': {
      slug: '/federal-investments-program-statement-of-account/',
      seoConfig: {
        pageTitle: 'Federal Investments Program',
        description:
          'Statement of Account provides monthly reports specifying the security holdings as of the end of each month and all transaction activity during that month for each individual investment account.',
        keywords: 'Financial Summaries',
      },
      topics: ['financial-summaries'],
      relatedDatasets: ['015-BFS-2014Q3-098'],
      currentDateButton: 'byMonth',
    },
    '015-BFS-2014Q3-049': {
      slug: '/receipts-by-department/',
      seoConfig: {
        pageTitle: 'Receipts by Department',
        description: 'The Receipts by Department dataset contains receipt amounts categorized by agency identifier and account symbols',
        keywords: 'Financial Summaries',
      },
      topics: ['financial-summaries'],
      relatedDatasets: ['015-BFS-2014Q1-13', '015-BFS-2014Q1-03', '015-BFS-2014Q1-07'],
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
    '302': {
      endpoint: 'v1/accounting/od/fip_statement_of_account_table1',
      dateField: 'record_date',
      downloadName: 'FIP_SOA_CARS_Reporting',
      alwaysSortWith: ['account_number_tas, -record_date, src_line_nbr'],
      selectColumns: ['account_number_tas', 'account_name', 'date_range', 'line_item_nm', 'decrease', 'increase'],
    },
    '303': {
      endpoint: 'v1/accounting/od/fip_statement_of_account_table2',
      dateField: 'record_date',
      downloadName: 'FIP_SOA_Account_Pos_Summary',
      alwaysSortWith: ['account_number_tas, -record_date, src_line_nbr'],
      selectColumns: [
        'account_number_tas',
        'account_name',
        'date_range',
        'sub_category',
        'line_item_nm',
        'beginning_balance',
        'net_change',
        'ending_balance',
      ],
    },
    '304': {
      endpoint: 'v1/accounting/od/fip_statement_of_account_table3',
      dateField: 'record_date',
      downloadName: 'FIP_SOA_Transaction_Detail',
      alwaysSortWith: ['account_number_tas, -record_date, src_line_nbr'],
      selectColumns: [
        'account_number_tas',
        'account_name',
        'date_range',
        'trans_date',
        'memo_no',
        'sub_category',
        'principal_inflation_comp',
        'unrealized_discount',
        'premium_discount_recognized',
        'interest_inflation_earnings',
        'total_investments',
        'total_redemptions',
        'total_inflation_purchased_sold',
      ],
    },
  },
};
