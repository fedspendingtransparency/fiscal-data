module.exports = {
  ENV_ID: 'uat',
  BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.uat.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.uat.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['experimental-page', 'react-table-poc', 'afg-overview'],
  ADDITIONAL_DATASETS: {
    '015-BFS-2014Q3-047': {
      slug: '/treasury-bulletin-trust-funds/',
      seoConfig: {
        pageTitle: 'Treasury Bulletin Trust Fund Reports',
        description: 'Machine readable data of the Treasury Bulletin Trust Fund Reports.',
        keywords: 'Trust Fund, Financial Summaries',
      },
      topics: ['financial-summaries'],
      relatedDatasets: ['015-BFS-2014Q3-046'],
      currentDateButton: 'byMonth',
    },
  },
  ADDITIONAL_ENDPOINTS: {
    '27': {
      endpoint: 'v1/debt/mspd/mspd_table_1',
      dateField: 'record_date',
      downloadName: 'MSPD_SumSecty',
      dataDisplays: [
        {
          title: 'By Marketable',
          dimensionField: 'security_class_desc',
          filters: [
            {
              key: 'security_type_desc',
              value: 'Marketable',
            },
          ],
        },
        {
          title: 'By Nonmarketable',
          dimensionField: 'security_class_desc',
          filters: [
            {
              key: 'security_type_desc',
              value: 'Nonmarketable',
            },
          ],
        },
      ],
      valueFieldOptions: ['debt_held_public_mil_amt', 'intragov_hold_mil_amt', 'total_mil_amt'],
    },
    '28': {
      endpoint: 'v1/debt/mspd/mspd_table_3',
      dateField: 'record_date',
      downloadName: 'MSPD_DetailSecty',
      dataDisplays: [
        {
          title: 'By Marketable',
          dimensionField: 'security_class1_desc',
          filters: [
            {
              key: 'security_type_desc',
              value: 'Marketable',
            },
          ],
        },
        {
          title: 'By Nonmarketable',
          dimensionField: 'security_class2_desc',
          filters: [
            {
              key: 'security_type_desc',
              value: 'Nonmarketable',
            },
          ],
        },
      ],
      valueFieldOptions: [
        'issued_amt',
        'inflation_adj_amt',
        'redeemed_amt',
        'outstanding_amt',
        'prior_month_outstanding_amt',
        'current_month_issued_amt',
        'current_month_redeemed_amt',
        'current_month_outstanding_amt',
      ],
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
    // Treasury Bulletin: Trust Fund Reports
    '265': {
      endpoint: 'v1/accounting/od/airport_airway_trust_fund_results',
      dateField: 'record_date',
      downloadName: 'TB_AirportAirwayResults',
    },
    '266': {
      endpoint: 'v1/accounting/od/airport_airway_trust_fund_expected',
      dateField: 'record_date',
      downloadName: 'TB_AirportAirwayExpected',
      alwaysSortWith: ['record_date', 'fiscal_year', 'src_line_nbr'],
    },
    '269': {
      endpoint: 'v1/accounting/od/black_lung_disability_trust_fund_results',
      dateField: 'record_date',
      downloadName: 'TB_BlackLungResults',
    },
    '270': {
      endpoint: 'v1/accounting/od/black_lung_disability_trust_fund_expected',
      dateField: 'record_date',
      downloadName: 'TB_BlackLungConditionExpected',
      alwaysSortWith: ['record_date', 'fiscal_year', 'src_line_nbr'],
    },
    '271': {
      endpoint: 'v1/accounting/od/harbor_maintenance_trust_fund_results',
      dateField: 'record_date',
    },
    '272': {
      endpoint: 'v1/accounting/od/harbor_maintenance_trust_fund_expected',
      dateField: 'record_date',
      alwaysSortWith: ['record_date', 'fiscal_year', 'src_line_nbr'],
    },
    '273': {
      endpoint: 'v1/accounting/od/hazardous_substance_superfund_results',
      dateField: 'record_date',
    },
    '274': {
      endpoint: 'v1/accounting/od/hazardous_substance_superfund_expected',
      dateField: 'record_date',
      alwaysSortWith: ['record_date', 'fiscal_year', 'src_line_nbr'],
    },
    '283': {
      endpoint: 'v1/accounting/od/reforestation_trust_fund_results',
      dateField: 'record_date',
    },
    '284': {
      endpoint: 'v1/accounting/od/reforestation_trust_fund_expected',
      dateField: 'record_date',
      alwaysSortWith: ['record_date', 'fiscal_year', 'src_line_nbr'],
    },
    '285': {
      endpoint: 'v1/accounting/od/sport_fish_restoration_boating_trust_fund_results',
      dateField: 'record_date',
    },
    '286': {
      endpoint: 'v1/accounting/od/sport_fish_restoration_boating_trust_fund_expected',
      dateField: 'record_date',
      alwaysSortWith: ['record_date', 'fiscal_year', 'src_line_nbr'],
    },
    '287': {
      endpoint: 'v1/accounting/od/oil_spill_liability_trust_fund_results',
      dateField: 'record_date',
    },
    '288': {
      endpoint: 'v1/accounting/od/oil_spill_liability_trust_fund_expected',
      dateField: 'record_date',
      alwaysSortWith: ['record_date', 'fiscal_year', 'src_line_nbr'],
    },
    '293': {
      endpoint: 'v1/accounting/od/agriculture_disaster_relief_trust_fund_results',
      dateField: 'record_date',
    },
    '294': {
      endpoint: 'v1/accounting/od/agriculture_disaster_relief_trust_fund_expected',
      dateField: 'record_date',
      alwaysSortWith: ['record_date', 'fiscal_year', 'src_line_nbr'],
    },
    '295': {
      endpoint: 'v1/accounting/od/patient_centered_outcomes_research_trust_fund_results',
      dateField: 'record_date',
    },
    '296': {
      endpoint: 'v1/accounting/od/patient_centered_outcomes_research_trust_fund_expected',
      dateField: 'record_date',
      alwaysSortWith: ['record_date', 'fiscal_year', 'src_line_nbr'],
    },
    '297': {
      endpoint: 'v1/accounting/od/us_victims_state_sponsored_terrorism_fund_results',
      dateField: 'record_date',
    },
    '298': {
      endpoint: 'v1/accounting/od/us_victims_state_sponsored_terrorism_fund_expected',
      dateField: 'record_date',
      alwaysSortWith: ['record_date', 'fiscal_year', 'src_line_nbr'],
    },
  },
};
