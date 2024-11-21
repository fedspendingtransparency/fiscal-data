import React from 'react';
import { render } from '@testing-library/react';
import InsightPageLayout from './insight';
import { RecoilRoot } from 'recoil';
import { getCurrentInterestExpData } from './sections/interest-expense/interest-expense';
jest.mock('./sections/interest-expense/interest-expense', () => ({
  getCurrentInterestExpData: jest.fn(),
}));

describe('Insights Template', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  const seoConfig = {
    pageTitle: 'mock page',
    description: 'mock description',
  };
  const heroImage = {
    heading: 'mock heading',
  };
  const pageName = 'interest-expense';

  const mockPageContext = {
    pageName,
    seoConfig,
    heroImage,
  };

  it('renders the interest expense insights page', async () => {
    // Mock the network request
    getCurrentInterestExpData.mockResolvedValue({
      data: [{ record_date: '2023-09-30' }],
    });

    const { findByRole } = render(<InsightPageLayout pageContext={mockPageContext} />, {
      wrapper: RecoilRoot,
    });

    const sectionHeading = await findByRole('heading', { name: 'mock heading' });
    expect(sectionHeading).toBeInTheDocument();

    const dataSourcesMethodologies = await findByRole('heading', {
      name: 'Data Sources and Methodologies:',
    });
    expect(dataSourcesMethodologies).toBeInTheDocument();

    const socialShare = await findByRole('heading', { name: 'Share this page' });
    expect(socialShare).toBeInTheDocument();

    const exploreMore = await findByRole('heading', { name: 'Explore More' });
    expect(exploreMore).toBeInTheDocument();

    const discoverDatasets = await findByRole('heading', { name: 'Discover Datasets' });
    expect(discoverDatasets).toBeInTheDocument();
  });
});
