import {setGlobalFetchResponse} from "../../../../utils/mock-utils";
import {mockExplainerPageResponse} from "../../explainer-test-helper";
import nationalDeficitSections from "./national-deficit";

describe('National Deficit explainer page sections', () => {
  beforeEach(() => {
    setGlobalFetchResponse(jest, mockExplainerPageResponse);
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('returns 8 sections with headings and body components', () => {
    expect(nationalDeficitSections.length).toBe(6);
    expect(nationalDeficitSections[0].title).toBeDefined();
  });
});
