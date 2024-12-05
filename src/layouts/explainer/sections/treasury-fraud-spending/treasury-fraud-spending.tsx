import React from 'react';
import { IExplainerPageSection } from '../../../../models/IExplainerPageSection';
import KeyTakeawaysSection from './key-takeaways/treasury-fraud-spending-key-takeaways';
import OverviewSection from './overview/overview';
import PreventFraudSection from './prevent-fraud/prevent-fraud';
import ReduceFraudSection from './reduce-fraud/reduce-fraud';
import LearnMoreSection from './learn-more/learn-more';

export const treasuryFraudSpendingSectionIds = [
  'key-takeaways',
  'fraud-spending-overview',
  'what-is-the-treasury-doing-to-prevent-fraud',
  'need-to-go-next-to-reduce-fraud',
  'learn-more-about-fraud',
];

const treasuryFraudSpendingSections: IExplainerPageSection[] = [
  {
    index: 0,
    id: treasuryFraudSpendingSectionIds[0],
    title: 'Key Takeaways',
    component: cpiData => <KeyTakeawaysSection />,
  },
  {
    index: 1,
    id: treasuryFraudSpendingSectionIds[1],
    title: 'Fraud Spending Overview',
    component: cpiData => <OverviewSection />,
  },
  {
    index: 2,
    id: treasuryFraudSpendingSectionIds[2],
    title: 'What Is The Treasury Doing To Prevent Fraud?',
    component: cpiData => <PreventFraudSection />,
  },
  {
    index: 3,
    id: treasuryFraudSpendingSectionIds[3],
    title: 'Where Will The Treasury And The Federal Government To Go To Next To Radically Reduce Fraud?',
    component: cpiData => <ReduceFraudSection />,
  },
  {
    index: 4,
    id: treasuryFraudSpendingSectionIds[4],
    title: 'Learn More About Fraud',
    component: cpiData => <LearnMoreSection />,
  },
];

export default treasuryFraudSpendingSections;
