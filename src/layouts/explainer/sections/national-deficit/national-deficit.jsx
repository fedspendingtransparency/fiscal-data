import React from "react";
import UnderstandingDeficit from "./understanding/understanding-deficit";
import DeficitAndSurplusCauses from "./deficit-and-surplus-causes/deficit-and-surplus-causes";
import DebtDeficitDifference from "./debt-deficit-difference/debt-deficit-difference";
import DeficitByYear from "./deficit-by-year/deficit-by-year";
import {
  deficitExplainerLightSecondary,
  deficitExplainerPrimary
} from "./national-deficit.module.scss";
import KeyTakeawaysSection from "../../explainer-components/key-takeaways/key-takeaways-section";
import {
  deficitKeyTakeaways,
  deficitLearnMoreDescription,
  deficitLearnMoreLinks
} from "../../explainer-helpers/national-deficit/national-deficit-helper";
import LearnMoreSection from "../../explainer-components/learn-more/learn-more-section";
import {datasetSectionConfig} from "../../explainer-helpers/explainer-helpers";

export const nationalDeficitSectionIds = [
  'key-takeaways',
  'understanding',
  'causes-and-surpluses',
  'deficit-vs-debt',
  'deficit-by-year',
  'learn-more'
];

export const nationalDeficitSectionConfigs = datasetSectionConfig['national-deficit'];

const nationalDeficitSections = [
  {
    index: 0,
    id: nationalDeficitSectionIds[0],
    title: 'Key Takeaways',
    component: (glossary, cpiDataByYear) =>
      <KeyTakeawaysSection takeaways={deficitKeyTakeaways}
                           primaryColor={deficitExplainerPrimary}
                           secondaryColor={deficitExplainerLightSecondary}
      />
  },
  {
    index: 1,
    id: nationalDeficitSectionIds[1],
    title: 'Understanding the National Deficit',
    component: (glossary, cpiDataByYear) =>
      <UnderstandingDeficit sectionId={nationalDeficitSectionIds[1]} />
  },
  {
    index: 2,
    id: nationalDeficitSectionIds[2],
    title: 'The Causes of Deficits and Surpluses',
    component: (glossary, cpiDataByYear) => <DeficitAndSurplusCauses />
  },
  {
    index: 3,
    id: nationalDeficitSectionIds[3],
    title: 'The Difference Between the National Deficit and the National Debt',
    component: (glossary, cpiDataByYear) => <DebtDeficitDifference />
  },
  {
    index: 4,
    id: nationalDeficitSectionIds[4],
    title: 'U.S. Deficit by Year',
    component: (glossary, cpiDataByYear) => <DeficitByYear />
  },
  {
    index: 5,
    id: nationalDeficitSectionIds[5],
    title: 'Learn More about the Deficit',
    component: (glossary, cpiDataByYear) =>
      <LearnMoreSection
        links={deficitLearnMoreLinks}
        description={deficitLearnMoreDescription}
      />
  }
];


export default nationalDeficitSections;

