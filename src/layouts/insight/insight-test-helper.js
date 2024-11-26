export const mockInterestExpenseHeroOlderResponse = {
  data: [
    {
      expense_catg_desc: 'INTEREST EXPENSE ON PUBLIC ISSUES',
      expense_group_desc: 'ACCRUED INTEREST EXPENSE',
      expense_type_desc: 'Treasury Notes',
      fytd_expense_amt: '100000000.00',
      month_expense_amt: '1000.00',
      record_calendar_day: '31',
      record_calendar_month: '05',
      record_calendar_quarter: '2',
      record_calendar_year: '2012',
      record_date: '2012-05-31',
      record_fiscal_quarter: '3',
      record_fiscal_year: '2012',
      src_line_nbr: '1',
    },
  ],
};

export const mockInterestExpenseHeroCurrentResponse = {
  data: [
    {
      expense_catg_desc: 'INTEREST EXPENSE ON PUBLIC ISSUES',
      expense_group_desc: 'ACCRUED INTEREST EXPENSE',
      expense_type_desc: 'Treasury Notes',
      fytd_expense_amt: '100000000.00',
      month_expense_amt: '1000.00',
      record_calendar_day: '31',
      record_calendar_month: '09',
      record_calendar_quarter: '2',
      record_calendar_year: '2024',
      record_date: '2024-09-30',
      record_fiscal_quarter: '3',
      record_fiscal_year: '2024',
      src_line_nbr: '1',
    },
  ],
};

export const mockAvgInterestRateResponse = {
  data: [
    {
      record_date: '2024-09-30',
      security_type_desc: 'Interest-bearing Debt',
      security_desc: 'Total Interest-bearing Debt',
      avg_interest_rate_amt: '3.324',
      src_line_nbr: '17',
      record_fiscal_year: '2024',
      record_fiscal_quarter: '4',
      record_calendar_year: '2024',
      record_calendar_quarter: '3',
      record_calendar_month: '09',
      record_calendar_day: '30',
    },
    {
      record_date: '2024-08-31',
      security_type_desc: 'Interest-bearing Debt',
      security_desc: 'Total Interest-bearing Debt',
      avg_interest_rate_amt: '3.348',
      src_line_nbr: '17',
      record_fiscal_year: '2024',
      record_fiscal_quarter: '4',
      record_calendar_year: '2024',
      record_calendar_quarter: '3',
      record_calendar_month: '08',
      record_calendar_day: '31',
    },
  ],
};

export const mockInterestExpenseSummableAmountResponse = {
  data: [
    {
      record_date: '2024-10-31',
      expense_catg_desc: 'INTEREST EXPENSE ON PUBLIC ISSUES',
      expense_group_desc: 'ACCRUED INTEREST EXPENSE',
      expense_type_desc: 'Treasury Notes',
      month_expense_amt: '32452968218.06',
      fytd_expense_amt: '32452968218.06',
      src_line_nbr: '1',
      record_fiscal_year: '2025',
      record_fiscal_quarter: '1',
      record_calendar_year: '2024',
      record_calendar_quarter: '4',
      record_calendar_month: '10',
      record_calendar_day: '31',
    },
    {
      record_date: 2024 - 10 - 31,
      expense_catg_desc: 'INTEREST EXPENSE ON PUBLIC ISSUES',
      expense_group_desc: 'ACCRUED INTEREST EXPENSE',
      expense_type_desc: 'Treasury Bonds',
      month_expense_amt: '12496011674.92',
      fytd_expense_amt: '12496011674.92',
      src_line_nbr: '2',
      record_fiscal_year: '2025',
      record_fiscal_quarter: '1',
      record_calendar_year: '2024',
      record_calendar_quarter: '4',
      record_calendar_month: '10',
      record_calendar_day: '31',
    },
    {
      record_date: '2024-10-31',
      expense_catg_desc: 'INTEREST EXPENSE ON PUBLIC ISSUES',
      expense_group_desc: 'ACCRUED INTEREST EXPENSE',
      expense_type_desc: 'Inflation Protected Securities (TIPS)',
      month_expense_amt: '1647394004.36',
      fytd_expense_amt: '1647394004.36',
      src_line_nbr: '3',
      record_fiscal_year: '2025',
      record_fiscal_quarter: '1',
      record_calendar_year: '2024',
      record_calendar_quarter: '4',
      record_calendar_month: '10',
      record_calendar_day: '31',
    },
  ],
};

export const mockInsightChartData = [
  {
    year: 2010,
    expense: 320000000000,
    rate: 3.0,
  },
  {
    year: 2011,
    expense: 380000000000,
    rate: 2.8,
  },
  {
    year: 2012,
    expense: 260000000000,
    rate: 2.7,
  },
  {
    year: 2013,
    expense: 450000000000,
    rate: 2.6,
  },
  {
    year: 2014,
    expense: 500000000000,
    rate: 2.6,
  },
  {
    year: 2015,
    expense: 600000000000,
    rate: 2.6,
  },
  {
    year: 2016,
    expense: 650000000000,
    rate: 2.7,
  },
  {
    year: 2017,
    expense: 700000000000,
    rate: 2.7,
  },
  {
    year: 2018,
    expense: 250000000000,
    rate: 2.8,
  },
  {
    year: 2019,
    expense: 450000000000,
    rate: 2.9,
  },
  {
    year: 2020,
    expense: 550000000000,
    rate: 3.0,
  },
  {
    year: 2021,
    expense: 580000000000,
    rate: 3.4,
  },
  {
    year: 2022,
    expense: 610000000000,
    rate: 3.6,
  },
  {
    year: 2023,
    expense: 680000000000,
    rate: 3.7,
  },
  {
    year: 2024,
    expense: 890000000000,
    rate: 3.8,
  },
];
