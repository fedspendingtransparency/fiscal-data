import ApiRequest from "../../helpers/api-request"

export const revenueRequest =
  {
    endpointPath: 'v1/accounting/mts/mts_table_4',
    fields: 'current_fytd_net_rcpt_amt,prior_fytd_net_rcpt_amt,' +
      'record_calendar_month,record_calendar_year,record_fiscal_year,record_date',
    filter: 'line_code_nbr:eq:830'
  };

export const revenueCategoryRequest =
  {
    endpointPath: 'v1/accounting/mts/mts_table_9',
    fields: 'classification_desc,record_date,current_fytd_rcpt_outly_amt',
    filter: 'record_type_cd:eq:RSG,current_fytd_rcpt_outly_amt:gt:0',
    sort: '-current_fytd_rcpt_outly_amt'
  };

export const spendingRequest =
  {
    endpointPath: 'v1/accounting/mts/mts_table_5',
    fields: 'current_fytd_net_outly_amt,prior_fytd_net_outly_amt,record_date,' +
      'record_calendar_month,record_calendar_year,record_fiscal_year',
    filter: 'line_code_nbr:eq:5691'
  };

export const spendingCategoryRequest =
  {
    endpointPath: 'v1/accounting/mts/mts_table_9',
    fields: 'classification_desc,record_date,current_fytd_rcpt_outly_amt',
    filter: 'record_type_cd:eq:F,current_fytd_rcpt_outly_amt:gt:0',
    sort: '-current_fytd_rcpt_outly_amt'
  };

export const deficitRequest =
  {
    endpointPath: 'v1/accounting/mts/mts_table_5',
    fields: 'current_fytd_net_outly_amt,prior_fytd_net_outly_amt,record_date,' +
      'record_calendar_month,record_calendar_year,record_fiscal_year',
    filter: 'line_code_nbr:eq:5694'
  };

export const debtRequest =
  {
    endpointPath: 'v2/accounting/od/debt_to_penny'
  };

export const mockEndpointResponseMap = [
  {
    // revenueEndpointUrl
    matcher: (url: string): boolean => url === new ApiRequest(revenueRequest).getUrl(),
    jsonResponse: {
      "data": [{
        "current_fytd_net_rcpt_amt": "4408451733324.00",
        "record_fiscal_year": "2022"
      }]
    }
  },
  {

    matcher: (url: string): boolean => url === new ApiRequest(spendingRequest).getUrl(),
    jsonResponse: {
      "data": [{
        "current_fytd_net_outly_amt": "5354166807317.16"
      }]
    }
  },
  {
    matcher: (url: string): boolean => url === new ApiRequest(deficitRequest).getUrl(),
    jsonResponse: {
      "data": [{
        "current_fytd_net_outly_amt": "-945715073993.16"
      }]
    }
  },
  {
    matcher: (url: string): boolean => url === new ApiRequest(debtRequest).getUrl(),
    jsonResponse: {
      "data": [{
        "tot_pub_debt_out_amt": "30902024272230.49"
      }]
    }
  },
  {
    matcher: (url: string): boolean => {
      const priorRevenueRequest = new ApiRequest(revenueRequest).forEndOfFiscalYear('2021');
      return url === priorRevenueRequest.getUrl();
    },
    jsonResponse: {
      "data": [{
        "current_fytd_net_rcpt_amt": "4045978858727.41"
      }]
    }
  },
  {
    matcher: (url: string): boolean => {
      const priorRevenueCategoryRequest = new ApiRequest(revenueCategoryRequest)
        .forEndOfFiscalYear('2021');
      return url === priorRevenueCategoryRequest.getUrl();
    },
    jsonResponse: {
      "data": [{
        "classification_desc": "Individual Income Taxes"
      }]
    }
  },
  {
    matcher: (url: string): boolean => {
      const priorSpendingRequest = new ApiRequest(spendingRequest).forEndOfFiscalYear('2021');
      return url === priorSpendingRequest.getUrl();
    },
    jsonResponse: {
      "data": [{
        "current_fytd_net_outly_amt": "6818157647016.83"
      }]
    }
  },
  {
    matcher: (url: string): boolean => {
      const priorSpendingCategoryRequest = new ApiRequest(spendingCategoryRequest)
        .forEndOfFiscalYear('2021');
      return url === priorSpendingCategoryRequest.getUrl();
    },
    jsonResponse: {
      "data": [{
        "classification_desc": "Income Security"
      }]
    }
  },
  {
    matcher: (url: string): boolean => {
      const priorDeficitRequest = new ApiRequest(deficitRequest).forEndOfFiscalYear('2021');
      return url === priorDeficitRequest.getUrl();
    },
    jsonResponse: {
      "data": [{
        "current_fytd_net_outly_amt": "-2772178788289.42",
        "prior_fytd_net_outly_amt": "-3131917245643.30"
      }]
    }
  },
  {
    matcher: (url: string): boolean => {
      const priorDebtRequest = new ApiRequest(debtRequest).forEndOfFiscalYear('2021');
      return url === priorDebtRequest.getUrl();
    },
    jsonResponse: {
      "data": [{
        "tot_pub_debt_out_amt": "28428918570048.68"
      }]
    }
  },
  {
    matcher: (url: string): boolean => {
      const priorPriorDebtRequest = new ApiRequest(debtRequest).forEndOfFiscalYear('2020');
      return url === priorPriorDebtRequest.getUrl();
    },
    jsonResponse: {
      "data": [{
        "tot_pub_debt_out_amt": "26945391194615.15"
      }]
    }
  }
];
