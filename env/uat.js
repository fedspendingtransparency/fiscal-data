module.exports = {
  ENV_ID: 'uat',
  BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.uat.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.uat.fiscaldata.treasury.gov/main',
  STRICT_SSL: true,
  EXPERIMENTAL_ALLOWLIST: [
    'experimental-page',
    'afg-overview',
    'publishedReportsSection',
    'dataPreview',
    'chartingConfigurationTool',
    'featured-content',
  ],
  LOWER_ENV_FEATURE_ALLOWLIST: ['reportGeneration', 'fipReportsSection', 'combinedStatement'],
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
      datePreset: 'all',
      detailView: {
        apiId: 332,
        field: 'cusip',
        label: 'CUSIP',
        dateRangeLockCopy: 'To filter data by date range, select a CUSIP from the table below.',
        summaryTableFields: [
          'cusip',
          'series',
          'interest_rate',
          'security_term',
          'original_issue_date',
          'maturity_date',
          'dated_date',
          'ref_cpi_on_dated_date',
          'additional_issue_date',
        ],
        selectColumns: ['index_date', 'ref_cpi', 'index_ratio', 'pdf_link', 'xml_link'],
      },
    },
  },
  ADDITIONAL_ENDPOINTS: {
    '299': {
      endpoint: 'v1/debt/treasury_offset_program',
      dateField: 'record_date',
      downloadName: 'treasury_offset_program',
      alwaysSortWith: ['-record_date', 'row_index_nbr'],
      selectColumns: [],
      dataDisplays: [
        {
          title: 'Mixed Stream',
          dimensionField: 'mixed_stream',
        },
        {
          title: 'State or Agency',
          dimensionField: 'state_or_agency',
        },
        {
          title: 'Agency Full Code Name',
          dimensionField: 'agency_full_cd_nm',
        },
        {
          title: 'Agency Name',
          dimensionField: 'agency_nm',
        },
        {
          title: 'Agency',
          dimensionField: 'agency',
        },
        {
          title: 'Agency Site ID',
          dimensionField: 'agency_site_id',
        },
        {
          title: 'Payment Type',
          dimensionField: 'payment_type',
        },
        {
          title: 'Payment Source',
          dimensionField: 'payment_source',
        },
        {
          title: 'Debt Category',
          dimensionField: 'debt_category',
        },
        {
          title: 'State Code',
          dimensionField: 'state_cd',
        },
        {
          title: 'Reversal Requestor',
          dimensionField: 'reversal_requestor',
        },
        {
          title: 'Payment Category Description',
          dimensionField: 'payment_category',
        },
      ],
      valueFieldOptions: ['net_offset_cnt', 'net_offset_amt', 'net_dms_fee_amt', 'offset_amnt', 'offset_cnt', 'reversal_cnt', 'reserval_amt'],
    },
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
    '139': {
      endpoint: 'v1/debt/mspd/mspd_table_3_market',
      dateField: 'record_date',
      downloadName: 'MSPD_MktSecty',
      dataDisplays: [
        {
          title: 'Security Class Description',
          dimensionField: 'security_class1_desc',
          roundingDenomination: 'millions',
          filters: [
            {
              key: 'security_class2_desc',
              operator: 'in',
              value:
                'null,Total Treasury Bills,Total Treasury Bonds,Total Treasury Floating ' +
                'Rate Notes,Total Tresasury Floating Rate Notes,Treasury Floating Rate Notes,Total Treasury Inflation-Indexed ' +
                'Bonds,Total Treasury Inflation-Indexed Notes,Total Treasury Inflation-Protected ' +
                'Securities,Total Treasury TIPS,Total Treasury Notes,',
            },
            {
              key: 'security_class1_desc',
              operator: 'neq',
              value: 'Total Marketable',
            },
          ],
        },
        {
          title: 'Bonds by Maturity',
          dimensionField: 'security_class2_desc',
          roundingDenomination: 'millions',
          filters: [
            {
              key: 'security_class2_desc',
              operator: 'in',
              value: 'Total Matured Treasury Bonds,Total Unmatured Treasury Bonds',
            },
          ],
        },
        {
          title: 'Inflation-Protected Securities by Class',
          dimensionField: 'security_class2_desc',
          roundingDenomination: 'millions',
          filters: [
            {
              key: 'security_class2_desc',
              operator: 'in',
              value:
                'Total Treasury Inflation-Indexed Bonds,Total Treasury Inflation-Indexed ' +
                'Notes,Total Treasury Inflation-Protected Securities,Total Treasury TIPS',
            },
          ],
        },
        {
          title: 'Notes by Maturity',
          dimensionField: 'security_class2_desc',
          roundingDenomination: 'millions',
          filters: [
            {
              key: 'security_class2_desc',
              operator: 'in',
              value: 'Total Matured Treasury Notes,Total Unmatured Treasury Notes',
            },
          ],
        },
      ],
      valueFieldOptions: ['issued_amt', 'outstanding_amt', 'redeemed_amt'],
      selectColumns: [
        'record_date',
        'security_type_desc',
        'security_class1_desc',
        'security_class2_desc',
        'series_cd',
        'interest_rate_pct',
        'yield_pct',
        'issue_date',
        'maturity_date',
        'interest_pay_date_1',
        'interest_pay_date_2',
        'interest_pay_date_3',
        'interest_pay_date_4',
        'issued_amt',
        'inflation_adj_amt',
        'redeemed_amt',
        'outstanding_amt',
      ],
    },
    // Auctions Query V2
    329: {
      endpoint: 'v1/accounting/od/treasury_securities_auctions_v2',
      dateField: 'record_date',
      downloadName: 'Auctions_TreasurySecurities_v2',
      alwaysSortWith: ['-comp_auction_close_date', 'noncomp_auction_close_date', '-issue_date', '-maturity_date'],
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
        'pdf_filenm_spec_announcemt',
        'pdf_filenm_comp_results',
        'pdf_filenm_noncomp_results',
        'xml_filenm_announcemt',
        'xml_filenm_comp_results',
        'xml_filenm_noncomp_results',
      ],
    },
    // Upcoming Auctions V2
    330: {
      endpoint: 'v1/accounting/od/upcoming_auctions_v2',
      dateField: 'record_date',
      downloadName: 'Upcoming_Auctions_v2',
      alwaysSortWith: ['-announcemt_date', '-comp_auction_close_date', '-issue_date'],
    },
    // TIPS and CPI V2
    // 331: {
    //   endpoint: 'v1/accounting/od/tips_cpi_data_summary_v2',
    //   downloadName: 'TIPSandCPIdata_Summary_v2',
    //   dateField: 'comp_auction_close_date',
    //   alwaysSortWith: ['-comp_auction_close_date'],
    // },
    // 332: {
    //   endpoint: 'v1/accounting/od/tips_cpi_data_details_v2',
    //   downloadName: 'TIPSandCPIdata_Details_v2',
    //   dateField: 'index_date',
    //   alwaysSortWith: ['-index_date'],
    //   hideColumns: ['cusip', 'original_issue_date'],
    //   customFormatting: [
    //     {
    //       type: 'NUMBER',
    //       fields: ['index_ratio', 'ref_cpi', 'ref_cpi_on_dated_date'],
    //       decimalPlaces: 6,
    //     },
    //     {
    //       type: 'STRING',
    //       fields: ['additional_issue_date'],
    //       breakChar: ',',
    //       customType: 'dateList',
    //     },
    //   ],
    //   selectColumns: ['index_date', 'ref_cpi', 'index_ratio', 'pdf_link', 'xml_link'],
    // },
    //FRN Daily Indexes V2
    334: {
      endpoint: 'v1/accounting/od/frn_daily_indexes_v2',
      dateField: 'record_date',
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
