import React from 'react';
import SpendingKeyTakeaways from './key-takeaways/spending-key-takeaways';
import { SpendingOverview } from './overview/spending-overview';
import { SpendingCategories } from './spending-categories/spending-categories';
import SpendingDifference from './spending-difference/spending-difference';
import { SpendingTrends } from './spending-trends/spending-trends';
import Analytics from '../../../../utils/analytics/analytics';

export const federalSpendingSectionIds = [
  'key-takeaways',
  'federal-spending-overview',
  'spending-categories',
  'the-difference-between-mandatory-discretionary-and-supplemental-spending',
  'spending-trends-over-time-and-the-us-economy',
];

export const analyticsClickHandler = section => {
  Analytics.event({
    category: 'Explainers',
    action: 'Spending Citation Click',
    label: `Spending - ${section}`,
  });
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'dap_event',
    event_category: 'Fiscal Data - Explainers',
    event_label: `Spending - ${section}`,
  });
};

const federalSpendingSection = [
  {
    index: 0,
    id: federalSpendingSectionIds[0],
    title: 'Key Takeaways',
    component: cpiData => <SpendingKeyTakeaways />,
  },
  {
    index: 1,
    id: federalSpendingSectionIds[1],
    title: 'Federal Spending Overview',
    component: cpiData => <SpendingOverview />,
    onClick: () => analyticsClickHandler('Spending - Federal Spending Overview'),
  },
  {
    index: 2,
    id: federalSpendingSectionIds[2],
    title: 'Spending Categories',
    component: cpiData => <SpendingCategories />,
    onClick: () => analyticsClickHandler('Spending - Spending Categories\n'),
  },
  {
    index: 3,
    id: federalSpendingSectionIds[3],
    title: 'The Difference Between Mandatory, Discretionary, and Supplemental Spending',
    component: cpiData => <SpendingDifference />,
    onClick: () => analyticsClickHandler('Spending - Difference Between Mandatory, Discretionary, and Supplemental Spending'),
  },
  {
    index: 4,
    id: federalSpendingSectionIds[4],
    title: 'Spending Trends Over Time and the U.S. Economy',
    component: cpiData => <SpendingTrends cpiDataByYear={cpiData.cpiDataByYear} />,
    onClick: () => analyticsClickHandler('Spending - Spending Trends Over Time and the U.S. Economy'),
  },
];

export default federalSpendingSection;
