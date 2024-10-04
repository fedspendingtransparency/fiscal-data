import React from 'react';
import { explainerCitationsMap } from '../explainer-helpers';

export const deficitLearnMoreLinks = [
  {
    title: 'America’s Fiscal Future',
    url: 'https://www.gao.gov/americas-fiscal-future',
    eventNumber: '19',
  },
  {
    title: 'An Update to the Budget and Economic Outlook: 2021 to 2031',
    url: 'https://www.cbo.gov/publication/57339',
    eventNumber: '20',
  },
  {
    title: 'Congressional Budget Office Topics – Budget',
    url: 'https://www.cbo.gov/topics/budget',
    eventNumber: '21',
  },
  {
    title: 'Federal Deficits, Growing Debt, and the Economy in the Wake of COVID 19',
    url: 'https://crsreports.congress.gov/product/pdf/R/R46729',
    eventNumber: '22',
  },
  {
    title: 'President’s Budget – Historical Tables',
    url: 'https://www.whitehouse.gov/omb/historical-tables/',
    eventNumber: '23',
  },
  {
    title: 'FY 2022 Final Monthly Treasury Statement',
    url: 'https://fiscaldata.treasury.gov/static-data/published-reports/mts/MonthlyTreasuryStatement_202209.pdf',
    eventNumber: '24',
    id: 'Monthly Treasury Statement',
  },
];

export const deficitLearnMoreDescription = `For more information about the national deficit, please
  explore more of Fiscal Data and check out the extensive resources listed below.`;

const { mts, github } = explainerCitationsMap['national-deficit'];

export const nationalDeficitDataSources = (
  <>
    The {mts} dataset provides all deficit, spending, and revenue values on this page. For detailed documentation, users can reference our {github}.
  </>
);
