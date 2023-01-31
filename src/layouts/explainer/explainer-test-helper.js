const mockExplainerPageResponseData = [
  {
      "record_date": "2021-09-30",
      "debt_outstanding_amt": "28428918570048.68",
      "src_line_nbr": "1",
      "record_fiscal_year": "2021",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2021",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
  },
  {
      "record_date": "2020-09-30",
      "debt_outstanding_amt": "26945391194615.15",
      "src_line_nbr": "1",
      "record_fiscal_year": "2020",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2020",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
  },
  {
      "record_date": "2019-09-30",
      "debt_outstanding_amt": "22719401753433.78",
      "src_line_nbr": "1",
      "record_fiscal_year": "2019",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2019",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
  },
  {
      "record_date": "2018-09-30",
      "debt_outstanding_amt": "21516058183180.23",
      "src_line_nbr": "1",
      "record_fiscal_year": "2018",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2018",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
  },
  {
      "record_date": "2017-09-30",
      "debt_outstanding_amt": "20244900016053.51",
      "src_line_nbr": "1",
      "record_fiscal_year": "2017",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2017",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
  },
  {
      "record_date": "2016-09-30",
      "debt_outstanding_amt": "19573444713936.79",
      "src_line_nbr": "1",
      "record_fiscal_year": "2016",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2016",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
  },
  {
      "record_date": "2015-09-30",
      "debt_outstanding_amt": "18150617666484.33",
      "src_line_nbr": "1",
      "record_fiscal_year": "2015",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2015",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
  },
  {
      "record_date": "2014-09-30",
      "debt_outstanding_amt": "17824071380733.82",
      "src_line_nbr": "1",
      "record_fiscal_year": "2014",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2014",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
  },
  {
      "record_date": "2013-09-30",
      "debt_outstanding_amt": "16738183526697.32",
      "src_line_nbr": "1",
      "record_fiscal_year": "2013",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2013",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
  },
  {
      "record_date": "2012-09-30",
      "debt_outstanding_amt": "16066241407385.89",
      "src_line_nbr": "1",
      "record_fiscal_year": "2012",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2012",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
  },
  {
      "record_date": "2011-09-30",
      "debt_outstanding_amt": "14790340328557.15",
      "src_line_nbr": "1",
      "record_fiscal_year": "2011",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2011",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
  }
];

export const mockExplainerPageResponse = {
  data: mockExplainerPageResponseData,
  links: {},
  meta: {
    count: mockExplainerPageResponseData.length,

  }
};

const mockDebtBreakdownData =
  [
    {
      "debt_held_public_mil_amt": "10256015.4323853",
      "intragov_hold_mil_amt": "4737693.61275732",
      "record_calendar_year": "2011",
      "record_calendar_month": "10",
      "record_date": "2011-10-31"
    },
    {
      "debt_held_public_mil_amt": "10389957.7807415",
      "intragov_hold_mil_amt": "4720540.76767472",
      "record_calendar_year": "2011",
      "record_calendar_month": "11",
      "record_date": "2011-11-30"
    },
    {
      "debt_held_public_mil_amt": "10447662.9880831",
      "intragov_hold_mil_amt": "4775277.19364394",
      "record_calendar_year": "2011",
      "record_calendar_month": "12",
      "record_date": "2011-12-31"
    },
    {
      "debt_held_public_mil_amt": "22637089.618511",
      "intragov_hold_mil_amt": "6271676.24279488",
      "record_calendar_year": "2021",
      "record_calendar_month": "10",
      "record_date": "2021-10-31"
    }
  ];

export const mockInterestRatesData = [{
    "record_date": "2021-12-31",
    "security_type_desc": "Interest-bearing Debt",
    "security_desc": "Total Interest-bearing Debt",
    "avg_interest_rate_amt": "1.565",
    "src_line_nbr": "17",
    "record_fiscal_year": "2022",
    "record_fiscal_quarter": "1",
    "record_calendar_year": "2021",
    "record_calendar_quarter": "4",
    "record_calendar_month": "12",
    "record_calendar_day": "31",
  }, {
    "record_date": "2020-12-31",
    "security_type_desc": "Interest-bearing Debt",
    "security_desc": "Total Interest-bearing Debt",
    "avg_interest_rate_amt": "1.695",
    "src_line_nbr": "17",
    "record_fiscal_year": "2021",
    "record_fiscal_quarter": "1",
    "record_calendar_year": "2020",
    "record_calendar_quarter": "4",
    "record_calendar_month": "12",
    "record_calendar_day": "31",
  }, {
    "record_date": "2019-12-31",
    "security_type_desc": "Interest-bearing Debt",
    "security_desc": "Total Interest-bearing Debt",
    "avg_interest_rate_amt": "2.429",
    "src_line_nbr": "16",
    "record_fiscal_year": "2020",
    "record_fiscal_quarter": "1",
    "record_calendar_year": "2019",
    "record_calendar_quarter": "4",
    "record_calendar_month": "12",
    "record_calendar_day": "31",
  }, {
    "record_date": "2018-12-31",
    "security_type_desc": "Interest-bearing Debt",
    "security_desc": "Total Interest-bearing Debt",
    "avg_interest_rate_amt": "2.560",
    "src_line_nbr": "16",
    "record_fiscal_year": "2019",
    "record_fiscal_quarter": "1",
    "record_calendar_year": "2018",
    "record_calendar_quarter": "4",
    "record_calendar_month": "12",
    "record_calendar_day": "31",
  }, {
    "record_date": "2017-12-31",
    "security_type_desc": "Interest-bearing Debt",
    "security_desc": "Total Interest-bearing Debt",
    "avg_interest_rate_amt": "2.309",
    "src_line_nbr": "16",
    "record_fiscal_year": "2018",
    "record_fiscal_quarter": "1",
    "record_calendar_year": "2017",
    "record_calendar_quarter": "4",
    "record_calendar_month": "12",
    "record_calendar_day": "31",
  }, {
    "record_date": "2016-12-31",
    "security_type_desc": "Interest-bearing Debt",
    "security_desc": "Total Interest-bearing Debt",
    "avg_interest_rate_amt": "2.232",
    "src_line_nbr": "17",
    "record_fiscal_year": "2017",
    "record_fiscal_quarter": "1",
    "record_calendar_year": "2016",
    "record_calendar_quarter": "4",
    "record_calendar_month": "12",
    "record_calendar_day": "31",
  }, {
    "record_date": "2015-12-31",
    "security_type_desc": "Interest-bearing Debt",
    "security_desc": "Total Interest-bearing Debt",
    "avg_interest_rate_amt": "2.331",
    "src_line_nbr": "17",
    "record_fiscal_year": "2016",
    "record_fiscal_quarter": "1",
    "record_calendar_year": "2015",
    "record_calendar_quarter": "4",
    "record_calendar_month": "12",
    "record_calendar_day": "31",
  }, {
    "record_date": "2014-12-31",
    "security_type_desc": "Interest-bearing Debt",
    "security_desc": "Total Interest-bearing Debt",
    "avg_interest_rate_amt": "2.369",
    "src_line_nbr": "17",
    "record_fiscal_year": "2015",
    "record_fiscal_quarter": "1",
    "record_calendar_year": "2014",
    "record_calendar_quarter": "4",
    "record_calendar_month": "12",
    "record_calendar_day": "31",
  }, {
    "record_date": "2013-12-31",
    "security_type_desc": "Interest-bearing Debt",
    "security_desc": "Total Interest-bearing Debt",
    "avg_interest_rate_amt": "2.406",
    "src_line_nbr": "16",
    "record_fiscal_year": "2014",
    "record_fiscal_quarter": "1",
    "record_calendar_year": "2013",
    "record_calendar_quarter": "4",
    "record_calendar_month": "12",
    "record_calendar_day": "31",
  }, {
    "record_date": "2012-12-31",
    "security_type_desc": "Interest-bearing Debt",
    "security_desc": "Total Interest-bearing Debt",
    "avg_interest_rate_amt": "2.523",
    "src_line_nbr": "16",
    "record_fiscal_year": "2013",
    "record_fiscal_quarter": "1",
    "record_calendar_year": "2012",
    "record_calendar_quarter": "4",
    "record_calendar_month": "12",
    "record_calendar_day": "31",
  }];

