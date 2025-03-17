import { getShortForm } from './rounding-utils';

describe('Rounding Utils', () => {
  it('getShortForm', () => {
    const valueBillions = '100000000000';
    const valueTrillions = '1000000000000';
    const valueTrillionsDecimal = '1120000000000';
    const valueMillions = '100000000';
    const fractionDigitsBillion = 0;
    const fractionDigitsMillion = 0;
    const fractionDigitsTrillion = 2;
    expect(getShortForm(valueBillions, false, false, fractionDigitsBillion)).toEqual('100 billion');
    expect(getShortForm(valueTrillions, false, false, fractionDigitsTrillion)).toEqual('1 trillion');
    expect(getShortForm(valueTrillionsDecimal, true, false, fractionDigitsTrillion)).toEqual('1.12 T');
    expect(getShortForm(valueMillions, false, false, fractionDigitsMillion)).toEqual('100 million');
  });

  it('getShortForm rounding', () => {
    const valueBillions = '100000000000';
    const valueTrillions = '1000000000000';
    const valueTrillionsDecimal = '1120000000000';
    expect(getShortForm(valueBillions, false)).toEqual('100 billion');
    expect(getShortForm(valueTrillions, false)).toEqual('1 trillion');
    expect(getShortForm(valueTrillionsDecimal, true)).toEqual('1.12 T');
  });

  it('getShortForm non-default fraction digits', () => {
    const valueBillions = '100120000000';
    const valueTrillions = '1000000000000';
    const nonDefaultFractionDigitsBillion = 2;
    const nonDefaultFractionDigitsTrillion = 0;
    expect(getShortForm(valueBillions, false, false, nonDefaultFractionDigitsBillion)).toEqual('100.12 billion');
    expect(getShortForm(valueTrillions, false, false, nonDefaultFractionDigitsTrillion)).toEqual('1 trillion');
    expect(getShortForm(valueTrillions, true, false, nonDefaultFractionDigitsTrillion)).toEqual('1 T');
  });
});
