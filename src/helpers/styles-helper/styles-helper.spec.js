import { pxToNumber, getComputedStyle } from './styles-helper';

describe('Styles helper', () => {
  it('converts a pixel value to a number, or 0 if given an invalid string', () => {
    expect(pxToNumber('500px')).toEqual(500);
    expect(pxToNumber('not a number')).toEqual(0);
  });

  it('gets computed style', () => {
    const windowSpy = jest.spyOn(global, "window", "get")
    windowSpy.mockImplementation(() => ({
      getComputedStyle: (el, pseudoEl) => {
        return ({
          getPropertyValue: (prop) => {
            const out = {"font-size": "40px"};
            return out[prop];
          }
        });
      }
    }));
    expect(getComputedStyle('font-size')).toEqual("40px");
  });

});
