import { deficitExplainerLightSecondary } from '../../national-deficit.module.scss';
import {
  folderVis,
  folderVisContainer,
  title,
  folderContent,
  tabBaselineWhiteout,
  folderWhiteOutLine,
  selectedTab,
} from './surplus-illustration.module.scss';
import surplus from '../../../../../../images/explainer/national-deficit/surplus.png';
import balancedBudget from '../../../../../../images/explainer/national-deficit/balanced-budget.png';
import deficit from '../../../../../../images/explainer/national-deficit/deficit.png';
import React, { useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import GlossaryPopoverDefinition from '../../../../../../components/glossary/glossary-term/glossary-popover-definition';
import FolderTabEdgeRight from './folder-illustration-svgs/folder-tab-edge-right';
import FolderTabEdgeRightLast from './folder-illustration-svgs/folder-tab-edge-right-last';
import FolderTabEdgeLeft from './folder-illustration-svgs/folder-tab-edge-left';
import FolderTabEdgeLeftMobile from './folder-illustration-svgs/mobile/folder-tab-edge-left-mobile';
import FolderTabEdgeRightMobile from './folder-illustration-svgs/mobile/folder-tab-edge-right-mobile';
import FolderTabEdgeRightLastMobile from './folder-illustration-svgs/mobile/folder-tab-edge-right-last-mobile';
import useGAEventTracking from '../../../../../../hooks/useGAEventTracking';
import Analytics from '../../../../../../utils/analytics/analytics';
import { useInView } from 'react-intersection-observer';
import { chartInViewProps } from '../../../../explainer-helpers/explainer-charting-helper';

const SurplusIllustration = ({ width }) => {
  const { getGAEvent } = useGAEventTracking(null, 'DeficitExplainer');

  const edgeBreakPoint = pxToNumber(1188);
  const centerBreakPoint = pxToNumber(1128);

  const handleClick = eventNumber => {
    const gaEvent = getGAEvent(eventNumber);
    Analytics.event({
      category: gaEvent?.eventCategory?.replace('Fiscal Data - ', ''),
      action: gaEvent?.eventAction,
      label: gaEvent?.eventLabel,
    });
  };

  const tabListStyle = {
    margin: '0',
    borderTopColor: deficitExplainerLightSecondary,
    borderLeftColor: deficitExplainerLightSecondary,
    borderRightColor: deficitExplainerLightSecondary,
    borderWidth: '0.125rem',
    borderBottom: '0',
    display: 'flex',
    justifyContent: 'center',
  };

  const tabStyleDesktop = {
    position: 'relative',
    borderTopColor: deficitExplainerLightSecondary,
    borderBottom: '0',
    borderTopWidth: '0.125rem',
    borderLeft: '0',
    borderRight: '0',
    margin: '0 0.875rem',
    paddingRight: '1.25rem',
    paddingLeft: '1.25rem',
    borderRadius: '0 0 0 0',
  };
  const tabStyleMobile = {
    borderTopColor: deficitExplainerLightSecondary,
    borderTopWidth: '2px',
    borderBottom: '0',
    borderLeft: '0',
    borderRight: '0',
    borderRadius: '0 0 0 0',
    marginRight: '0.55rem',
    marginLeft: '0.55rem',
    paddingRight: '8px',
    paddingLeft: '8px',
  };

  const { ref, inView, entry } = useInView(chartInViewProps);

  useEffect(() => {
    let renderCounter = 0;
    if (inView && entry) {
      const tabs = entry.target.children[1].children[0].children;
      for (const tab of tabs) {
        if (tab.innerHTML.includes('Balanced Budget') && renderCounter < 2) {
          tab.classList.add('bounce');
          renderCounter += 1;
        } else if (tab.innerHTML.includes('Deficit') && renderCounter < 2) {
          tab.classList.add('bounceDeficit');
          renderCounter += 1;
        }
      }
    }
  }, [inView]);

  const tabStyle = width < pxToNumber(1128) ? tabStyleMobile : tabStyleDesktop;

  const balancedBudgetGlossary = (
    <GlossaryPopoverDefinition term="Balanced Budget" page="Deficit Explainer">
      balanced budget
    </GlossaryPopoverDefinition>
  );

  return (
    <div className={folderVisContainer} data-testid="surplus-illustration" ref={ref}>
      <div className={folderWhiteOutLine} />
      <Tabs>
        <TabList style={tabListStyle}>
          <Tab style={tabStyle} data-testid="surplus-tab" selectedClassName={selectedTab} onClick={() => handleClick('10')}>
            <div className={tabBaselineWhiteout} />
            {width < edgeBreakPoint ? <FolderTabEdgeLeftMobile /> : <FolderTabEdgeLeft />}
            <div className={title}>Surplus</div>
            {width < centerBreakPoint ? <FolderTabEdgeRightMobile /> : <FolderTabEdgeRight />}
          </Tab>
          <Tab style={tabStyle} data-testid="budget-tab" selectedClassName={selectedTab} onClick={() => handleClick('11')}>
            <div className={tabBaselineWhiteout} />
            {width < centerBreakPoint ? <FolderTabEdgeLeftMobile /> : <FolderTabEdgeLeft />}
            <div className={title}>Balanced Budget</div>
            {width < centerBreakPoint ? <FolderTabEdgeRightMobile /> : <FolderTabEdgeRight />}
          </Tab>
          <Tab style={tabStyle} data-testid="deficit-tab" selectedClassName={selectedTab} onClick={() => handleClick('12')}>
            <div className={tabBaselineWhiteout} />
            {width < centerBreakPoint ? <FolderTabEdgeLeftMobile /> : <FolderTabEdgeLeft />}
            <div className={title}>Deficit</div>
            {width < edgeBreakPoint ? <FolderTabEdgeRightLastMobile /> : <FolderTabEdgeRightLast />}
          </Tab>
        </TabList>
        <TabPanel>
          <div className={folderVis}>
            <div className={folderContent}>
              <img src={surplus} alt="" data-testid="surplus-image" />
              <div>
                <p>
                  A <i>surplus</i> occurs when the government collects more money than it spends.
                </p>
                <p>The last surplus for the federal government was in 2001.</p>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel data-testid="budget-panel">
          <div className={folderVis}>
            <div className={folderContent}>
              <img src={balancedBudget} alt="" data-testid="balanced-budget-image" />
              <div>
                <p>
                  A <i>{balancedBudgetGlossary}</i> occurs when the amount the government spends equals the amount the government collects.
                </p>
                <p>Sometimes the term balanced budget is used more broadly to refer to instances where there is no deficit.</p>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className={folderVis}>
            <div className={folderContent}>
              <img src={deficit} alt="" data-testid="deficit-image" />
              <div>
                <p>
                  A <i>deficit</i> occurs when the government spends more money than it collects.
                </p>
                <p>The federal government has run deficits for the last 20 years.</p>
              </div>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default withWindowSize(SurplusIllustration);