export const mockTotalDebtData = [{
  "record_date": "2021-12-31",
  "security_type_desc": "Total Public Debt Outstanding",
  "security_class_desc": "_",
  "debt_held_public_mil_amt": "23143747.3419429",
  "intragov_hold_mil_amt": "6473468.17868392",
  "total_mil_amt": "29617214.5206268",
  "src_line_nbr": "15",
  "record_fiscal_year": "2022",
  "record_fiscal_quarter": "1",
  "record_calendar_year": "2021",
  "record_calendar_quarter": "4",
  "record_calendar_month": "12",
  "record_calendar_day": "31",
}, {
  "record_date": "2020-12-31",
  "security_type_desc": "Total Public Debt Outstanding",
  "security_class_desc": "_",
  "debt_held_public_mil_amt": "21632418.9103295",
  "intragov_hold_mil_amt": "6115378.61090277",
  "total_mil_amt": "27747797.5212323",
  "src_line_nbr": "15",
  "record_fiscal_year": "2021",
  "record_fiscal_quarter": "1",
  "record_calendar_year": "2020",
  "record_calendar_quarter": "4",
  "record_calendar_month": "12",
  "record_calendar_day": "31",
}, {
  "record_date": "2019-12-31",
  "security_type_desc": "Total Public Debt Outstanding",
  "security_class_desc": "_",
  "debt_held_public_mil_amt": "17170441.5200595",
  "intragov_hold_mil_amt": "6030937.64717518",
  "total_mil_amt": "23201380.1672346",
  "src_line_nbr": "15",
  "record_fiscal_year": "2020",
  "record_fiscal_quarter": "1",
  "record_calendar_year": "2019",
  "record_calendar_quarter": "4",
  "record_calendar_month": "12",
  "record_calendar_day": "31",
}, {
  "record_date": "2018-12-31",
  "security_type_desc": "Total Public Debt Outstanding",
  "security_class_desc": "_",
  "debt_held_public_mil_amt": "16101666.5273713",
  "intragov_hold_mil_amt": "5872429.20530887",
  "total_mil_amt": "21974095.7326802",
  "src_line_nbr": "15",
  "record_fiscal_year": "2019",
  "record_fiscal_quarter": "1",
  "record_calendar_year": "2018",
  "record_calendar_quarter": "4",
  "record_calendar_month": "12",
  "record_calendar_day": "31",
}, {
  "record_date": "2017-12-31",
  "security_type_desc": "Total Public Debt Outstanding",
  "security_class_desc": "_",
  "debt_held_public_mil_amt": "14814720.9625454",
  "intragov_hold_mil_amt": "5678025.41838998",
  "total_mil_amt": "20492747.3809354",
  "src_line_nbr": "15",
  "record_fiscal_year": "2018",
  "record_fiscal_quarter": "1",
  "record_calendar_year": "2017",
  "record_calendar_quarter": "4",
  "record_calendar_month": "12",
  "record_calendar_day": "31",
}, {
  "record_date": "2016-12-31",
  "security_type_desc": "Total Public Debt Outstanding",
  "security_class_desc": "_",
  "debt_held_public_mil_amt": "14434842.2903118",
  "intragov_hold_mil_amt": "5541985.43011943",
  "total_mil_amt": "19976826.7204312",
  "src_line_nbr": "15",
  "record_fiscal_year": "2017",
  "record_fiscal_quarter": "1",
  "record_calendar_year": "2016",
  "record_calendar_quarter": "4",
  "record_calendar_month": "12",
  "record_calendar_day": "31",
}, {
  "record_date": "2015-12-31",
  "security_type_desc": "Total Public Debt Outstanding",
  "security_class_desc": "_",
  "debt_held_public_mil_amt": "13672522.2613769",
  "intragov_hold_mil_amt": "5249656.73725891",
  "total_mil_amt": "18922178.9983102",
  "src_line_nbr": "16",
  "record_fiscal_year": "2016",
  "record_fiscal_quarter": "1",
  "record_calendar_year": "2015",
  "record_calendar_quarter": "4",
  "record_calendar_month": "12",
  "record_calendar_day": "31",
}, {
  "record_date": "2014-12-31",
  "security_type_desc": "Total Public Debt Outstanding",
  "security_class_desc": "_",
  "debt_held_public_mil_amt": "13023951.1625189",
  "intragov_hold_mil_amt": "5117492.74511852",
  "total_mil_amt": "18141443.9076374",
  "src_line_nbr": "16",
  "record_fiscal_year": "2015",
  "record_fiscal_quarter": "1",
  "record_calendar_year": "2014",
  "record_calendar_quarter": "4",
  "record_calendar_month": "12",
  "record_calendar_day": "31",
}, {
  "record_date": "2013-12-31",
  "security_type_desc": "Total Public Debt Outstanding",
  "security_class_desc": "_",
  "debt_held_public_mil_amt": "12355426.8626055",
  "intragov_hold_mil_amt": "4996544.16464242",
  "total_mil_amt": "17351971.027248",
  "src_line_nbr": "15",
  "record_fiscal_year": "2014",
  "record_fiscal_quarter": "1",
  "record_calendar_year": "2013",
  "record_calendar_quarter": "4",
  "record_calendar_month": "12",
  "record_calendar_day": "31",
}, {
  "record_date": "2012-12-31",
  "security_type_desc": "Total Public Debt Outstanding",
  "security_class_desc": "_",
  "debt_held_public_mil_amt": "11581518.4672974",
  "intragov_hold_mil_amt": "4851212.55699793",
  "total_mil_amt": "16432730.0242953",
  "src_line_nbr": "15",
  "record_fiscal_year": "2013",
  "record_fiscal_quarter": "1",
  "record_calendar_year": "2012",
  "record_calendar_quarter": "4",
  "record_calendar_month": "12",
  "record_calendar_day": "31",
}];

