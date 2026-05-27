import React from 'react';
import { cleanup, render } from '@testing-library/react';
import CurrencyExchangeFAQ from './exchange-rates-faq';
import { useStaticQuery } from 'gatsby';

const mockData = {
  allExchangeRatesData: {
    exchangeRatesData: [{ record_date: '2023-09-30' }, { record_date: '2023-06-30' }, { record_date: '2023-03-31' }, { record_date: '2022-12-31' }],
  },
};

jest.mock('gatsby', () => {
  const React = require('react');
  return {
    ...jest.requireActual('gatsby'),
    graphql: jest.fn(),
    useStaticQuery: jest.fn(),
    StaticQuery: jest.fn(),
    Link: jest.fn().mockImplementation(({ to, ...rest }) =>
      React.createElement('a', {
        ...rest,
        href: to,
      })
    ),
  };
});

jest.mock('../../../utils/analytics/analytics', () => ({
  default: {
    event: jest.fn(),
  },
}));

jest.mock('../../../helpers/google-analytics/google-analytics-helper', () => ({
  ga4DataLayerPush: jest.fn(),
}));

describe('CurrencyExchangeFAQ Component', () => {
  beforeEach(() => {
    useStaticQuery.mockImplementation(() => mockData);
    jest.clearAllMocks();
  });
  afterEach(cleanup);

  it('renders the CurrencyExchangeFAQ component', () => {
    const { getByText } = render(<CurrencyExchangeFAQ />);
    expect(getByText('Frequently Asked Questions')).toBeInTheDocument();
  });

  it('renders all FAQ items', () => {
    const { getByText } = render(<CurrencyExchangeFAQ />);

    expect(getByText('How is this foreign currency converter different from others?')).toBeInTheDocument();
    expect(getByText('Can I use these exchange rates for my IRS tax forms?')).toBeInTheDocument();
    expect(getByText('Why can’t I see a real-time exchange rate?')).toBeInTheDocument();
  });

  it('renders all related resources', () => {
    const { getByText } = render(<CurrencyExchangeFAQ />);

    expect(getByText('Report of Foreign Bank and Financial Accounts (FBAR) | IRS.gov')).toBeInTheDocument();
    expect(getByText('About Form 8938, Statement of Specified Foreign Financial Assets | IRS.gov')).toBeInTheDocument();
    expect(getByText('Foreign currency and currency exchange rates | IRS.gov')).toBeInTheDocument();
    expect(getByText('Yearly Average Currency Exchange Rates | IRS.gov')).toBeInTheDocument();
    expect(getByText('U.S. citizens and residents abroad filing requirements | IRS.gov')).toBeInTheDocument();
  });

  it('renders the correct dataset date', () => {
    const { getByText } = render(<CurrencyExchangeFAQ />);
    expect(getByText(/March 31, 2018 to September 30, 2023\./)).toBeInTheDocument();
  });
});
