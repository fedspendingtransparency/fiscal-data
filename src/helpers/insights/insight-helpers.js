import { BASE_URL } from 'gatsby-env-variables';
import { InterestExpenseHero } from '../../layouts/insight/heros/interest-expense/interest-expense-hero';
import React from 'react';
import { LastUpdatedDate } from '../../layouts/insight/sections/interest-expense/last-updated/last-updated';

const envBaseUrl = BASE_URL;

export const insightHeroMap = {
  'interest-expense': {
    component: () => <InterestExpenseHero />,
  },
};

export const insightLastUpdated = {
  'interest-expense': {
    endpoint: 'v2/accounting/od/interest_expense?sort=-record_date&page[size]=1',
  },
};

export const insightSocialShareMap = {
  'interest-expense': {
    title: 'Fiscal Data Explores Interest Expense on National Debt',
    description: 'Check out @FiscalService Fiscal Data’s new topic page exploring interest expense on the national debt! #InterestExpense',
    body:
      'Check out @FiscalService Fiscal Data’s new topic page exploring interest expense and average interest rates on the national debt! #FiscalData #InterestExpense',
    emailSubject: 'Fiscal Data Explores Interest Expense on National Debt',
    emailBody:
      'Check out Fiscal Data’s new interactive insight page, exploring interest expense and average interest rates on the national debt. This tool visualizes trends over time in interest expense and average interest rates. You’ll find both historical and current data, along with easy access to downloadable datasets powering the insight, allowing users to perform their own analysis. Start exploring this essential data today to learn more about U.S. federal finance trends!',
    url: envBaseUrl + '/interest-expense-avg-interest-rates/',
    image: envBaseUrl + '/images/Interest-Expense-Social-Share-Graph-and-Money_1200x630.png',
  },
};

export const exploreMoreCitationsMap = {
  'interest-expense': [
    { text: 'Federal Spending | U.S. Treasury Fiscal Data', url: '/americas-finance-guide/federal-spending/' },
    { text: 'Understanding the National Debt | U.S. Treasury Fiscal Data', url: '/americas-finance-guide/national-debt/' },
  ],
};

export const discoverDatasetsCitationsMap = {
  'interest-expense': [
    {
      text: 'Interest Expense on the Debt Outstanding | U.S. Treasury Fiscal Data',
      url: '/datasets/interest-expense-debt-outstanding/interest-expense-on-the-public-debt-outstanding',
    },
    {
      text: 'Average Interest Rates on U.S. Treasury Securities | U.S. Treasury Fiscal Data',
      url: '/datasets/average-interest-rates-treasury-securities/average-interest-rates-on-u-s-treasury-securities',
    },
    {
      text: 'Monthly Treasury Statement (MTS) | U.S. Treasury Fiscal Data',
      url: '/datasets/monthly-treasury-statement/summary-of-receipts-by-source-and-outlays-by-function-of-the-u-s-government',
    },
    {
      text: 'Monthly Statement of the Public Debt (MSPD) | U.S. Treasury Fiscal Data',
      url: '/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding',
    },
  ],
};