export const mockInterestExpenseResponse = {
  "data": [{
    "expense_catg_desc": "INTEREST EXPENSE ON PUBLIC ISSUES",
    "expense_group_desc": "ACCRUED INTEREST EXPENSE",
    "expense_type_desc": "Treasury Notes",
    "fytd_expense_amt": "100000000.00",
    "month_expense_amt": "1000.00",
    "record_calendar_day": "31",
    "record_calendar_month": "05",
    "record_calendar_quarter": "2",
    "record_calendar_year": "2012",
    "record_date": "2012-05-31",
    "record_fiscal_quarter": "3",
    "record_fiscal_year": "2012",
    "src_line_nbr": "1"
  }]
}

export const mockDeficitTrendsData = {
  "data":[
    {
       "current_fytd_net_outly_amt":"-438898858122.71",
       "record_date":"2015-09-30",
       "record_calendar_month":"09",
       "record_fiscal_year":"2015"
    },
    {
       "current_fytd_net_outly_amt":"-587411769636.30",
       "record_date":"2016-09-30",
       "record_calendar_month":"09",
       "record_fiscal_year":"2016"
    },
    {
       "current_fytd_net_outly_amt":"-665711513062.26",
       "record_date":"2017-09-30",
       "record_calendar_month":"09",
       "record_fiscal_year":"2017"
    },
    {
       "current_fytd_net_outly_amt":"-778996251866.11",
       "record_date":"2018-09-30",
       "record_calendar_month":"09",
       "record_fiscal_year":"2018"
    },
    {
       "current_fytd_net_outly_amt":"-984388026331.38",
       "record_date":"2019-09-30",
       "record_calendar_month":"09",
       "record_fiscal_year":"2019"
    },
    {
       "current_fytd_net_outly_amt":"-3131917248888.30",
       "record_date":"2020-09-30",
       "record_calendar_month":"09",
       "record_fiscal_year":"2020"
    },
    {
       "current_fytd_net_outly_amt":"-2772178788289.42",
       "record_date":"2021-09-30",
       "record_calendar_month":"09",
       "record_fiscal_year":"2021"
    },
    {
       "current_fytd_net_outly_amt":"-1375388552955.00",
       "record_date":"2022-09-30",
       "record_calendar_month":"09",
       "record_fiscal_year":"2022"
    }
 ],
}

export const mockDeficitHeroData = {
    "data": [{
    "current_fytd_net_outly_amt": "-515067070149.23",
    "prior_fytd_net_outly_amt": "-2237949464925.20",
    "record_calendar_month": "06",
    "record_calendar_year": "2022",
    "record_date": "2022-06-30",
    "record_fiscal_year": "2022"
  },
  {
    "current_fytd_net_outly_amt":"-2772178788289.42",
    "prior_fytd_net_outly_amt":"-3131917245643.30",
    "record_date":"2021-09-30",
    "record_calendar_month":"09",
    "record_calendar_year":"2021",
    "record_fiscal_year":"2021"
  }]
}
export const mockDeficitHeroDataOct = {
  "data": [{
    "current_fytd_net_outly_amt": "-515067070149.23",
    "prior_fytd_net_outly_amt": "-2237949464925.20",
    "record_calendar_month": "10",
    "record_calendar_year": "2022",
    "record_date": "2022-10-30",
    "record_fiscal_year": "2022"
  },
    {
      "current_fytd_net_outly_amt":"-2772178788289.42",
      "prior_fytd_net_outly_amt":"-3131917245643.30",
      "record_date":"2021-10-30",
      "record_calendar_month":"10",
      "record_calendar_year":"2021",
      "record_fiscal_year":"2021"
    }]
}

export const mockSpendingHeroData = {
    "data": [{
    "current_fytd_net_outly_amt": "4515067070149.23",
    "prior_fytd_net_outly_amt": "2237949464925.20",
    "record_calendar_month": "06",
    "record_calendar_year": "2022",
    "record_date": "2022-06-30",
    "record_fiscal_year": "2022"
  },
  {
    "current_fytd_net_outly_amt":"-2772178788289.42",
    "prior_fytd_net_outly_amt":"-3131917245643.30",
    "record_date":"2021-09-30",
    "record_calendar_month":"09",
    "record_calendar_year":"2021",
    "record_fiscal_year":"2021"
  }]
}
export const mockSpendingHeroData_decrease = {
    "data": [{
    "prior_fytd_net_outly_amt": "4515067070149.23",
    "current_fytd_net_outly_amt": "2237949464925.20",
    "record_calendar_month": "06",
    "record_calendar_year": "2022",
    "record_date": "2022-06-30",
    "record_fiscal_year": "2022"
  },
  {
    "current_fytd_net_outly_amt":"-2772178788289.42",
    "prior_fytd_net_outly_amt":"-3131917245643.30",
    "record_date":"2021-09-30",
    "record_calendar_month":"09",
    "record_calendar_year":"2021",
    "record_fiscal_year":"2021"
  }]
}

