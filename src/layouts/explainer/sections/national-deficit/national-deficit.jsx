import React from "react";
import UnderstandingDeficit from "./understanding/understanding-deficit";
import DeficitAndSurplusCauses from "./deficit-and-surplus-causes/deficit-and-surplus-causes";
import DebtDeficitDifference from "./debt-deficit-difference/debt-deficit-difference";
import DeficitByYear from "./deficit-by-year/deficit-by-year";
import {
  deficitLearnMoreDescription,
  deficitLearnMoreLinks
} from "../../explainer-helpers/national-deficit/national-deficit-helper";
import LearnMoreSection from "../../explainer-components/learn-more/learn-more-section";
import {datasetSectionConfig} from "../../explainer-helpers/explainer-helpers";
import DeficitKeyTakeaways from "./deficit-key-takeaways/deficit-key-takeaways";

export const nationalDeficitSectionIds = [
  'key-takeaways',
  'understanding-the-national-deficit',
  'the-causes-of-deficits-and-surpluses',
  'the-difference-between-the-national-deficit-and-the-national-debt',
  'us-deficit-by-year',
  'learn-more-about-the-deficit'
];

export const nationalDeficitSectionConfigs = datasetSectionConfig['national-deficit'];

const nationalDeficitSections = [
  {
    index: 0,
    id: nationalDeficitSectionIds[0],
    title: 'Key Takeaways',
    component: (glossary, glossaryClickHandler, cpiDataByYear) => <DeficitKeyTakeaways />
  },
  {
    index: 1,
    id: nationalDeficitSectionIds[1],
    title: 'Understanding the National Deficit',
    component: (glossary, glossaryClickHandler, cpiDataByYear) =>
      <UnderstandingDeficit sectionId={nationalDeficitSectionIds[1]} glossary={glossary} glossaryClickHandler={glossaryClickHandler} />
  },
  {
    index: 2,
    id: nationalDeficitSectionIds[2],
    title: 'The Causes of Deficits and Surpluses',
    component: (glossary, glossaryClickHandler, cpiDataByYear) =>
      <DeficitAndSurplusCauses glossary={glossary} glossaryClickHandler={glossaryClickHandler} />
  },
  {
    index: 3,
    id: nationalDeficitSectionIds[3],
    title: 'The Difference Between the National Deficit and the National Debt',
    component: (glossary, glossaryClickHandler, cpiDataByYear) =>
      <DebtDeficitDifference glossary={glossary} glossaryClickHandler={glossaryClickHandler} />
  },
  {
    index: 4,
    id: nationalDeficitSectionIds[4],
    title: 'U.S. Deficit by Year',
    component: (glossary, glossaryClickHandler, cpiDataByYear) => <DeficitByYear />
  },
  {
    index: 5,
    id: nationalDeficitSectionIds[5],
    title: 'Learn More about the Deficit',
    component: (glossary, glossaryClickHandler, cpiDataByYear) =>
      <LearnMoreSection
        links={deficitLearnMoreLinks}
        description={deficitLearnMoreDescription}
      />
  }
];


export default nationalDeficitSections;

