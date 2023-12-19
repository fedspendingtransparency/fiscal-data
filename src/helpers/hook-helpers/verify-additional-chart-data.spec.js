import { useVerifyAdditionalChartData } from './use-verify-additional-chart-data';
import fetchMock from 'fetch-mock';

const mts5 = 'https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?sort=-record_date';
const mts4 = 'https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_4?sort=-record_date';
const debtOutstanding = 'https://www.transparency.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_outstanding?sort=-record_date';

describe('verifyAdditionalChartData return true', () => {
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
  beforeAll(() => {
    fetchMock.get(`${debtOutstanding}`, mockDebtOutstandingCurrentData, { overwriteRoutes: true }, { repeat: 0 });
    fetchMock.get(`${mts4}`, mockMtsSeptemberData, { overwriteRoutes: true }, { repeat: 0 });
    fetchMock.get(`${mts5}`, mockMtsSeptemberData, { overwriteRoutes: true }, { repeat: 0 });
  });

  it('will return true when debtOutstanding flagged and in with 2020 data as the most recent', () => {
    const result = useVerifyAdditionalChartData('debtOutstanding', 2020);
    expect(result).toEqual(true);
  });

  it('will return true when mts5 flagged and in with September 2020 data as the most recent', () => {
    const result = useVerifyAdditionalChartData('mts5', 2020);
    expect(result).toEqual(true);
  });

  it('will return true when mts4 flagged and in with September 2020 data as the most recent', () => {
    const result = useVerifyAdditionalChartData('mts4', 2020);
    expect(result).toEqual(true);
  });
});

describe('verifyAdditionalChartData return false', () => {
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
  beforeAll(() => {
    fetchMock.get(`${debtOutstanding}`, mockDebtOutstandingNotCurrentData, { overwriteRoutes: true }, { repeat: 1 });
    fetchMock.get(`${mts4}`, mockMtsAugustData, { overwriteRoutes: true }, { repeat: 1 });
    fetchMock.get(`${mts5}`, mockMtsAugustData, { overwriteRoutes: true }, { repeat: 1 });
  });

  it('will return false when debtOutstanding flagged and in with 2019 data as the most recent', () => {
    const result = useVerifyAdditionalChartData('debtOutstanding', 2020);
    expect(result).toEqual(false);
  });

  it('will return false when mts5 flagged and in with August 2019 data as the most recent', () => {
    const result = useVerifyAdditionalChartData('mts5', 2020);
    expect(result).toEqual(false);
  });

  it('will return false when mts4 flagged and in with August 2019 data as the most recent', () => {
    const result = useVerifyAdditionalChartData('mts4', 2020);
    expect(result).toEqual(false);
  });
});
