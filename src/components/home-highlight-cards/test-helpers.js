import datasets from './highlighted-datasets-config';

const getAPI120DataArr = isPerfectEOYArr => {
  const fields = {
    year: 'record_calendar_year',
    month: 'record_calendar_month',
    aggregationField: 'current_month_budget_amt',
  };

  const firstMonth = {
    record_calendar_year: '2015',
    record_calendar_month: '01',
    current_month_budget_amt: 1,
    classification_desc: 'Total Outlays',
  };

  const lastMonth = {
    record_calendar_year: '2017',
    record_calendar_month: '12',
    current_month_budget_amt: 256,
    classification_desc: 'Total Outlays',
  };

  /*
   * The following is crafted so that several entries can be zeroed out when used
   * in conjunction with the api120UniqueAggregation seen in highlighted-datasets-config.tx
   */
  const apiDataArr = [
    {
      record_calendar_year: '2015',
      record_calendar_month: '02',
      current_month_budget_amt: 2,
      classification_desc: 'Total Outlays',
    },
    {
      record_calendar_year: '2015',
      record_calendar_month: '02',
      current_month_budget_amt: 2,
      classification_desc: 'Total Receipts', // Subtracts the 2 from above
    },
    {
      record_calendar_year: '2015',
      record_calendar_month: '10',
      current_month_budget_amt: 4,
      classification_desc: 'Total Outlays',
    },
    {
      record_calendar_year: '2015',
      record_calendar_month: '10',
      current_month_budget_amt: 4,
      classification_desc: 'Total Receipts', // Subtracts 4 from above
    },
    {
      record_calendar_year: '2015',
      record_calendar_month: '11',
      current_month_budget_amt: 8,
      classification_desc: 'Total Outlays',
    },
    {
      record_calendar_year: '2015',
      record_calendar_month: '12',
      current_month_budget_amt: 8,
      classification_desc: 'Total Receipts', // Subtracts the 8 from above
    },
    {
      record_calendar_year: '2016',
      record_calendar_month: '01',
      current_month_budget_amt: 16,
      classification_desc: 'Total Outlays',
    },
    {
      record_calendar_year: '2016',
      record_calendar_month: '11',
      current_month_budget_amt: 32,
      classification_desc: 'Total Outlays',
    },
    {
      record_calendar_year: '2016',
      record_calendar_month: '12',
      current_month_budget_amt: 32,
      classification_desc: 'Total Receipts', // Subtracts the 32 from above
    },
    {
      record_calendar_year: '2017',
      record_calendar_month: '01',
      current_month_budget_amt: 64,
      classification_desc: 'Total Outlays',
    },
    {
      record_calendar_year: '2017',
      record_calendar_month: '01',
      current_month_budget_amt: 64,
      classification_desc: 'Total Receipts', // Subtracts the 64 from above
    },
    {
      record_calendar_year: '2017',
      record_calendar_month: '09',
      current_month_budget_amt: 128,
      classification_desc: 'Total Outlays',
    },
    {
      record_calendar_year: '2017',
      record_calendar_month: '10',
      current_month_budget_amt: 128,
      classification_desc: 'Total Receipts', // Subtracts the 128 from above
    },
  ];

  // The following is what will be seen when using api120UniqueAggregation
  // as the annualAggregation function.
  const transformedUniqueAggArray = [
    {
      record_calendar_year: '2015',
      record_calendar_month: '12',
      current_month_budget_amt: 8,
      classification_desc: 'Total Receipts',
      chartedValue: 1,
    },
    {
      record_calendar_year: '2016',
      record_calendar_month: '12',
      current_month_budget_amt: 32,
      classification_desc: 'Total Receipts',
      chartedValue: 16,
    },
    {
      record_calendar_year: '2017',
      record_calendar_month: '12',
      current_month_budget_amt: 256,
      classification_desc: 'Total Outlays',
      chartedValue: 256,
    },
  ];

  // The following is what will be seen when using the default aggregation from annualAggregation.
  const transformedArray = [
    {
      record_calendar_year: '2015',
      record_calendar_month: '12',
      current_month_budget_amt: 8,
      classification_desc: 'Total Receipts',
      chartedValue: 29,
    },
    {
      record_calendar_year: '2016',
      record_calendar_month: '12',
      current_month_budget_amt: 32,
      classification_desc: 'Total Receipts',
      chartedValue: 80,
    },
    {
      record_calendar_year: '2017',
      record_calendar_month: '12',
      current_month_budget_amt: 256,
      classification_desc: 'Total Outlays',
      chartedValue: 640,
    },
  ];

  if (isPerfectEOYArr) {
    // Add the beginning and end months to apiDataArr to make it all years show as
    // complete years of data
    apiDataArr.unshift(firstMonth);
    apiDataArr.push(lastMonth);
  } else {
    // Only the middle entries will be returned since the outer years are incomplete.
    transformedUniqueAggArray.pop();
    transformedUniqueAggArray.shift();
    transformedArray.pop();
    transformedArray.shift();
  }

  return {
    resArray: apiDataArr,
    transformedArray,
    transformedUniqueAggArray,
    fields,
  };
};

