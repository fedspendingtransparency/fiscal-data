import {deficitExplainerLightSecondary} from "../../national-deficit.module.scss";
import {
  folderVis,
  folderVisContainer,
  title,
  folderContent,
  tabEdgeLeft,
  tabEdgeRight,
  tabBaselineWhiteout
}
from "./surplus-illustration.module.scss";
import surplus from "../../../../../../images/explainer/national-deficit/surplus.png";
import balancedBudget
  from "../../../../../../images/explainer/national-deficit/balanced-budget.png";
import deficit from "../../../../../../images/explainer/national-deficit/deficit.png";
import React from "react";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {withWindowSize} from "react-fns";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {breakpointLg} from "../../../../../../variables.module.scss";
import GlossaryTerm from "../../../../../../components/glossary-term/glossary-term";
import FolderTabEdgeRight from "./folder-illustration-svgs/folder-tab-edge-right";
import FolderTabEdgeLeft from "./folder-illustration-svgs/folder-tab-edge-left";


const SurplusIllustration = ({glossary, width}) => {
  const tabListStyle = {
    margin:'0',
    borderColor:deficitExplainerLightSecondary,
    borderWidth:'0.125rem',
    borderBottom:'0',
    display:'flex',
    justifyContent:'center'
  };

  const tabStyleDesktop = {
    position: 'relative',
    borderTopColor:deficitExplainerLightSecondary,
    borderBottom:'0',
    borderTopWidth:'0.125rem',
    borderLeft: '0',
    borderRight: '0',
    margin: '0 0.875rem',
    borderRadius: '0 0 0 0'
  };
  const tabStyleMobile = {
    borderColor:deficitExplainerLightSecondary,
    boxShadow:`.25rem .25rem ${deficitExplainerLightSecondary}`,
    borderBottom:'0',
    borderWidth:'2px',
    borderRadius: '5px 5px 0 0',
    margin: '0 0.25rem',
    bottom: '-0.125rem',
    padding: '0.375rem 0.75rem 0.188rem'
  };

  const tabStyle = width < pxToNumber(breakpointLg) ? tabStyleMobile : tabStyleDesktop;

  const balancedBudgetGlossary =
    <GlossaryTerm term={'balanced budget'} page={'Deficit Explainer'} glossary={glossary}>
      balanced budget
    </GlossaryTerm>

  return (
    <div className={folderVisContainer} data-testid={'surplus-illustration'}>
      <Tabs>
        <TabList style={tabListStyle}>
          <Tab style={tabStyle}>
              <div className={tabBaselineWhiteout} />
              <FolderTabEdgeLeft />
            <div className={title}>
              Surplus
            </div>
            <FolderTabEdgeRight />
          </Tab>
          <Tab style={tabStyle}>
            <div className={tabBaselineWhiteout} />
            <FolderTabEdgeLeft />
            <div className={title}>
              Balanced Budget
            </div>
            <FolderTabEdgeRight />
          </Tab>
          <Tab style={tabStyle}>
            <div className={tabBaselineWhiteout} />
            <FolderTabEdgeLeft />
            <div className={title}>
              Deficit
            </div>
            <FolderTabEdgeRight />
          </Tab>
        </TabList>
        <TabPanel>
          <div className={folderVis}>
            <div className={folderContent}>
              <img src={surplus} alt="" data-testid={"surplus-image"} />
              <div>
                <p>
                  A <i>surplus</i> occurs when the government collects more money than it spends.
                </p>
                <p>
                  The last surplus for the federal government was in 2001.
                </p>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className={folderVis}>
            <div className={folderContent}>
              <img src={balancedBudget} alt="" data-testid={"balanced-budget-image"} />
              <div>
                <p>
                  A <i>{balancedBudgetGlossary}</i> occurs when the amount the government spends
                  equals the amount the government collects.
                </p>
                <p>
                  Sometimes the term balanced budget is used more broadly to refer
                  to instances where there is no deficit.
                </p>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className={folderVis}>
            <div className={folderContent}>
              <img src={deficit} alt="" data-testid={"deficit-image"} />
              <div>
                <p>
                  A <i>deficit</i> occurs when the government spends more money than it collects.
                </p>
                <p>
                  The federal government has run deficits for the last 20 years.
                </p>
              </div>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default withWindowSize(SurplusIllustration);