export const mockRevenueHeroData = {
  "data": [{
    "current_fytd_net_rcpt_amt": "4104725332729.16",
    "prior_fytd_net_rcpt_amt": "3318077685879.47",
    "record_calendar_month": "06",
    "record_calendar_year": "2022",
    "record_date": "2022-06-30",
    "record_fiscal_year": "2022"
  }]
};
export const mockRevenueHeroData_decrease = {
  "data": [{
    "current_fytd_net_rcpt_amt": "4104725332729.16",
    "prior_fytd_net_rcpt_amt": "4318077685879.47",
    "record_calendar_month": "06",
    "record_calendar_year": "2022",
    "record_date": "2022-06-30",
    "record_fiscal_year": "2022"
  }]
};


export const mockDebtExpenseResponse = {
  "data": [{
    "current_fytd_net_outly_amt": "1000000000000.00",
    "prior_fytd_net_outly_amt": "4683745234438.17",
    "record_calendar_month": "05",
    "record_calendar_year": "2012",
    "record_date": "2012-05-31",
    "record_fiscal_year": "2012"
  }]
}

// default header values based on mock data above
export const mockInterestToDebtChartHeaderSummary = {
  'Interest': '1.57%',
  'Total Debt': '$29.62 T',
  'Fiscal Year': '2021'
};

export const mockFifthSectionValueMarkers = [
  '$10.26 T',
  '$4.74 T',
  '$22.64 T',
  '$6.27 T'
];

export const mockPublicDebtIncrease = '121%';
export const mockGovtDebtIncrease = '32%';

export const mockDebtBreakdownResponse = {
  data: mockDebtBreakdownData,
  links: {},
  meta: {
    count: mockDebtBreakdownData.length,
  }
};

export const mockInterestRatesResponse = {
  data: mockInterestRatesData,
  links: {},
  meta: {
    count: mockInterestRatesData.length,
  }
};

export const mockTotalDebtResponse = {
  data: mockTotalDebtData,
  links: {},
  meta: {
    count: mockTotalDebtData.length,
  }
};
export const mockBeaGDPData =
{
  "finalGDPData": [
    {
      "x": 2011,
      "actual": 22560300363991.676,
      "fiscalYear": "2015",
      "y": 22.56
    },
    {
      "x": 2012,
      "actual": 22560300363991.676,
      "fiscalYear": "2015",
      "y": 22.56
    },
    {
      "x": 2013,
      "actual": 22560300363991.676,
      "fiscalYear": "2015",
      "y": 22.56
    },
    {
      "x": 2014,
      "actual": 22560300363991.676,
      "fiscalYear": "2015",
      "y": 22.56
    },
    {
      "x": 2015,
      "actual": 22560300363991.676,
      "fiscalYear": "2015",
      "y": 22.56
    },
    {
      "x": 2016,
      "actual": 22788024981037.824,
      "fiscalYear": "2016",
      "y": 22.79
    },
    {
      "x": 2017,
      "actual": 23143540937585.84,
      "fiscalYear": "2017",
      "y": 23.14
    },
    {
      "x": 2018,
      "actual": 23870220416108.445,
      "fiscalYear": "2018",
      "y": 23.87
    },
    {
      "x": 2019,
      "actual": 24459543912704.13,
      "fiscalYear": "2019",
      "y": 24.46
    },
    {
      "x": 2020,
      "actual": 24016646434785.617,
      "fiscalYear": "2020",
      "y": 24.02
    },
    {
      "x": 2021,
      "actual": 24511981895738.4,
      "fiscalYear": "2021",
      "y": 24.51
    },
    {
      "x": 2022,
      "actual": 25000341500000,
      "fiscalYear": "2022",
      "y": 25
    }
  ],
  "gdpMinYear": 2015,
  "gdpMaxYear": 2022,
  "gdpMinAmount": 22.56,
  "gdpMaxAmount": 25,
  "gdpLastAmountActual": 25000341500000,
  "isGDPLoading": false
}

export const mockCpiDataset = {
  "1921": "17.6",
  "1922": "16.7",
  "1923": "17.0",
  "1924": "17.0",
  "1925": "17.5",
  "1926": "17.7",
  "1927": "17.6",
  "1928": "17.1",
  "1929": "17.1",
  "1930": "16.8",
  "1931": "15.1",
  "1932": "13.6",
  "1933": "12.7",
  "1934": "13.4",
  "1935": "13.7",
  "1936": "13.8",
  "1937": "14.4",
  "1938": "14.1",
  "1939": "13.8",
  "1940": "14.1",
  "1941": "14.7",
  "1942": "16.3",
  "1943": "17.5",
  "1944": "17.6",
  "1945": "18.1",
  "1946": "18.7",
  "1947": "22.0",
  "1948": "24.1",
  "1949": "23.9",
  "1950": "23.8",
  "1951": "25.9",
  "1952": "26.5",
  "1953": "26.8",
  "1954": "26.9",
  "1955": "26.7",
  "1956": "27.2",
  "1957": "28.1",
  "1958": "28.9",
  "1959": "29.1",
  "1960": "29.6",
  "1961": "29.8",
  "1962": "30.2",
  "1963": "30.6",
  "1964": "31.0",
  "1965": "31.6",
  "1966": "32.4",
  "1967": "33.3",
  "1968": "34.7",
  "1969": "36.6",
  "1970": "38.8",
  "1971": "40.6",
  "1972": "41.7",
  "1973": "44.2",
  "1974": "49.0",
  "1975": "53.6",
  "1976": "56.8",
  "1977": "61.4",
  "1978": "66.5",
  "1979": "74.6",
  "1980": "84.0",
  "1981": "93.2",
  "1982": "97.9",
  "1983": "100.7",
  "1984": "105.0",
  "1985": "108.3",
  "1986": "110.2",
  "1987": "115.0",
  "1988": "119.8",
  "1989": "125.0",
  "1990": "132.7",
  "1991": "137.2",
  "1992": "141.3",
  "1993": "145.1",
  "1994": "149.4",
  "1995": "153.2",
  "1996": "157.8",
  "1997": "161.2",
  "1998": "163.6",
  "1999": "167.9",
  "2000": "173.7",
  "2001": "178.3",
  "2002": "181.0",
  "2003": "185.2",
  "2004": "189.9",
  "2005": "198.8",
  "2006": "202.9",
  "2007": "208.490",
  "2008": "218.783",
  "2009": "215.969",
  "2010": "218.439",
  "2011": "226.889",
  "2012": "231.407",
  "2013": "234.149",
  "2014": "238.031",
  "2015": "237.945",
  "2016": "241.428",
  "2017": "246.819",
  "2018": "252.439",
  "2019": "256.759",
  "2020": "260.280",
  "2021": "274.310",
  "2022": "298.012"
};


