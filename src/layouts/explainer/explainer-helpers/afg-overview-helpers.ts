export const revenueRequest = {
  endpointPath: 'v1/accounting/mts/mts_table_4',
  fields: 'current_fytd_net_rcpt_amt,prior_fytd_net_rcpt_amt,' + 'record_calendar_month,record_calendar_year,record_fiscal_year,record_date',
  filter: 'line_code_nbr:eq:830',
};

export const revenueCategoryRequest = {
  endpointPath: 'v1/accounting/mts/mts_table_9',
  fields: 'classification_desc,record_date,current_fytd_rcpt_outly_amt',
  filter: 'record_type_cd:eq:RSG,current_fytd_rcpt_outly_amt:gt:0',
  sort: '-current_fytd_rcpt_outly_amt',
};

export const spendingRequest = {
  endpointPath: 'v1/accounting/mts/mts_table_5',
  fields: 'current_fytd_net_outly_amt,prior_fytd_net_outly_amt,record_date,' + 'record_calendar_month,record_calendar_year,record_fiscal_year',
  filter: 'line_code_nbr:eq:5691',
};

export const spendingCategoryRequest = {
  endpointPath: 'v1/accounting/mts/mts_table_9',
  fields: 'classification_desc,record_date,current_fytd_rcpt_outly_amt',
  filter: 'record_type_cd:eq:F,current_fytd_rcpt_outly_amt:gt:0',
  sort: '-current_fytd_rcpt_outly_amt',
};

export const deficitRequest = {
  endpointPath: 'v1/accounting/mts/mts_table_5',
  fields: 'current_fytd_net_outly_amt,prior_fytd_net_outly_amt,record_date,' + 'record_calendar_month,record_calendar_year,record_fiscal_year',
  filter: 'line_code_nbr:eq:5694',
};

export const debtRequest = {
  endpointPath: 'v2/accounting/od/debt_to_penny',
};
