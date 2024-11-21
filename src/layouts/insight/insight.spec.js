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

describe('Insights Template', () => {
  beforeEach(() => {
    fetchMock.get(
      `begin:https://www.transparency.treasury.gov/services/api/fiscal_service/v2/accounting/od/interest_expense?sort=-record_date&page[size]=1`,
      mockInterestExpenseHeroCurrentResponse,
      { overwriteRoutes: true, repeat: 1 }
    );
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v2/accounting/od/interest_expense?sort=record_date&page[size]=1`,
      mockInterestExpenseHeroOlderResponse,
      { overwriteRoutes: true, repeat: 1 }
    );
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v2/accounting/od/interest_expense?sort=-record_date&filter=record_date:eq:2025-05-31`,
      mockInterestExpenseSummableAmountResponse,
      { overwriteRoutes: true, repeat: 1 }
    );
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
