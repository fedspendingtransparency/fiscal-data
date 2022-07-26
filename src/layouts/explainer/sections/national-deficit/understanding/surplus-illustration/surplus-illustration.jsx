import {deficitExplainerLightSecondary} from "../../national-deficit.module.scss";
import {folderVis, folderVisContainer, title} from "./surplus-illustration.module.scss";
import surplus from "../../../../../../images/explainer/national-deficit/surplus.png";
import balancedBudget
  from "../../../../../../images/explainer/national-deficit/balanced-budget.png";
import deficit from "../../../../../../images/explainer/national-deficit/deficit.png";
import React from "react";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {withWindowSize} from "react-fns";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {breakpointLg} from "../../../../../../variables.module.scss";


const SurplusIllustration = ({width}) => {
  const tabListStyle = {
    margin:'0',
    borderColor:deficitExplainerLightSecondary,
    borderWidth:'2px',
    borderBottom:'0',
    display:'flex',
    justifyContent:'center'
  };

  const tabStyleDesktop = {
    borderColor:deficitExplainerLightSecondary,
    borderBottom:'0',
    borderWidth:'2px',
    margin: '0 .5rem',
    // boxShadow: `.25rem .25rem ${deficitExplainerLightSecondary}`,
    borderRadius: '5px 5px 0 0'
  };
  const tabStyleMobile = {
    borderColor:deficitExplainerLightSecondary,
    borderBottom:'0',
    borderWidth:'2px',
    borderRadius: '5px 5px 0 0',
    // boxShadow: `.25rem .25rem ${deficitExplainerLightSecondary}`,
    margin: '0 .25rem'
  };

  const tabStyle = width < pxToNumber(breakpointLg) ? tabStyleMobile : tabStyleDesktop;

  return (
    <div className={folderVisContainer} data-testid={'folderVis'}>
      <Tabs>
        <TabList style={tabListStyle}>
          <Tab style={tabStyle}>
            <div className={title}>
              Surplus
            </div>
          </Tab>
          <Tab style={tabStyle}>
            <div className={title}>
              Balanced Budget
            </div>
          </Tab>
          <Tab style={tabStyle}>
            <div className={title}>
              Deficit
            </div>
          </Tab>
        </TabList>
        <TabPanel>
          <div className={folderVis}>
            <img src={surplus} alt="placeholder alt text" />
            <div>
              <p>
                A <i>surplus</i> occurs when the government collects more money than it spends.
              </p>
              <p>
                The last surplus for the federal government was in 2001.
              </p>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className={folderVis}>
            <img src={balancedBudget} alt="placeholder alt text" />
            <div>
              <p>
                A <i>balanced budget</i> occurs when the amount the government spends equals the amount the
                government collects.
              </p>
              <p>
                Sometimes the term balanced budget is used more broadly to refer
                to instances where there is no deficit.
              </p>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className={folderVis}>
            <img src={deficit} alt="placeholder alt text" />
            <div>
              <p>
                A <i>deficit</i> occurs when the government spends more money than it collects.
              </p>
              <p>
                The federal government has run deficits for the last 20 years.
              </p>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default withWindowSize(SurplusIllustration);
