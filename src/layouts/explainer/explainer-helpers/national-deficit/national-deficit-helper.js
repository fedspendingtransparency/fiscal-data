import CustomLink from '../../../../components/links/custom-link/custom-link';
import React from 'react';
import Analytics from '../../../../utils/analytics/analytics';
const analyticsClickHandler = section => {
  Analytics.event({
    category: 'Explainers',
    action: 'Deficit Citation Click',
    label: `Deficit - Deficit Citation Click`,
  });
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'dap_event',
    event_category: 'Debt Citation Click',
    event_label: `Deficit - ${section}`,
  });
};

export const deficitLearnMoreLinks = [
  {
    title: 'America’s Fiscal Future',
    url: 'https://www.gao.gov/americas-fiscal-future',
    eventNumber: '19',
    onClick: () => analyticsClickHandler("America's Fiscal Future"),
  },
  {
    title: 'An Update to the Budget and Economic Outlook: 2021 to 2031',
    url: 'https://www.cbo.gov/publication/57339',
    eventNumber: '20',
    onClick: () => analyticsClickHandler('An Update to the Budget and Economic Outlook'),
  },
  {
    title: 'Congressional Budget Office Topics – Budget',
    url: 'https://www.cbo.gov/topics/budget',
    eventNumber: '21',
    onClick: () => analyticsClickHandler('Budget'),
  },
  {
    title: 'Federal Deficits, Growing Debt, and the Economy in the Wake of COVID 19',
    url: 'https://crsreports.congress.gov/product/pdf/R/R46729',
    eventNumber: '22',
    onClick: () => analyticsClickHandler('Federal Deficits, Growing Debt, and the Economy in the Wake of COVID 19'),
  },
  {
    title: 'President’s Budget – Historical Tables',
    url: 'https://www.whitehouse.gov/omb/historical-tables/',
    eventNumber: '23',
    onClick: () => analyticsClickHandler('Historical Tables'),
  },
  {
    title: 'FY 2022 Final Monthly Treasury Statement',
    url: 'https://fiscaldata.treasury.gov/static-data/published-reports/mts/MonthlyTreasuryStatement_202209.pdf',
    eventNumber: '24',
    id: 'Monthly Treasury Statement',
    onClick: () => analyticsClickHandler('Monthly Treasury Statement'),
  },
];

export const deficitLearnMoreDescription = `For more information about the national deficit, please
  explore more of Fiscal Data and check out the extensive resources listed below.`;

const mst = (
  <CustomLink
    url="/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays-of-the-u-s-government"
    eventNumber="28"
    id="Monthly Treasury Statement"
  >
    Monthly Treasury Statement (MTS)
  </CustomLink>
);
const github = (
  <CustomLink
    url="https://github.com/fedspendingtransparency/fiscal-data/tree/master/documentation"
    eventNumber="29"
    onClick={() => analyticsClickHandler('DS&M Github')}
  >
    GitHub repository
  </CustomLink>
);

export const nationalDeficitDataSources = (
  <>
    The {mst} dataset provides all deficit, spending, and revenue values on this page. For detailed documentation, users can reference our {github}.
  </>
);
