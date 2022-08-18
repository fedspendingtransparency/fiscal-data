import federalSpendingSections from "./federal-spending";

describe('Federal spendinf explainer page sections', () => {
  it('returns 6 sections with headings and body components', () => {
    expect(federalSpendingSections.length).toBe(5);
    expect(federalSpendingSections[0].title).toBeDefined();
    expect(federalSpendingSections[0].component).toBeDefined();
  });
});
