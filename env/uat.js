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
      detailViewAPI: '300',
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
    '300': {
      endpoint: 'v1/accounting/od/tips_cpi_data_detail',
      downloadName: 'TIPSandCPIdata_Details',
      dateField: 'index_date',
      alwaysSortWith: ['-index_date'],
    },
    '301': {
      endpoint: 'v1/accounting/od/tips_cpi_data_summary',
      downloadName: 'TIPSandCPIdata_Summary',
      dateField: 'original_issue_date',
      alwaysSortWith: ['-original_issue_date'],
      selectColumns: [],
    },
    '267': {
      endpoint: 'v1/accounting/od/uranium_enrichment_decontamination_decommissioning_fund_results',
      dateField: 'record_date',
      downloadName: 'TB_UraniumEnrichmentResults',
      alwaysSortWith: ['-record_date', '-src_line_nbr'],
    },
    '268': {
      endpoint: 'v1/accounting/od/uranium_enrichment_decontamination_decommissioning_fund_expected',
      dateField: 'record_date',
      downloadName: 'TB_UraniumEnrichmentExpected',
      alwaysSortWith: ['-record_date', '-fiscal_year', '-src_line_nbr'],
    },
    '275': {
      endpoint: 'v1/accounting/od/highway_trust_fund_results',
      dateField: 'record_date',
      downloadName: 'TB_HighwayResults',
      alwaysSortWith: ['-record_date', '-src_line_nbr'],
    },
    '276': {
      endpoint: 'v1/accounting/od/highway_trust_fund_expected',
      dateField: 'record_date',
      downloadName: 'TB_HighwayExpected',
      alwaysSortWith: ['-record_date', '-fiscal_year', '-src_line_nbr'],
    },
    '277': {
      endpoint: 'v1/accounting/od/highway_trust_fund',
      dateField: 'record_date',
      downloadName: 'TB_Highway',
      alwaysSortWith: ['-record_date', '-src_line_nbr'],
    },
    '278': {
      endpoint: 'v1/accounting/od/inland_waterways_trust_fund_results',
      dateField: 'record_date',
      downloadName: 'TB_InlandWaterwaysResults',
      alwaysSortWith: ['-record_date', '-src_line_nbr'],
    },
    '279': {
      endpoint: 'v1/accounting/od/inland_waterways_trust_fund_expected',
      dateField: 'record_date',
      downloadName: 'TB_InlandWaterwaysExpected',
      alwaysSortWith: ['-record_date', '-fiscal_year', '-src_line_nbr'],
    },
    '280': {
      endpoint: 'v1/accounting/od/leaking_underground_storage_tank_trust_fund_results',
      dateField: 'record_date',
      downloadName: 'TB_LeakingUndergroundResults',
      alwaysSortWith: ['-record_date', '-src_line_nbr'],
    },
    '281': {
      endpoint: 'v1/accounting/od/leaking_underground_storage_tank_trust_fund_expected',
      dateField: 'record_date',
      downloadName: 'TB_LeakingUndergroundExpected',
      alwaysSortWith: ['-record_date', '-fiscal_year', '-src_line_nbr'],
    },
    '282': {
      endpoint: 'v1/accounting/od/nuclear_waste_fund_results',
      dateField: 'record_date',
      downloadName: 'TB_NuclearWasteResults',
      alwaysSortWith: ['-record_date', '-src_line_nbr'],
    },
    '289': {
      endpoint: 'v1/accounting/od/vaccine_injury_compensation_trust_fund_results',
      dateField: 'record_date',
      downloadName: 'TB_VaccineInjuryResults',
      alwaysSortWith: ['-record_date', '-src_line_nbr'],
    },
    '290': {
      endpoint: 'v1/accounting/od/vaccine_injury_compensation_trust_fund_expected',
      dateField: 'record_date',
      downloadName: 'TB_VaccineInjuryExpected',
      alwaysSortWith: ['-record_date', '-fiscal_year', '-src_line_nbr'],
    },
    '291': {
      endpoint: 'v1/accounting/od/wool_research_development_promotion_trust_fund_results',
      dateField: 'record_date',
      downloadName: 'TB_WoolResearchResults',
      alwaysSortWith: ['-record_date', '-src_line_nbr'],
    },
    '292': {
      endpoint: 'v1/accounting/od/wool_research_development_promotion_trust_fund_expected',
      dateField: 'record_date',
      downloadName: 'TB_WoolResearchExpected',
      alwaysSortWith: ['-record_date', '-fiscal_year', '-src_line_nbr'],
    },
  },
};