const getAPI130Data = () => {
  const responseArray = [
    {
      transaction_type: 'Deposits',
      transaction_today_amt: '32668',
      record_calendar_month: '09',
      record_calendar_year: '2021',
    },
    {
      transaction_type: 'Withdrawals',
      transaction_today_amt: '91720',
      record_calendar_month: '09',
      record_calendar_year: '2021',
    },
    {
      transaction_type: 'Deposits',
      transaction_today_amt: '2248554',
      record_calendar_month: '08',
      record_calendar_year: '2021',
    },
    {
      transaction_type: 'Withdrawals',
      transaction_today_amt: '2351957',
      record_calendar_month: '08',
      record_calendar_year: '2021',
    },
    {
      transaction_type: 'Deposits',
      transaction_today_amt: '1817865',
      record_calendar_month: '07',
      record_calendar_year: '2021',
    },
    {
      transaction_type: 'Withdrawals',
      transaction_today_amt: '2210411',
      record_calendar_month: '07',
      record_calendar_year: '2021',
    },
    {
      transaction_type: 'Deposits',
      transaction_today_amt: '2509248',
      record_calendar_month: '06',
      record_calendar_year: '2021',
    },
    {
      transaction_type: 'Withdrawals',
      transaction_today_amt: '2434024',
      record_calendar_month: '06',
      record_calendar_year: '2021',
    },
    {
      transaction_type: 'Deposits',
      transaction_today_amt: '1987095',
      record_calendar_month: '05',
      record_calendar_year: '2021',
    },
    {
      transaction_type: 'Withdrawals',
      transaction_today_amt: '2181116',
      record_calendar_month: '05',
      record_calendar_year: '2021',
    },
    {
      transaction_type: 'Deposits',
      transaction_today_amt: '2335186',
      record_calendar_month: '04',
      record_calendar_year: '2021',
    },
    {
      transaction_type: 'Withdrawals',
      transaction_today_amt: '2486422',
      record_calendar_month: '04',
      record_calendar_year: '2021',
    },
    {
      transaction_type: 'Deposits',
      transaction_today_amt: '2364236',
      record_calendar_month: '03',
      record_calendar_year: '2021',
    },
    {
      transaction_type: 'Withdrawals',
      transaction_today_amt: '2656743',
      record_calendar_month: '03',
      record_calendar_year: '2021',
    },
    {
      transaction_type: 'Deposits',
      transaction_today_amt: '1522361',
      record_calendar_month: '02',
      record_calendar_year: '2021',
    },
    {
      transaction_type: 'Withdrawals',
      transaction_today_amt: '1762802',
      record_calendar_month: '02',
      record_calendar_year: '2021',
    },
  ];
  const postTransformData = [
    {
      deposits: 2364236000000,
      withdrawals: -2656743000000,
      yearMonth: 202103,
      combinedValue: -292507000000,
      record_date: '2021-03-01',
    },
    {
      deposits: 2335186000000,
      withdrawals: -2486422000000,
      yearMonth: 202104,
      combinedValue: -151236000000,
      record_date: '2021-04-01',
    },
    {
      deposits: 1987095000000,
      withdrawals: -2181116000000,
      yearMonth: 202105,
      combinedValue: -194021000000,
      record_date: '2021-05-01',
    },
    {
      deposits: 2509248000000,
      withdrawals: -2434024000000,
      yearMonth: 202106,
      combinedValue: 75224000000,
      record_date: '2021-06-01',
    },
    {
      deposits: 1817865000000,
      withdrawals: -2210411000000,
      yearMonth: 202107,
      combinedValue: -392546000000,
      record_date: '2021-07-01',
    },
    {
      deposits: 2248554000000,
      withdrawals: -2351957000000,
      yearMonth: 202108,
      combinedValue: -103403000000,
      record_date: '2021-08-01',
    },
  ];

  return {
    res: { data: responseArray, links: {}, meta: {} },
    postTransformData,
  };
};

