import React from 'react';
import { render, within } from '@testing-library/react';
import FeaturedContentPageLayout from './featured-content';
import { useStaticQuery } from 'gatsby';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const glossaryMock = {
  allGlossaryCsv: {
    glossaryCsv: [
      {
        term: 'Federal Debt',
        definition: 'The total amount of outstanding borrowing by the U.S. federal government accumulated over time.',
        site_page: 'Sample Feature',
        id: '1',
        url_display: '',
        url_path: '',
      },
    ],
  },
  extensions: {},
};

jest.mock('../../../variables.module.scss', () => {
  return {
    breakpointLg: '992',
  };
});

describe('Featured Content Template', () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }) => (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );

  beforeAll(() => {
    useStaticQuery.mockReturnValue(glossaryMock);
  });

  const seoConfig = {
    pageTitle: 'mock page',
    description: 'mock description',
  };
  const heroImage = {
    heading: 'mock heading',
    subHeading: 'mock subtitle',
  };
  const pageName = 'story-of-data-transparency';

  const mockPageContext = {
    pageName,
    seoConfig,
    heroImage,
  };

  it('renders the featured content page heading, subtitle, and sidebar links', async () => {
    const { findByRole, getByTestId } = render(<FeaturedContentPageLayout pageContext={mockPageContext} />, {
      wrapper,
    });

    const sectionHeading = await findByRole('heading', { name: 'mock heading' });
    expect(sectionHeading).toBeInTheDocument();

    expect(getByTestId('hero-border')).toBeInTheDocument();

    const subTitle = await findByRole('heading', { name: 'mock subtitle' });
    expect(subTitle).toBeInTheDocument();

    const socialShare = await within(getByTestId('social-share-desktop')).findByRole('heading', { name: 'Share this page' });
    expect(socialShare).toBeInTheDocument();

    const exploreMore = await findByRole('heading', { name: 'Explore More' });
    expect(exploreMore).toBeInTheDocument();

    const discoverDatasets = await findByRole('heading', { name: 'Discover Datasets' });
    expect(discoverDatasets).toBeInTheDocument();
  });

  it('does not render a Data Sources and Methodologies section', async () => {
    const { findByRole, queryByRole } = render(<FeaturedContentPageLayout pageContext={mockPageContext} />, {
      wrapper,
    });

    await findByRole('heading', { name: 'mock heading' });
    expect(queryByRole('heading', { name: 'Data Sources and Methodologies:' })).not.toBeInTheDocument();
  });
});
