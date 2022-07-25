import {
  folderVis,
  folderVisContainer,
  understandingDeficitContainer,
  understandingVisContainer,
  textContent
} from "./understanding-deficit.module.scss";
import {deficitExplainerPrimary} from "../national-deficit.module.scss";
import sampleImg from "../../../../../../static/topic-icons/debt.png";
import {visWithCallout} from "../../../explainer.module.scss";
import VisualizationCallout
  from "../../../../../components/visualization-callout/visualization-callout";
import React from "react";
import DeficitComparisonBarChart from "./deficit-comparison-bar-chart/deficit-comparison-bar-chart";

const UnderstandingDeficitFolderVis = () => (
  <div className={folderVisContainer} data-testid={'folderVis'}>
    <div className={folderVis}>
      <img src={sampleImg} alt="placeholder alt text" />
      <p>
        Deficit / Surplus vis placeholder
      </p>
    </div>
  </div>
);

const UnderstandingDeficit = () => (
  <div className={understandingDeficitContainer}>
    <div className={visWithCallout}>
      <div className={textContent} data-testid={'textContent'}>
        <p>
          A budget deficit occurs when money going out (spending) exceeds money coming in (revenue)
          during a defined period. In FY YYYY (latest complete fiscal year), the federal government
          spent $XX.XX trillion and collected $XX.XX trillion in revenue, resulting in a deficit.
          The amount by which spending exceeds revenue, $XX.XX trillion in YYYY (latest complete
          fiscal year), is referred to as deficit spending.
        </p>
        <p>
          The opposite of a budget deficit is a budget surplus, which occurs when the federal
          government collects more money than it spends. The U.S. has experienced a fiscal year-end
          budget surplus five times in the last 50 years, most recently in 2001.
        </p>
        <p>
          When there is no deficit or surplus due to spending and revenue being equal,
          the budget is considered balanced.
        </p>
      </div>
      <VisualizationCallout color={deficitExplainerPrimary} textWithCallout={true}>
        <p>
          The terms “national deficit”, “federal deficit” and “U.S. deficit” have the same meaning
          and are used interchangeably by the U.S. Treasury.
        </p>
      </VisualizationCallout>
    </div>
    <UnderstandingDeficitFolderVis />
    <p>
      The chart below provides a breakdown of how the U.S. deficit compares to the corresponding
      revenue and spending.
    </p>
    <DeficitComparisonBarChart />
  </div>
);

export default UnderstandingDeficit;
