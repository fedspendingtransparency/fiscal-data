import React from 'react';
import SpendingKeyTakeaways from './key-takeaways/spending-key-takeaways';
import { SpendingOverview } from './overview/spending-overview';
import { SpendingCategories } from './spending-categories/spending-categories';
import SpendingDifference from './spending-difference/spending-difference';
import { SpendingTrends } from './spending-trends/spending-trends';
import { explainerCitationsMap } from '../../explainer-helpers/explainer-helpers';

export const federalSpendingSectionIds = [
  'key-takeaways',
  'federal-spending-overview',
  'spending-categories',
  'the-difference-between-mandatory-discretionary-and-supplemental-spending',
  'spending-trends-over-time-and-the-us-economy',
];

const { mtsSummary, bls, beaSurvey, github } = explainerCitationsMap['federal-spending'];

export const federalSpendingDataSources = (
  <>
    {/* eslint-disable-next-line max-len */}
    The {mtsSummary} datasets provide all spending values on this page. Adjustments for inflation are calculated using Consumer Price Index (CPI) values
    from the {bls}. If CPI data is delayed or missing, the latest available value for the given month is used.
    Fiscal year Gross Domestic Product values from the {beaSurvey} are calculated by averaging four relevant quarterly values from
    calendar year quarter 4 of the prior year through calendar year quarter 3 of the fiscal year shown. For detailed documentation, users can
    reference our {github}.
  </>
);

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
  },
  {
    index: 2,
    id: federalSpendingSectionIds[2],
    title: 'Spending Categories',
    component: cpiData => <SpendingCategories />,
  },
  {
    index: 3,
    id: federalSpendingSectionIds[3],
    title: 'The Difference Between Mandatory, Discretionary, and Supplemental Spending',
    component: cpiData => <SpendingDifference />,
  },
  {
    index: 4,
    id: federalSpendingSectionIds[4],
    title: 'Spending Trends Over Time and the U.S. Economy',
    component: cpiData => <SpendingTrends cpiDataByYear={cpiData.cpiDataByYear} />,
  },
];

export default federalSpendingSection;