export const mockCallOutData = {
  data: [
    {
      current_fytd_net_outly_amt: "3687622059038.44",
      record_date: "2015-09-30",
      record_fiscal_year: "2015",
    },
  ],
};

export const mockRevenueData = {
  data: [
    {
      current_fytd_net_rcpt_amt: 3248723200915.73,
      record_fiscal_year: "2015",
      record_date: "2015-09-30",
    },
    {
      current_fytd_net_rcpt_amt: 3266688370973.35,
      record_fiscal_year: "2016",
      record_date: "2016-09-30",
    },
    {
      current_fytd_net_rcpt_amt: 3314893904524.18,
      record_fiscal_year: "2017",
      record_date: "2017-09-30",
    },
    {
      current_fytd_net_rcpt_amt: 3328745244718.20,
      record_fiscal_year: "2018",
      record_date: "2018-09-30",
    },
    {
      current_fytd_net_rcpt_amt: 3462195610149.20,
      record_fiscal_year: "2019",
      record_date: "2019-09-30",
    },
    {
      current_fytd_net_rcpt_amt: 3419955005765.34,
      record_fiscal_year: "2020",
      record_date: "2020-09-30",
    },
    {
      current_fytd_net_rcpt_amt: 4045978858727.41,
      record_fiscal_year: "2021",
      record_date: "2021-09-30",
    },
    {
      current_fytd_net_rcpt_amt: 4896119043921.00,
      record_fiscal_year: "2022",
      record_date: "2022-09-30",
    },
  ],
};

export const mockUseStaticBeaGDP = {
  "allBeaGdp": {
    "nodes": [
      {
        "dataValue": "17,144,281",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2014Q1",
        "id": "T101052014Q1"
      },
      {
        "dataValue": "17,462,703",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2014Q2",
        "id": "T101052014Q2"
      },
      {
        "dataValue": "17,743,227",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2014Q3",
        "id": "T101052014Q3"
      },
      {
        "dataValue": "17,852,540",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2014Q4",
        "id": "T101052014Q4"
      },
      {
        "dataValue": "17,991,348",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2015Q1",
        "id": "T101052015Q1"
      },
      {
        "dataValue": "18,193,707",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2015Q2",
        "id": "T101052015Q2"
      },
      {
        "dataValue": "18,306,960",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2015Q3",
        "id": "T101052015Q3"
      },
      {
        "dataValue": "18,332,079",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2015Q4",
        "id": "T101052015Q4"
      },
      {
        "dataValue": "18,425,306",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2016Q1",
        "id": "T101052016Q1"
      },
      {
        "dataValue": "18,611,617",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2016Q2",
        "id": "T101052016Q2"
      },
      {
        "dataValue": "18,775,459",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2016Q3",
        "id": "T101052016Q3"
      },
      {
        "dataValue": "18,968,041",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2016Q4",
        "id": "T101052016Q4"
      },
      {
        "dataValue": "19,148,194",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2017Q1",
        "id": "T101052017Q1"
      },
      {
        "dataValue": "19,304,506",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2017Q2",
        "id": "T101052017Q2"
      },
      {
        "dataValue": "19,561,896",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2017Q3",
        "id": "T101052017Q3"
      },
      {
        "dataValue": "19,894,750",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2017Q4",
        "id": "T101052017Q4"
      },
      {
        "dataValue": "20,155,486",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2018Q1",
        "id": "T101052018Q1"
      },
      {
        "dataValue": "20,470,197",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2018Q2",
        "id": "T101052018Q2"
      },
      {
        "dataValue": "20,687,278",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2018Q3",
        "id": "T101052018Q3"
      },
      {
        "dataValue": "20,819,269",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2018Q4",
        "id": "T101052018Q4"
      },
      {
        "dataValue": "21,013,085",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2019Q1",
        "id": "T101052019Q1"
      },
      {
        "dataValue": "21,272,448",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2019Q2",
        "id": "T101052019Q2"
      },
      {
        "dataValue": "21,531,839",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2019Q3",
        "id": "T101052019Q3"
      },
      {
        "dataValue": "21,706,532",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2019Q4",
        "id": "T101052019Q4"
      },
      {
        "dataValue": "21,538,032",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2020Q1",
        "id": "T101052020Q1"
      },
      {
        "dataValue": "19,636,731",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2020Q2",
        "id": "T101052020Q2"
      },
      {
        "dataValue": "21,362,428",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2020Q3",
        "id": "T101052020Q3"
      },
      {
        "dataValue": "21,704,706",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2020Q4",
        "id": "T101052020Q4"
      },
      {
        "dataValue": "22,313,850",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2021Q1",
        "id": "T101052021Q1"
      },
      {
        "dataValue": "23,046,934",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2021Q2",
        "id": "T101052021Q2"
      },
      {
        "dataValue": "23,550,420",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2021Q3",
        "id": "T101052021Q3"
      },
      {
        "dataValue": "24,349,121",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2021Q4",
        "id": "T101052021Q4"
      },
      {
        "dataValue": "24,740,480",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2022Q1",
        "id": "T101052022Q1"
      },
      {
        "dataValue": "25,248,476",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2022Q2",
        "id": "T101052022Q2"
      },
      {
        "dataValue": "25,663,289",
        "lineDescription": "Gross domestic product",
        "timePeriod": "2022Q3",
        "id": "T101052022Q3"
      }
    ]
  }
}

