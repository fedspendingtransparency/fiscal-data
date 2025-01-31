const revenueConstants = {
  CURRENT_FY: 'v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG,sequence_number_cd:eq:1.1&sort=-record_date&page[size]=1',
  CURRENT_SINGLE_FYTD_RCPT_OUTLY_AMT: 'v1/accounting/mts/mts_table_9?filter=line_code_nbr:eq:120&sort=-record_date&page[size]=1',
  CURRENT_MULTI_FYTD_RCPT_OUTLY_AMT: 'v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG&sort=-record_date&page[size]=10',
  PRIOR_FY: 'v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1',
  PRIOR_SINGLE_FYTD_RCPT_OUTLY_AMT:
    'v1/accounting/mts/mts_table_9?filter=line_code_nbr:eq:120,record_calendar_month:eq:09&sort=-record_date&page[size]=1',
  PRIOR_MULTI_FYTD_RCPT_OUTLY_AMT:
    'v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG,record_calendar_month:eq:09&sort=-record_date&page[size]=10',
  BEA_URL:
    'https://apps.bea.gov/api/data/?UserID=F9C35FFF-7425-45B0-B988-9F10E3263E9E&method=GETDATA&datasetname=NIPA&TableName=T10105&frequency=Q&year=X&ResultFormat=JSON',
};

export default revenueConstants;
