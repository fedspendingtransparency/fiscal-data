import ApiRequest from '../../../helpers/api-request';
import {
  debtRequest,
  deficitRequest,
  revenueCategoryRequest,
  revenueRequest,
  spendingCategoryRequest,
  spendingRequest,
} from './afg-overview-helpers';

const mockRevenueChartData = {
  data: [
    {
      current_fytd_net_rcpt_amt: '22379494649.20',
      record_calendar_month: '06',
      record_calendar_year: '2015',
      record_date: '2015-06-30',
      record_fiscal_year: '2015',
    },
    {
      current_fytd_net_rcpt_amt: '22379494649.20',
      record_calendar_month: '10',
      record_calendar_year: '2014',
      record_date: '2014-06-30',
      record_fiscal_year: '2015',
    },
    {
      current_fytd_net_rcpt_amt: '22379494649.20',
      record_calendar_month: '09',
      record_calendar_year: '2014',
      record_date: '2014-06-30',
      record_fiscal_year: '2014',
    },
    {
      current_fytd_net_rcpt_amt: '22379494649.20',
      record_calendar_month: '06',
      record_calendar_year: '2009',
      record_date: '2009-06-30',
      record_fiscal_year: '2009',
    },
  ],
};

export const mockSpendingChartData = {
  data: [
    {
      record_fiscal_year: '2019',
      record_date: '2019-11-15',
      record_calender_month: '11',
      current_fytd_net_outly_amt: '11000000000000',
    },
    {
      record_fiscal_year: '2017',
      record_date: '2017-11-15',
      record_calender_month: '11',
      current_fytd_net_outly_amt: '11000000030000',
    },
    {
      record_fiscal_year: '2020',
      record_date: '2020-11-15',
      record_calender_month: '11',
      current_fytd_net_outly_amt: '11000000010000',
    },
  ],
};

