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
  ADDITIONAL_DATASETS: {},
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
      hideColumns: [
        'record_date',
        'src_line_nbr',
        'record_fiscal_year',
        'record_fiscal_quarter',
        'record_calendar_year',
        'record_calendar_quarter',
        'record_calendar_month',
        'record_calendar_day',
      ],
    },
    // TIPS and CPI V2
    331: {
      endpoint: 'v1/accounting/od/tips_cpi_data_summary_v2',
      downloadName: 'TIPSandCPIdata_Summary_v2',
      dateField: 'original_issue_date',
      alwaysSortWith: ['-comp_auction_close_date'],
      detailApi: {
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
      selectColumns: [],
      customFormatting: [
        {
          type: 'NUMBER',
          fields: ['index_ratio', 'ref_cpi', 'ref_cpi_on_dated_date'],
          decimalPlaces: 6,
        },
        {
          type: 'STRING',
          fields: ['additional_issue_date'],
          breakChar: ',',
          customType: 'dateList',
        },
      ],
    },
    332: {
      endpoint: 'v1/accounting/od/tips_cpi_data_detail_v2',
      downloadName: 'TIPSandCPIdata_Details_v2',
      dateField: 'index_date',
      alwaysSortWith: ['-index_date'],
      hideColumns: ['cusip', 'original_issue_date'],
      isDetailApi: true,
      customFormatting: [
        {
          type: 'NUMBER',
          fields: ['index_ratio', 'ref_cpi', 'ref_cpi_on_dated_date'],
          decimalPlaces: 6,
        },
        {
          type: 'STRING',
          fields: ['additional_issue_date'],
          breakChar: ',',
          customType: 'dateList',
        },
      ],
      selectColumns: ['index_date', 'ref_cpi', 'index_ratio', 'pdf_link', 'xml_link'],
    },
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
