import { API_BASE_URL } from "gatsby-env-variables";
import * as util from '../../utils/api-utils';

const apiPrefix = `${API_BASE_URL}/services/api/fiscal_service/`;

const mockData = {
  endpoint: '/test_endpoint',
  filters: [{
    "key": "security_desc",
    "operator": "eq",
    "value": "Total%20Interest-bearing%20Debt"
  }, {
    "key": "security_type_desc",
    "operator": "in",
    "value": "Banana,Orange,CherryPie"
  }, {
    "key": "reporting_date",
    'operator': 'between',
    'range': {
      'high': {
        'value': '2020-05-11',
        'inclusive': true
      },
      'low': {
        'value': '2019-05-11',
        'inclusive': true
      }
    }
  }, {
    "key": "record_date",
    "operator": 'mostRecentDatePeriod',
    "unit": 'MONTH',
    "amount": 7
  }, {
    "key": "secondary_date",
    "operator": 'mostRecentDatePeriod',
    "unit": 'YEAR',
    "amount": 5
  }, {
    "key": "tertiary_date",
    "operator": 'mostRecentDatePeriod',
    "unit": 'DAY',
    "amount": 90
  }],
  fields: ["reporting_date", "avg_interest_rate_amt"],
  limit: -1,
  dateField: "reporting_date",
};

describe('API Utility', () => {

  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
  });

  it('attempts to fetch data correct number of times - SUCCESS', async () => {
    const url = 'test/url';
    const num = 3;
    let error;

    try {
      await util.fetch_retry(url, num);
    } catch (err) {
      error = err;
    }

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(url);
    expect(error).toBeUndefined();
  });

  it('attempts to fetch data correct number of times - FAILURE', async () => {
    const url = 'test/url';
    const num = 3;
    const error = {message: 'error'};
    let result;

    global.fetch = jest.fn(() => Promise.reject(error));

    try {
      result = await util.fetch_retry(url, num);
    } catch (err) {
      expect(err).toBe(error);
    }

    expect(global.fetch).toHaveBeenCalledTimes(num);
  });

  it('correctly forms the full url', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({data: []}) }));

    const filters = [{ "key": "someField", "operator": "eq", "value": "someValue"}];
    const filterString = 'filter=someField:eq:someValue';
    const formedUrl = `${apiPrefix}${mockData.endpoint}?format=json&${filterString}&fields=${mockData.fields.join()},${mockData.dateField}&sort=-${mockData.dateField}&page[size]=${mockData.limit}`;

    await util.fetchHighlights(mockData.endpoint, filters, mockData.fields, mockData.dateField, mockData.limit);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(formedUrl);
  });

  it("serializes filters correctly", () => {
    jest.spyOn(global.Date, 'now').mockImplementation(() => {
      return new Date(new Date(2021, 7, 30, 12).valueOf());  // don't specify a timezone so test will work in any locale
    });
    expect(util.serializeFilters(mockData.filters))
      .toStrictEqual('security_desc:eq:Total%20Interest-bearing%20Debt,security_type_desc:in:(Banana,Orange,CherryPie),' +
        'reporting_date:gte:2019-05-11,reporting_date:lte:2020-05-11,' +
        'record_date:gte:2021-01-30,secondary_date:gte:2016-08-30,tertiary_date:gte:2021-06-01');
  });

});