const getAPI129Data = () => {
  const responseArray = [
    {
      open_today_bal: '1414465',
      record_calendar_day: '26',
      account_type: 'Federal Reserve Account',
      record_date: '2021-02-26',
    },
    {
      open_today_bal: '1013861',
      record_calendar_day: '26',
      account_type: 'Federal Reserve Account',
      record_date: '2021-03-26',
    },
    {
      open_today_bal: '1019013',
      record_calendar_day: '29',
      account_type: 'Federal Reserve Account',
      record_date: '2021-03-29',
    },
    {
      open_today_bal: '1003516',
      record_calendar_day: '30',
      account_type: 'Federal Reserve Account',
      record_date: '2021-03-30',
    },
    {
      open_today_bal: '1121951',
      record_calendar_day: '31',
      account_type: 'Federal Reserve Account',
      record_date: '2021-03-31',
    },
    {
      open_today_bal: '982206',
      record_calendar_day: '26',
      account_type: 'Federal Reserve Account',
      record_date: '2021-04-26',
    },
    {
      open_today_bal: '958871',
      record_calendar_day: '27',
      account_type: 'Federal Reserve Account',
      record_date: '2021-04-27',
    },
    {
      open_today_bal: '932287',
      record_calendar_day: '28',
      account_type: 'Federal Reserve Account',
      record_date: '2021-04-28',
    },
    {
      open_today_bal: '903015',
      record_calendar_day: '29',
      account_type: 'Federal Reserve Account',
      record_date: '2021-04-29',
    },
    {
      open_today_bal: '970716',
      record_calendar_day: '30',
      account_type: 'Federal Reserve Account',
      record_date: '2021-04-30',
    },
    {
      open_today_bal: '778912',
      record_calendar_day: '26',
      account_type: 'Federal Reserve Account',
      record_date: '2021-05-26',
    },
    {
      open_today_bal: '745973',
      record_calendar_day: '27',
      account_type: 'Federal Reserve Account',
      record_date: '2021-05-27',
    },
    {
      open_today_bal: '776700',
      record_calendar_day: '28',
      account_type: 'Federal Reserve Account',
      record_date: '2021-05-28',
    },
    {
      open_today_bal: '734915',
      record_calendar_day: '28',
      account_type: 'Federal Reserve Account',
      record_date: '2021-06-28',
    },
    {
      open_today_bal: '711267',
      record_calendar_day: '29',
      account_type: 'Federal Reserve Account',
      record_date: '2021-06-29',
    },
    {
      open_today_bal: '851929',
      record_calendar_day: '30',
      account_type: 'Federal Reserve Account',
      record_date: '2021-06-30',
    },
    {
      open_today_bal: '591368',
      record_calendar_day: '26',
      account_type: 'Federal Reserve Account',
      record_date: '2021-07-26',
    },
    {
      open_today_bal: '564799',
      record_calendar_day: '27',
      account_type: 'Federal Reserve Account',
      record_date: '2021-07-27',
    },
    {
      open_today_bal: '536966',
      record_calendar_day: '28',
      account_type: 'Federal Reserve Account',
      record_date: '2021-07-28',
    },
    {
      open_today_bal: '501179',
      record_calendar_day: '29',
      account_type: 'Federal Reserve Account',
      record_date: '2021-07-29',
    },
    {
      open_today_bal: '459402',
      record_calendar_day: '30',
      account_type: 'Federal Reserve Account',
      record_date: '2021-07-30',
    },
    {
      open_today_bal: '239304',
      record_calendar_day: '26',
      account_type: 'Federal Reserve Account',
      record_date: '2021-08-26',
    },
    {
      open_today_bal: '262811',
      record_calendar_day: '27',
      account_type: 'Federal Reserve Account',
      record_date: '2021-08-27',
    },
    {
      open_today_bal: '262895',
      record_calendar_day: '30',
      account_type: 'Federal Reserve Account',
      record_date: '2021-08-30',
    },
  ];
  const postTransformData = [
    {
      record_date: '2021-02-28',
      record_calendar_year: '2021',
      record_calendar_month: '02',
      open_today_bal: '1414465000000',
    },
    {
      record_date: '2021-03-31',
      record_calendar_year: '2021',
      record_calendar_month: '03',
      open_today_bal: '1121951000000',
    },
    {
      record_date: '2021-04-30',
      record_calendar_year: '2021',
      record_calendar_month: '04',
      open_today_bal: '970716000000',
    },
    {
      record_date: '2021-05-31',
      record_calendar_year: '2021',
      record_calendar_month: '05',
      open_today_bal: '776700000000',
    },
    {
      record_date: '2021-06-30',
      record_calendar_year: '2021',
      record_calendar_month: '06',
      open_today_bal: '851929000000',
    },
    {
      record_date: '2021-07-31',
      record_calendar_year: '2021',
      record_calendar_month: '07',
      open_today_bal: '459402000000',
    },
  ];

  return {
    res: { data: responseArray, links: {}, meta: {} },
    postTransformData,
  };
};

