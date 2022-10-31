import {deficitExplainerLightSecondary} from "../../national-deficit.module.scss";
import {
  folderVis,
  folderVisContainer,
  title,
  folderContent,
  tabBaselineWhiteout,
  folderWhiteOutLine
}
from "./surplus-illustration.module.scss";
import surplus from "../../../../../../images/explainer/national-deficit/surplus.png";
import balancedBudget
  from "../../../../../../images/explainer/national-deficit/balanced-budget.png";
import deficit from "../../../../../../images/explainer/national-deficit/deficit.png";
import React, {useEffect} from "react";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {withWindowSize} from "react-fns";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {breakpointLg} from "../../../../../../variables.module.scss";
import GlossaryTerm from "../../../../../../components/glossary-term/glossary-term";
import FolderTabEdgeRight from "./folder-illustration-svgs/folder-tab-edge-right";
import FolderTabEdgeRightLast from "./folder-illustration-svgs/folder-tab-edge-right-last";
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
    paddingRight: '1.25rem',
    paddingLeft: '1.25rem',
    borderRadius: '0 0 0 0'
  };
  const tabStyleMobile = {
    borderColor:deficitExplainerLightSecondary,
    borderBottom:'0',
    borderTopWidth: '2px',
    borderLeft: '0',
    borderRight: '0',
    borderRadius: '0 0 0 0',
    marginRight: '0.55rem',
    marginLeft: '0.55rem',
    paddingRight: '8px',
    paddingLeft: '8px',
  };

  let renderCounter = 0;

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.innerHTML.includes('Balanced Budget') && renderCounter < 2) {
          entry.target.classList.add('bounce');
          renderCounter += 1;
        }
        else if (entry.target.innerHTML.includes('Deficit') && renderCounter < 2) {
          entry.target.classList.add('bounceDeficit');
          renderCounter += 1;
        }
      }
    })
  });

  setTimeout(() => observer.observe(document.querySelector('[data-testid="budget-tab"]')), 1000);
  setTimeout(() => observer.observe(document.querySelector('[data-testid="deficit-tab"]')), 1000);


  const tabStyle = width < pxToNumber(breakpointLg) ? tabStyleMobile : tabStyleDesktop;

  const balancedBudgetGlossary =
    <GlossaryTerm term={'balanced budget'} page={'Deficit Explainer'} glossary={glossary}>
      balanced budget
    </GlossaryTerm>

  return (
    <div className={folderVisContainer} data-testid={'surplus-illustration'}>
      <div className={folderWhiteOutLine} />
      <Tabs>
        <TabList style={tabListStyle}>
          <Tab style={tabStyle} data-testid={'surplus-tab'}>
            <div className={tabBaselineWhiteout} />
            <FolderTabEdgeLeft />
            <div className={title}>
              Surplus
            </div>
            <FolderTabEdgeRight />
          </Tab>
          <Tab style={tabStyle} data-testid={'budget-tab'}>
            <div className={tabBaselineWhiteout} />
            <FolderTabEdgeLeft />
            <div className={title}>
              Balanced Budget
            </div>
            <FolderTabEdgeRight />
          </Tab>
          <Tab style={tabStyle} data-testid={'deficit-tab'}>
            <div className={tabBaselineWhiteout} />
            <FolderTabEdgeLeft />
            <div className={title}>
              Deficit
            </div>
            <FolderTabEdgeRightLast />
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
        <TabPanel data-testid={"budget-panel"}>
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
