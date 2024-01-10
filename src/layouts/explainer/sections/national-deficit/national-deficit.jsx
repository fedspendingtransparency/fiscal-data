import React from 'react';
import UnderstandingDeficit from './understanding/understanding-deficit';
import DeficitAndSurplusCauses from './deficit-and-surplus-causes/deficit-and-surplus-causes';
import DebtDeficitDifference from './debt-deficit-difference/debt-deficit-difference';
import DeficitByYear from './deficit-by-year/deficit-by-year';
import { deficitLearnMoreDescription, deficitLearnMoreLinks } from '../../explainer-helpers/national-deficit/national-deficit-helper';
import LearnMoreSection from '../../explainer-components/learn-more/learn-more-section';
import { datasetSectionConfig } from '../../explainer-helpers/explainer-helpers';
import DeficitKeyTakeaways from './deficit-key-takeaways/deficit-key-takeaways';

export const nationalDeficitSectionIds = [
  'key-takeaways',
  'understanding-the-national-deficit',
  'the-causes-of-deficits-and-surpluses',
  'the-difference-between-the-national-deficit-and-the-national-debt',
  'us-deficit-by-year',
  'learn-more-about-the-deficit',
];

export const nationalDeficitSectionConfigs = datasetSectionConfig['national-deficit'];

const nationalDeficitSections = [
  {
    index: 0,
    id: nationalDeficitSectionIds[0],
    title: 'Key Takeaways',
    component: cpiDataByYear => <DeficitKeyTakeaways />,
    target: true,
  },
  {
    index: 1,
    id: nationalDeficitSectionIds[1],
    title: 'Understanding the National Deficit',
    component: cpiDataByYear => <UnderstandingDeficit sectionId={nationalDeficitSectionIds[1]} />,
    target: true,
  },
  {
    index: 2,
    id: nationalDeficitSectionIds[2],
    title: 'The Causes of Deficits and Surpluses',
    component: cpiDataByYear => <DeficitAndSurplusCauses />,
    target: true,
  },
  {
    index: 3,
    id: nationalDeficitSectionIds[3],
    title: 'The Difference Between the National Deficit and the National Debt',
    component: cpiDataByYear => <DebtDeficitDifference />,
    target: true,
  },
  {
    index: 4,
    id: nationalDeficitSectionIds[4],
    title: 'U.S. Deficit by Year',
    component: cpiDataByYear => <DeficitByYear />,
    target: true,
  },
  {
    index: 5,
    id: nationalDeficitSectionIds[5],
    title: 'Learn More about the Deficit',
    component: cpiDataByYear => <LearnMoreSection links={deficitLearnMoreLinks} description={deficitLearnMoreDescription} />,
    target: true,
  },
];

export default nationalDeficitSections;
