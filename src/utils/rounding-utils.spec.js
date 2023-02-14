import {getShortForm} from "./rounding-utils";

describe('Rounding Utils', () => {

  it('getShortForm', () => {
    const valueBillions = '100000000000';
    const valueTrillions = '1000000000000';
    const fractionDigitsBillion = 0;
    const fractionDigitsTrillion = 2;
    expect(getShortForm(valueBillions, false, false, fractionDigitsBillion))
    .toEqual('100 billion');
    expect(getShortForm(valueTrillions, false, false, fractionDigitsTrillion))
    .toEqual('1.00 trillion');
    expect(getShortForm(valueTrillions, true, false, fractionDigitsTrillion))
    .toEqual('1.00 T');
  });

  it('getShortForm rounding', () => {
    const valueBillions = '100000000000';
    const valueTrillions = '1000000000000';
    expect(getShortForm(valueBillions, false))
    .toEqual('100 billion');
    expect(getShortForm(valueTrillions, false))
    .toEqual('1.00 trillion');
    expect(getShortForm(valueTrillions, true))
    .toEqual('1.00 T');
  });

})
