import { BASE_URL } from 'gatsby-env-variables';
import { InterestExpenseHero } from '../../layouts/insight/heros/interest-expense/interest-expense-hero';
import React from 'react';
import Analytics from '../../utils/analytics/analytics';
import CustomLink from '../../components/links/custom-link/custom-link';

const envBaseUrl = BASE_URL;

export const insightsPageName = {
  'interest-expense': 'Interest Expense',
  'state-and-local-government-series': 'State and Local Government Series',
};

export const insightHeroMap = {
  'interest-expense': {
    component: () => <InterestExpenseHero />,
  },
  'state-and-local-government-series': {
    component: () => <></>,
  },
};

export const insightLastUpdated = {
  'interest-expense': {
    endpoint: 'v2/accounting/od/interest_expense?sort=-record_date&page[size]=1',
  },
  // 'state-and-local-government-series': {
  //   endpoint: '',
  // },
};

export const insightSocialShareMap = {
  'interest-expense': {
    title: 'Fiscal Data Explores Interest Expense on National Debt',
    description: 'Check out @FiscalService Fiscal Data’s new topic page exploring interest expense on the national debt! #InterestExpense',
    body:
      'Check out @FiscalService Fiscal Data’s new topic page exploring interest expense and average interest rates on the ' +
      'national debt! #FiscalData #InterestExpense',
    emailSubject: 'Fiscal Data Explores Interest Expense on National Debt',
    emailBody:
      'Check out Fiscal Data’s new interactive insight page, exploring interest expense and average interest rates on the national debt. ' +
      'This tool visualizes trends over time in interest expense and average interest rates. You’ll find both historical and current data, ' +
      'along with easy access to downloadable datasets powering the insight, allowing users to perform their own analysis. Start exploring ' +
      'this essential data today to learn more about U.S. federal finance trends!',
    url: envBaseUrl + '/interest-expense-avg-interest-rates/',
    image: envBaseUrl + '/images/Interest-Expense-Social-Share-Graph-and-Money_1200x630.png',
  },
  'state-and-local-government-series': {
    title: '',
    description: '',
    body: '',
    emailSubject: '',
    emailBody: '',
    url: envBaseUrl + '',
    image: envBaseUrl + '',
  },
};

export const exploreMoreCitationsMap = {
  'interest-expense': [
    { text: 'Federal Spending', url: '/americas-finance-guide/federal-spending/' },
    { text: 'Understanding the National Debt', url: '/americas-finance-guide/national-debt/' },
  ],
  'state-and-local-government-series': [
    { text: 'Test1', url: '' },
    { text: 'Test2', url: '' },
  ],
};

export const discoverDatasetsCitationsMap = {
  'interest-expense': [
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
  'state-and-local-government-series': [
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
    stateLocalGovernmentSeriesDataset: (
      <CustomLink
        url="/datasets/interest-expense-debt-outstanding/interest-expense-on-the-public-debt-outstanding"
        id="SLGS Test ID"
        onClick={() => analyticsEventHandler(page, 'SLGS Test')}
      >
        SLGS Placeholder
      </CustomLink>
    ),
  };
};

export const insightsCitationsMap = {
  'interest-expense': insightsCitations('Interest Expense'),
  'state-and-local-government-series': insightsCitations('State and Local Government Series'),
};
