import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Analytics from '../../utils/analytics/analytics';
import {
  analyticsEventHandler,
  insightHeroMap,
  insightsCitationsMap,
  insightSocialShareMap,
  insightLastUpdated,
  insightsPageName,
  exploreMoreCitationsMap,
  discoverDatasetsCitationsMap,
} from './insight-helpers';

jest.mock('gatsby-env-variables', () => ({
  BASE_URL: 'https://fiscaldata.treasury.gov',
}));

jest.mock('../../utils/analytics/analytics', () => ({
  event: jest.fn(),
}));

jest.mock('../../layouts/insight/heros/interest-expense/interest-expense-hero', () => ({
  InterestExpenseHero: () => <div data-testid="interest-hero">Interest Expense Hero</div>,
}));

jest.mock('../../components/links/custom-link/custom-link', () => {
  return ({ children, onClick }) => (
    <button onClick={onClick} data-testid="custom-link">
      {children}
    </button>
  );
});

describe('Insight Helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export the correct static data maps', () => {
    expect(insightsPageName['interest-expense']).toBe('Interest Expense');
    expect(insightLastUpdated['interest-expense'].endpoint).toContain('v2/accounting/od/interest_expense');
    expect(insightSocialShareMap['interest-expense'].title).toContain('Fiscal Data Explores Interest Expense');
    expect(insightSocialShareMap['state-and-local-government-series'].url).toContain('/state-and-local-government-series/');
    expect(exploreMoreCitationsMap['interest-expense'].length).toBe(2);
    expect(discoverDatasetsCitationsMap['state-and-local-government-series'].length).toBe(4);
  });

  it('calls Analytics.event with correct parameters when analyticsEventHandler is called', () => {
    const pageName = 'Test Page';
    const label = 'Test Label';
    const action = 'Test Action';

    analyticsEventHandler(pageName, label, action);
    expect(Analytics.event).toHaveBeenCalledWith({
      category: pageName,
      action: action,
      label: label,
    });

    analyticsEventHandler(pageName, label);
    expect(Analytics.event).toHaveBeenCalledWith({
      category: pageName,
      action: 'Citation Click', // Default value check
      label: label,
    });
  });

  it('renders the correct hero component for interest-expense', () => {
    const Component = insightHeroMap['interest-expense'].component;
    render(<Component />);
    expect(screen.getByTestId('interest-hero')).toBeInTheDocument();
  });

  it('renders an empty fragment for state-and-local-government-series', () => {
    const Component = insightHeroMap['state-and-local-government-series'].component;
    const { container } = render(<Component />);
    expect(container.firstChild).toBeNull();
  });

  it('fires a GA event when each citation link is clicked', () => {
    Object.entries(insightsCitationsMap).forEach(([pageKey, citationsObj]) => {
      const expectedPageName = insightsPageName[pageKey];

      const { unmount } = render(<div>{Object.values(citationsObj)}</div>);

      const links = screen.getAllByTestId('custom-link');
      links.forEach(link => {
        fireEvent.click(link);

        expect(Analytics.event).toHaveBeenCalledWith(
          expect.objectContaining({
            category: expectedPageName,
            action: 'Citation Click',
          })
        );

        jest.clearAllMocks();
      });

      unmount();
    });
  });
});
