import { isOtherDataUpdated } from './useBeaGDP-helper';
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

describe('isOtherDataUpdated', () => {
  it('will return true when debtOutstanding flagged and in with 2020 data as the most recent', () => {
    const result = isOtherDataUpdated('debtOutstanding', 2020);
    expect(result).toEqual(true);
  });

  it('will return false when debtOutstanding flagged and in with 2019 data as the most recent', () => {
    const result = isOtherDataUpdated('debtOutstanding', 2020);
    expect(result).toEqual(false);
  });

  it('will return true when mts5 flagged and in with September 2020 data as the most recent', () => {
    const result = isOtherDataUpdated('mts5', 2020);
    expect(result).toEqual(true);
  });

  it('will return false when mts5 flagged and in with August 2019 data as the most recent', () => {
    const result = isOtherDataUpdated('mts5', 2020);
    expect(result).toEqual(false);
  });

  it('will return true when mts4 flagged and in with September 2020 data as the most recent', () => {
    const result = isOtherDataUpdated('mts4', 2020);
    expect(result).toEqual(true);
  });

  it('will return false when mts4 flagged and in with August 2019 data as the most recent', () => {
    const result = isOtherDataUpdated('mts4', 2020);
    expect(result).toEqual(false);
  });
});