const getAPI146Data = () => {
  const responseArray = [
    {
      avg_interest_rate_amt: '1.687',
      record_calendar_year: '2021',
      record_calendar_month: '01',
    },
    {
      avg_interest_rate_amt: '1.664',
      record_calendar_year: '2021',
      record_calendar_month: '02',
    },
    {
      avg_interest_rate_amt: '1.656',
      record_calendar_year: '2021',
      record_calendar_month: '03',
    },
    {
      avg_interest_rate_amt: '1.653',
      record_calendar_year: '2021',
      record_calendar_month: '04',
    },
    {
      avg_interest_rate_amt: '1.609',
      record_calendar_year: '2021',
      record_calendar_month: '06',
    },
    {
      avg_interest_rate_amt: '1.613',
      record_calendar_year: '2021',
      record_calendar_month: '07',
    },
    {
      avg_interest_rate_amt: '1.647',
      record_calendar_year: '2021',
      record_calendar_month: '05',
    },
    {
      avg_interest_rate_amt: '2.087',
      record_calendar_year: '2020',
      record_calendar_month: '04',
    },
    {
      avg_interest_rate_amt: '2.394',
      record_calendar_year: '2020',
      record_calendar_month: '02',
    },
    {
      avg_interest_rate_amt: '1.875',
      record_calendar_year: '2020',
      record_calendar_month: '06',
    },
    {
      avg_interest_rate_amt: '1.842',
      record_calendar_year: '2020',
      record_calendar_month: '07',
    },
    {
      avg_interest_rate_amt: '1.795',
      record_calendar_year: '2020',
      record_calendar_month: '08',
    },
    {
      avg_interest_rate_amt: '1.772',
      record_calendar_year: '2020',
      record_calendar_month: '09',
    },
    {
      avg_interest_rate_amt: '1.761',
      record_calendar_year: '2020',
      record_calendar_month: '10',
    },
    {
      avg_interest_rate_amt: '1.723',
      record_calendar_year: '2020',
      record_calendar_month: '11',
    },
    {
      avg_interest_rate_amt: '1.695',
      record_calendar_year: '2020',
      record_calendar_month: '12',
    },
    {
      avg_interest_rate_amt: '2.291',
      record_calendar_year: '2020',
      record_calendar_month: '03',
    },
    {
      avg_interest_rate_amt: '2.418',
      record_calendar_year: '2020',
      record_calendar_month: '01',
    },
    {
      avg_interest_rate_amt: '1.983',
      record_calendar_year: '2020',
      record_calendar_month: '05',
    },
    {
      avg_interest_rate_amt: '2.594',
      record_calendar_year: '2019',
      record_calendar_month: '04',
    },
    {
      avg_interest_rate_amt: '2.590',
      record_calendar_year: '2019',
      record_calendar_month: '03',
    },
    {
      avg_interest_rate_amt: '2.567',
      record_calendar_year: '2019',
      record_calendar_month: '06',
    },
    {
      avg_interest_rate_amt: '2.593',
      record_calendar_year: '2019',
      record_calendar_month: '05',
    },
    {
      avg_interest_rate_amt: '2.444',
      record_calendar_year: '2019',
      record_calendar_month: '11',
    },
    {
      avg_interest_rate_amt: '2.492',
      record_calendar_year: '2019',
      record_calendar_month: '09',
    },
    {
      avg_interest_rate_amt: '2.429',
      record_calendar_year: '2019',
      record_calendar_month: '12',
    },
    {
      avg_interest_rate_amt: '2.464',
      record_calendar_year: '2019',
      record_calendar_month: '10',
    },
    {
      avg_interest_rate_amt: '2.574',
      record_calendar_year: '2019',
      record_calendar_month: '01',
    },
    {
      avg_interest_rate_amt: '2.554',
      record_calendar_year: '2019',
      record_calendar_month: '07',
    },
    {
      avg_interest_rate_amt: '2.525',
      record_calendar_year: '2019',
      record_calendar_month: '08',
    },
    {
      avg_interest_rate_amt: '2.581',
      record_calendar_year: '2019',
      record_calendar_month: '02',
    },
    {
      avg_interest_rate_amt: '2.347',
      record_calendar_year: '2018',
      record_calendar_month: '02',
    },
    {
      avg_interest_rate_amt: '2.433',
      record_calendar_year: '2018',
      record_calendar_month: '06',
    },
    {
      avg_interest_rate_amt: '2.457',
      record_calendar_year: '2018',
      record_calendar_month: '07',
    },
    {
      avg_interest_rate_amt: '2.472',
      record_calendar_year: '2018',
      record_calendar_month: '08',
    },
    {
      avg_interest_rate_amt: '2.522',
      record_calendar_year: '2018',
      record_calendar_month: '10',
    },
    {
      avg_interest_rate_amt: '2.560',
      record_calendar_year: '2018',
      record_calendar_month: '12',
    },
    {
      avg_interest_rate_amt: '2.542',
      record_calendar_year: '2018',
      record_calendar_month: '11',
    },
    {
      avg_interest_rate_amt: '2.397',
      record_calendar_year: '2018',
      record_calendar_month: '04',
    },
    {
      avg_interest_rate_amt: '2.326',
      record_calendar_year: '2018',
      record_calendar_month: '01',
    },
    {
      avg_interest_rate_amt: '2.421',
      record_calendar_year: '2018',
      record_calendar_month: '05',
    },
    {
      avg_interest_rate_amt: '2.494',
      record_calendar_year: '2018',
      record_calendar_month: '09',
    },
    {
      avg_interest_rate_amt: '2.368',
      record_calendar_year: '2018',
      record_calendar_month: '03',
    },
    {
      avg_interest_rate_amt: '2.249',
      record_calendar_year: '2017',
      record_calendar_month: '02',
    },
    {
      avg_interest_rate_amt: '2.277',
      record_calendar_year: '2017',
      record_calendar_month: '04',
    },
    {
      avg_interest_rate_amt: '2.279',
      record_calendar_year: '2017',
      record_calendar_month: '07',
    },
    {
      avg_interest_rate_amt: '2.229',
      record_calendar_year: '2017',
      record_calendar_month: '10',
    },
    {
      avg_interest_rate_amt: '2.293',
      record_calendar_year: '2017',
      record_calendar_month: '11',
    },
    {
      avg_interest_rate_amt: '2.264',
      record_calendar_year: '2017',
      record_calendar_month: '03',
    },
    {
      avg_interest_rate_amt: '2.276',
      record_calendar_year: '2017',
      record_calendar_month: '05',
    },
    {
      avg_interest_rate_amt: '2.284',
      record_calendar_year: '2017',
      record_calendar_month: '09',
    },
    {
      avg_interest_rate_amt: '2.282',
      record_calendar_year: '2017',
      record_calendar_month: '08',
    },
    {
      avg_interest_rate_amt: '2.309',
      record_calendar_year: '2017',
      record_calendar_month: '12',
    },
    {
      avg_interest_rate_amt: '2.244',
      record_calendar_year: '2017',
      record_calendar_month: '01',
    },
    {
      avg_interest_rate_amt: '2.268',
      record_calendar_year: '2017',
      record_calendar_month: '06',
    },
    {
      avg_interest_rate_amt: '2.237',
      record_calendar_year: '2016',
      record_calendar_month: '08',
    },
    {
      avg_interest_rate_amt: '2.232',
      record_calendar_year: '2016',
      record_calendar_month: '09',
    },
    {
      avg_interest_rate_amt: '2.216',
      record_calendar_year: '2016',
      record_calendar_month: '10',
    },
    {
      avg_interest_rate_amt: '2.232',
      record_calendar_year: '2016',
      record_calendar_month: '12',
    },
    {
      avg_interest_rate_amt: '2.204',
      record_calendar_year: '2016',
      record_calendar_month: '11',
    },
  ];

  const postTransformData = [
    {
      record_date: '2016-12-31',
      avg_interest_rate_amt: '2.224',
    },
    {
      record_date: '2017-12-31',
      avg_interest_rate_amt: '2.271',
    },
    {
      record_date: '2018-12-31',
      avg_interest_rate_amt: '2.445',
    },
    {
      record_date: '2019-12-31',
      avg_interest_rate_amt: '2.534',
    },
    {
      record_date: '2020-12-31',
      avg_interest_rate_amt: '1.970',
    },
  ];

  return {
    res: { data: responseArray, links: {}, meta: {} },
    postTransformData,
  };
};

