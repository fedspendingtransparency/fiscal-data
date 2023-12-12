import { isOtherDataUpdated } from './useBeaGDP-helper';
import fetchMock from 'fetch-mock';
import { apiPrefix } from '../../utils/api-utils';
// in:      9/30/2020
// not in:  9/30/2019
const mockMtsSeptemberData = {
  data: [
    {
      record_calendar_month: '09',
      record_calendar_year: '2020',
      record_date: '2020-09-30',
      record_fiscal_year: '2020',
    },
  ],
};

const mockMtsAugustData = {
  data: [
    {
      record_calendar_month: '08',
      record_calendar_year: '2020',
      record_date: '2020-08-31',
      record_fiscal_year: '2020',
    },
  ],
};

// in:      9/30/2020
// not in:  9/30/2019
const mockDebtOutstandingCurrentData = {
  data: [
    {
      record_calendar_month: '09',
      record_calendar_year: '2020',
      record_date: '2020-09-30',
      record_fiscal_year: '2020',
    },
  ],
};

const mockDebtOutstandingNotCurrentData = {
  data: [
    {
      record_calendar_month: '09',
      record_calendar_year: '2019',
      record_date: '2019-09-30',
      record_fiscal_year: '2019',
    },
  ],
};

const mts5 = apiPrefix + '/v1/accounting/mts/mts_table_5?sort=-record_date';
const mts4 = apiPrefix + '/v1/accounting/mts/mts_table_4?sort=-record_date';
const debtOutstanding = apiPrefix + 'v2/accounting/od/debt_outstanding?sort=-record_date';

fetchMock.get(`begin:${apiPrefix}${mts4}`, mockMtsSeptemberData, { overwriteRoutes: true }, { repeat: 1 });

describe('isOtherDataUpdated', () => {
  it('will return true when debtOutstanding flagged and in with 2020 data as the most recent', () => {
    fetchMock.get(`begin:${apiPrefix}${debtOutstanding}`, mockDebtOutstandingCurrentData, { overwriteRoutes: true }, { repeat: 1 });

    const result = isOtherDataUpdated('debtOutstanding', 2020);
    expect(result).toEqual(true);
  });

  it('will return false when debtOutstanding flagged and in with 2019 data as the most recent', () => {
    fetchMock.get(`begin:${apiPrefix}${debtOutstanding}`, mockDebtOutstandingNotCurrentData, { overwriteRoutes: true }, { repeat: 1 });

    const result = isOtherDataUpdated('debtOutstanding', 2020);
    expect(result).toEqual(false);
  });

  it('will return true when mts5 flagged and in with September 2020 data as the most recent', () => {
    fetchMock.get(`begin:${apiPrefix}${mts5}`, mockMtsSeptemberData, { overwriteRoutes: true }, { repeat: 1 });

    const result = isOtherDataUpdated('mts5', 2020);
    expect(result).toEqual(true);
  });

  it('will return false when mts5 flagged and in with August 2019 data as the most recent', () => {
    fetchMock.get(`begin:${apiPrefix}${mts5}`, mockMtsAugustData, { overwriteRoutes: true }, { repeat: 1 });

    const result = isOtherDataUpdated('mts5', 2020);
    expect(result).toEqual(false);
  });

  it('will return true when mts4 flagged and in with September 2020 data as the most recent', () => {
    fetchMock.get(`begin:${apiPrefix}${mts5}`, mockMtsSeptemberData, { overwriteRoutes: true }, { repeat: 1 });

    const result = isOtherDataUpdated('mts4', 2020);
    expect(result).toEqual(true);
  });

  it('will return false when mts4 flagged and in with August 2019 data as the most recent', () => {
    fetchMock.get(`begin:${apiPrefix}${mts5}`, mockMtsAugustData, { overwriteRoutes: true }, { repeat: 1 });

    const result = isOtherDataUpdated('mts4', 2020);
    expect(result).toEqual(false);
  });
});