export const mockTotalDebt100YData = {
  "data": [
    {
      "record_date": "2022-09-30",
      "debt_outstanding_amt": "30928911613306.73",
      "src_line_nbr": "1",
      "record_fiscal_year": "2022",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2022",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2021-09-30",
      "debt_outstanding_amt": "28428918570048.68",
      "src_line_nbr": "1",
      "record_fiscal_year": "2021",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2021",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2020-09-30",
      "debt_outstanding_amt": "26945391194615.15",
      "src_line_nbr": "1",
      "record_fiscal_year": "2020",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2020",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2019-09-30",
      "debt_outstanding_amt": "22719401753433.78",
      "src_line_nbr": "1",
      "record_fiscal_year": "2019",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2019",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2018-09-30",
      "debt_outstanding_amt": "21516058183180.23",
      "src_line_nbr": "1",
      "record_fiscal_year": "2018",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2018",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2017-09-30",
      "debt_outstanding_amt": "20244900016053.51",
      "src_line_nbr": "1",
      "record_fiscal_year": "2017",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2017",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2016-09-30",
      "debt_outstanding_amt": "19573444713936.79",
      "src_line_nbr": "1",
      "record_fiscal_year": "2016",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2016",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2015-09-30",
      "debt_outstanding_amt": "18150617666484.33",
      "src_line_nbr": "1",
      "record_fiscal_year": "2015",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2015",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2014-09-30",
      "debt_outstanding_amt": "17824071380733.82",
      "src_line_nbr": "1",
      "record_fiscal_year": "2014",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2014",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2013-09-30",
      "debt_outstanding_amt": "16738183526697.32",
      "src_line_nbr": "1",
      "record_fiscal_year": "2013",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2013",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2012-09-30",
      "debt_outstanding_amt": "16066241407385.89",
      "src_line_nbr": "1",
      "record_fiscal_year": "2012",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2012",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2011-09-30",
      "debt_outstanding_amt": "14790340328557.15",
      "src_line_nbr": "1",
      "record_fiscal_year": "2011",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2011",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2010-09-30",
      "debt_outstanding_amt": "13561623030891.79",
      "src_line_nbr": "1",
      "record_fiscal_year": "2010",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2010",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2009-09-30",
      "debt_outstanding_amt": "11909829003511.75",
      "src_line_nbr": "1",
      "record_fiscal_year": "2009",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2009",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2008-09-30",
      "debt_outstanding_amt": "10024724896912.49",
      "src_line_nbr": "1",
      "record_fiscal_year": "2008",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2008",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2007-09-30",
      "debt_outstanding_amt": "9007653372262.48",
      "src_line_nbr": "1",
      "record_fiscal_year": "2007",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2007",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2006-09-30",
      "debt_outstanding_amt": "8506973899215.23",
      "src_line_nbr": "1",
      "record_fiscal_year": "2006",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2006",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2005-09-30",
      "debt_outstanding_amt": "7932709661723.50",
      "src_line_nbr": "1",
      "record_fiscal_year": "2005",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2005",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2004-09-30",
      "debt_outstanding_amt": "7379052696330.32",
      "src_line_nbr": "1",
      "record_fiscal_year": "2004",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2004",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2003-09-30",
      "debt_outstanding_amt": "6783231062743.62",
      "src_line_nbr": "1",
      "record_fiscal_year": "2003",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2003",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2002-09-30",
      "debt_outstanding_amt": "6228235965597.16",
      "src_line_nbr": "1",
      "record_fiscal_year": "2002",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2002",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2001-09-30",
      "debt_outstanding_amt": "5807463412200.06",
      "src_line_nbr": "1",
      "record_fiscal_year": "2001",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2001",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "2000-09-30",
      "debt_outstanding_amt": "5674178209886.86",
      "src_line_nbr": "1",
      "record_fiscal_year": "2000",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2000",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1999-09-30",
      "debt_outstanding_amt": "5656270901615.43",
      "src_line_nbr": "1",
      "record_fiscal_year": "1999",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1999",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1998-09-30",
      "debt_outstanding_amt": "5526193008897.62",
      "src_line_nbr": "1",
      "record_fiscal_year": "1998",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1998",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1997-09-30",
      "debt_outstanding_amt": "5413146011397.34",
      "src_line_nbr": "1",
      "record_fiscal_year": "1997",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1997",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1996-09-30",
      "debt_outstanding_amt": "5224810939135.73",
      "src_line_nbr": "1",
      "record_fiscal_year": "1996",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1996",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1995-09-29",
      "debt_outstanding_amt": "4973982900709.39",
      "src_line_nbr": "1",
      "record_fiscal_year": "1995",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1995",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "29"
    },
    {
      "record_date": "1994-09-30",
      "debt_outstanding_amt": "4692749910013.32",
      "src_line_nbr": "1",
      "record_fiscal_year": "1994",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1994",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1993-09-30",
      "debt_outstanding_amt": "4411488883139.38",
      "src_line_nbr": "1",
      "record_fiscal_year": "1993",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1993",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1992-09-30",
      "debt_outstanding_amt": "4064620655521.66",
      "src_line_nbr": "1",
      "record_fiscal_year": "1992",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1992",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1991-09-30",
      "debt_outstanding_amt": "3665303351697.03",
      "src_line_nbr": "1",
      "record_fiscal_year": "1991",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1991",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1990-09-28",
      "debt_outstanding_amt": "3233313451777.25",
      "src_line_nbr": "1",
      "record_fiscal_year": "1990",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1990",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "28"
    },
    {
      "record_date": "1989-09-29",
      "debt_outstanding_amt": "2857430960187.32",
      "src_line_nbr": "1",
      "record_fiscal_year": "1989",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1989",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "29"
    },
    {
      "record_date": "1988-09-30",
      "debt_outstanding_amt": "2602337712041.16",
      "src_line_nbr": "1",
      "record_fiscal_year": "1988",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1988",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1987-09-30",
      "debt_outstanding_amt": "2350276890953.00",
      "src_line_nbr": "1",
      "record_fiscal_year": "1987",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1987",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1986-09-30",
      "debt_outstanding_amt": "2125302616658.42",
      "src_line_nbr": "1",
      "record_fiscal_year": "1986",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1986",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1985-09-30",
      "debt_outstanding_amt": "1823103000000.00",
      "src_line_nbr": "1",
      "record_fiscal_year": "1985",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1985",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1984-09-30",
      "debt_outstanding_amt": "1572266000000.00",
      "src_line_nbr": "1",
      "record_fiscal_year": "1984",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1984",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1983-09-30",
      "debt_outstanding_amt": "1377210000000.00",
      "src_line_nbr": "1",
      "record_fiscal_year": "1983",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1983",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1982-09-30",
      "debt_outstanding_amt": "1142034000000.00",
      "src_line_nbr": "1",
      "record_fiscal_year": "1982",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1982",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1981-09-30",
      "debt_outstanding_amt": "997855000000.00",
      "src_line_nbr": "1",
      "record_fiscal_year": "1981",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1981",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1980-09-30",
      "debt_outstanding_amt": "907701000000.00",
      "src_line_nbr": "1",
      "record_fiscal_year": "1980",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1980",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1979-09-30",
      "debt_outstanding_amt": "826519000000.00",
      "src_line_nbr": "1",
      "record_fiscal_year": "1979",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1979",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1978-09-30",
      "debt_outstanding_amt": "771544000000.00",
      "src_line_nbr": "1",
      "record_fiscal_year": "1978",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1978",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1977-09-30",
      "debt_outstanding_amt": "698840000000.00",
      "src_line_nbr": "1",
      "record_fiscal_year": "1977",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "1977",
      "record_calendar_quarter": "3",
      "record_calendar_month": "09",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1976-06-30",
      "debt_outstanding_amt": "620433000000.00",
      "src_line_nbr": "1",
      "record_fiscal_year": "1976",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1976",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1975-06-30",
      "debt_outstanding_amt": "533189000000.00",
      "src_line_nbr": "1",
      "record_fiscal_year": "1975",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1975",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1974-06-30",
      "debt_outstanding_amt": "475059815731.55",
      "src_line_nbr": "1",
      "record_fiscal_year": "1974",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1974",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1973-06-30",
      "debt_outstanding_amt": "458141605312.09",
      "src_line_nbr": "1",
      "record_fiscal_year": "1973",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1973",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1972-06-30",
      "debt_outstanding_amt": "427260460940.50",
      "src_line_nbr": "1",
      "record_fiscal_year": "1972",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1972",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1971-06-30",
      "debt_outstanding_amt": "398129744455.54",
      "src_line_nbr": "1",
      "record_fiscal_year": "1971",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1971",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1970-06-30",
      "debt_outstanding_amt": "370918706949.93",
      "src_line_nbr": "1",
      "record_fiscal_year": "1970",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1970",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1969-06-30",
      "debt_outstanding_amt": "353720253841.41",
      "src_line_nbr": "1",
      "record_fiscal_year": "1969",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1969",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1968-06-30",
      "debt_outstanding_amt": "347578406425.88",
      "src_line_nbr": "1",
      "record_fiscal_year": "1968",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1968",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1967-06-30",
      "debt_outstanding_amt": "326220937794.54",
      "src_line_nbr": "1",
      "record_fiscal_year": "1967",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1967",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1966-06-30",
      "debt_outstanding_amt": "319907087795.48",
      "src_line_nbr": "1",
      "record_fiscal_year": "1966",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1966",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1965-06-30",
      "debt_outstanding_amt": "317273898983.64",
      "src_line_nbr": "1",
      "record_fiscal_year": "1965",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1965",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1964-06-30",
      "debt_outstanding_amt": "311712899257.30",
      "src_line_nbr": "1",
      "record_fiscal_year": "1964",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1964",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1963-06-30",
      "debt_outstanding_amt": "305859632996.41",
      "src_line_nbr": "1",
      "record_fiscal_year": "1963",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1963",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1962-06-30",
      "debt_outstanding_amt": "298200822720.87",
      "src_line_nbr": "1",
      "record_fiscal_year": "1962",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1962",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1961-06-30",
      "debt_outstanding_amt": "288970938610.05",
      "src_line_nbr": "1",
      "record_fiscal_year": "1961",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1961",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1960-06-30",
      "debt_outstanding_amt": "286330760848.37",
      "src_line_nbr": "1",
      "record_fiscal_year": "1960",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1960",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1959-06-30",
      "debt_outstanding_amt": "284705907078.22",
      "src_line_nbr": "1",
      "record_fiscal_year": "1959",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1959",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1958-06-30",
      "debt_outstanding_amt": "276343217745.81",
      "src_line_nbr": "1",
      "record_fiscal_year": "1958",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1958",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1957-06-30",
      "debt_outstanding_amt": "270527171896.43",
      "src_line_nbr": "1",
      "record_fiscal_year": "1957",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1957",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1956-06-30",
      "debt_outstanding_amt": "272750813649.32",
      "src_line_nbr": "1",
      "record_fiscal_year": "1956",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1956",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1955-06-30",
      "debt_outstanding_amt": "274374222802.62",
      "src_line_nbr": "1",
      "record_fiscal_year": "1955",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1955",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1954-06-30",
      "debt_outstanding_amt": "271259599108.46",
      "src_line_nbr": "1",
      "record_fiscal_year": "1954",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1954",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1953-06-30",
      "debt_outstanding_amt": "266071061638.57",
      "src_line_nbr": "1",
      "record_fiscal_year": "1953",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1953",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1952-06-30",
      "debt_outstanding_amt": "259105178785.43",
      "src_line_nbr": "1",
      "record_fiscal_year": "1952",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1952",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1951-06-29",
      "debt_outstanding_amt": "255221976814.93",
      "src_line_nbr": "1",
      "record_fiscal_year": "1951",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1951",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "29"
    },
    {
      "record_date": "1950-06-30",
      "debt_outstanding_amt": "257357352351.04",
      "src_line_nbr": "1",
      "record_fiscal_year": "1950",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1950",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1949-06-30",
      "debt_outstanding_amt": "252770359860.33",
      "src_line_nbr": "1",
      "record_fiscal_year": "1949",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1949",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1948-06-30",
      "debt_outstanding_amt": "252292246512.99",
      "src_line_nbr": "1",
      "record_fiscal_year": "1948",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1948",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1947-06-30",
      "debt_outstanding_amt": "258286383108.67",
      "src_line_nbr": "1",
      "record_fiscal_year": "1947",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1947",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1946-06-28",
      "debt_outstanding_amt": "269422099173.26",
      "src_line_nbr": "1",
      "record_fiscal_year": "1946",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1946",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "28"
    },
    {
      "record_date": "1945-06-30",
      "debt_outstanding_amt": "258682187409.93",
      "src_line_nbr": "1",
      "record_fiscal_year": "1945",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1945",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1944-06-30",
      "debt_outstanding_amt": "201003387221.13",
      "src_line_nbr": "1",
      "record_fiscal_year": "1944",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1944",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1943-06-30",
      "debt_outstanding_amt": "136696090329.90",
      "src_line_nbr": "1",
      "record_fiscal_year": "1943",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1943",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1942-06-30",
      "debt_outstanding_amt": "72422445116.22",
      "src_line_nbr": "1",
      "record_fiscal_year": "1942",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1942",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1941-06-30",
      "debt_outstanding_amt": "48961443535.71",
      "src_line_nbr": "1",
      "record_fiscal_year": "1941",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1941",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1940-06-29",
      "debt_outstanding_amt": "42967531037.68",
      "src_line_nbr": "1",
      "record_fiscal_year": "1940",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1940",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "29"
    },
    {
      "record_date": "1939-06-30",
      "debt_outstanding_amt": "40439532411.11",
      "src_line_nbr": "1",
      "record_fiscal_year": "1939",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1939",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1938-06-30",
      "debt_outstanding_amt": "37164740315.45",
      "src_line_nbr": "1",
      "record_fiscal_year": "1938",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1938",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1937-06-30",
      "debt_outstanding_amt": "36424613732.29",
      "src_line_nbr": "1",
      "record_fiscal_year": "1937",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1937",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1936-06-30",
      "debt_outstanding_amt": "33778543493.73",
      "src_line_nbr": "1",
      "record_fiscal_year": "1936",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1936",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1935-06-29",
      "debt_outstanding_amt": "28700892624.53",
      "src_line_nbr": "1",
      "record_fiscal_year": "1935",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1935",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "29"
    },
    {
      "record_date": "1934-06-30",
      "debt_outstanding_amt": "27053141414.48",
      "src_line_nbr": "1",
      "record_fiscal_year": "1934",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1934",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1933-06-30",
      "debt_outstanding_amt": "22538672560.15",
      "src_line_nbr": "1",
      "record_fiscal_year": "1933",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1933",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1932-06-30",
      "debt_outstanding_amt": "19487002444.13",
      "src_line_nbr": "1",
      "record_fiscal_year": "1932",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1932",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1931-06-30",
      "debt_outstanding_amt": "16801281491.71",
      "src_line_nbr": "1",
      "record_fiscal_year": "1931",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1931",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1930-06-30",
      "debt_outstanding_amt": "16185309831.43",
      "src_line_nbr": "1",
      "record_fiscal_year": "1930",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1930",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1929-06-29",
      "debt_outstanding_amt": "16931088484.10",
      "src_line_nbr": "1",
      "record_fiscal_year": "1929",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1929",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "29"
    },
    {
      "record_date": "1928-06-30",
      "debt_outstanding_amt": "17604293201.43",
      "src_line_nbr": "1",
      "record_fiscal_year": "1928",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1928",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1927-06-30",
      "debt_outstanding_amt": "18511906931.85",
      "src_line_nbr": "1",
      "record_fiscal_year": "1927",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1927",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1926-06-30",
      "debt_outstanding_amt": "19643216315.19",
      "src_line_nbr": "1",
      "record_fiscal_year": "1926",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1926",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1925-06-30",
      "debt_outstanding_amt": "20516193887.90",
      "src_line_nbr": "1",
      "record_fiscal_year": "1925",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1925",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1924-06-30",
      "debt_outstanding_amt": "21250812989.49",
      "src_line_nbr": "1",
      "record_fiscal_year": "1924",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1924",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1923-06-30",
      "debt_outstanding_amt": "22349707365.36",
      "src_line_nbr": "1",
      "record_fiscal_year": "1923",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1923",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    },
    {
      "record_date": "1922-06-30",
      "debt_outstanding_amt": "22963381708.31",
      "src_line_nbr": "1",
      "record_fiscal_year": "1922",
      "record_fiscal_quarter": "3",
      "record_calendar_year": "1922",
      "record_calendar_quarter": "2",
      "record_calendar_month": "06",
      "record_calendar_day": "30"
    }
  ],
  "meta": {
    "count": 101,
    "labels": {
      "record_date": "Record Date",
      "debt_outstanding_amt": "Debt Outstanding Amount",
      "src_line_nbr": "Source Line Number",
      "record_fiscal_year": "Fiscal Year",
      "record_fiscal_quarter": "Fiscal Quarter Number",
      "record_calendar_year": "Calendar Year",
      "record_calendar_quarter": "Calendar Quarter Number",
      "record_calendar_month": "Calendar Month Number",
      "record_calendar_day": "Calendar Day Number"
    },
    "dataTypes": {
      "record_date": "DATE",
      "debt_outstanding_amt": "CURRENCY",
      "src_line_nbr": "NUMBER",
      "record_fiscal_year": "YEAR",
      "record_fiscal_quarter": "QUARTER",
      "record_calendar_year": "YEAR",
      "record_calendar_quarter": "QUARTER",
      "record_calendar_month": "MONTH",
      "record_calendar_day": "DAY"
    },
    "dataFormats": {
      "record_date": "YYYY-MM-DD",
      "debt_outstanding_amt": "$10.20",
      "src_line_nbr": "10.2",
      "record_fiscal_year": "YYYY",
      "record_fiscal_quarter": "Q",
      "record_calendar_year": "YYYY",
      "record_calendar_quarter": "Q",
      "record_calendar_month": "MM",
      "record_calendar_day": "DD"
    },
    "total-count": 234,
    "total-pages": 3
  },
  "links": {
    "self": "&page%5Bnumber%5D=1&page%5Bsize%5D=101",
    "first": "&page%5Bnumber%5D=1&page%5Bsize%5D=101",
    "prev": null,
    "next": "&page%5Bnumber%5D=2&page%5Bsize%5D=101",
    "last": "&page%5Bnumber%5D=3&page%5Bsize%5D=101"
  }
}
