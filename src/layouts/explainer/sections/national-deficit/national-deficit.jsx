import React from "react";
import DeficitKeyTakeaways from "./key-takeaways/deficit-key-takeaways";
import UnderstandingDeficit from "./understanding/understanding-deficit";
import DeficitAndSurplusCauses from "./causes/deficit-and-surplus-causes";
import DebtDeficitDifference from "./difference/debt-deficit-difference";
import DeficitByYear from "./deficit-by-year/deficit-by-year";
import DeficitLearnMore from "./learn-more/deficit-learn-more";
import CustomLink from "../../../../components/links/custom-link/custom-link";


export const sampleCopy = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
  esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
  in culpa qui officia deserunt mollit anim id est laborum.
`

export const smallSampleCopy = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
  eiusmod tempor incididunt ut labore et dolore magna aliqua.
`

export const ChartPlaceholder = () => (
  <div
    style={{
      height: 500,
      marginTop: '16px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      backgroundColor: '#555'
    }}
  >
    Placeholder
  </div>
);

const mst =
  <CustomLink url={'/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays-of-the-u-s-government'}>
    Monthly Treasury Statement (MTS)
  </CustomLink>;
const github =
  <CustomLink url={'https://github.com/fedspendingtransparency/fiscal-data/tree/master/documentation'}>
    GitHub repository
  </CustomLink>;

export const nationalDeficitDataSources = (
  <>
    The {mst} dataset provides all deficit, spending, and revenue values
    on this page. For detailed documentation, users can reference our {github}.
  </>
);

export const nationalDeficitSectionIds = [
  'key-takeaways',
  'understanding',
  'causes-and-surpluses',
  'deficit-vs-debt',
  'deficit-by-year',
  'learn-more'
];


const nationalDeficitSections = [
  {
    index: 0,
    id: nationalDeficitSectionIds[0],
    title: 'Key Takeaways',
    component: (glossary, cpiDataByYear) => <DeficitKeyTakeaways />
  },
  {
    index: 1,
    id: nationalDeficitSectionIds[1],
    title: 'Understanding the National Deficit',
    component: (glossary, cpiDataByYear) => <UnderstandingDeficit />
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
    component: (glossary, cpiDataByYear) => <DeficitLearnMore />
  }
];


export default nationalDeficitSections;

