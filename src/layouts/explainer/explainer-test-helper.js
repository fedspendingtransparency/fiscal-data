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
  "2015": "237.945",
  "2016": "241.428",
  "2017": "246.819",
  "2018": "252.439",
  "2019": "256.759",
  "2020": "260.280",
  "2021": "274.310",
  "2022": "296.808",
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
