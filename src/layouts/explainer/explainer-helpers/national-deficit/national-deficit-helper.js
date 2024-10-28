import React from 'react';
import { analyticsEventHandler, explainerCitationsMap } from '../explainer-helpers';

const diveDeeperCitationClick = eventLabel => {
  analyticsEventHandler(eventLabel, 'Deficit Citation Click');
};

export const deficitLearnMoreLinks = [
  {
    title: 'America’s Fiscal Future',
    url: 'https://www.gao.gov/americas-fiscal-future',
    onClick: () => diveDeeperCitationClick('America’s Fiscal Future'),
  },
  {
    title: 'An Update to the Budget and Economic Outlook: 2021 to 2031',
    url: 'https://www.cbo.gov/publication/57339',
    onClick: () => diveDeeperCitationClick('An Update to the Budget and Economic Outlook: 2021 to 2031'),
  },
  {
    title: 'Congressional Budget Office Topics – Budget',
    url: 'https://www.cbo.gov/topics/budget',
    onClick: () => diveDeeperCitationClick('Congressional Budget Office Topics – Budget'),
  },
  {
    title: 'Federal Deficits, Growing Debt, and the Economy in the Wake of COVID 19',
    url: 'https://crsreports.congress.gov/product/pdf/R/R46729',
    onClick: () => diveDeeperCitationClick('Federal Deficits, Growing Debt, and the Economy in the Wake of COVID 19'),
  },
  {
    title: 'President’s Budget – Historical Tables',
    url: 'https://www.whitehouse.gov/omb/historical-tables/',
    onClick: () => diveDeeperCitationClick('President’s Budget – Historical Tables'),
  },
  {
    title: 'FY 2022 Final Monthly Treasury Statement',
    url: 'https://fiscaldata.treasury.gov/static-data/published-reports/mts/MonthlyTreasuryStatement_202209.pdf',
    onClick: () => diveDeeperCitationClick('FY 2022 Final Monthly Treasury Statement'),
    id: 'Monthly Treasury Statement',
  },
];

export const deficitLearnMoreDescription = `For more information about the national deficit, please
  explore more of Fiscal Data and check out the extensive resources listed below.`;

const { mtsSummaryReceipts, github } = explainerCitationsMap['national-deficit'];

export const nationalDeficitDataSources = (
  <>
    The {mtsSummaryReceipts} dataset provides all deficit, spending, and revenue values on this page. For detailed documentation, users can reference
    our {github}.
  </>
);
