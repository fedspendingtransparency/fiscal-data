import React from 'react';
import SavingsBondsOverview from './savings-bonds-overview/savings-bonds-overview';
import WhatInfluencesPurchaseOfSavingsBonds from './purchase-of-savings-bonds/what-influences-purchase-of-savings-bonds';
import SavingBondsKeyTakeaway from './savings-bonds-key-takeaway/savings-bonds-key-takeaway';
import HowSavingsBondsFinanceGovernment from './how-savings-bonds-finance-government/how-savings-bonds-finance-government';

export const treasurySavingsBondsSectionIds = [
  'key-takeaways',
  'savings-bonds-overview',
  'how-do-savings-bonds-finance-the-federal-government',
  'what-influences-the-purchase-of-savings-bonds',
  'what-happens-when-savings-bonds-are-fully-matured',
  'learn-more-buying-and-redeeming-savings-bonds-today',
];

const treasurySavingsBondsSections = [
  {
    index: 0,
    id: treasurySavingsBondsSectionIds[0],
    title: 'Key Takeaways',
    component: cpiDataByYear => <SavingBondsKeyTakeaway />,
  },
  {
    index: 1,
    id: treasurySavingsBondsSectionIds[1],
    title: 'Savings Bonds Overview',
    component: cpiDataByYear => <SavingsBondsOverview />,
  },
  {
    index: 2,
    id: treasurySavingsBondsSectionIds[2],
    title: 'How Do Savings Bonds Help Finance the Federal Government?',
    component: cpiDataByYear => <HowSavingsBondsFinanceGovernment />,
  },
  {
    index: 3,
    id: treasurySavingsBondsSectionIds[3],
    title: 'What Influences the Purchase of Savings Bonds?',
    component: cpiDataByYear => <WhatInfluencesPurchaseOfSavingsBonds />,
  },
  {
    index: 4,
    id: treasurySavingsBondsSectionIds[4],
    title: 'What Happens when Savings Bonds are Fully Matured?',
    component: cpiDataByYear => <div />,
  },
  {
    index: 5,
    id: treasurySavingsBondsSectionIds[5],
    title: 'Learn More: Buying and Redeeming Savings Bonds Today',
    component: cpiDataByYear => <div />,
  },
];

export default treasurySavingsBondsSections;
