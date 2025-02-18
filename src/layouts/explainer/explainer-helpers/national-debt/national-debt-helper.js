import CustomLink from '../../../../components/links/custom-link/custom-link';
import React from 'react';
import { analyticsEventHandler } from '../explainer-helpers';

export const deficitLink = (
  <CustomLink
    url="/americas-finance-guide/national-deficit/"
    id="National Deficit"
    onClick={() => analyticsEventHandler('National Deficit', 'Debt Citation Click')}
  >
    deficit
  </CustomLink>
);

export const spendingLink = copy => (
  <CustomLink url="/americas-finance-guide/federal-spending/" id="Federal Spending">
    {copy}
  </CustomLink>
);

const diveDeeperCitationClick = eventLabel => analyticsEventHandler(eventLabel, 'Debt Citation Click');

export const debtLearnMoreLinks = [
  {
    title: 'The most recent U.S. Government Financial Report',
    url: 'https://fiscaldata.treasury.gov/static-data/published-reports/frusg/FRUSG_2024.pdf',
    onClick: () => diveDeeperCitationClick('The most recent U.S. Government Financial Report'),
  },
  {
    title: 'America’s Fiscal Future: Federal Debt',
    url: 'https://www.gao.gov/americas-fiscal-future/federal-debt',
    onClick: () => diveDeeperCitationClick('America’s Fiscal Future: Federal Debt'),
  },
  {
    title: 'Federal Net Interest Costs: A Primer',
    url: 'https://www.cbo.gov/publication/56910',
    onClick: () => diveDeeperCitationClick('Federal Net Interest Costs: A Primer'),
  },
  {
    title: 'Is the Federal Reserve Printing Money in Order to Buy Treasury Securities?',
    url: 'https://www.federalreserve.gov/faqs/money_12853.htm',
    onClick: () => diveDeeperCitationClick('Is the Federal Reserve Printing Money in Order to Buy Treasury Securities?'),
  },
  {
    title: 'Options for Reducing Deficit',
    url: 'https://www.cbo.gov/publication/56783',
    onClick: () => diveDeeperCitationClick('Options for Reducing Deficit'),
  },
  {
    title: 'Treasury Bulletin',
    url: 'https://fiscal.treasury.gov/reports-statements/treasury-bulletin/',
    onClick: () => diveDeeperCitationClick('Treasury Bulletin'),
  },
  {
    title: 'USAspending',
    url: 'https://www.usaspending.gov',
    onClick: () => diveDeeperCitationClick('USAspending'),
  },
];
