import { IExplainerPageSection } from '../../../../models/IExplainerPageSection';
import { analyticsEventHandler } from '../../../../helpers/insights/insight-helpers';
import { ga4DataLayerPush } from '../../../../helpers/google-analytics/google-analytics-helper';
import HowSavingsBondsFinanceGovernment from './how-savings-bonds-finance-government/how-savings-bonds-finance-government';
import WhatInfluencesPurchaseOfSavingsBonds from './purchase-of-savings-bonds/what-influences-purchase-of-savings-bonds';
import SavingsBondsAreFullyMatured from './savings-bonds-are-fully-matured/savings-bonds-are-fully-matured';
import SavingsBondsOverview from './savings-bonds-overview/savings-bonds-overview';
import SavingBondsKeyTakeaway from './savings-bonds-key-takeaway/savings-bonds-key-takeaway';
import LearnMore from './learn-more/learn-more';
import React from 'react';

export const treasurySavingsBondsSectionIds = [
  'key-takeaways',
  'savings-bonds-overview',
  'how-do-savings-bonds-finance-the-federal-government',
  'what-influences-the-purchase-of-savings-bonds',
  'what-happens-when-savings-bonds-are-fully-matured',
  'learn-more-buying-and-redeeming-savings-bonds-today',
];

export const glossaryGAEvent = (term: string): void => {
  analyticsEventHandler('Explainers', 'Savings Bonds - ' + term, 'Glossary Term Click');
  ga4DataLayerPush({
    event: `Glossary Term Click`,
    eventLabel: 'Savings Bonds - ' + term,
  });
};

const treasurySavingsBondsSections: IExplainerPageSection[] = [
  {
    index: 0,
    id: treasurySavingsBondsSectionIds[0],
    title: 'Key Takeaways',
    component: cpiData => <SavingBondsKeyTakeaway />,
  },
  {
    index: 1,
    id: treasurySavingsBondsSectionIds[1],
    title: 'Savings Bonds Overview',
    component: cpiData => <SavingsBondsOverview />,
  },
  {
    index: 2,
    id: treasurySavingsBondsSectionIds[2],
    title: 'How Do Savings Bonds Help Finance the Federal Government?',
    component: cpiData => <HowSavingsBondsFinanceGovernment />,
  },
  {
    index: 3,
    id: treasurySavingsBondsSectionIds[3],
    title: 'What Influences the Purchase of Savings Bonds?',
    component: cpiData => (
      <WhatInfluencesPurchaseOfSavingsBonds cpi12MonthPercentChange={cpiData.cpi12MonthPercentChange} cpiDataByYear={cpiData.cpiDataByYear} />
    ),
  },
  {
    index: 4,
    id: treasurySavingsBondsSectionIds[4],
    title: 'What Happens when Savings Bonds are Fully Matured?',
    component: cpiData => <SavingsBondsAreFullyMatured />,
  },
  {
    index: 5,
    id: treasurySavingsBondsSectionIds[5],
    title: 'Learn More: Buying and Redeeming Savings Bonds Today',
    component: cpiData => <LearnMore />,
  },
];

export default treasurySavingsBondsSections;
