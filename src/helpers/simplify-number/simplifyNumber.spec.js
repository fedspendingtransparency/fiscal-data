import simplifyNumber, {numberWithCommas} from './simplifyNumber' ;

describe('simplify number', () => {
    it('handles trillions', () => {
        expect(simplifyNumber(3123123123123.23)).toBe('3.12 T');
    });

    it('handles tens of trillions', () => {
        expect(simplifyNumber(12312312312312.23)).toBe('12.31 T');
    });

    it('handles hundreds of trillions', () => {
        expect(simplifyNumber(123123123123123.23)).toBe('123.12 T');
    });

    it('handles billions', () => {
        expect(simplifyNumber(123193123123.23)).toBe('123 B'); //also validates rounding
    });

    it('handles millions', () => {
        expect(simplifyNumber(123123123.23)).toBe('123.1 M');
    });

    it('handles thousands', () => {
        expect(simplifyNumber(1234.23)).toBe('1.2 K');
    });

    it('handles hundreds', () => {
        expect(simplifyNumber(123.84)).toBe('124'); //also validates rounding
    });

    it('handles negative numbers', () => {
        expect(simplifyNumber(-12312312)).toBe('-12.3 M');
    });

    it('handles zero', () => {
        expect(simplifyNumber(0)).toBe('0');
    });

    it('adds a dollary sign when called with the currency param', () => {
        expect(simplifyNumber(123, true)).toBe('$123');
    });

    it('shows 2-decimal precision for numbers less than 20', () => {
        expect(simplifyNumber(19, true)).toBe('$19.00');
    });

});

describe('number with commas', () => {
  it('adds commas to number', () => {
    expect(numberWithCommas(123456)).toBe('123,456');
  });

  it('adds commas to number', () => {
    expect(numberWithCommas(123456789)).toBe('123,456,789');
  });
});
