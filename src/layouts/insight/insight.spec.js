import React from 'react';
import { render, within } from '@testing-library/react';
import InsightPageLayout from './insight';
import { RecoilRoot } from 'recoil';
import fetchMock from 'fetch-mock';
import {
  avgRateChartDataUrl,
  currentUrl,
  expenseChartDataUrl,
  mockAvgInterestRateResponse,
  mockInterestExpenseHeroCurrentResponse,
  mockInterestExpenseHeroOlderResponse,
  mockInterestExpenseSummableAmountResponse,
  olderUrl,
  summableRecentExpenseUrl,
} from './insight-test-helper';
import { useStaticQuery } from 'gatsby';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const glossaryMock = {
  allGlossaryCsv: {
    glossaryCsv: [
      {
        term: 'Interest Expense',
        definition:
          'The interest that the government pays on its outstanding loans. It can be referred to as the cost to the U.S. for borrowing money. It is the sum of interest paid at the interest rate applicable for each outstanding loan held by the government.',
        site_page: 'Interest Expense Insight',
        id: '38',
        url_display: '',
        url_path: '',
      },
    ],
  },
  extensions: {},
};

jest.mock('../../variables.module.scss', () => {
  return {
    breakpointLg: '992',
  };
});

describe('Insights Template', () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }) => (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RecoilRoot>
  );

  beforeAll(() => {
    useStaticQuery.mockReturnValue(glossaryMock);
    fetchMock.get(currentUrl, mockInterestExpenseHeroCurrentResponse);
    fetchMock.get(olderUrl, mockInterestExpenseHeroOlderResponse);
    fetchMock.get(expenseChartDataUrl, mockInterestExpenseHeroCurrentResponse);
    fetchMock.get(avgRateChartDataUrl, mockAvgInterestRateResponse);
    fetchMock.get(summableRecentExpenseUrl, mockInterestExpenseSummableAmountResponse);
  });

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
    const { findByRole, getByTestId } = render(<InsightPageLayout pageContext={mockPageContext} />, {
      wrapper,
    });

    const sectionHeading = await findByRole('heading', { name: 'mock heading' });
    expect(sectionHeading).toBeInTheDocument();

    const dataSourcesMethodologies = await findByRole('heading', { name: 'Data Sources and Methodologies:' });
    expect(dataSourcesMethodologies).toBeInTheDocument();

    const socialShare = await within(getByTestId('social-share-desktop')).findByRole('heading', { name: 'Share this page' });
    expect(socialShare).toBeInTheDocument();

    const exploreMore = await findByRole('heading', { name: 'Explore More' });
    expect(exploreMore).toBeInTheDocument();

    const discoverDatasets = await findByRole('heading', { name: 'Discover Datasets' });
    expect(discoverDatasets).toBeInTheDocument();
  });

  it('renders the mobile interest expense insights page', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 400,
    });

    const { findByRole, queryByRole, findByTestId, getByTestId } = render(<InsightPageLayout pageContext={mockPageContext} />, {
      wrapper,
    });

    const sectionHeading = await findByRole('heading', { name: 'mock heading' });
    expect(sectionHeading).toBeInTheDocument();

    const dataSourcesMethodologies = await findByRole('heading', { name: 'Data Sources and Methodologies:' });
    expect(dataSourcesMethodologies).toBeInTheDocument();

    const socialShare = queryByRole('heading', { name: 'Share this page' });
    expect(socialShare).not.toBeInTheDocument();

    const facebookButton = await within(getByTestId('social-share-desktop')).findByTestId('facebookButton');
    expect(facebookButton).toBeInTheDocument();

    const exploreMore = await findByRole('heading', { name: 'Explore More' });
    expect(exploreMore).toBeInTheDocument();

    const discoverDatasets = await findByRole('heading', { name: 'Discover Datasets' });
    expect(discoverDatasets).toBeInTheDocument();
  });
});
