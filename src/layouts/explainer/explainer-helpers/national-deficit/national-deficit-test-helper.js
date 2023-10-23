import { mockDeficitHeroData } from '../../explainer-test-helper';

const mockMtsDeficitData_decrease = [
  {
    current_fytd_net_outly_amt: '2750000000000',
    prior_fytd_net_outly_amt: '4000000000000',
    record_calendar_month: '09',
    record_date: '2021-09-30',
    record_fiscal_year: '2021',
  },
];

const mockMtsDeficitData_increase = [
  {
    current_fytd_net_outly_amt: '2750000000000',
    prior_fytd_net_outly_amt: '1000000000000',
    record_calendar_month: '09',
    record_date: '2021-09-30',
    record_fiscal_year: '2021',
  },
];

const mockMtsDeficitData_noChange = [
  {
    current_fytd_net_outly_amt: '2750000000000',
    prior_fytd_net_outly_amt: '2750000000000',
    record_calendar_month: '09',
    record_date: '2021-09-30',
    record_fiscal_year: '2021',
  },
];

const mockMtsRevenueData = [
  {
    current_fytd_net_rcpt_amt: '4220000000000',
    record_date: '2021-09-30',
    record_fiscal_year: '2021',
    record_calendar_month: '09',
  },
];

const mockMtsSpendingData = [
  {
    current_fytd_net_outly_amt: '6970000000000',
    record_calendar_month: '09',
    record_date: '2021-09-30',
    record_fiscal_year: '2021',
  },
];

const mockMtsSpendingData_surplus = [
  {
    current_fytd_net_outly_amt: '2970000000000',
    record_calendar_month: '09',
    record_date: '2021-09-30',
    record_fiscal_year: '2021',
  },
];

const mockMtsDeficitResponse = {
  data: mockMtsDeficitData_decrease,
  links: {},
  meta: {
    count: mockMtsDeficitData_decrease.length,
  },
};

const mockMtsDeficitResponse_increase = {
  data: mockMtsDeficitData_increase,
  links: {},
  meta: {
    count: mockMtsDeficitData_increase.length,
  },
};

const mockMtsDeficitResponse_noChange = {
  data: mockMtsDeficitData_noChange,
  links: {},
  meta: {
    count: mockMtsDeficitData_noChange.length,
  },
};

const mockMtsRevenueResponse = {
  data: mockMtsRevenueData,
  links: {},
  meta: {
    count: mockMtsRevenueData.length,
  },
};

const mockMtsSpendingResponse = {
  data: mockMtsSpendingData,
  links: {},
  meta: {
    count: mockMtsSpendingData.length,
  },
};
const mockMtsSpendingResponse_surplus = {
  data: mockMtsSpendingData_surplus,
  links: {},
  meta: {
    count: mockMtsSpendingData_surplus.length,
  },
};

export const mockDeficitComparisonChartMarkers = ['$2.75 T', '$4.22 T', '$6.97 T', 'Deficit', 'Revenue', 'Spending'];

export const mockCalloutValues = ['$2.75 trillion', '$4.22 trillion', '$6.97 trillion'];

const understandingDeficit_RevenueSpendingMatchers = [
  {
    matcher: url => {
      return url.includes('filter=line_code_nbr:eq:830');
    },
    jsonResponse: mockMtsRevenueResponse,
  },
  {
    matcher: url => {
      return url.includes('filter=line_code_nbr:eq:5691');
    },
    jsonResponse: mockMtsSpendingResponse,
  },
];

export const understandingDeficitMatchers = [
  {
    matcher: url => {
      return url.includes('filter=line_code_nbr:eq:5694') && url.includes('page[size]=13');
    },
    jsonResponse: mockDeficitHeroData,
  },
  {
    matcher: url => {
      return url.includes('filter=line_code_nbr:eq:5694');
    },
    jsonResponse: mockMtsDeficitResponse,
  },
  ...understandingDeficit_RevenueSpendingMatchers,
];

export const understandingDeficitMatchers_increase = [
  {
    matcher: url => {
      return url.includes('filter=line_code_nbr:eq:5694');
    },
    jsonResponse: mockMtsDeficitResponse_increase,
  },
  ...understandingDeficit_RevenueSpendingMatchers,
];

export const understandingDeficitMatchers_noChange = [
  {
    matcher: url => {
      return url.includes('filter=line_code_nbr:eq:5694');
    },
    jsonResponse: mockMtsDeficitResponse_noChange,
  },
  ...understandingDeficit_RevenueSpendingMatchers,
];

export const afgOverviewDeficitChart_surplus = [
  {
    matcher: url => {
      return url.includes('filter=line_code_nbr:eq:830');
    },
    jsonResponse: mockMtsRevenueResponse,
  },
  {
    matcher: url => {
      return url.includes('filter=line_code_nbr:eq:5691');
    },
    jsonResponse: mockMtsSpendingResponse_surplus,
  },
  {
    matcher: url => {
      return url.includes('filter=line_code_nbr:eq:5694');
    },
    jsonResponse: mockMtsDeficitResponse_noChange,
  },
];
