import React from 'react';

export const savingsBondsSectionIds = [
  'key-takeaways',
  'savings-bonds-overview',
  'how-do-savings-bonds-finance-the-federal-government',
  'what-influences-the-purchase-of-savings-bonds',
  'what-happens-when-savings-bonds-are-fully-matured',
  'learn-more-buying-and-redeeming-savings-bonds-today',
];

const savingsBondsSections = [
  {
    index: 0,
    id: savingsBondsSectionIds[0],
    title: 'Key Takeaways',
    component: cpiDataByYear => <div />,
  },
  {
    index: 1,
    id: savingsBondsSectionIds[1],
    title: 'Savings Bonds Overview',
    component: cpiDataByYear => <div />,
  },
  {
    index: 2,
    id: savingsBondsSectionIds[2],
    title: 'How Do Savings Bonds Finance the Federal Government?',
    component: cpiDataByYear => <div />,
  },
  {
    index: 3,
    id: savingsBondsSectionIds[3],
    title: 'What Influences the Purchase of Savings Bonds?',
    component: cpiDataByYear => <div />,
  },
  {
    index: 4,
    id: savingsBondsSectionIds[4],
    title: 'What Happens when Savings Bonds are Fully Matured?',
    component: cpiDataByYear => <div />,
  },
  {
    index: 5,
    id: savingsBondsSectionIds[5],
    title: 'Learn More: Buying and Redeeming Savings Bonds Today',
    component: cpiDataByYear => <div />,
  },
];

export default savingsBondsSections;
