import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
      action: 'Citation Click',
      label: label,
    });
  });

  it('renders the correct hero component for interest-expense', () => {
    const Component = insightHeroMap['interest-expense'].component;
    const { getByTestId } = render(<Component />);
    expect(getByTestId('interest-hero')).toBeInTheDocument();
  });

  it('renders an empty fragment for state-and-local-government-series', () => {
    const Component = insightHeroMap['state-and-local-government-series'].component;
    const { container } = render(<Component />);
    expect(container.firstChild).toBeNull();
  });

  it('renders citations for Interest Expense and triggers analytics on click', () => {
    const LinkComponent = insightsCitationsMap['interest-expense'].interestExpenseDataset;
    const { getByText } = render(LinkComponent);
    const linkElement = getByText('Interest Expense on the Debt Outstanding');

    fireEvent.click(linkElement);

    expect(Analytics.event).toHaveBeenCalledWith({
      category: 'Interest Expense',
      action: 'Citation Click',
      label: 'Interest Expense on the Public Debt Outstanding',
    });
  });

  it('renders citations for SLGS and triggers analytics on click', () => {
    const LinkComponent = insightsCitationsMap['state-and-local-government-series'].stateAndLocalGovernmentSeriesSecuritiesDataset;

    const { getByText } = render(LinkComponent);
    const linkElement = getByText('State and Local Government Series Securities (Non-Marketable)');

    fireEvent.click(linkElement);

    expect(Analytics.event).toHaveBeenCalledWith({
      category: 'State and Local Government Series',
      action: 'Citation Click',
      label: 'State and Local Government Series Securities (Non-Marketable)',
    });
  });

  it('triggers analytics for Debt to the Penny link', () => {
    const LinkComponent = insightsCitationsMap['interest-expense'].debtToThePennyDataset;
    const { getByText } = render(LinkComponent);
    fireEvent.click(getByText('Debt to the Penny'));

    expect(Analytics.event).toHaveBeenCalledWith({
      category: 'Interest Expense',
      action: 'Citation Click',
      label: 'Debt to the Penny',
    });
  });

  it('triggers analytics for Treasury Securities link', () => {
    const LinkComponent = insightsCitationsMap['interest-expense'].treasurySecurities;
    const { getByText } = render(LinkComponent);
    fireEvent.click(getByText('Average Interest Rates on U.S. Treasury Securities'));

    expect(Analytics.event).toHaveBeenCalledWith({
      category: 'Interest Expense',
      action: 'Citation Click',
      label: 'Average Interest Rates on U.S. Treasury Securities',
    });
  });
});
