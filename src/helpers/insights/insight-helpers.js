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
  'interest-expense': [{ text: 'Example Citation with an extra long name that should wrap correctly', url: 'fiscaldata.treasury.gov' }],
};

export const discoverDatasetsCitationsMap = {
  'interest-expense': [
    { text: 'Example Citation', url: 'fiscaldata.treasury.gov' },
    { text: 'Example Citation', url: 'fiscaldata.treasury.gov' },
  ],
};
