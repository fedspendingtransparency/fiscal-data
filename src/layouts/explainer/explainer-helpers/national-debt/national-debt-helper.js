import Analytics from '../../../../utils/analytics/analytics';
import CustomLink from '../../../../components/links/custom-link/custom-link';
import React from 'react';


export const deficitLink = (
  <CustomLink
    url={'/americas-finance-guide/national-deficit/'}
    id="National Deficit"
  >
    deficit
  </CustomLink>
);

export const spendingLink = (copy) => (
  <CustomLink
    url={'/americas-finance-guide/federal-spending/'}
    id="Federal Spending"
  >
    {copy}
  </CustomLink>
);
export const analyticsClickHandler = (action, section) => {
  Analytics.event({
    category: "Explainers",
    action: action,
    label: `Debt - ${section}`,
  });
};

const diveDeeperCitationClick = () =>
  analyticsClickHandler("Citation Click", "Dive Deeper into the Debt");

export const debtLearnMoreLinks = [
  {
    title: 'The most recent U.S. Government Financial Report',
    url: 'https://fiscaldata.treasury.gov/static-data/published-reports/frusg/FRUSG_2022.pdf',
    onClick: () => diveDeeperCitationClick()
  },
  {
    title: 'America’s Fiscal Future: Federal Debt',
    url: 'https://www.gao.gov/americas-fiscal-future/federal-debt',
    onClick: () => diveDeeperCitationClick()
  },
  {
    title: 'The Debt Ceiling: An Explainer',
    url: 'https://www.whitehouse.gov/cea/written-materials/2021/10/06/the-debt-ceiling-an-explainer/',
    onClick: () => diveDeeperCitationClick()
  },
  {
    title: 'Federal Borrowing and Debt',
    url: 'https://www.whitehouse.gov/wp-content/uploads/2021/05/ap_4_borrowing_fy22.pdf',
    onClick: () => diveDeeperCitationClick()
  },
  {
    title: 'Federal Net Interest Costs: A Primer',
    url: 'https://www.cbo.gov/publication/56910',
    onClick: () => diveDeeperCitationClick()
  },
  {
    title: 'Is the Federal Reserve Printing Money in Order to Buy Treasury Securities?',
    url: 'https://www.federalreserve.gov/faqs/money_12853.htm',
    onClick: () => diveDeeperCitationClick()
  },
  {
    title: 'Options for Reducing Deficit',
    url: 'https://www.cbo.gov/publication/56783',
    onClick: () => diveDeeperCitationClick()
  },
  {
    title: 'Treasury Bulletin',
    url: 'https://fiscal.treasury.gov/reports-statements/treasury-bulletin/',
    onClick: () => diveDeeperCitationClick()
  },
  {
    title: 'USAspending',
    url: 'https://www.usaspending.gov',
    onClick: () => diveDeeperCitationClick()
  },
];
