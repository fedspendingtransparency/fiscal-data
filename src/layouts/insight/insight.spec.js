import React from 'react';
import { render } from '@testing-library/react';
import InsightPageLayout from './insight';
import { RecoilRoot } from 'recoil';
import fetchMock from 'fetch-mock';
import {
  mockInterestExpenseHeroCurrentResponse,
  mockInterestExpenseHeroOlderResponse,
  mockInterestExpenseSummableAmountResponse,
} from './insight-test-helper';

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

describe('Insights Template', () => {
  beforeAll(() => {
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v2/accounting/od/interest_expense?sort=-record_date&page[size]=1`,
      mockInterestExpenseHeroCurrentResponse
    );
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v2/accounting/od/interest_expense?sort=record_date&page[size]=1`,
      mockInterestExpenseHeroOlderResponse
    );
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v2/accounting/od/interest_expense?sort=-record_date&filter=record_date:eq:2025-10-30`,
      mockInterestExpenseSummableAmountResponse
    );
  });
  beforeAll(() => {
    useStaticQuery.mockReturnValue(glossaryMock);
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
    const { findByRole } = render(<InsightPageLayout pageContext={mockPageContext} />, {
      wrapper: RecoilRoot,
    });

    const sectionHeading = await findByRole('heading', { name: 'mock heading' });
    expect(sectionHeading).toBeInTheDocument();

    const dataSourcesMethodologies = await findByRole('heading', { name: 'Data Sources and Methodologies:' });
    expect(dataSourcesMethodologies).toBeInTheDocument();

    const socialShare = await findByRole('heading', { name: 'Share this page' });
    expect(socialShare).toBeInTheDocument();

    const exploreMore = await findByRole('heading', { name: 'Explore More' });
    expect(exploreMore).toBeInTheDocument();

    const discoverDatasets = await findByRole('heading', { name: 'Discover Datasets' });
    expect(discoverDatasets).toBeInTheDocument();
  });
});