const getAPI144Data = () => {
  const responseArray = [
    {
      book_value_amt: '125',
      record_date: '2021-07-31',
    },
    {
      book_value_amt: '125',
      record_date: '2021-07-31',
    },
    {
      book_value_amt: '125',
      record_date: '2021-07-31',
    },
    {
      book_value_amt: '125',
      record_date: '2021-07-31',
    },
    {
      book_value_amt: '125',
      record_date: '2021-07-31',
    },
    {
      book_value_amt: '125',
      record_date: '2021-07-31',
    },
    {
      book_value_amt: '125',
      record_date: '2021-07-31',
    },
    {
      book_value_amt: '125',
      record_date: '2021-07-31',
    },
  ];

  const postTransformData = [
    {
      book_value_amt: 1000,
      record_date: '2021-07-31',
    },
  ];

  return {
    res: { data: responseArray, links: {}, meta: {} },
    postTransformData,
  };
};

const getAPI143Data = () => {
  const responseArray = [
    {
      tot_pub_debt_out_amt: '38484705102395.33',
      record_calendar_year: '2025',
      record_calendar_month: '07',
    },
    {
      tot_pub_debt_out_amt: '38484705102395.33',
      record_calendar_year: '2025',
      record_calendar_month: '01',
    },
    {
      tot_pub_debt_out_amt: '38473375474319.00',
      record_calendar_year: '2024',
      record_calendar_month: '07',
    },
    {
      tot_pub_debt_out_amt: '38473375474319.00',
      record_calendar_year: '2024',
      record_calendar_month: '01',
    },
    {
      tot_pub_debt_out_amt: '38490798138585.90',
      record_calendar_year: '2023',
      record_calendar_month: '07',
    },
    {
      tot_pub_debt_out_amt: '38490798138585.90',
      record_calendar_year: '2023',
      record_calendar_month: '01',
    },
    {
      tot_pub_debt_out_amt: '38491020558407.85',
      record_calendar_year: '2022',
      record_calendar_month: '07',
    },
    {
      tot_pub_debt_out_amt: '38491020558407.85',
      record_calendar_year: '2022',
      record_calendar_month: '01',
    },
    {
      tot_pub_debt_out_amt: '38513523578580.59',
      record_calendar_year: '2021',
      record_calendar_month: '07',
    },
    {
      tot_pub_debt_out_amt: '38513523578580.59',
      record_calendar_year: '2021',
      record_calendar_month: '01',
    },
  ];

  const postTransformData = [
    {
      chartedValue: 0,
      tot_pub_debt_out_amt: '38484705102395.33',
      record_calendar_year: '2025',
      record_calendar_month: '07',
    },
    {
      chartedValue: 0,
      tot_pub_debt_out_amt: '38473375474319.00',
      record_calendar_year: '2024',
      record_calendar_month: '07',
    },
    {
      chartedValue: 0,
      tot_pub_debt_out_amt: '38490798138585.90',
      record_calendar_year: '2023',
      record_calendar_month: '07',
    },
    {
      chartedValue: 0,
      tot_pub_debt_out_amt: '38491020558407.85',
      record_calendar_year: '2022',
      record_calendar_month: '07',
    },
    {
      chartedValue: 0,
      tot_pub_debt_out_amt: '38513523578580.59',
      record_calendar_year: '2021',
      record_calendar_month: '07',
    },
  ];

  return {
    res: { data: responseArray, links: {}, meta: {} },
    postTransformData,
  };
};

const getMockHighlightCardsData = () => {
  const cardsObj = {};

  const buildAPIData = api => {
    return {
      apiId: api.api_id,
      dateField: 'reportDate',
      reportDate: '2020-05-31',
      latestDate: '2020-05-31',
    };
  };

  datasets.forEach(dataset => {
    const id = dataset.datasetId;
    const api = dataset.data;
    if (!cardsObj[id]) {
      cardsObj[id] = {
        datasetId: id,
        slug: 'slug',
        name: 'name',
        title: dataset.title,
        apis: [buildAPIData(api)],
      };
    } else {
      cardsObj[id].apis.push(buildAPIData(api));
    }
  });
  return Object.keys(cardsObj).map(card => cardsObj[card]);
};

const testHelpers = {
  getAPI120DataArr,
  getAPI130Data,
  getAPI129Data,
  getAPI146Data,
  getAPI144Data,
  getAPI143Data,
  getMockHighlightCardsData,
};

export default testHelpers;
