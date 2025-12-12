import nationalDeficitSections from './national-deficit';
import { deficitLearnMoreLinks } from '../../../../layouts/explainer/explainer-helpers/national-deficit/national-deficit-helper';
import { analyticsEventHandler } from '../../explainer-helpers/explainer-helpers';

jest.mock('../../explainer-helpers/explainer-helpers');

describe('National Deficit explainer page sections', () => {
  it('returns 6 sections with headings and body components', () => {
    expect(nationalDeficitSections.length).toBe(6);
    expect(nationalDeficitSections[0].title).toBeDefined();
    expect(nationalDeficitSections[0].component).toBeDefined();
  });

  it('fires a citation click when the user clicks the learn more link', () => {
    expect(deficitLearnMoreLinks.length).toBe(5);
    deficitLearnMoreLinks.forEach(link => {
      analyticsEventHandler.mockClear();
      link.onClick();
      expect(analyticsEventHandler).toHaveBeenCalledWith(link.title, 'Deficit Citation Click');
    });
  });
});
