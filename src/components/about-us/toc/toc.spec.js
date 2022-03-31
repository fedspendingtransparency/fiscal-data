import { classLevelErrorMsg, tocBuilder, paramsErrorMsg } from "./toc";
import { mdxMultiHeaders, properMDX, properMDXClassNames, properMDXResult } from "./toc.helper";

describe('tocBuilder - Incorrect params', () => {
  let consoleError = jest.fn();

  beforeAll(() => {
    consoleError = global.console.error;
    global.console.error = jest.fn();
  });

  beforeEach(() => {
    global.console.error.mockClear();
  });

  afterAll(() => {
    global.console.error = consoleError;
  });

  it ('exits with console errors if the mdx param is empty', () => {
    const result = tocBuilder(null,properMDXClassNames);
    expect(result).toEqual([]);
    expect(global.console.error).toHaveBeenCalledWith(paramsErrorMsg);
  });

  it ('exits with console errors if the classLevelArr is empty', () => {
    tocBuilder(properMDX);
    expect(global.console.error).toHaveBeenCalledWith(paramsErrorMsg);
  });

  it('exits with console errors if the classLevelArr is an empty array',
    () => {
    tocBuilder(properMDX,[]);
    expect(global.console.error).toHaveBeenCalledWith(paramsErrorMsg);
  });

  it('exits with console errors if the classLevelArr does not have ' +
    'enough classes', () => {
    tocBuilder(properMDX,['heading1']);
    expect(global.console.error).toHaveBeenCalledWith(classLevelErrorMsg);
  })
});

describe('tocBuilder', () => {
  it('properly parses an mdx input to a toc output', () => {
    const result = tocBuilder(properMDX,properMDXClassNames);
    expect(result).toEqual(properMDXResult);
  });
  it('only builds out the first heading per section', () => {
    const result = tocBuilder(mdxMultiHeaders,properMDXClassNames);
    expect(result).toEqual(properMDXResult);
  })
});
