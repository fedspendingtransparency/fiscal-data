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
  },
};
