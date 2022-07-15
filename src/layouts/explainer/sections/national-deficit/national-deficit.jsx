import React from "react";
import sampleImg from '../../../../../static/topic-icons/debt.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faPercent, faPollH } from "@fortawesome/free-solid-svg-icons";
import Accordion from "../../../../components/accordion/accordion";
import { visWithCallout } from "../../explainer.module.scss";
import VisualizationCallout from "../../../../components/visualization-callout/visualization-callout";
import {
  icon,
  iconBackground,
  keyTakeawaysContent,
  noMarginBottom,
  offsetIcon,
  understandingDeficitContent,
  deficitByYearContent,
  folderVisContainer,
  folderVis,
  calloutText,
  understandingVisContainer,
  deficitDebtDifferenceContent,
  deficitDebtDifferenceVisContainer,
  deficitExplainerPrimary
} from "./national-deficit.module.scss";
import DeficitKeyTakeaways from "./key-takeaways/deficit-key-takeaways";


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

export const nationalDeficitSectionIds = [
  'key-takeaways',
  'understanding',
  'causes-and-surpluses',
  'deficit-vs-debt',
  'deficit-by-year',
  'learn-more'
];



const UnderstandingDeficitFolderVis = () => (
  <div className={folderVisContainer}>
    <div className={folderVis}>
      <img src={sampleImg} alt="placeholder alt text" />
      <p>{smallSampleCopy}</p>
    </div>
  </div>
);

const UnderstandingDeficitSection = () => (
  <div className={understandingDeficitContent}>
    <div className={visWithCallout}>
      <p>
        {sampleCopy}
        {sampleCopy}
      </p>
      <VisualizationCallout color={deficitExplainerPrimary} textWithCallout={true}>
        <p className={calloutText}>{smallSampleCopy}</p>
      </VisualizationCallout>
    </div>
    <UnderstandingDeficitFolderVis />
    <p>{smallSampleCopy}</p>
    <div className={visWithCallout}>
      <div className={understandingVisContainer}>
        <ChartPlaceholder />
      </div>
      <VisualizationCallout color={deficitExplainerPrimary}>
        <p className={calloutText}>{smallSampleCopy}</p>
      </VisualizationCallout>
    </div>
  </div>
);

const CausesAndSurplusesSection = () => (
  <>
    <p>
      {sampleCopy}
      {sampleCopy}
    </p>
  </>
);

export const DeficitDebtDifferenceSection = () => (
  <>
    <div className={deficitDebtDifferenceContent}>
      <p>{sampleCopy}</p>
      <div className={deficitDebtDifferenceVisContainer}>
        <ChartPlaceholder />
      </div>
      <Accordion
        title="How else does the federal government finance a deficit?"
        altStyleAccordion={{
          color:deficitExplainerPrimary,
          fontSize: '18px',
          borderColor:deficitExplainerPrimary,
          borderWidth:'1px'
        }}
        altStyleIcon={{
          color:deficitExplainerPrimary
        }}
        altStyleContent={{
          borderColor:deficitExplainerPrimary
        }}
      >
        <p>{smallSampleCopy}</p>
      </Accordion>
    </div>
  </>
);

const DeficitByYearSection = () => (
  <div className={deficitByYearContent}>
    <p>{sampleCopy}</p>
    <div className={visWithCallout}>
      <ChartPlaceholder />
      <VisualizationCallout color={deficitExplainerPrimary}>
        <p>{smallSampleCopy}</p>
      </VisualizationCallout>
    </div>
  </div>
);

const LearnMoreSection = () => (
  <>
    <p>{smallSampleCopy}</p>
  </>
);

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
    component: (glossary, cpiDataByYear) => <UnderstandingDeficitSection />
  },
  {
    index: 2,
    id: nationalDeficitSectionIds[2],
    title: 'The Causes of Deficits and Surpluses',
    component: (glossary, cpiDataByYear) => <CausesAndSurplusesSection />
  },
  {
    index: 3,
    id: nationalDeficitSectionIds[3],
    title: 'The Difference Between the National Deficit and the National Debt',
    component: (glossary, cpiDataByYear) => <DeficitDebtDifferenceSection />
  },
  {
    index: 4,
    id: nationalDeficitSectionIds[4],
    title: 'U.S. Deficit by Year',
    component: (glossary, cpiDataByYear) => <DeficitByYearSection />
  },
  {
    index: 5,
    id: nationalDeficitSectionIds[5],
    title: 'Learn More about the Deficit',
    component: (glossary, cpiDataByYear) => <LearnMoreSection />
  }
];


export default nationalDeficitSections;

