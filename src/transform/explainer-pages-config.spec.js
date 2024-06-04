import { freshExplainerPages } from './explainer-pages-config';

describe('Explainer Pages Config', () => {
  it('returns the explainer pages with the page name', () => {
    const pages = freshExplainerPages();
    expect(pages.length).toBe(5);
    expect(pages[0].pageName).toBeDefined();
  });
});
