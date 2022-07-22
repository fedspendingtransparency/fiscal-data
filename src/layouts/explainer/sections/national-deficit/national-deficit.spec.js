import nationalDeficitSections from "./national-deficit";

describe('National Deficit explainer page sections', () => {
  it('returns 6 sections with headings and body components', () => {
    expect(nationalDeficitSections.length).toBe(6);
    expect(nationalDeficitSections[0].title).toBeDefined();
    expect(nationalDeficitSections[0].component).toBeDefined();
  });
});
