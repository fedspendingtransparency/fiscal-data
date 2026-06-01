import { BASE_URL } from 'gatsby-env-variables';
import React from 'react';
import Analytics from '../../utils/analytics/analytics';
import CustomLink from '../../components/links/custom-link/custom-link';

const envBaseUrl = BASE_URL;

export const featuredContentPageName = {
  'story-of-data-transparency': 'The Story of Data Transparency',
};

export const featuredContentImageMap = {
  'story-of-data-transparency': {
    image: 'static/image/feature_placeholder.png',
    altText: 'this is alt text',
  },
};

export const featuredContentSocialShareMap = {
  'story-of-data-transparency': {
    title: 'The Story of Data Transparency',
    description:
      'U.S. Government financial transparency was established in the Constitution. ' +
      'Learn more about how transparency has evolved to get us where we are today.',
    body:
      'Check out @FiscalService Fiscal Data’s new topic page exploring interest expense and average interest rates on the ' +
      'national debt! #FiscalData #InterestExpense',
    emailSubject: 'The Story of Federal Financial Data Transparency',
    emailBody:
      'Check out Fiscal Data’s new feature on how federal financial transparency has grown and evolved ' +
      'over time! This short piece highlights the roots of financial transparency and the ways that Fiscal ' +
      'Data has continued to advance government transparency. ',
    url: envBaseUrl + '/story-of-data-transparency/',
    image: envBaseUrl + '/static/image/feature_placeholder.png',
  },
};

export const exploreMoreCitationsMap = {
  'story-of-data-transparency': [
    {
      text: 'Government Spending Open Data | USAspending ',
      url: 'https://www.usaspending.gov/featured-content/data-you-can-trust/the-story-of-spending-transparency',
    },
    {
      text: 'Preserving America’s Story | USAspending',
      url: 'https://www.usaspending.gov/featured-content/spending-stories/preserving-americas-story',
    },
    {
      text: 'Understanding the National Debt | U.S. Treasury Fiscal Data ',
      url: '/americas-finance-guide/national-debt/',
    },
    { text: 'National Deficit | U.S. Treasury Fiscal Data ', url: '/americas-finance-guide/national-deficit/' },
  ],
};

export const discoverDatasetsCitationsMap = {
  'story-of-data-transparency': [
    {
      text: 'Interest Expense on the Debt Outstanding',
      url: '/datasets/interest-expense-debt-outstanding/interest-expense-on-the-public-debt-outstanding',
    },
    {
      text: 'Average Interest Rates on U.S. Treasury Securities',
      url: '/datasets/average-interest-rates-treasury-securities/average-interest-rates-on-u-s-treasury-securities',
    },
    {
      text: 'Monthly Treasury Statement (MTS)',
      url: '/datasets/monthly-treasury-statement/summary-of-receipts-by-source-and-outlays-by-function-of-the-u-s-government',
    },
    {
      text: 'Monthly Statement of the Public Debt (MSPD)',
      url: '/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding',
    },
  ],
};

export const analyticsEventHandler = (pageName, eventLabel, eventAction = 'Citation Click') => {
  Analytics.event({
    category: pageName,
    action: eventAction,
    label: eventLabel,
  });
};

const insightsCitations = page => {
  return {
    interestExpenseDataset: (
      <CustomLink
        url="/datasets/interest-expense-debt-outstanding/interest-expense-on-the-public-debt-outstanding"
        id="Interest Expense on the Public Debt Outstanding"
        onClick={() => analyticsEventHandler(page, 'Interest Expense on the Public Debt Outstanding')}
      >
        Interest Expense on the Debt Outstanding
      </CustomLink>
    ),
    treasurySecurities: (
      <CustomLink
        url="/datasets/average-interest-rates-treasury-securities/average-interest-rates-on-u-s-treasury-securities"
        id="Average Interest Rates on U.S. Treasury Securities"
        onClick={() => analyticsEventHandler(page, 'Average Interest Rates on U.S. Treasury Securities')}
      >
        Average Interest Rates on U.S. Treasury Securities
      </CustomLink>
    ),
    stateAndLocalGovernmentSeriesSecuritiesDataset: (
      <CustomLink
        url="/datasets/slgs-securities/state-and-local-government-series-securities-non-marketable"
        id="State and Local Government Series Securities (Non-Marketable)"
        onClick={() => analyticsEventHandler(page, 'State and Local Government Series Securities (Non-Marketable)')}
      >
        State and Local Government Series Securities (Non-Marketable)
      </CustomLink>
    ),
    debtToThePennyDataset: (
      <CustomLink
        url="/datasets/debt-to-the-penny/debt-to-the-penny"
        id="Debt to the Penny"
        onClick={() => analyticsEventHandler(page, 'Debt to the Penny')}
      >
        Debt to the Penny
      </CustomLink>
    ),
  };
};

export const insightsCitationsMap = {
  'interest-expense': insightsCitations('Interest Expense'),
  'state-and-local-government-series': insightsCitations('State and Local Government Series'),
};
