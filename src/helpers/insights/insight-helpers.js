import { BASE_URL } from 'gatsby-env-variables';
import { InterestExpenseHero } from '../../layouts/insight/heros/interest-expense/interest-expense-hero';
import React from 'react';

const envBaseUrl = BASE_URL;

export const insightHeroMap = {
  'interest-expense': {
    component: () => <InterestExpenseHero />,
  },
};

export const insightSocialShareMap = {
  'interest-expense': {
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
