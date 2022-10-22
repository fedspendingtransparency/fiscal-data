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
              <div className={tabEdgeLeft}>
              <svg version={1.1} overflow="visible" height="36" viewBox="0 -1 14 35">
                <g strokeLinejoin="miter">
                  <path
                    d="M 0 33.7801 L 1.3882 31.9027 C 2.9654 31.561 4.3081 30.8803 4.3898 29.5524 L 8.1914 2.3517 C 8.1914 1.0586 9.711 0 11.5816 0 L 12.5451 33.7801 L 0 33.7801 Z"
                    fill="#ffffff"
                    strokeLinecap="round"
                    stroke="none"
                    strokeMiterlimit="80"
                  />
                  <path
                    d="M 1.3882 31.9027 C 2.9654 31.561 4.3081 30.8803 4.3898 29.5524 L 8.1914 2.3517 C 8.1914 1.0586 9.711 0 11.5816 0 L 12.5451 0"
                    fill="none"
                    strokeLinecap="square"
                    stroke="#e0baab"
                    strokeMiterlimit="80"
                    strokeWidth="2"
                  />
                </g>
              </svg>
                </div>
            <div className={title}>
              Surplus
            </div>
            <div className={tabEdgeRight}>
              <svg version={1.1} overflow="hidden" height="35" width="22" viewBox="-8 -1 14 34">
                <g transform="scale(-1,1)">
                  <path
                    d="M -4 37.7801 L -2.6118 35.9027 C -1.0346 35.561 0.3081 34.8803 0.3898 33.5524 L 4.1914 6.3517 C 4.1914 5.0586 5.711 4 7.5816 4 L 8.5451 4 L 8.5451 37.7801 L -4 37.7801 Z"
                    fill="#e0baab"
                    strokeLinecap="round"
                    stroke="none"
                    strokeMiterlimit="80"
                  />
                  <path
                    d="M -2.6118 35.9027 C -1.0346 35.561 0.3081 34.8803 0.3898 33.5524 L 4.1914 6.3517 C 4.1914 5.0586 5.711 4 7.5816 4 L 8.5451 4"
                    fill="none"
                    strokeLinecap="square"
                    stroke="#e0baab"
                    strokeMiterlimit="80"
                    strokeWidth="2"
                  />
                </g>
                <g strokeLinejoin="miter" transform="scale(-1,1)">
                  <path
                    d="M 0 33.7801 L 1.3882 31.9027 C 2.9654 31.561 4.3081 30.8803 4.3898 29.5524 L 8.1914 2.3517 C 8.1914 1.0586 9.711 0 11.5816 0 L 12.5451 0 L 12.5451 33.7801 L 0 33.7801 Z"
                    fill="#ffffff"
                    strokeLinecap="round"
                    stroke="none"
                    strokeMiterlimit="80"
                  />
                  <path
                    d="M 1.3882 31.9027 C 2.9654 31.561 4.3081 30.8803 4.3898 29.5524 L 8.1914 2.3517 C 8.1914 1.0586 9.711 0 11.5816 0 L 12.5451 0"
                    fill="none"
                    strokeLinecap="square"
                    stroke="#e0baab"
                    strokeMiterlimit="80"
                    strokeWidth="2"
                  />
                </g>
              </svg>
            </div>
          </Tab>
          <Tab style={tabStyle}>
            <div className={tabBaselineWhiteout} />
            <div className={tabEdgeLeft}>
              <svg version={1.1} overflow="visible" height="36" viewBox="0 -1 14 35">
                <g strokeLinejoin="miter">
                  <path
                    d="M 0 33.7801 L 1.3882 31.9027 C 2.9654 31.561 4.3081 30.8803 4.3898 29.5524 L 8.1914 2.3517 C 8.1914 1.0586 9.711 0 11.5816 0 L 12.5451 33.7801 L 0 33.7801 Z"
                    fill="#ffffff"
                    strokeLinecap="round"
                    stroke="none"
                    strokeMiterlimit="80"
                  />
                  <path
                    d="M 1.3882 31.9027 C 2.9654 31.561 4.3081 30.8803 4.3898 29.5524 L 8.1914 2.3517 C 8.1914 1.0586 9.711 0 11.5816 0 L 12.5451 0"
                    fill="none"
                    strokeLinecap="square"
                    stroke="#e0baab"
                    strokeMiterlimit="80"
                    strokeWidth="2"
                  />
                </g>
              </svg>
            </div>
            <div className={title}>
              Balanced Budget
            </div>
            <div className={tabEdgeRight}>
              <svg version={1.1} overflow="hidden" height="35" width="22" viewBox="-8 -1 14 34">
                <g strokeLinejoin="miter" transform="scale(-1,1)">
                  <path
                    d="M -4 37.7801 L -2.6118 35.9027 C -1.0346 35.561 0.3081 34.8803 0.3898 33.5524 L 4.1914 6.3517 C 4.1914 5.0586 5.711 4 7.5816 4 L 8.5451 4 L 8.5451 37.7801 L -4 37.7801 Z"
                    fill="#e0baab"
                    strokeLinecap="round"
                    stroke="none"
                    strokeMiterlimit="80"
                  />
                  <path
                    d="M -2.6118 35.9027 C -1.0346 35.561 0.3081 34.8803 0.3898 33.5524 L 4.1914 6.3517 C 4.1914 5.0586 5.711 4 7.5816 4 L 8.5451 4"
                    fill="none"
                    strokeLinecap="square"
                    stroke="#e0baab"
                    strokeMiterlimit="80"
                    strokeWidth="2"
                  />
                </g>
                <g strokeLinejoin="miter" transform="scale(-1,1)">
                  <path
                    d="M 0 33.7801 L 1.3882 31.9027 C 2.9654 31.561 4.3081 30.8803 4.3898 29.5524 L 8.1914 2.3517 C 8.1914 1.0586 9.711 0 11.5816 0 L 12.5451 0 L 12.5451 33.7801 L 0 33.7801 Z"
                    fill="#ffffff"
                    strokeLinecap="round"
                    stroke="none"
                    strokeMiterlimit="80"
                  />
                  <path
                    d="M 1.3882 31.9027 C 2.9654 31.561 4.3081 30.8803 4.3898 29.5524 L 8.1914 2.3517 C 8.1914 1.0586 9.711 0 11.5816 0 L 12.5451 0"
                    fill="none"
                    strokeLinecap="square"
                    stroke="#e0baab"
                    strokeMiterlimit="80"
                    strokeWidth="2"
                  />
                </g>
              </svg>
            </div>
          </Tab>
          <Tab style={tabStyle}>
            <div className={tabBaselineWhiteout} />
            <div className={tabEdgeLeft}>
              <svg version={1.1} overflow="visible" height="36" viewBox="0 -1 14 35">
                <g strokeLinejoin="miter">
                  <path
                    d="M 0 33.7801 L 1.3882 31.9027 C 2.9654 31.561 4.3081 30.8803 4.3898 29.5524 L 8.1914 2.3517 C 8.1914 1.0586 9.711 0 11.5816 0 L 12.5451 33.7801 L 0 33.7801 Z"
                    fill="#ffffff"
                    strokeLinecap="round"
                    stroke="none"
                    strokeMiterlimit="80"
                  />
                  <path
                    d="M 1.3882 31.9027 C 2.9654 31.561 4.3081 30.8803 4.3898 29.5524 L 8.1914 2.3517 C 8.1914 1.0586 9.711 0 11.5816 0 L 12.5451 0"
                    fill="none"
                    strokeLinecap="square"
                    stroke="#e0baab"
                    strokeMiterlimit="80"
                    strokeWidth="2"
                  />
                </g>
              </svg>
            </div>
            <div className={title}>
              Deficit
            </div>
            <div className={tabEdgeRight}>
              <svg version={1.1} overflow="hidden" height="35" width="22" viewBox="-8 -1 14 34">
                <g strokeLinejoin="miter" transform="scale(-1,1)">
                  <path
                    d="M -4 37.7801 L -2.6118 35.9027 C -1.0346 35.561 0.3081 34.8803 0.3898 33.5524 L 4.1914 6.3517 C 4.1914 5.0586 5.711 4 7.5816 4 L 8.5451 4 L 8.5451 37.7801 L -4 37.7801 Z"
                    fill="#e0baab"
                    strokeLinecap="round"
                    stroke="none"
                    strokeMiterlimit="80"
                  />
                  <path
                    d="M -2.6118 35.9027 C -1.0346 35.561 0.3081 34.8803 0.3898 33.5524 L 4.1914 6.3517 C 4.1914 5.0586 5.711 4 7.5816 4 L 8.5451 4"
                    fill="none"
                    strokeLinecap="square"
                    stroke="#e0baab"
                    strokeMiterlimit="80"
                    strokeWidth="2"
                  />
                </g>
                <g strokeLinejoin="miter" transform="scale(-1,1)">
                  <path
                    d="M 0 33.7801 L 1.3882 31.9027 C 2.9654 31.561 4.3081 30.8803 4.3898 29.5524 L 8.1914 2.3517 C 8.1914 1.0586 9.711 0 11.5816 0 L 12.5451 0 L 12.5451 33.7801 L 0 33.7801 Z"
                    fill="#ffffff"
                    strokeLinecap="round"
                    stroke="none"
                    strokeMiterlimit="80"
                  />
                  <path
                    d="M 1.3882 31.9027 C 2.9654 31.561 4.3081 30.8803 4.3898 29.5524 L 8.1914 2.3517 C 8.1914 1.0586 9.711 0 11.5816 0 L 12.5451 0"
                    fill="none"
                    strokeLinecap="square"
                    stroke="#e0baab"
                    strokeMiterlimit="80"
                    strokeWidth="2"
                  />
                </g>
              </svg>
            </div>
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
