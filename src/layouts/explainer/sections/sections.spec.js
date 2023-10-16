import explainerSections from './sections';
import nationalDebtSections from './national-debt/national-debt';

describe('Explainer page sections', () => {
  it("maps each page's sections to its name", () => {
    expect(explainerSections['national-debt']).toStrictEqual(nationalDebtSections);
  });
});