export const mockEndpointResponseMap = [
  {
    // revenueEndpointUrl
    matcher: (url: string): boolean => url === new ApiRequest(revenueRequest).getUrl(),
    jsonResponse: {
      data: [
        {
          current_fytd_net_rcpt_amt: '4408451733324.00',
          record_fiscal_year: '2022',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => {
      return url.includes('filter=line_code_nbr:eq:830');
    },
    jsonResponse: mockRevenueChartData,
  },
  {
    matcher: (url: string): boolean => {
      return url.includes('mts_table_5?filter=line_code_nbr:eq:5691');
    },
    jsonResponse: mockSpendingChartData,
  },
  {
    // debt mts
    matcher: (url: string): boolean => url.includes('v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5694&sort=-record_date&page[size]=1'),
    jsonResponse: {
      data: [
        {
          record_date: '2022-09-30',
          current_month_net_outly_amt: '-429673478961.84',
          current_fytd_net_outly_amt: '-1375388552955.00',
          prior_fytd_net_outly_amt: '-2775574881310.02',
          record_fiscal_year: '2022',
          record_fiscal_quarter: '4',
          record_calendar_year: '2022',
          record_calendar_quarter: '3',
          record_calendar_month: '09',
          record_calendar_day: '30',
        },
      ],
    },
  },
  {
    // debt mspd
    matcher: (url: string): boolean => url.includes('v1/debt/mspd/mspd_table_1?filter=security_type_desc:eq:Total%20Public%20Debt%20Outstanding'),
    jsonResponse: {
      data: [
        {
          record_date: '2022-09-30',
          total_mil_amt: '30928911.5870284',
          record_fiscal_year: '2022',
          record_fiscal_quarter: '4',
          record_calendar_year: '2022',
          record_calendar_quarter: '3',
          record_calendar_month: '09',
          record_calendar_day: '30',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => url === new ApiRequest(spendingRequest).getUrl(),
    jsonResponse: {
      data: [
        {
          current_fytd_net_outly_amt: '5354166807317.16',
          record_calendar_month: '09',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => url === new ApiRequest(deficitRequest).getUrl(),
    jsonResponse: {
      data: [
        {
          current_fytd_net_outly_amt: '-945715073993.16',
          record_calendar_month: '09',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => url === new ApiRequest(debtRequest).getUrl(),
    jsonResponse: {
      data: [
        {
          tot_pub_debt_out_amt: '30902024272230.49',
          record_calendar_month: '09',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => {
      const priorRevenueRequest = new ApiRequest(revenueRequest).forEndOfFiscalYear('2021');
      return url === priorRevenueRequest.getUrl();
    },
    jsonResponse: {
      data: [
        {
          current_fytd_net_rcpt_amt: '4045978858727.41',
          record_calendar_month: '09',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => {
      const priorRevenueCategoryRequest = new ApiRequest(revenueCategoryRequest).forEndOfFiscalYear('2021');
      return url === priorRevenueCategoryRequest.getUrl();
    },
    jsonResponse: {
      data: [
        {
          classification_desc: 'Individual Income Taxes',
          record_calendar_month: '09',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => {
      const priorSpendingRequest = new ApiRequest(spendingRequest).forEndOfFiscalYear('2021');
      return url === priorSpendingRequest.getUrl();
    },
    jsonResponse: {
      data: [
        {
          current_fytd_net_outly_amt: '6818157647016.83',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => {
      const priorSpendingCategoryRequest = new ApiRequest(spendingCategoryRequest).forEndOfFiscalYear('2021');
      return url === priorSpendingCategoryRequest.getUrl();
    },
    jsonResponse: {
      data: [
        {
          classification_desc: 'Income Security',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => {
      const priorDeficitRequest = new ApiRequest(deficitRequest).forEndOfFiscalYear('2021');
      return url === priorDeficitRequest.getUrl();
    },
    jsonResponse: {
      data: [
        {
          current_fytd_net_outly_amt: '-2772178788289.42',
          prior_fytd_net_outly_amt: '-3131917245643.30',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => {
      const priorDebtRequest = new ApiRequest(debtRequest).forEndOfFiscalYear('2021');
      return url === priorDebtRequest.getUrl();
    },
    jsonResponse: {
      data: [
        {
          tot_pub_debt_out_amt: '28428918570048.68',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => {
      const priorPriorDebtRequest = new ApiRequest(debtRequest).forEndOfFiscalYear('2020');
      return url === priorPriorDebtRequest.getUrl();
    },
    jsonResponse: {
      data: [
        {
          tot_pub_debt_out_amt: '26945391194615.15',
        },
      ],
    },
  },
];

export const mockEndpointResponseMapAltDates = [
  {
    // revenueEndpointUrl
    matcher: (url: string): boolean => url === new ApiRequest(revenueRequest).getUrl(),
    jsonResponse: {
      data: [
        {
          current_fytd_net_rcpt_amt: '4408451733324.00',
          record_fiscal_year: '2022',
        },
      ],
    },
  },

  {
    matcher: (url: string): boolean => {
      return url.includes('filter=line_code_nbr:eq:830');
    },
    jsonResponse: mockRevenueChartData,
  },
  {
    matcher: (url: string): boolean => {
      return url.includes('mts_table_5?filter=line_code_nbr:eq:5691');
    },
    jsonResponse: mockSpendingChartData,
  },
  {
    // debt mts
    matcher: (url: string): boolean => url.includes('v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5694&sort=-record_date&page[size]=1'),
    jsonResponse: {
      data: [
        {
          record_date: '2022-11-30',
          current_month_net_outly_amt: '-429673478961.84',
          current_fytd_net_outly_amt: '-1375388552955.00',
          prior_fytd_net_outly_amt: '-2775574881310.02',
          record_fiscal_year: '2022',
          record_fiscal_quarter: '4',
          record_calendar_year: '2022',
          record_calendar_quarter: '3',
          record_calendar_month: '11',
          record_calendar_day: '30',
        },
      ],
    },
  },
  {
    // debt mspd
    matcher: (url: string): boolean => url.includes('v1/debt/mspd/mspd_table_1?filter=security_type_desc:eq:Total%20Public%20Debt%20Outstanding'),
    jsonResponse: {
      data: [
        {
          record_date: '2022-11-30',
          total_mil_amt: '30928911.5870284',
          record_fiscal_year: '2022',
          record_fiscal_quarter: '4',
          record_calendar_year: '2022',
          record_calendar_quarter: '3',
          record_calendar_month: '11',
          record_calendar_day: '30',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => url === new ApiRequest(spendingRequest).getUrl(),
    jsonResponse: {
      data: [
        {
          current_fytd_net_outly_amt: '5354166807317.16',
          record_calendar_month: '11',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => url === new ApiRequest(deficitRequest).getUrl(),
    jsonResponse: {
      data: [
        {
          current_fytd_net_outly_amt: '-945715073993.16',
          record_calendar_month: '11',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => url === new ApiRequest(debtRequest).getUrl(),
    jsonResponse: {
      data: [
        {
          tot_pub_debt_out_amt: '30902024272230.49',
          record_calendar_month: '11',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => {
      const priorRevenueRequest = new ApiRequest(revenueRequest).forEndOfFiscalYear('2021');
      return url === priorRevenueRequest.getUrl();
    },
    jsonResponse: {
      data: [
        {
          current_fytd_net_rcpt_amt: '4045978858727.41',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => {
      const priorRevenueCategoryRequest = new ApiRequest(revenueCategoryRequest).forEndOfFiscalYear('2021');
      return url === priorRevenueCategoryRequest.getUrl();
    },
    jsonResponse: {
      data: [
        {
          classification_desc: 'Individual Income Taxes',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => {
      const priorSpendingRequest = new ApiRequest(spendingRequest).forEndOfFiscalYear('2021');
      return url === priorSpendingRequest.getUrl();
    },
    jsonResponse: {
      data: [
        {
          current_fytd_net_outly_amt: '6818157647016.83',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => {
      const priorSpendingCategoryRequest = new ApiRequest(spendingCategoryRequest).forEndOfFiscalYear('2021');
      return url === priorSpendingCategoryRequest.getUrl();
    },
    jsonResponse: {
      data: [
        {
          classification_desc: 'Income Security',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => {
      const priorDeficitRequest = new ApiRequest(deficitRequest).forEndOfFiscalYear('2021');
      return url === priorDeficitRequest.getUrl();
    },
    jsonResponse: {
      data: [
        {
          current_fytd_net_outly_amt: '-2772178788289.42',
          prior_fytd_net_outly_amt: '-3131917245643.30',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => {
      const priorDebtRequest = new ApiRequest(debtRequest).forEndOfFiscalYear('2021');
      return url === priorDebtRequest.getUrl();
    },
    jsonResponse: {
      data: [
        {
          tot_pub_debt_out_amt: '28428918570048.68',
        },
      ],
    },
  },
  {
    matcher: (url: string): boolean => {
      const priorPriorDebtRequest = new ApiRequest(debtRequest).forEndOfFiscalYear('2020');
      return url === priorPriorDebtRequest.getUrl();
    },
    jsonResponse: {
      data: [
        {
          tot_pub_debt_out_amt: '26945391194615.15',
        },
      ],
    },
  },
];
