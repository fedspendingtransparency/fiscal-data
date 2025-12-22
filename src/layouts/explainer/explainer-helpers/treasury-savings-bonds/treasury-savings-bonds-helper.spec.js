import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { treasurySavingsbondsDataSources } from './treasury-savings-bonds-helper';
import { analyticsEventHandler } from '../explainer-helpers';

jest.mock('../explainer-helpers', () => ({
  analyticsEventHandler: jest.fn(),
}));

jest.mock('../../../../components/links/custom-link/custom-link', () => {
  return ({ url, onClick, children, id }) => (
    <a href={url} onClick={onClick} id={id}>
      {children}
    </a>
  );
});

describe('Treasury Savings Bonds Helper', () => {
  const renderComponent = () => render(<>{treasurySavingsbondsDataSources}</>);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the glossary text and links', () => {
    renderComponent();
    expect(screen.getByText(/The number and value of total savings bonds sold/i)).toBeInTheDocument();
  });

  const linksData = [
    {
      text: 'Electronic Securities Transactions',
      url: '/datasets/electronic-securities-transactions/',
      eventLabel: 'Electronic Securities Transactions',
    },
    {
      text: 'TreasuryDirect',
      url: 'https://www.treasurydirect.gov/research-center/history-of-savings-bond/savings-bond-sales/',
      eventLabel: 'Savings Bond Sales',
    },
    {
      text: 'U.S. Treasury Monthly Statement of Public Debt (MSPD)',
      url: '/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding',
      eventLabel: 'U.S. Treasury Monthly Statement of Public Debt',
    },
    {
      text: 'Bureau of Labor Statistics',
      url: 'https://www.bls.gov/developers/',
      eventLabel: 'Bureau of Labor Statistics',
    },
    {
      text: 'U.S. Treasury Savings Bonds: Issues, Redemptions, and Maturities by Series',
      url: '/datasets/savings-bonds-issues-redemptions-maturities-by-series/matured-unredeemed-debt',
      eventLabel: 'Matured Unredeemed Debt',
    },
    {
      text: 'GitHub repository',
      url: 'https://github.com/fedspendingtransparency/fiscal-data/tree/master/documentation',
      eventLabel: 'GitHub repository',
    },
  ];

  linksData.forEach(({ text, url, eventLabel }) => {
    it(`renders the ${text} link with correct URL and analytics`, () => {
      renderComponent();

      const link = screen.getByText(text);

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', url);
      fireEvent.click(link);
      expect(analyticsEventHandler).toHaveBeenCalledWith(eventLabel, 'Savings Bonds Citation Click');
    });
  });
});
