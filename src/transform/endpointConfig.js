const endpointConfig = {
  '27': {
    endpoint: 'v1/debt/mspd/mspd_table_1',
    dateField: 'record_date',
    downloadName: 'MSPD_SumSecty',
    dataDisplays: [
      {
        title: 'By Security Type',
        dimensionField: 'security_type_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'security_type_desc',
            operator: 'in',
            value: 'Marketable,Nonmarketable',
          },
        ],
      },
    ],
    valueFieldOptions: ['debt_held_public_mil_amt', 'intragov_hold_mil_amt', 'total_mil_amt'],
    selectColumns: ['record_date', 'security_type_desc', 'security_class_desc', 'debt_held_public_mil_amt', 'intragov_hold_mil_amt', 'total_mil_amt'],
  },
  '28': {
    endpoint: 'v1/debt/mspd/mspd_table_3',
    dateField: 'record_date',
    downloadName: 'MSPD_DetailSecty',
    dataDisplays: [
      {
        title: 'By Marketable',
        dimensionField: 'security_type_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'security_type_desc',
            operator: 'eq',
            value: 'Marketable',
          },
          {
            key: 'security_class1_desc',
            operator: 'eq',
            value: 'Total Marketable',
          },
        ],
        uniquePivotValues: [
          {
            columnName: 'issued_amt',
            prettyName: 'Issued Amount (in Millions)',
          },
          {
            columnName: 'redeemed_amt',
            prettyName: 'Redeemed Amount (in Millions)',
          },
          {
            columnName: 'outstanding_amt',
            prettyName: 'Outstanding Amount (in Millions)',
          },
        ],
      },
      {
        title: 'By Nonmarketable',
        dimensionField: 'security_type_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'security_type_desc',
            operator: 'eq',
            value: 'Nonmarketable',
          },
          {
            key: 'security_class1_desc',
            operator: 'eq',
            value: 'Total Nonmarketable',
          },
        ],
        uniquePivotValues: [
          {
            columnName: 'current_month_outstanding_amt',
            prettyName: 'Current Month Outstanding Amount (in Millions)',
          },
        ],
      },
    ],
    selectColumns: [
      'record_date',
      'issue_date',
      'redeemed_amt',
      'security_type_desc',
      'maturity_date',
      'outstanding_amt',
      'series_cd',
      'interest_pay_date_1',
      'prior_month_outstanding_amt',
      'security_class1_desc',
      'interest_pay_date_2',
      'current_month_issued_amt',
      'security_class2_desc',
      'interest_pay_date_3',
      'current_month_redeemed_amt',
      'security_class3_desc',
      'interest_pay_date_4',
      'current_month_outstanding_amt',
      'interest_rate_pct',
      'issued_amt',
      'yield_pct',
      'inflation_adj_amt',
    ],
    valueFieldOptions: ['issued_amt', 'redeemed_amt', 'outstanding_amt'],
  },
  '94': {
    endpoint: 'v1/accounting/od/savings_bonds_pcs',
    dateField: 'record_date',
    downloadName: 'USTSB_SavBondPcs',
    dataDisplays: [
      {
        title: 'Pieces Issued by Series',
        dimensionField: 'series_cd',
        filters: [
          {
            key: 'type_cd',
            operator: 'eq',
            value: 'PiecesIssued',
          },
        ],
      },
      {
        title: 'Pieces Outstanding by Series',
        dimensionField: 'series_cd',
        filters: [
          {
            key: 'type_cd',
            operator: 'eq',
            value: 'PiecesOutstanding',
          },
        ],
      },
      {
        title: 'Pieces Redeemed by Series',
        dimensionField: 'series_cd',
        filters: [
          {
            key: 'type_cd',
            operator: 'eq',
            value: 'PiecesRedeemed',
          },
        ],
      },
    ],
    valueFieldOptions: ['total_pcs_cnt'],
  },

  '95': {
    endpoint: 'v1/accounting/od/securities_sales',
    downloadName: 'SITD_Sales',
    dateField: 'record_date',
    dataDisplays: [
      {
        title: 'Security Type Description',
        dimensionField: 'security_type_desc',
      },
      {
        title: 'Security Class Description',
        dimensionField: 'security_class_desc',
      },
    ],
    valueFieldOptions: ['securities_sold_cnt', 'gross_sales_amt', 'returned_sales_amt', 'net_sales_amt'],
  },
  '96': {
    showChartForCompleteTable: true,
    endpoint: 'v1/accounting/od/securities_accounts',
    downloadName: 'SITD_Accounts',
    dateField: 'record_date',
  },
  '97': {
    showChartForCompleteTable: true,
    endpoint: 'v1/accounting/od/securities_c_of_i',
    downloadName: 'SITD_CertofIndebt',
    dateField: 'record_date',
  },
  '98': {
    endpoint: 'v1/accounting/od/securities_redemptions',
    downloadName: 'SITD_Redemptions',
    dateField: 'record_date',
    dataDisplays: [
      {
        title: 'Security Type Description',
        dimensionField: 'security_type_desc',
      },
      {
        title: 'Security Class Description',
        dimensionField: 'security_class_desc',
      },
    ],
    valueFieldOptions: ['securities_redeemed_cnt', 'securities_redeemed_amt'],
  },
  '99': {
    endpoint: 'v1/accounting/od/securities_outstanding',
    downloadName: 'SITD_Outstanding',
    dateField: 'record_date',
    dataDisplays: [
      {
        title: 'Security Type Description',
        dimensionField: 'security_type_desc',
      },
      {
        title: 'Security Class Description',
        dimensionField: 'security_class_desc',
      },
    ],
    valueFieldOptions: ['securities_outstanding_amt'],
  },
  '100': {
    showChartForCompleteTable: true,
    endpoint: 'v1/accounting/od/securities_transfers',
    downloadName: 'SITD_Transfers',
    dateField: 'record_date',
  },
  '101': {
    endpoint: 'v1/accounting/od/securities_conversions',
    downloadName: 'SITD_Conversions',
    dateField: 'record_date',
    dataDisplays: [
      {
        title: 'Security Class Description',
        dimensionField: 'security_class_desc',
      },
    ],
    valueFieldOptions: ['paper_sb_conversions_cnt', 'paper_sb_conversions_amt'],
  },
  '102': {
    endpoint: 'v1/accounting/od/securities_sales_term',
    downloadName: 'SITD_SalesbyTerm',
    dateField: 'record_date',
    dataDisplays: [
      {
        title: 'Security Type Description',
        dimensionField: 'security_type_desc',
      },
      {
        title: 'Security Class Description',
        dimensionField: 'security_class_desc',
      },
      {
        title: 'Security Term Number',
        dimensionField: 'security_term_nbr',
      },
      {
        title: 'From Certificates of Indebtedness Indicator',
        dimensionField: 'from_cert_of_indebt_ind',
      },
    ],
    valueFieldOptions: ['securities_sold_cnt', 'securities_sold_amt'],
  },
  '103': {
    endpoint: 'v1/accounting/od/slgs_savings_bonds',
    downloadName: 'SavBondSecty',
    dateField: 'record_date',
  },
  '104': {
    endpoint: 'v1/accounting/od/slgs_securities',
    dateField: 'record_date',
    downloadName: 'SlgsSecty',
    dataDisplays: [
      {
        title: 'Complete Table',
        chartType: 'none',
      },
    ],
  },
  '105': {
    endpoint: 'v1/accounting/od/savings_bonds_mud',
    dateField: 'record_date',
    downloadName: 'USTSB_SavBondMUD',
    dataDisplays: [
      {
        title: 'Series Code',
        dimensionField: 'series_cd',
      },
    ],
    valueFieldOptions: ['bonds_issued_cnt', 'bonds_out_cnt'],
  },
  '107': {
    endpoint: 'v1/debt/mspd/mspd_table_2',
    dateField: 'record_date',
    downloadName: 'MSPD_DebtLim',
    dataDisplays: [
      {
        title: 'By Debt Limit Class 1',
        dimensionField: 'debt_limit_class1_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'debt_limit_class1_desc',
            operator: 'in',
            value: 'Statutory Debt Limit,Public Debt Outstanding,Total Public Debt Outstanding',
          },
        ],
      },
    ],
    valueFieldOptions: ['debt_held_public_mil_amt', 'intragov_hold_mil_amt', 'total_mil_amt'],
    selectColumns: [
      'record_date',
      'debt_limit_desc',
      'debt_limit_class1_desc',
      'debt_limit_class2_desc',
      'debt_held_public_mil_amt',
      'intragov_hold_mil_amt',
      'total_mil_amt',
    ],
  },
  '108': {
    endpoint: 'v1/accounting/mts/mts_table_4',
    dateField: 'record_date',
    downloadName: 'MTS_RcptSrc',
    dataDisplays: [
      {
        title: 'On- vs. Off-Budget',
        dimensionField: 'classification_desc',
        filters: [
          {
            key: 'classification_desc',
            operator: 'in',
            value: 'Total -- On-Budget,Total -- Off-Budget',
          },
        ],
      },
      {
        title: 'By Receipt Category',
        dimensionField: 'classification_desc',
        filters: [
          {
            key: 'classification_desc',
            operator: 'in',
            value:
              'Total -- Individual Income Taxes,Corporation Income Taxes,' +
              'Total -- Social Insurance and Retirement Receipts,Total -- Excise Taxes,' +
              'Estate and Gift Taxes,Customs Duties,Total -- Miscellaneous Receipts',
          },
        ],
      },
    ],
    valueFieldOptions: ['current_month_gross_rcpt_amt', 'current_month_refund_amt', 'current_month_net_rcpt_amt'],
  },
  '109': {
    endpoint: 'v1/accounting/mts/mts_table_5',
    dateField: 'record_date',
    downloadName: 'MTS_OutlyAgcy',
    dataDisplays: [
      {
        title: 'By Federal Program Agency',
        dimensionField: 'classification_desc',
        filters: [
          {
            key: 'classification_desc',
            operator: 'in',
            value:
              'Total--Legislative Branch,' +
              'Total--Judicial Branch,Total--Department of Agriculture,' +
              'Total--Department of Commerce,Total--Department of Defense--Military Programs,' +
              'Total--Department of Education,Total--Department of Energy,' +
              'Total--Department of Health and Human Services,' +
              'Total--Department of Homeland Security,' +
              'Total--Department of Housing and Urban Development,' +
              'Total--Department of the Interior,' +
              'Total--Department of Justice,' +
              'Total--Department of Labor,' +
              'Total--Department of State,' +
              'Total--Department of Transportation,' +
              'Total--Department of the Treasury,' +
              'Total--Department of Veterans Affairs,' +
              'Total--Corps of Engineers,' +
              'Total--Other Defense Civil Programs,' +
              'Total--Environmental Protection Agency,' +
              'Total--Executive Office of the President,' +
              'Total--General Services Administration,' +
              'Total--International Assistance Programs,' +
              'Total--National Aeronautics and Space Administration,' +
              'Total--National Science Foundation,' +
              'Total--Office of Personnel Management,' +
              'Total--Small Business Administration,' +
              'Total--Social Security Administration,' +
              'Total--Independent Agencies,Total--Undistributed Offsetting Receipts',
          },
        ],
      },
    ],
    valueFieldOptions: ['current_month_gross_outly_amt', 'current_month_app_rcpt_amt', 'current_month_net_outly_amt'],
  },
  '111': {
    endpoint: 'v1/accounting/mts/mts_table_7',
    dateField: 'record_date',
    downloadName: 'MTS_RcptOutlyMo',
  },
  '112': {
    endpoint: 'v1/accounting/mts/mts_table_8',
    dateField: 'record_date',
    downloadName: 'MTS_TrustFund',
    dataDisplays: [
      {
        title: 'Classification Description',
        dimensionField: 'classification_desc',
        filters: [
          {
            key: 'classification_desc',
            operator: 'neq',
            // has commas within its value, so held out of comma separated "nin" values below
            value: 'Trust Receipts, Outlays, and Investments Held:',
          },
          {
            key: 'classification_desc',
            operator: 'nin',
            value: [
              'Less: Interfund Transactions',
              'Total Trust Fund Receipts and Outlays and Investments Held from Table 6-D',
              'Trust Fund Receipts and Outlays on the Basis of Tables 4 & 5',
              'Net Budget Receipts & Outlays',
              'Total Federal Fund Receipts and Outlays',
              'Federal Fund Receipts and Outlays on the Basis of Table 4 & 5',
            ].join(','),
          },
        ],
      },
    ],
    valueFieldOptions: ['current_month_rcpt_amt', 'current_month_outly_amt', 'current_month_excess_amt'],
  },
  '113': {
    endpoint: 'v1/accounting/mts/mts_table_6',
    dateField: 'record_date',
    downloadName: 'MTS_FinDfctDispSur',
    dataDisplays: [
      {
        title: 'Net Transactions',
        dimensionField: 'classification_desc',
        filters: [
          {
            key: 'classification_desc',
            operator: 'in',
            value:
              'Total Liability Accounts,Total Asset Accounts,' +
              "Transactions Not Applied to Current Year's Surplus " +
              'or Deficit (See Schedule A for Details)',
          },
        ],
      },
    ],
    valueFieldOptions: ['current_month_net_txn_amt'],
  },
  '114': {
    endpoint: 'v1/accounting/mts/mts_table_6a',
    dateField: 'record_date',
    downloadName: 'MTS_ChgExcsLiab',
  },
  '115': {
    endpoint: 'v1/accounting/mts/mts_table_6b',
    dateField: 'record_date',
    downloadName: 'MTS_AgcySpecIssue',
    dataDisplays: [
      {
        title: 'Tennessee Valley Authority',
        dimensionField: 'classification_desc',
        filters: [
          {
            key: 'classification_desc',
            operator: 'eq',
            value: 'Tennessee Valley Authority',
          },
        ],
      },
      {
        title: 'Architect of the Capitol',
        dimensionField: 'classification_desc',
        filters: [
          {
            key: 'classification_desc',
            operator: 'eq',
            value: 'Architect of the Capitol',
          },
        ],
      },
      {
        title: 'National Archives and Records Administration',
        dimensionField: 'classification_desc',
        filters: [
          {
            key: 'classification_desc',
            operator: 'eq',
            value: 'National Archives and Records Administration',
          },
        ],
      },
    ],
    valueFieldOptions: ['current_month_net_txn_amt'],
  },
  '116': {
    endpoint: 'v1/accounting/mts/mts_table_6c',
    dateField: 'record_date',
    downloadName: 'MTS_AgcyIssue',
    dataDisplays: [
      {
        title: 'Total Borrowing by Source',
        dimensionField: 'classification_desc',
        filters: [
          {
            key: 'classification_desc',
            operator: 'in',
            value: 'Total Borrowing from the Federal Financing Bank,Total Borrowing from the US Treasury',
          },
        ],
      },
    ],
    valueFieldOptions: ['current_month_net_txn_amt'],
  },
  '117': {
    endpoint: 'v1/accounting/mts/mts_table_6d',
    dateField: 'record_date',
    downloadName: 'MTS_AgcyInvest',
    dataDisplays: [
      {
        title: 'Investments by Fund Type',
        dimensionField: 'classification_desc',
        filters: [
          {
            key: 'classification_desc',
            operator: 'in',
            value: 'Total Federal Funds,Total Trust Funds',
          },
        ],
      },
    ],
    valueFieldOptions: ['current_month_net_txn_amt'],
  },
  '118': {
    endpoint: 'v1/accounting/mts/mts_table_6e',
    dateField: 'record_date',
    downloadName: 'MTS_GuarDirLoan',
    dataDisplays: [
      {
        title: 'Net Activity by Loan Type',
        dimensionField: 'classification_desc',
        filters: [
          {
            key: 'classification_desc',
            operator: 'in',
            value: 'Net Activity&44; Direct Loan Financing,Net Activity&44; Guaranteed Loan Financing',
          },
        ],
      },
    ],
    valueFieldOptions: ['current_month_net_txn_amt'],
  },
  '119': {
    endpoint: 'v1/accounting/mts/mts_table_1',
    dateField: 'record_date',
    downloadName: 'MTS_RcptOutlyDfctSur',
  },
  '120': {
    endpoint: 'v1/accounting/mts/mts_table_2',
    dateField: 'record_date',
    downloadName: 'MTS_BudRsltFin',
    dataDisplays: [
      {
        title: 'Budget Results',
        dimensionField: 'classification_desc',
        filters: [
          {
            key: 'classification_desc',
            operator: 'in',
            value: 'Off-Budget Surplus (+) or Deficit (-),On-Budget Surplus (+) or Deficit (-)',
          },
        ],
      },
      {
        title: 'Means of Financing',
        dimensionField: 'classification_desc',
        filters: [
          {
            key: 'classification_desc',
            operator: 'in',
            value: ['Borrowing from the Public', 'Reduction of Operating Cash&44; Increase (-)', 'By Other Means'].join(','),
          },
        ],
      },
    ],
    valueFieldOptions: ['current_month_budget_amt'],
  },
  '121': {
    endpoint: 'v1/accounting/mts/mts_table_3',
    dateField: 'record_date',
    downloadName: 'MTS_RcptSrcOutlyAgcy',
    dataDisplays: [
      {
        title: 'Total Receipts and Outlays',
        dimensionField: 'classification_desc',
        filters: [
          {
            key: 'classification_desc',
            operator: 'in',
            value: 'Total Receipts,Total Outlays',
          },
        ],
      },
    ],
    valueFieldOptions: ['current_month_rcpt_outly_amt'],
  },
  '122': {
    endpoint: 'v1/accounting/mts/mts_table_9',
    dateField: 'record_date',
    downloadName: 'MTS_RcptSrcOutlyFcn',
    dataDisplays: [
      {
        title: 'Receipts by Source',
        dimensionField: 'classification_desc',
        filters: [
          {
            key: 'classification_desc',
            operator: 'neq',
            value: 'Education, Training, Employment, and Social Services',
          },
          {
            key: 'classification_desc',
            operator: 'neq',
            value: 'General Science, Space, and Technology',
          },
          {
            key: 'classification_desc',
            operator: 'nin',
            value:
              'Net Interest,Social Security,Income Security,Medicare,Health,' +
              'Undistributed Offsetting Receipts,General Government,Administration of Justice,' +
              'Veterans Benefits and Services,Community and Regional Development,Transportation,' +
              'Commerce and Housing Credit,Natural Resources and Environment,Agriculture,Energy,' +
              'National Defense,International Affairs,Social Insurance and Retirement Receipts:,' +
              'Receipts,Net Outlays,Total',
          },
        ],
      },
      {
        title: 'Outlays by Function',
        dimensionField: 'classification_desc',
        filters: [
          {
            key: 'classification_desc',
            operator: 'nin',
            value:
              'Unemployment Insurance,Other Retirement,Excise Taxes,Estate and Gift Taxes,' +
              'Customs Duties,Miscellaneous Receipts,Individual Income Taxes,' +
              'Corporation Income Taxes,Employment and General Retirement,' +
              'Social Insurance and Retirement Receipts:,Receipts,Net Outlays,Total',
          },
        ],
      },
    ],
    valueFieldOptions: ['current_month_rcpt_outly_amt'],
  },
  '123': {
    endpoint: 'v1/debt/mspd/mspd_table_4',
    dateField: 'record_date',
    downloadName: 'MSPD_HstSecty',
    dataDisplays: [
      {
        title: 'By Security Class',
        dimensionField: 'security_class_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'security_class_desc',
            operator: 'neq',
            value: 'Total Treasury Securities Outstanding',
          },
        ],
      },
    ],
    valueFieldOptions: ['curr_mth_mil_amt'],
    selectColumns: [
      'record_date',
      'security_class_desc',
      'curr_mth_mil_amt',
      'curr_mth_1_yr_ago_mil_amt',
      'fy_end_1_yr_ago_mil_amt',
      'fy_end_2_yr_ago_mil_amt',
      'fy_end_3_yr_ago_mil_amt',
      'fy_end_4_yr_ago_mil_amt',
    ],
  },
  '124': {
    endpoint: 'v1/debt/mspd/mspd_table_5',
    dateField: 'record_date',
    downloadName: 'MSPD_StripSecty',
    dataDisplays: [
      {
        title: 'By Security Class',
        dimensionField: 'security_class1_desc',
        roundingDenomination: 'thousands',
        filters: [
          {
            key: 'security_class2_desc',
            operator: 'in',
            value:
              'Total Treasury Bonds,' +
              'Total Treasury Inflation-Protected Securities,' +
              'Total Treasury Notes,Total Inflation-Indexed Bonds,Total Inflation-Indexed Notes',
          },
        ],
      },
    ],
    valueFieldOptions: ['outstanding_amt', 'portion_unstripped_amt', 'portion_stripped_amt', 'reconstituted_amt'],
    selectColumns: [
      'record_date',
      'cusip',
      'security_class1_desc',
      'security_class2_desc',
      'interest_rate_pct',
      'maturity_date',
      'outstanding_amt',
      'portion_unstripped_amt',
      'portion_stripped_amt',
      'reconstituted_amt',
    ],
  },
  '126': {
    endpoint: 'v1/debt/top/top_state',
    dateField: 'record_date',
    downloadName: 'TOP_StateProg',
    dataDisplays: [{ dimensionField: 'state_nm' }, { dimensionField: 'state_cd' }, { dimensionField: 'program_desc' }],
    valueFieldOptions: ['total_amt'],
  },
  '127': {
    endpoint: 'v1/debt/top/top_federal',
    downloadName: 'TOP_FedClct',
    dateField: 'record_date',
    dataDisplays: [
      {
        title: 'Complete Table',
        chartType: 'none',
        fields: [
          'gross_count',
          'gross_amount',
          'net_count',
          'net_amount',
          'creditor_agency_nm',
          'payment_source_description',
          'payment_category',
          'taxable',
          'debt_type_description',
          'agency_type_code',
          'payment_agency_nm',
          'source_agency',
          'agency_type',
          'agency_site_name',
          'debt_type_code',
        ],
      },
      { dimensionField: 'creditor_agency_nm' },
      { dimensionField: 'agency_type' },
      { dimensionField: 'agency_site_nm' },
      { dimensionField: 'source_agency' },
      { dimensionField: 'source_agency_1' },
      { dimensionField: 'payment_agency_nm' },
      { dimensionField: 'agency_type_cd' },
      { dimensionField: 'payment_source_desc' },
      { dimensionField: 'payment_source_cd' },
      { dimensionField: 'payment_category' },
      { dimensionField: 'payment_type_desc' },
      { dimensionField: 'payment_type_cd' },
      { dimensionField: 'debt_type_cd' },
      { dimensionField: 'debt_type_desc' },
    ],
    valueFieldOptions: ['gross_amt', 'net_amt', 'gross_cnt', 'net_cnt'],
  },
  '138': {
    endpoint: 'v1/accounting/od/schedules_fed_debt',
    dateField: 'record_date',
    downloadName: 'SFD_SchedFedDebtMo',
    dataDisplays: [
      {
        title: 'Total Increases and Decreases',
        dimensionField: 'debt_holder_type',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'security_class2_desc',
            operator: 'in',
            value: 'Total Increases,Total Decreases',
          },
        ],
      },
      {
        title: 'Debt Held by the Public Increases',
        dimensionField: 'security_class2_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'debt_holder_type',
            operator: 'eq',
            value: 'Held by the Public',
          },
          {
            key: 'security_class2_desc',
            operator: 'in',
            value: 'Borrowings from the Public,Accrued Interest',
          },
        ],
      },
      {
        title: 'Intragovernmental Debt Holdings Increases',
        dimensionField: 'security_class2_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'debt_holder_type',
            operator: 'eq',
            value: 'Intragovernmental Debt Holdings',
          },
          {
            key: 'security_class2_desc',
            operator: 'in',
            value: 'Net Increase in Intragovernmental Debt Holdings,Accrued Interest',
          },
        ],
      },
      {
        title: 'Debt Held by the Public Decreases',
        dimensionField: 'security_class2_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'debt_holder_type',
            operator: 'eq',
            value: 'Held by the Public',
          },
          {
            key: 'security_class2_desc',
            operator: 'in',
            value: 'Repayments of Debt Held by the Public,Interest Paid,Net Amortization',
          },
        ],
      },
      {
        title: 'Intragovernmental Debt Holdings Decreases',
        dimensionField: 'security_class2_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'debt_holder_type',
            operator: 'eq',
            value: 'Intragovernmental Debt Holdings',
          },
          {
            key: 'security_class2_desc',
            operator: 'in',
            value: 'Net Decrease in Intragovernmental Debt Holdings,Interest Paid,Net Amortization',
          },
        ],
      },
    ],
    valueFieldOptions: ['principal_mil_amt', 'accrued_int_payable_mil_amt', 'net_unamortized_mil_amt'],
    selectColumns: [
      'record_date',
      'debt_holder_type',
      'security_class1_desc',
      'security_class2_desc',
      'principal_mil_amt',
      'accrued_int_payable_mil_amt',
      'net_unamortized_mil_amt',
    ],
  },
  '139': {
    endpoint: 'v1/debt/mspd/mspd_table_3_market',
    dateField: 'record_date',
    downloadName: 'MSPD_MktSecty',
    dataDisplays: [
      {
        title: 'By Security Class',
        dimensionField: 'security_class1_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'security_class2_desc',
            operator: 'in',
            value:
              'null,Total Treasury Bills,Total Treasury Bonds,Total Treasury Floating ' +
              'Rate Notes,Total Treasury Floating Rate Notes,Total Treasury Inflation-Indexed ' +
              'Bonds,Total Treasury Inflation-Indexed Notes,Total Treasury Inflation-Protected ' +
              'Securities,Total TIPS,Total Treasury Notes,',
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
  '140': {
    endpoint: 'v1/debt/mspd/mspd_table_3_nonmarket',
    dateField: 'record_date',
    downloadName: 'MSPD_NonmktSecty',
    dataDisplays: [
      {
        title: 'By Security Class',
        dimensionField: 'security_class1_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'security_class1_desc',
            operator: 'in',
            value:
              'Total Depositary Securities,Total Domestic Series,Total Foreign Series,' +
              'Total R.E.A. Series,Total State and Local Government Series,Total United ' +
              'States Savings Securities',
          },
        ],
        uniquePivotValues: [
          {
            columnName: 'current_month_issued_amt',
            prettyName: 'Current Month Issued Amount (in Millions)',
          },
          {
            columnName: 'current_month_redeemed_amt',
            prettyName: 'Current Month Redeemed Amount (in Millions)',
          },
        ],
      },
      {
        title: 'Zero-coupon Treasury Bonds by Series',
        dimensionField: 'security_class1_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'security_class2_desc',
            operator: 'in',
            value:
              'Zero-coupon Treasury Bond,Zero-coupon Treasury Bond (A),Zero-coupon ' +
              'Treasury Bond (B),Zero-coupon Treasury bond,Zero-coupon Treasury bond (A),' +
              'Zero-coupon Treasury bond (B)',
          },
        ],
        uniquePivotValues: [
          {
            columnName: 'current_month_issued_amt',
            prettyName: 'Current Month Issued Amount (in Millions)',
          },
          {
            columnName: 'current_month_redeemed_amt',
            prettyName: 'Current Month Redeemed Amount (in Millions)',
          },
        ],
      },
      {
        title: 'Foreign Series Bills',
        dimensionField: 'security_class1_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'security_class1_desc',
            operator: 'eq',
            value: 'Foreign Series',
          },
          {
            key: 'security_class2_desc',
            operator: 'nin',
            value: 'Zero-coupon Treasury Bond,Zero-coupon Treasury bond',
          },
        ],
        uniquePivotValues: [
          {
            columnName: 'current_month_issued_amt',
            prettyName: 'Current Month Issued Amount (in Millions)',
          },
        ],
      },
      {
        title: 'Government Account Series',
        dimensionField: 'security_class2_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'security_class1_desc',
            operator: 'eq',
            value: 'Government Account Series',
          },
          {
            key: 'security_class3_desc',
            operator: 'nin',
            value:
              'Total Government Account Series - Held by Public,Total Government Account ' +
              'Series - Held By The Public,Total Governmental Account Series - Held By the ' +
              'Public,Total Government Account Series,Total Government Account Series - ' +
              'Intragovernmental Holding,Total Government Account Series - Intragovernmental ' +
              'Holdings,Total Governmental Account Series - Intragovernmental Holdings',
          },
        ],
        uniquePivotValues: [
          {
            columnName: 'current_month_issued_amt',
            prettyName: 'Current Month Issued Amount (in Millions)',
          },
          {
            columnName: 'current_month_redeemed_amt',
            prettyName: 'Current Month Redeemed Amount (in Millions)',
          },
        ],
      },
      {
        title: 'Other Debt Not Subject to Limit',
        dimensionField: 'security_class3_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'security_class1_desc',
            operator: 'eq',
            value: 'Other Debt',
          },
          {
            key: 'security_class2_desc',
            operator: 'eq',
            value: 'Not Subject to the Statutory Debt Limit',
          },
          {
            key: 'security_class3_desc',
            operator: 'neq',
            value: 'Total Not Subject to the Statutory Debt Limit',
          },
        ],
      },
      {
        title: 'Other Debt Subject to Limit',
        dimensionField: 'security_class3_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'security_class1_desc',
            operator: 'eq',
            value: 'Other Debt',
          },
          {
            key: 'security_class2_desc',
            operator: 'eq',
            value: 'Subject to the Statutory Debt Limit',
          },
          {
            key: 'security_class3_desc',
            operator: 'neq',
            value: 'Total Subject to the Statutory Debt Limit',
          },
        ],
      },
      {
        title: 'State and Local Government Series',
        dimensionField: 'security_class2_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'security_class1_desc',
            operator: 'eq',
            value: 'State and Local Government Series',
          },
          {
            key: 'security_class2_desc',
            operator: 'nin',
            value:
              'Ninety-day Certificates of Indebtedness,Special - 90 Day Certificates of ' +
              "Indebtedness (Various rates),Treasury Special Zero's - Notes",
          },
        ],
        uniquePivotValues: [
          {
            columnName: 'current_month_issued_amt',
            prettyName: 'Current Month Issued Amount (in Millions)',
          },
          {
            columnName: 'current_month_redeemed_amt',
            prettyName: 'Current Month Redeemed Amount (in Millions)',
          },
        ],
      },
      {
        title: 'U.S. Savings Securities by Class',
        dimensionField: 'security_class2_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'security_class1_desc',
            operator: 'eq',
            value: 'United States Savings Securities',
          },
          {
            key: 'security_class2_desc',
            operator: 'neq',
            value: 'Total United States Savings Bonds',
          },
        ],
        uniquePivotValues: [
          {
            columnName: 'current_month_issued_amt',
            prettyName: 'Current Month Issued Amount (in Millions)',
          },
          {
            columnName: 'current_month_redeemed_amt',
            prettyName: 'Current Month Redeemed Amount (in Millions)',
          },
        ],
      },
      {
        title: 'U.S. Savings Securities by Maturity',
        dimensionField: 'security_class1_desc',
        roundingDenomination: 'millions',
        filters: [
          {
            key: 'security_class1_desc',
            operator: 'in',
            value: 'Total Matured United States Savings Securities,Total Unmatured United States Savings Securities',
          },
        ],
        uniquePivotValues: [
          {
            columnName: 'current_month_issued_amt',
            prettyName: 'Current Month Issued Amount (in Millions)',
          },
          {
            columnName: 'current_month_redeemed_amt',
            prettyName: 'Current Month Redeemed Amount (in Millions)',
          },
        ],
      },
    ],
    valueFieldOptions: ['current_month_outstanding_amt'],
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
      'current_month_issued_amt',
      'current_month_outstanding_amt',
      'current_month_redeemed_amt',
      'prior_month_outstanding_amt',
    ],
  },
  '141': {
    endpoint: 'v1/accounting/od/schedules_fed_debt_fytd',
    dateField: 'record_date',
    downloadName: 'SFD_SchedFedDebtFytd',
    selectColumns: [
      'record_date',
      'debt_holder_type',
      'security_class1_desc',
      'security_class2_desc',
      'principal_mil_amt',
      'accrued_int_payable_mil_amt',
      'net_unamortized_mil_amt',
    ],
  },
  '142': {
    endpoint: 'v1/accounting/od/savings_bonds_report',
    dateField: 'record_date',
    downloadName: 'USTSB_SavBondIssueRedeemMat',
  },
  '143': {
    dataDisplays: [
      {
        title: 'Complete Table',
        lastRowSnapshot: true,
      },
    ],
    endpoint: 'v2/accounting/od/debt_to_penny',
    dateField: 'record_date',
    downloadName: 'DebtPenny',
    selectColumns: ['record_date', 'debt_held_public_amt', 'intragov_hold_amt', 'tot_pub_debt_out_amt'],
  },
  '144': {
    endpoint: 'v2/accounting/od/gold_reserve',
    dateField: 'record_date',
    downloadName: 'TreasGold',
    dataDisplays: [
      {
        title: 'By Facility',
        dimensionField: 'facility_desc',
      },
      {
        title: 'By Form',
        dimensionField: 'form_desc',
      },
      {
        title: 'By Location',
        dimensionField: 'location_desc',
      },
    ],
    valueFieldOptions: ['book_value_amt', 'fine_troy_ounce_qty'],
  },
  '145': {
    showChartForCompleteTable: true,
    endpoint: 'v2/accounting/od/debt_outstanding',
    dateField: 'record_date',
    downloadName: 'HstDebt',
    selectColumns: ['record_date', 'debt_outstanding_amt'],
  },
  '146': {
    endpoint: 'v2/accounting/od/avg_interest_rates',
    downloadName: 'AvgInterestRate',
    dataDisplays: [
      {
        title: 'By Marketable',
        dimensionField: 'security_desc',
        valueFieldOptions: ['avg_interest_rate_amt'],
        filters: [
          {
            key: 'security_type_desc',
            value: 'Marketable',
            operator: 'eq',
          },
        ],
      },
      {
        title: 'By Non-marketable',
        dimensionField: 'security_desc',
        filters: [
          {
            key: 'security_type_desc',
            value: 'Non-marketable',
            operator: 'eq',
          },
        ],
      },
      {
        title: 'By Interest-bearing Debt',
        dimensionField: 'security_desc',
        filters: [
          {
            key: 'security_type_desc',
            value: 'Interest-bearing Debt',
            operator: 'eq',
          },
        ],
      },
    ],
    valueFieldOptions: ['avg_interest_rate_amt'],
    selectColumns: ['record_date', 'security_type_desc', 'security_desc', 'avg_interest_rate_amt'],
  },
  '147': {
    endpoint: 'v2/accounting/od/interest_uninvested',
    downloadName: 'FBP_IntUninvestFund',
    dateField: 'record_date',
    dataDisplays: [
      {
        title: 'By Fund ID',
        dimensionField: 'fund_id',
      },
      {
        title: 'By Department ID',
        dimensionField: 'department_id',
      },
    ],
    valueFieldOptions: ['interest_payable_amt', 'interest_expense_amt'],
  },
  '148': {
    showChartForCompleteTable: true,
    endpoint: 'v2/accounting/od/gift_contributions',
    downloadName: 'GiftContr',
    dateField: 'record_date',
    selectColumns: ['record_date', 'contribution_amt'],
  },
  '149': {
    endpoint: 'v2/accounting/od/record_setting_auction',
    dateField: 'record_date',
    downloadName: 'RecAuc',
  },
  '150': {
    endpoint: 'v2/accounting/od/interest_expense',
    downloadName: 'IntExp',
    dataDisplays: [
      {
        title: 'By Expense Category',
        dimensionField: 'expense_catg_desc',
      },
      {
        title: 'By Expense Group',
        dimensionField: 'expense_group_desc',
      },
      {
        title: 'By Expense Type',
        dimensionField: 'expense_type_desc',
      },
    ],
    valueFieldOptions: ['month_expense_amt', 'fytd_expense_amt'],
    selectColumns: ['record_date', 'expense_catg_desc', 'expense_group_desc', 'expense_type_desc', 'month_expense_amt', 'fytd_expense_amt'],
  },
  '151': {
    endpoint: 'v2/accounting/od/redemption_tables',
    dateField: 'redemp_period',
    downloadName: 'RedempTable_v2',
    alwaysSortWith: ['-redemp_period', 'src_line_nbr'],
  },
  '152': {
    endpoint: 'v2/accounting/od/sb_value',
    dateField: 'redemp_period',
    downloadName: 'SavBondVal_v2',
  },
  '153': {
    endpoint: 'v2/accounting/od/slgs_statistics',
    downloadName: 'MthlySlgsSecty',
    dataDisplays: [
      {
        title: 'By Security Description',
        dimensionField: 'security_type_desc',
      },
    ],
    valueFieldOptions: ['securities_outstanding_cnt', 'principal_outstanding_amt'],
  },
  '154': {
    endpoint: 'v2/accounting/od/title_xii',
    downloadName: 'AdvStateUnempFundsTitleXII',
    dataDisplays: [
      {
        title: 'By State',
        dimensionField: 'state_nm',
        lastRowSnapshot: true,
      },
    ],
    valueFieldOptions: ['interest_rate_pct', 'outstanding_advance_bal', 'advance_auth_month_amt', 'gross_advance_draws_month_amt'],
  },
  '155': {
    endpoint: 'v2/payments/jfics/jfics_congress_report',
    downloadName: 'JudgFundRprtCongress',
  },
  '156': {
    endpoint: 'v2/accounting/od/utf_qtr_yields',
    downloadName: 'UnempFundQrtrlyYields',
    showChartForCompleteTable: true,
  },
  '157': {
    endpoint: 'v2/debt/tror/data_act_compliance',
    downloadName: '120DayDelDebtRefComp',
    alwaysSortWith: ['-record_date', 'agency_nm', 'agency_bureau_indicator', 'bureau_nm'],
    // 'Pivot View' in UI; 'Pivot View (Field)' and 'Pivot View (Name)' on form
    dataDisplays: [
      {
        title: 'Agency Name',
        dimensionField: 'agency_nm',
      },
    ],
    // 'Pivot Value' in UI, 'Pivot Value (Field)' on form
    valueFieldOptions: [
      'total_eligible_debt_amt',
      'total_eligible_debt_cnt',
      'eligible_debt_referred_amt',
      'eligible_debt_referred_cnt',
      'eligible_debt_not_referred_amt',
      'eligible_debt_not_referred_cnt',
    ],
  },
  '158': {
    endpoint: 'v2/accounting/od/statement_net_cost',
    alwaysSortWith: ['-record_date', '-stmt_fiscal_year', 'src_line_nbr'],
    downloadName: 'USFR_StmtNetCost',
  },
  '159': {
    endpoint: 'v2/accounting/od/interest_cost_fund',
    downloadName: 'FIP_IntCostbyFund',
    // 'Pivot View' in UI; 'Pivot View (Field)' and 'Pivot View (Name)' on form
    dataDisplays: [
      {
        title: 'Cost Type Description',
        dimensionField: 'cost_type_desc',
      },
    ],
    // 'Pivot Value' in UI, 'Pivot Value (Field)' on form
    valueFieldOptions: ['net_premium_amt', 'net_discount_amt', 'accrued_int_amt', 'interest_paid_amt', 'inflation_comp_amt', 'month_total_amt'],
  },
  '160': {
    alwaysSortWith: ['-record_date', '-stmt_fiscal_year', 'src_line_nbr'],
    endpoint: 'v2/accounting/od/balance_sheets',
    downloadName: 'USFR_BalSheet',
    // todo - un-comment code for charts after the double counting issue is resolved
    // 'Pivot View' in UI; 'Pivot View (Field)' and 'Pivot View (Name)' on form
    // 'dataDisplays': [
    //   {
    //     'title': 'Account Description',
    //     'dimensionField': 'account_desc'
    //   },
    //   {
    //     'title': 'Line Item Description',
    //     'dimensionField': 'line_item_desc'
    //   }
    // ],
    // 'Pivot Value' in UI, 'Pivot Value (Field)' on form
    // 'valueFieldOptions': [
    //   'position_bil_amt'
    // ]
  },
  '161': {
    endpoint: 'v2/accounting/od/qualified_tax',
    downloadName: 'HstQtcbInterestRate',
    dataDisplays: [
      {
        title: 'Complete Table',
        lastRowSnapshot: true,
      },
    ],
  },
  '162': {
    endpoint: 'v2/revenue/rcm',
    downloadName: 'USGovtRevCollect',
    dataDisplays: [
      {
        title: 'Electronic Category Description',
        dimensionField: 'electronic_category_desc',
      },
      {
        title: 'Channel Type Description',
        dimensionField: 'channel_type_desc',
      },
      {
        title: 'Tax Category Description',
        dimensionField: 'tax_category_desc',
      },
    ],
    valueFieldOptions: ['net_collections_amt'],
  },
  '163': {
    endpoint: 'v2/debt/tror',
    downloadName: 'TROR_Full',
    dataDisplays: [
      {
        title: 'Receivable Type Description',
        dimensionField: 'receivable_type_description',
      },
      {
        title: 'Funding Type Description',
        dimensionField: 'funding_type_description',
      },
    ],
    valueFieldOptions: [
      'new_receivables_amt',
      'accruals_amt',
      'collections_total_amt',
      'adjustments_total_amt',
      'written_off_total_amt',
      'end_bal_amt',
      'ddebt_by_age_total_amt',
      'ddebt_1_120_total_amt',
      'top_referred_total_amt',
      'cs_referred_total_amt',
      'collected_ddebt_total_amt',
      'cnc_total_amt',
      'cnc_closed_out_current_fy_amt',
    ],
  },
  '164': {
    endpoint: 'v2/debt/tror/collected_outstanding_recv',
    downloadName: 'TROR_CollectOutstand',
    dataDisplays: [
      {
        title: 'Receivable Type Description',
        dimensionField: 'receivable_type_description',
      },
      {
        title: 'Funding Type Description',
        dimensionField: 'funding_type_description',
      },
    ],
    valueFieldOptions: [
      'new_receivables_amt',
      'accruals_amt',
      'collections_total_amt',
      'adjustments_total_amt',
      'written_off_total_amt',
      'end_bal_amt',
    ],
  },
  '165': {
    endpoint: 'v2/debt/tror/delinquent_debt',
    downloadName: 'TROR_DelDebt',
    dataDisplays: [
      {
        title: 'Receivable Type Description',
        dimensionField: 'receivable_type_description',
      },
      {
        title: 'Funding Type Description',
        dimensionField: 'funding_type_description',
      },
    ],
    valueFieldOptions: ['ddebt_by_age_total_amt', 'ddebt_1_120_total_amt', 'top_referred_total_amt', 'cs_referred_total_amt'],
  },
  '166': {
    endpoint: 'v2/debt/tror/collections_delinquent_debt',
    downloadName: 'TROR_CollectDelDebt',
    dataDisplays: [
      {
        title: 'Receivable Type Description',
        dimensionField: 'receivable_type_description',
      },
      {
        title: 'Funding Type Description',
        dimensionField: 'funding_type_description',
      },
    ],
    valueFieldOptions: ['collected_ddebt_total_amt'],
  },
  '167': {
    endpoint: 'v2/debt/tror/written_off_delinquent_debt',
    downloadName: 'TROR_WriteOffDelDebt',
    dataDisplays: [
      {
        title: 'Receivable Type Description',
        dimensionField: 'receivable_type_description',
      },
      {
        title: 'Funding Type Description',
        dimensionField: 'funding_type_description',
      },
    ],
    valueFieldOptions: ['cnc_total_amt', 'cnc_closed_out_current_fy_amt'],
  },
  '168': {
    endpoint: 'v1/accounting/od/net_position',
    dateField: 'record_date',
    downloadName: 'USFR_StmtOpsChgNetPos',
    alwaysSortWith: ['-record_date', '-stmt_fiscal_year', 'src_line_nbr'],
  },
  '169': {
    endpoint: 'v1/accounting/od/insurance_amounts',
    downloadName: 'USFR_StmtChgSocInsAmts',
    dateField: 'record_date',
    alwaysSortWith: ['-record_date', '-stmt_fiscal_year', 'src_line_nbr'],
  },
  '170': {
    endpoint: 'v1/accounting/od/social_insurance',
    downloadName: 'USFR_StmtSocIns',
    dateField: 'record_date',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '171': {
    endpoint: 'v1/accounting/od/reconciliations',
    downloadName: 'USFR_ReconcNetOpCostBudgDfct',
    dateField: 'record_date',
    alwaysSortWith: ['-record_date', '-stmt_fiscal_year', 'src_line_nbr'],
  },
  '172': {
    alwaysSortWith: ['-record_date', '-stmt_fiscal_year', 'src_line_nbr'],
    endpoint: 'v1/accounting/od/cash_balance',
    dateField: 'record_date',
    downloadName: 'USFR_StmtChgCashBal',
  },
  '173': {
    endpoint: 'v1/accounting/od/long_term_projections',
    downloadName: 'USFR_StmtLngTrmFsclProj',
    dateField: 'record_date',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '174': {
    endpoint: 'v1/accounting/od/schedules_fed_debt_daily_activity',
    dateField: 'record_date',
    downloadName: 'SFD_SchedFedDebtDailyActivity',
    alwaysSortWith: ['-record_date', '-src_line_nbr'],
    dataDisplays: [
      {
        title: 'Type',
        dimensionField: 'type',
        filters: [
          {
            key: 'type',
            value: 'End of Fiscal Year Balance',
            operator: 'eq',
          },
        ],
      },
    ],
    valueFieldOptions: [
      'public_prin_borrowings_amt',
      'public_prin_repayments_amt',
      'public_interest_accrued_amt',
      'public_interest_paid_amt',
      'public_net_unamortized_amt',
      'public_net_amortization_amt',
      'intragov_prin_net_increase_amt',
      'intragov_interest_accrued_amt',
      'intragov_interest_paid_amt',
      'intragov_net_unamortized_amt',
      'intragov_net_amortization_amt',
    ],
    selectColumns: [
      'record_date',
      'type',
      'public_prin_borrowings_amt',
      'public_prin_repayments_amt',
      'public_interest_accrued_amt',
      'public_interest_paid_amt',
      'public_net_unamortized_amt',
      'public_net_amortization_amt',
      'intragov_prin_net_increase_amt',
      'intragov_interest_accrued_amt',
      'intragov_interest_paid_amt',
      'intragov_net_unamortized_amt',
      'intragov_net_amortization_amt',
    ],
  },
  '175': {
    endpoint: 'v1/accounting/od/schedules_fed_debt_daily_summary',
    dateField: 'record_date',
    downloadName: 'SFD_SchedFedDebtDailySummary',
    selectColumns: [
      'record_date',
      'public_principal_mil_amt',
      'public_accr_int_pay_mil_amt',
      'public_net_unamortized_mil_amt',
      'intragov_principal_mil_amt',
      'intragov_accr_int_pay_mil_amt',
      'intragov_net_unamort_mil_amt',
    ],
  },
  '176': {
    endpoint: 'v1/accounting/od/fbp_gl_borrowing_balances',
    dateField: 'record_date',
    downloadName: 'FBP_SummaryGeneralLedgerBorrowingBalances',
    dataDisplays: [
      {
        title: 'By Account',
        dimensionField: 'account_cd',
      },
      {
        title: 'By Department',
        dimensionField: 'dept_cd',
      },
    ],
    valueFieldOptions: [
      'loans_receivable_amt',
      'capitalized_interest_receivable_amt',
      'interest_receivable_amt',
      'interest_revenue_amt',
      'gain_amt',
      'loss_amt',
    ],
  },
  '177': {
    endpoint: 'v1/accounting/od/fbp_gl_repay_advance_balances',
    dateField: 'record_date',
    downloadName: 'FBP_SummaryGeneralLedgerRepayableAdvanceBalances',
    dataDisplays: [
      {
        title: 'By Account',
        dimensionField: 'account_cd',
      },
      {
        title: 'By Department',
        dimensionField: 'dept_cd',
      },
    ],
    valueFieldOptions: [
      'loans_receivable_amt',
      'capitalized_interest_receivable_amt',
      'interest_receivable_amt',
      'interest_revenue_amt',
      'gain_amt',
      'loss_amt',
    ],
  },
  '178': {
    endpoint: 'v1/accounting/od/slgs_demand_deposit_rates',
    dateField: 'record_date',
    downloadName: 'SLGS_DailyRateTable_DemandDepositRates',
  },
  '179': {
    endpoint: 'v1/accounting/od/slgs_time_deposit_rates',
    dateField: 'record_date',
    downloadName: 'SLGS_DailyRateTable_TimeDepositRates',
    valueFieldOptions: ['rate'],
  },
  '180': {
    endpoint: 'v1/accounting/od/federal_maturity_rates',
    dateField: 'record_date',
    downloadName: 'FederalCreditSimilarMaturityRates',
  },
  '181': {
    endpoint: 'v1/accounting/od/tma_contract_disputes',
    dateField: 'record_date',
    downloadName: 'TMA_ContractDisputes',
  },
  '182': {
    endpoint: 'v1/accounting/od/tma_no_fear',
    dateField: 'record_date',
    downloadName: 'TMA_NoFear',
  },
  '183': {
    endpoint: 'v1/accounting/od/tma_unclaimed_money',
    dateField: 'record_date',
    downloadName: 'TMA_UnclaimedMoney',
  },
  '184': {
    endpoint: 'v1/accounting/od/tcir_annual_table_1',
    dateField: 'record_date',
    downloadName: 'TCIR_Annual_RangeOfMaturities',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '185': {
    endpoint: 'v1/accounting/od/tcir_annual_table_2',
    dateField: 'record_date',
    downloadName: 'TCIR_Annual_SmallReclamationProj',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '186': {
    endpoint: 'v1/accounting/od/tcir_annual_table_3',
    dateField: 'record_date',
    downloadName: 'TCIR_Annual_USArmyCorpsOfEng',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '187': {
    endpoint: 'v1/accounting/od/tcir_annual_table_4',
    dateField: 'record_date',
    downloadName: 'TCIR_Annual_BureauOfReclamation',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '188': {
    endpoint: 'v1/accounting/od/tcir_annual_table_5',
    dateField: 'record_date',
    downloadName: 'TCIR_Annual_MidDakotaRuralWater',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '189': {
    endpoint: 'v1/accounting/od/tcir_annual_table_6',
    dateField: 'record_date',
    downloadName: 'TCIR_Annual_MerchantMarine',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '190': {
    endpoint: 'v1/accounting/od/tcir_annual_table_7',
    dateField: 'record_date',
    downloadName: 'TCIR_Annual_OtherLegislationCY',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '191': {
    endpoint: 'v1/accounting/od/tcir_annual_table_8',
    dateField: 'record_date',
    downloadName: 'TCIR_Annual_OtherLegislationFY',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '192': {
    endpoint: 'v1/accounting/od/tcir_annual_table_9',
    dateField: 'record_date',
    downloadName: 'TCIR_Annual_PowerMarketingAdmin',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '193': {
    endpoint: 'v1/accounting/od/tcir_semi_annual',
    dateField: 'record_date',
    downloadName: 'TCIR_SemiAnnual',
    alwaysSortWith: ['-effective_start_date', 'src_line_nbr'],
  },
  '194': {
    endpoint: 'v1/accounting/od/tcir_quarterly_table_1',
    dateField: 'record_date',
    downloadName: 'TCIR_Quarterly_IntRatesReclamReformAct',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '195': {
    endpoint: 'v1/accounting/od/tcir_quarterly_table_2a',
    dateField: 'record_date',
    downloadName: 'TCIR_Quarterly_IntRatesSpecificLegislation',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '196': {
    endpoint: 'v1/accounting/od/tcir_quarterly_table_2b',
    dateField: 'record_date',
    downloadName: 'TCIR_Quarterly_IntRatesSpecLegisPublicLaw',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '197': {
    endpoint: 'v1/accounting/od/tcir_quarterly_table_3',
    dateField: 'record_date',
    downloadName: 'TCIR_Quarterly_IntRatesNatConsCoopBank',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '198': {
    endpoint: 'v1/accounting/od/tcir_monthly_table_1',
    dateField: 'record_date',
    downloadName: 'TCIR_Monthly_SpecificMaturities',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '199': {
    endpoint: 'v1/accounting/od/tcir_monthly_table_2',
    dateField: 'record_date',
    downloadName: 'TCIR_Monthly_RangeOfMaturities',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '200': {
    endpoint: 'v1/accounting/od/tcir_monthly_table_3',
    dateField: 'record_date',
    downloadName: 'TCIR_Monthly_OtherTreasBorrowAuthorities',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '201': {
    endpoint: 'v1/accounting/od/tcir_monthly_table_4',
    dateField: 'record_date',
    downloadName: 'TCIR_Monthly_GuamDevelopmentFundAct',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '202': {
    endpoint: 'v1/accounting/od/tcir_monthly_table_5',
    dateField: 'record_date',
    downloadName: 'TCIR_Monthly_DeptOfDefArmsExportControl',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '203': {
    endpoint: 'v1/accounting/od/tcir_monthly_table_6',
    dateField: 'record_date',
    downloadName: 'TCIR_Monthly_OtherSpecificLegislation',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
  },
  '204': {
    endpoint: 'v1/accounting/od/auctions_query',
    dateField: 'record_date',
    downloadName: 'Auctions_Query',
    alwaysSortWith: ['-auction_date', '-issue_date', 'maturity_date'],
    selectColumns: [
      'cusip',
      'security_type',
      'security_term',
      'auction_date',
      'issue_date',
      'maturity_date',
      'price_per100',
      'pdf_filenm_announcemt',
      'xml_filenm_announcemt',
      'pdf_filenm_comp_results',
      'xml_filenm_comp_results',
      'pdf_filenm_noncomp_results',
      'pdf_filenm_spec_announcemt',
    ],
  },
  // treasury bulletin
  '206': {
    endpoint: 'v1/accounting/tb/pdo1_offerings_regular_weekly_treasury_bills',
    dateField: 'record_date',
    downloadName: 'TB_PDO1OfferingsRegularWeeklyTreasuryBills',
    customFormatting: [
      {
        type: 'NUMBER',
        fields: ['exchange_rate', 'high_price_per_hundred'],
        noFormatting: true,
      },
    ],
  },
  '207': {
    endpoint: 'v1/accounting/tb/pdo2_offerings_marketable_securities_other_regular_weekly_treasury_bills',
    downloadName: 'TB_PDO2OfferingsMarketableSecuritiesOtherRegularWeeklyTreasuryBills',
    dateField: 'record_date',
  },
  '208': {
    endpoint: 'v1/accounting/tb/ofs1_distribution_federal_securities_class_investors_type_issues',
    dateField: 'record_date',
    downloadName: 'TB_OFS1DistributionFederalSecuritiesClassInvestorsTypeIssues',
    // 'Pivot View' in UI; 'Pivot View (Field)' and 'Pivot View (Name)' on form
    dataDisplays: [
      {
        title: 'Securities Classification',
        dimensionField: 'securities_classification',
      },
      {
        title: 'Investors Classification',
        dimensionField: 'investors_classification',
      },
      {
        title: 'Issues Type',
        dimensionField: 'issues_type',
      },
    ],
    // 'Pivot Value' in UI, 'Pivot Value (Field)' on form
    valueFieldOptions: ['securities_mil_amt'],
  },
  '209': {
    endpoint: 'v1/accounting/tb/ofs2_estimated_ownership_treasury_securities',
    dateField: 'record_date',
    downloadName: 'TB_OFS2EstimatedOwnershipUSTreasurySecurities',
    dataDisplays: [
      {
        title: 'Securities Owner',
        dimensionField: 'securities_owner',
      },
    ],
    valueFieldOptions: ['securities_bil_amt'],
  },
  '210': {
    endpoint: 'v1/accounting/tb/uscc1_amounts_outstanding_circulation',
    dateField: 'record_date',
    downloadName: 'TB_USCC1AmountsOutstandingCirculation',
    dataDisplays: [
      {
        title: 'Currency and Coins Category Description',
        dimensionField: 'currency_coins_category_desc',
      },
    ],
    valueFieldOptions: [
      'total_currency_coins_amt',
      'total_currency_amt',
      'federal_reserve_notes_amt',
      'us_notes_amt',
      'currency_no_longer_issued_amt',
      'total_coins_amt',
      'dollar_coins_amt',
      'fractional_coins_amt',
    ],
  },
  '211': {
    endpoint: 'v1/accounting/tb/uscc2_amounts_outstanding_circulation',
    dateField: 'record_date',
    downloadName: 'TB_USCC2AmountsOutstandingCirculation',
  },
  '212': {
    endpoint: 'v1/accounting/tb/fcp1_weekly_report_major_market_participants',
    dateField: 'record_date',
    downloadName: 'TB_FCP1WeeklyReportMajorMarketParticipants',
    customFormatting: [
      {
        type: 'NUMBER',
        fields: ['exchange_rate', 'high_price_per_hundred'],
        noFormatting: true,
      },
    ],
  },
  '213': {
    endpoint: 'v1/accounting/tb/fcp2_monthly_report_major_market_participants',
    dateField: 'record_date',
    downloadName: 'TB_FCP2MonthlyReportMajorMarketParticipants',
    customFormatting: [
      {
        type: 'NUMBER',
        fields: ['exchange_rate', 'high_price_per_hundred'],
        noFormatting: true,
      },
    ],
  },
  '214': {
    endpoint: 'v1/accounting/tb/fcp3_quarterly_report_large_market_participants',
    dateField: 'record_date',
    downloadName: 'TB_FCP3QuarterlyReportLargeMarketParticipants',
    customFormatting: [
      {
        type: 'NUMBER',
        fields: ['exchange_rate', 'high_price_per_hundred'],
        noFormatting: true,
      },
    ],
  },
  '215': {
    endpoint: 'v1/accounting/tb/esf1_balances',
    dateField: 'record_date',
    downloadName: 'TB_ESF1Balances',
  },
  '216': {
    endpoint: 'v1/accounting/tb/esf2_statement_net_cost',
    dateField: 'record_date',
    downloadName: 'TB_ESF2StatementNetCost',
  },
  '217': {
    endpoint: 'v1/accounting/tb/ffo5_internal_revenue_by_state',
    dateField: 'record_date',
    downloadName: 'TB_FFO5InternalRevenueReceiptsState',
    dataDisplays: [
      {
        title: 'State Name',
        dimensionField: 'state_nm',
      },
    ],
    valueFieldOptions: [
      'total_rev_collect_thous_amt',
      'business_income_tax_thous_amt',
      'total_indv_tax_thous_amt',
      'withheld_fica_thous_amt',
      'not_withheld_seca_thous_amt',
      'unemployment_ins_tax_thous_amt',
      'railroad_retire_tax_thous_amt',
      'estate_trust_tax_thous_amt',
      'estate_tax_thous_amt',
      'gift_tax_thous_amt',
      'excise_tax_thous_amt',
    ],
  },
  '218': {
    endpoint: 'v1/accounting/tb/ffo6_customs_border_protection_collections',
    dateField: 'record_date',
    downloadName: 'TB_FFO6CustomsBorderProtectionCollectionDutiesTaxesFeesDistrictsPorts',
    dataDisplays: [
      {
        title: 'District Name',
        dimensionField: 'district_nm',
      },
      {
        title: 'Port Name',
        dimensionField: 'port_nm',
      },
    ],
    valueFieldOptions: ['collection_amt'],
  },
  '219': {
    endpoint: 'v1/accounting/dts/operating_cash_balance',
    dateField: 'record_date',
    downloadName: 'DTS_OpCashBal',
    dataDisplays: [
      {
        title: 'By Type of Account',
        dimensionField: 'account_type',
        roundingDenomination: 'millions',
        lastRowSnapshot: true,
        filters: [
          {
            key: 'account_type',
            operator: 'eq',
            value: 'Treasury General Account (TGA) Opening Balance',
          },
        ],
      },
    ],
    valueFieldOptions: ['open_today_bal', 'open_month_bal', 'open_fiscal_year_bal'],
    selectColumns: [
      'record_date',
      'account_type',
      'open_today_bal',
      'open_month_bal',
      'open_fiscal_year_bal',
      'table_nbr',
      'table_nm',
      'sub_table_name',
      'src_line_nbr',
      'record_fiscal_year',
      'record_fiscal_quarter',
      'record_calendar_year',
      'record_calendar_quarter',
      'record_calendar_month',
      'record_calendar_day',
    ],
  },
  '220': {
    endpoint: 'v1/accounting/dts/deposits_withdrawals_operating_cash',
    dateField: 'record_date',
    downloadName: 'DTS_OpCashDpstWdrl',
    dataDisplays: [
      {
        title: 'By Type of Account',
        dimensionField: 'account_type',
        roundingDenomination: 'millions',
      },
      {
        title: 'By Transaction Type',
        dimensionField: 'transaction_type',
        roundingDenomination: 'millions',
      },
    ],
    valueFieldOptions: ['transaction_today_amt', 'transaction_mtd_amt', 'transaction_fytd_amt'],
    selectColumns: [
      'record_date',
      'account_type',
      'transaction_type',
      'transaction_catg',
      'transaction_today_amt',
      'transaction_mtd_amt',
      'transaction_fytd_amt',
      'table_nbr',
      'table_nm',
      'src_line_nbr',
      'record_fiscal_year',
      'record_fiscal_quarter',
      'record_calendar_year',
      'record_calendar_quarter',
      'record_calendar_month',
      'record_calendar_day',
    ],
  },
  '221': {
    endpoint: 'v1/accounting/dts/public_debt_transactions',
    dateField: 'record_date',
    downloadName: 'DTS_PubDebtTrans',
    dataDisplays: [
      {
        title: 'By Transaction Type',
        dimensionField: 'transaction_type',
        roundingDenomination: 'millions',
      },
    ],
    valueFieldOptions: ['transaction_today_amt', 'transaction_mtd_amt', 'transaction_fytd_amt'],
  },
  '222': {
    endpoint: 'v1/accounting/dts/adjustment_public_debt_transactions_cash_basis',
    dateField: 'record_date',
    downloadName: 'DTS_PubDebtCashAdj',
    dataDisplays: [
      {
        title: 'By Transaction Type',
        dimensionField: 'transaction_type',
        roundingDenomination: 'millions',
      },
      {
        title: 'By Adjustment Type',
        dimensionField: 'adj_type',
        roundingDenomination: 'millions',
      },
    ],
    valueFieldOptions: ['adj_today_amt', 'adj_mtd_amt', 'adj_fytd_amt'],
  },
  '223': {
    endpoint: 'v1/accounting/dts/debt_subject_to_limit',
    dateField: 'record_date',
    downloadName: 'DTS_DebtSubjLim',
    dataDisplays: [
      {
        title: 'By Debt Category',
        dimensionField: 'debt_catg',
        roundingDenomination: 'millions',
        lastRowSnapshot: true,
      },
    ],
    valueFieldOptions: ['close_today_bal', 'open_today_bal', 'open_month_bal', 'open_fiscal_year_bal'],
  },
  '224': {
    endpoint: 'v1/accounting/dts/federal_tax_deposits',
    dateField: 'record_date',
    downloadName: 'DTS_FedTaxDpst',
    dataDisplays: [
      {
        title: 'By Federal Tax Deposit Type',
        dimensionField: 'tax_deposit_type',
        roundingDenomination: 'millions',
      },
    ],
    valueFieldOptions: ['tax_deposit_today_amt', 'tax_deposit_mtd_amt', 'tax_deposit_fytd_amt'],
  },
  '225': {
    endpoint: 'v1/accounting/dts/short_term_cash_investments',
    dateField: 'record_date',
    downloadName: 'DTS_StCashInvest',
    dataDisplays: [
      {
        title: 'By Transaction Type',
        dimensionField: 'transaction_type',
        roundingDenomination: 'millions',
      },
    ],
    valueFieldOptions: ['depositary_type_a_amt', 'depositary_type_b_amt', 'depositary_type_c_amt', 'total_amt'],
  },
  '226': {
    endpoint: 'v1/accounting/dts/income_tax_refunds_issued',
    dateField: 'record_date',
    downloadName: 'DTS_IncmTaxRfnd',
    dataDisplays: [
      {
        title: 'By Federal Tax Refund Type',
        dimensionField: 'tax_refund_type',
        roundingDenomination: 'millions',
      },
      {
        title: 'By Federal Tax Refund Type Description',
        dimensionField: 'tax_refund_type_desc',
      },
    ],
    valueFieldOptions: ['tax_refund_today_amt', 'tax_refund_mtd_amt', 'tax_refund_fytd_amt'],
    selectColumns: [
      'record_date',
      'tax_refund_type',
      'tax_refund_today_amt',
      'tax_refund_mtd_amt',
      'tax_refund_fytd_amt',
      'table_nbr',
      'table_nm',
      'sub_table_name',
      'src_line_nbr',
      'record_fiscal_year',
      'record_fiscal_quarter',
      'record_calendar_year',
      'record_calendar_quarter',
      'record_calendar_month',
      'record_calendar_day',
    ],
  },
  '227': {
    endpoint: 'v1/accounting/dts/inter_agency_tax_transfers',
    dateField: 'record_date',
    downloadName: 'DTS_InterAgencyTaxTransfers',
    dataDisplays: [
      {
        title: 'By Classification',
        dimensionField: 'classification',
        roundingDenomination: 'millions',
      },
    ],
    valueFieldOptions: ['today_amt', 'mtd_amt', 'fytd_amt'],
  },
  '262': {
    endpoint: 'v1/accounting/od/upcoming_auctions',
    dateField: 'record_date',
    downloadName: 'upcoming_auctions',
    alwaysSortWith: ['security_type', '-announcemt_date', '-auction_date', '-issue_date'],
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
  '263': {
    endpoint: 'v1/accounting/od/frn_daily_indexes',
    dateField: 'record_date',
    downloadName: 'frn_daily_indexes',
    alwaysSortWith: ['cusip', 'start_of_accrual_period'],
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
    alwaysSortWith: ['-record_date', '-fiscal_year', '-src_line_nbr'],
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
  '269': {
    endpoint: 'v1/accounting/od/black_lung_disability_trust_fund_results',
    dateField: 'record_date',
    downloadName: 'TB_BlackLungResults',
  },
  '270': {
    endpoint: 'v1/accounting/od/black_lung_disability_trust_fund_expected',
    dateField: 'record_date',
    downloadName: 'TB_BlackLungConditionExpected',
    alwaysSortWith: ['-record_date', '-fiscal_year', '-src_line_nbr'],
  },
  '271': {
    endpoint: 'v1/accounting/od/harbor_maintenance_trust_fund_results',
    dateField: 'record_date',
    downloadName: 'TB_HarborMaintenanceResults',
  },
  '272': {
    endpoint: 'v1/accounting/od/harbor_maintenance_trust_fund_expected',
    dateField: 'record_date',
    alwaysSortWith: ['-record_date', '-fiscal_year', '-src_line_nbr'],
    downloadName: 'TB_HarborMaintenanceExpected',
  },
  '273': {
    endpoint: 'v1/accounting/od/hazardous_substance_superfund_results',
    dateField: 'record_date',
    downloadName: 'TB_HazardousSubstanceResults',
  },
  '274': {
    endpoint: 'v1/accounting/od/hazardous_substance_superfund_expected',
    dateField: 'record_date',
    alwaysSortWith: ['-record_date', '-fiscal_year', '-src_line_nbr'],
    downloadName: 'TB_HazardousSubstanceExpected',
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
  '283': {
    endpoint: 'v1/accounting/od/reforestation_trust_fund_results',
    dateField: 'record_date',
    downloadName: 'TB_ReforestationResults',
  },
  '284': {
    endpoint: 'v1/accounting/od/reforestation_trust_fund_expected',
    dateField: 'record_date',
    alwaysSortWith: ['-record_date', '-fiscal_year', '-src_line_nbr'],
    downloadName: 'TB_ReforestationExpected',
  },
  '285': {
    endpoint: 'v1/accounting/od/sport_fish_restoration_boating_trust_fund_results',
    dateField: 'record_date',
    downloadName: 'TB_SportFishResults',
  },
  '286': {
    endpoint: 'v1/accounting/od/sport_fish_restoration_boating_trust_fund_expected',
    dateField: 'record_date',
    alwaysSortWith: ['-record_date', '-fiscal_year', '-src_line_nbr'],
    downloadName: 'TB_SportFishExpected',
  },
  '287': {
    endpoint: 'v1/accounting/od/oil_spill_liability_trust_fund_results',
    dateField: 'record_date',
    downloadName: 'TB_OilSpillResults',
  },
  '288': {
    endpoint: 'v1/accounting/od/oil_spill_liability_trust_fund_expected',
    dateField: 'record_date',
    alwaysSortWith: ['-record_date', '-fiscal_year', '-src_line_nbr'],
    downloadName: 'TB_OilSpillExpected',
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
  '293': {
    endpoint: 'v1/accounting/od/agriculture_disaster_relief_trust_fund_results',
    dateField: 'record_date',
    downloadName: 'TB_AgricultureDisasterResults',
  },
  '294': {
    endpoint: 'v1/accounting/od/agriculture_disaster_relief_trust_fund_expected',
    dateField: 'record_date',
    alwaysSortWith: ['-record_date', '-fiscal_year', '-src_line_nbr'],
    downloadName: 'TB_AgricultureDisasterExpected',
  },
  '295': {
    endpoint: 'v1/accounting/od/patient_centered_outcomes_research_trust_fund_results',
    dateField: 'record_date',
    downloadName: 'TB_PatientCenteredResults',
  },
  '296': {
    endpoint: 'v1/accounting/od/patient_centered_outcomes_research_trust_fund_expected',
    dateField: 'record_date',
    alwaysSortWith: ['-record_date', '-fiscal_year', '-src_line_nbr'],
    downloadName: 'TB_PatientCenteredExpected',
  },
  '297': {
    endpoint: 'v1/accounting/od/us_victims_state_sponsored_terrorism_fund_results',
    dateField: 'record_date',
    downloadName: 'TB_UnitedStatesResults',
  },
  '298': {
    endpoint: 'v1/accounting/od/us_victims_state_sponsored_terrorism_fund_expected',
    dateField: 'record_date',
    alwaysSortWith: ['-record_date', '-fiscal_year', '-src_line_nbr'],
    downloadName: 'TB_UnitedStatesExpected',
  },
  // TIPS CPI
  '300': {
    endpoint: 'v1/accounting/od/tips_cpi_data_detail',
    downloadName: 'TIPSandCPIdata_Details',
    dateField: 'index_date',
    alwaysSortWith: ['-index_date'],
    hideColumns: ['cusip', 'original_issue_date'],
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
  '301': {
    endpoint: 'v1/accounting/od/tips_cpi_data_summary',
    downloadName: 'TIPSandCPIdata_Summary',
    dateField: 'original_issue_date',
    alwaysSortWith: ['-original_issue_date'],
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
  '302': {
    endpoint: 'v1/accounting/od/fip_statement_of_account_table1',
    dateField: 'record_date',
    downloadName: 'FIP_SOA_CARS_Reporting',
    alwaysSortWith: ['account_number_tas', '-record_date', 'src_line_nbr'],
    selectColumns: ['account_number_tas', 'account_name', 'date_range', 'line_item_nm', 'decrease', 'increase'],
  },
  '303': {
    endpoint: 'v1/accounting/od/fip_statement_of_account_table2',
    dateField: 'record_date',
    downloadName: 'FIP_SOA_Account_Pos_Summary',
    alwaysSortWith: ['account_number_tas', '-record_date', 'src_line_nbr'],
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
    alwaysSortWith: ['account_number_tas', '-record_date', 'src_line_nbr'],
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
  '253': {
    endpoint: 'v1/accounting/od/receipts_by_department',
    dateField: 'record_date',
    downloadName: 'Receipts_By_Department',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
    selectColumns: [],
  },
  //UTF
  '305': {
    endpoint: 'v1/accounting/od/utf_account_statement',
    dateField: 'eff_date',
    downloadName: 'UTF_Account_Statement ',
    alwaysSortWith: ['acct_desc', '-eff_date', 'memo_nbr'],
    apiFilter: {
      field: 'acct_desc',
      downloadLabel: 'Account',
      label: 'Choose a Federal or State Account',
      dataUnmatchedHeader: 'There is no data to display based on the current filters selected.',
      dataUnmatchedMessage: 'Select a different account description and/or date range in order to preview the data.',
      dataDefaultHeader: 'This table requires additional filters.',
      dataDefaultMessage: 'Select an account in the filter section above to display the data.',
      dataSearchLabel: 'Search account descriptions',
      notice: `Effective Dates on Fiscal Data may differ from the published effective dates for corresponding reports on TreasuryDirect.`,
      fieldFilter: {
        field: 'report_type',
        value: ['Federal', 'State'],
      },
    },
    selectColumns: [
      'acct_statement',
      'eff_date',
      'shares_per_par',
      'trans_cd',
      'trans_desc_cd',
      'memo_nbr',
      'location_cd',
      'acct_nbr',
      'acct_desc',
      'report_type',
    ],
  },
  '306': {
    endpoint: 'v1/accounting/od/utf_transaction_statement',
    dateField: 'eff_date',
    downloadName: 'UTF_Transaction_Statement ',
    alwaysSortWith: ['acct_desc', '-eff_date', 'memo_nbr', 'trans_desc_cd'],
    apiFilter: {
      field: 'acct_desc',
      downloadLabel: 'Account',
      label: 'Choose a Federal or State Account',
      dataUnmatchedHeader: 'There is no data to display based on the current filters selected.',
      dataUnmatchedMessage: 'Select a different account description and/or date range in order to preview the data.',
      dataDefaultHeader: 'This table requires additional filters.',
      dataDefaultMessage: 'Select an account in the filter section above to display the data.',
      dataSearchLabel: 'Search account descriptions',
      notice: `Effective Dates on Fiscal Data may differ from the published effective dates for corresponding reports on TreasuryDirect.`,
      fieldFilter: {
        field: 'report_type',
        value: ['Federal', 'State'],
      },
    },
    selectColumns: [
      'trans_statement',
      'eff_date',
      'shares_per_par',
      'trans_desc_cd',
      'memo_nbr',
      'location_cd',
      'acct_nbr',
      'acct_desc',
      'report_type',
    ],
  },
  '307': {
    endpoint: 'v1/accounting/od/utf_federal_activity_statement',
    dateField: 'eff_date',
    downloadName: 'UTF_Federal_Activity_Statement ',
    alwaysSortWith: ['acct_desc', '-eff_date', 'memo_nbr', 'trans_desc_cd'],
    apiFilter: {
      field: 'acct_desc',
      downloadLabel: 'Account',
      label: 'Choose a State Account',
      dataUnmatchedHeader: 'There is no data to display based on the current filters selected.',
      dataUnmatchedMessage: 'Select a different account description and/or date range in order to preview the data.',
      dataDefaultHeader: 'This table requires additional filters.',
      dataDefaultMessage: 'Select an account in the filter section above to display the data.',
      dataSearchLabel: 'Search account descriptions',
      notice: `Effective Dates on Fiscal Data may differ from the published effective dates for corresponding reports on TreasuryDirect.`,
    },
    selectColumns: ['fed_act_statement', 'eff_date', 'shares_per_par', 'trans_desc_cd', 'memo_nbr', 'location_cd', 'acct_nbr', 'acct_desc'],
  },
  // FIP
  '308': {
    endpoint: 'v1/accounting/od/fip_principal_outstanding_table1',
    dateField: 'record_date',
    downloadName: 'FIP_PO_Principal_Outstanding',
    alwaysSortWith: ['-record_date', 'account_nbr', 'src_line_nbr'],
    selectColumn: [],
  },
  // FIP
  '309': {
    endpoint: 'v1/accounting/od/fip_principal_outstanding_table2',
    dateField: 'record_date',
    downloadName: 'FIP_PO_Total_Outstanding_Inflation_Comp',
    alwaysSortWith: ['-record_date', 'account_nbr', 'src_line_nbr'],
    selectColumn: [],
  },
  // Buybacks
  '316': {
    endpoint: 'v1/accounting/od/buybacks_operations',
    dateField: 'operation_date',
    customFormatting: [
      {
        type: 'DATE',
        fields: ['operation_date', 'settlement_date', 'maturity_date'],
        dateFormat: 'MM/DD/YYYY',
      },
    ],
    downloadName: 'Buybacks_Operations',
    alwaysSortWith: ['-operation_date'],
    selectColumns: [
      'operation_date',
      'operation_start_time_est',
      'operation_close_time_est',
      'settlement_date',
      'preliminary_ann_pdf',
      'preliminary_ann_xml',
      'final_ann_pdf',
      'final_ann_xml',
      'results_pdf',
      'results_xml',
      'special_ann_pdf',
    ],
  },
  // Buybacks
  '317': {
    endpoint: 'v1/accounting/od/buybacks_security_details',
    dateField: 'operation_date',
    downloadName: 'Buybacks_Security_Details',
    alwaysSortWith: ['-operation_date', 'maturity_date'],
    hideColumns: ['operation_date'],
    selectColumns: ['cusip_nbr', 'coupon_rate_pct', 'maturity_date', 'par_amt_accepted', 'weighted_avg_accepted_price'],
  },
  // TRRE
  '318': {
    endpoint: 'v1/accounting/od/rates_of_exchange',
    dateField: 'record_date',
    downloadName: 'RprtRateXchgCln',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
    dataDisplays: [
      {
        title: 'Exchange Rate Trend',
      },
    ],
    showChartForCompleteTable: true,
    userFilter: {
      field: 'country_currency_desc',
      label: 'Country-Currency',
      notice: `If current rates deviate from the published rates by 10% or more, Treasury
         will issue amendments to this quarterly report. An amendment to a currency exchange
         rate for the quarter will appear on the report as a separate line with a new effective
         date. The latest available data will display first.`,
      dataUnmatchedMessage: `This may be because the currency existed under a different
          name for that time period. Please check to see if the currency you are
          looking for appears under a different name, or change the date
          selected for available results.`,
    },
    selectColumns: ['record_date', 'country_currency_desc', 'exchange_rate', 'effective_date'],
  },
  //FBP
  '313': {
    endpoint: 'v1/accounting/od/fbp_balances',
    dateField: 'record_date',
    downloadName: 'FBP_Balances',
    alwaysSortWith: ['sort_order_primary', 'sort_order_secondary', 'maturity_date'],
    hideColumns: [],
    selectColumns: [
      'record_date',
      'account_nbr',
      'account_desc',
      'security_nbr',
      'segment_desc',
      'loans_receivable_amt',
      'interest_receivable_amt',
      'maturity_date',
      'interest_rate_pct',
      'amortization_amt',
      'capitalized_int_receivable_amt',
    ],
    apiFilter: {
      field: 'account_nbr',
      labelField: 'account_desc',
      filterEndpoint: 'v1/accounting/od/fbp_dpai_account_summary',
      downloadLabel: 'Account',
      label: 'Choose an Account',
      disableDateRangeFilter: true,
      dataDefaultHeader: 'This table requires additional filters.',
      dataDefaultMessage: 'Select an account in the filter section above to display the data.',
      dataUnmatchedHeader: 'There is no data to display based on the current filters selected.',
      dataUnmatchedMessage: 'Select a different account and/or date range in order to preview the data.',
      dataSearchLabel: 'Search account descriptions',
      notice: 'Date fields on Fiscal Data may differ from the published dates for corresponding reports on TreasuryDirect.',
    },
  },
  // FBP
  '314': {
    endpoint: 'v1/accounting/od/fbp_future_dated_transactions',
    dateField: 'settle_date',
    downloadName: 'FBP_FutureDatedTransactions',
    alwaysSortWith: ['sort_order_primary', 'sort_order_secondary', 'security_nbr'],
    hideColumns: [],
    selectColumns: [
      'record_date',
      'account_nbr',
      'account_desc',
      'security_nbr',
      'segment_desc',
      'loans_receivable_amt',
      'interest_receivable_amt',
      'effective_date',
      'settle_date',
      'transaction_cd',
      'memo_nbr',
      'amortization_amt',
      'capitalized_int_receivable_amt',
    ],
    apiFilter: {
      field: 'account_nbr',
      labelField: 'account_desc',
      filterEndpoint: 'v1/accounting/od/fbp_dpai_account_summary',
      downloadLabel: 'Account',
      label: 'Choose an Account',
      disableDateRangeFilter: true,
      dataDefaultHeader: 'This table requires additional filters.',
      dataDefaultMessage: 'Select an account in the filter section above to display the data.',
      dataUnmatchedHeader: 'There is no data to display based on the current filters selected.',
      dataUnmatchedMessage: 'Select a different account and/or date range in order to preview the data.',
      dataSearchLabel: 'Search account descriptions',
      notice: 'Date fields on Fiscal Data may differ from the published dates for corresponding reports on TreasuryDirect.',
      customDateFilter: {
        startDateField: 'settle_date',
        endDateField: 'effective_date',
        dateRange: 'endOfMonth',
      },
    },
  },
  // GAS
  '310': {
    endpoint: 'v1/accounting/od/gas_held_by_public_daily_activity',
    dateField: 'record_date',
    downloadName: 'GAS_HeldByThePublic_DailyActivity',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
    selectColumns: [],
    // 'Pivot View' in UI; 'Pivot View (Field)' and 'Pivot View (Name)' on form
    dataDisplays: [
      {
        title: 'Account Description',
        dimensionField: 'account_desc',
      },
    ],
    // 'Pivot Value' in UI, 'Pivot Value (Field)' on form
    valueFieldOptions: [
      'daily_opening_balance_amt',
      'daily_issued_amt',
      'daily_redeemed_amt',
      'mtd_opening_balance_amt',
      'mtd_issued_amt',
      'mtd_redeemed_amt',
      'fytd_opening_balance_amt',
      'fytd_issued_amt',
      'fytd_redeemed_amt',
      'daily_ending_balance_amt',
    ],
  },
  '311': {
    endpoint: 'v1/accounting/od/gas_intragov_holdings_daily_activity',
    dateField: 'record_date',
    downloadName: 'GAS_IntragovernmentalHoldings_DailyActivity',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
    selectColumns: [],
    // 'Pivot View' in UI; 'Pivot View (Field)' and 'Pivot View (Name)' on form
    dataDisplays: [
      {
        title: 'Account Description',
        dimensionField: 'account_desc',
      },
    ],
    // 'Pivot Value' in UI, 'Pivot Value (Field)' on form
    valueFieldOptions: [
      'daily_opening_balance_amt',
      'daily_issued_amt',
      'daily_redeemed_amt',
      'mtd_opening_balance_amt',
      'mtd_issued_amt',
      'mtd_redeemed_amt',
      'fytd_opening_balance_amt',
      'fytd_issued_amt',
      'fytd_redeemed_amt',
      'daily_ending_balance_amt',
    ],
  },
  '312': {
    endpoint: 'v1/accounting/od/gas_daily_activity_totals',
    dateField: 'record_date',
    downloadName: 'GAS_DailyActivity_Totals',
    alwaysSortWith: ['-record_date', 'src_line_nbr'],
    selectColumns: [],
    // 'Pivot View' in UI; 'Pivot View (Field)' and 'Pivot View (Name)' on form
    dataDisplays: [
      {
        title: 'Total Description',
        dimensionField: 'total_desc',
      },
    ],
    // 'Pivot Value' in UI, 'Pivot Value (Field)' on form
    valueFieldOptions: [
      'daily_opening_balance_amt',
      'daily_issued_amt',
      'daily_redeemed_amt',
      'mtd_opening_balance_amt',
      'mtd_issued_amt',
      'mtd_redeemed_amt',
      'fytd_opening_balance_amt',
      'fytd_issued_amt',
      'fytd_redeemed_amt',
      'daily_ending_balance_amt',
    ],
  },
  //TOP
  '299': {
    endpoint: 'v1/debt/treasury_offset_program',
    dateField: 'record_date',
    downloadName: 'treasury_offset_program',
    alwaysSortWith: ['-record_date', 'row_index_nbr'],
    selectColumns: [],
    downloadLimit: {
      fileType: 'xml',
      maxYearRange: 5,
    },
  },
  //MTD Empty endpoint
  322: {
    endpoint: '',
  },
};

const setCompleteTableDisplayItem = response => {
  const strCompleteTable = 'Complete Table',
    completeItem = { title: strCompleteTable };

  if (!response.showChartForCompleteTable) {
    completeItem.chartType = 'none';
  }

  response.dataDisplays = response.dataDisplays || [];
  if (!response.userFilter && response.dataDisplays.every(dd => dd.title !== strCompleteTable)) {
    response.dataDisplays.unshift(completeItem);
  }
};

const getConfigByApiId = (id, endpointConfigIdMap) => {
  const response = endpointConfigIdMap[id];

  if (!response) {
    // If there's no static API config for the ID return false immediately
    // so the API in metadata can be ignored
    return false;
  } else {
    if (response.endpoint && response.endpoint.indexOf('v1/') === 0) {
      response.dateField = response.dateField || 'reporting_date';
    } else {
      response.dateField = response.dateField || 'record_date';
    }

    setCompleteTableDisplayItem(response);
    return response;
  }
};

const getEndpointConfigsById = (excludedEndpointIds, additionalEndpoints) => {
  if (excludedEndpointIds && excludedEndpointIds.length) {
    excludedEndpointIds.forEach(endpointId => {
      if (endpointConfig[endpointId.toString()]) {
        delete endpointConfig[endpointId.toString()];
        console.info(`Excluding endpoint id: ${endpointId}`);
      }
    });
  }
  if (additionalEndpoints && Object.keys(additionalEndpoints).length) {
    Object.assign(endpointConfig, additionalEndpoints);
    console.info('Adding Endpoints: ', Object.keys(additionalEndpoints));
  }
  return endpointConfig;
};

exports.getEndpointConfigsById = getEndpointConfigsById;
exports.getConfigByApiId = getConfigByApiId;
