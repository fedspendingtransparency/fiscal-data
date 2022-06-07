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

const mockFifthSectionData =
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

export const mockFifthSectionValueMarkers = [
  '$10.3 T',
  '$4.7 T',
  '$22.6 T',
  '$6.3 T'
];

export const mockPublicDebtIncrease = '121%';
export const mockGovtDebtIncrease = '32%';

export const mockFifthSectionResponse = {
  data: mockFifthSectionData,
  links: {},
  meta: {
    count: mockFifthSectionData.length,
  }
};

export const mockCPIResponse = {
  Results: {
    series: [{
      data: [{
        value: "200"
      }]
    }]
  }
}
