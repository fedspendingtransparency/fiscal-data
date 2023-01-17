import {getShortForm, isBillionsOrTrillions} from "./rounding-utils";

describe('Rounding Utils', () => {

  it('getShortForm', () => {
    const valueBillions = '100000000000';
    const valueTrillions = '1000000000000';
    const fractionDigitsBillion = 0;
    const fractionDigitsTrillion = 2;
    expect(getShortForm(valueBillions, fractionDigitsBillion, false))
    .toEqual('100 billion');
    expect(getShortForm(valueTrillions, fractionDigitsTrillion, false))
    .toEqual('1.00 trillion');
    expect(getShortForm(valueTrillions, fractionDigitsTrillion, true))
    .toEqual('1.00 T');
  });

  it('isBillionsOrTrillions', () => {
    const valueBillions = '100000000000';
    const valueTrillions = '1000000000000';
    expect(isBillionsOrTrillions(valueBillions, false))
    .toEqual('100 billion');
    expect(isBillionsOrTrillions(valueTrillions, false))
    .toEqual('1.00 trillion');
    expect(isBillionsOrTrillions(valueTrillions, true))
    .toEqual('1.00 T');
  });

})
