import nationalDeficitSections from './national-deficit';
import { deficitLearnMoreLinks } from '../../../../layouts/explainer/explainer-helpers/national-deficit/national-deficit-helper';
import Analytics from '../../../../utils/analytics/analytics';

describe('National Deficit explainer page sections', () => {
  it('returns 6 sections with headings and body components', () => {
    expect(nationalDeficitSections.length).toBe(6);
    expect(nationalDeficitSections[0].title).toBeDefined();
    expect(nationalDeficitSections[0].component).toBeDefined();
  });

  it('fires a citation click when the user clicks the learn more link', () => {
    const analyticsSpy = jest.spyOn(Analytics, 'event');
    expect(deficitLearnMoreLinks.length).toBe(5);
    deficitLearnMoreLinks.forEach(link => {
      link.onClick();
      expect(analyticsSpy).toHaveBeenCalledWith({
        action: 'Deficit Citation Click',
        category: 'Explainers',
        label: link.title,
      });
    });
  });
});
