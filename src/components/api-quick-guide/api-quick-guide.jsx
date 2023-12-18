import React, { useEffect, useState } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import DocumentationLinkSection from './documentation-link-section/documentation-link-section';
import DatasetDetailFields from './dataset-detail-fields';
import Accordions from './accordions/accordions';
import DatasetDetailEndpoints from './dataset-detail-endpoints/dataset-detail-endpoints';
import ApiQuickGuideSection from './api-quick-guide-section';
import DatasetDetailExamples from './dataset-detail-examples/dataset-detail-examples';
import SectionCollapseButton from '../section-collapse/section-collapse-button';

import { sectionWrapper, collapsed, toggleButtonContainer } from './api-quick-guide.module.scss';

// TODO: Refactor ApiQuickGuideSection to allow table (combine with DatasetDetailFields).
const ApiQuickGuide = ({ selectedTable, config }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleCollapse = (stateOfToggle, _preserveScrollPosition) => {
    setIsCollapsed(stateOfToggle);
    if (stateOfToggle) {
      const scrollTarget = document.getElementById('collapse-scroll-target');
      if (!_preserveScrollPosition && scrollTarget.scrollIntoView) {
        scrollTarget.scrollIntoView({ block: 'start', inline: 'center', behavior: 'smooth' });
      }
      if (document && document.querySelector && document.querySelectorAll) {
        const collapsedSection = document.querySelector('#api-quick-guide-expandable');
        if (collapsedSection) {
          const buttons = collapsedSection.querySelectorAll('button');
          if (buttons) {
            const buttonsArr = Array.prototype.slice.call(buttons);
            buttonsArr.forEach(btn => {
              btn.tabIndex = -1;
            });
          }
          const links = collapsedSection.querySelectorAll('a');
          if (links) {
            const linksArr = Array.prototype.slice.call(links);
            linksArr.forEach(link => {
              link.tabIndex = -1;
            });
          }
        }
      }
    } else {
      if (document && document.querySelector && document.querySelectorAll) {
        const collapsedSection = document.querySelector('#api-quick-guide-expandable');
        if (collapsedSection) {
          const buttons = collapsedSection.querySelectorAll('button');
          if (buttons) {
            const buttonsArr = Array.prototype.slice.call(buttons);
            buttonsArr.forEach(btn => {
              btn.tabIndex = 0;
            });
          }
          const links = collapsedSection.querySelectorAll('a');
          if (links) {
            const linksArr = Array.prototype.slice.call(links);
            linksArr.forEach(link => {
              link.tabIndex = 0;
            });
          }
        }
      }
    }
  };

  // TODO: Move Method section to its own component or move title & desc inline
  const methods = {
    title: 'Methods',
    desc: 'Our APIs accept the GET method, one of the most common HTTP methods.',
  };

  useEffect(() => {
    handleCollapse(isCollapsed, true);

    // run this a second later to pick up any stragglers that weren't rendered the first time
    if (setTimeout) {
      setTimeout(() => {
        handleCollapse(isCollapsed, true);
      }, 1000);
    }
  }, []);

  const title = 'API Quick Guide';
  const expandStyles = !isCollapsed ? sectionWrapper : `${sectionWrapper} ${collapsed}`;

  return (
    <DatasetSectionContainer id="api-quick-guide" title={title}>
      <div className={expandStyles}>
        <div id="quick-guide-content-container">
          <DocumentationLinkSection type="HEADER" />
          <div id="api-quick-guide-expandable" aria-hidden={isCollapsed}>
            <DatasetDetailEndpoints selectedTable={selectedTable} apis={config.apis} />
            <div id="collapse-scroll-target" />
            <DatasetDetailFields apis={config.apis} />
            <Accordions selectedTable={selectedTable} />
            <ApiQuickGuideSection id="method-section" title={methods.title} description={methods.desc} />
            <DatasetDetailExamples isAccordionOpen={!isCollapsed} selectedTable={selectedTable} />
            <DocumentationLinkSection type="FOOTER" />
          </div>
        </div>
      </div>
      <div className={toggleButtonContainer}>
        <SectionCollapseButton sectionName="api-quick-guide" handleToggle={handleCollapse} />
      </div>
    </DatasetSectionContainer>
  );
};

export default ApiQuickGuide;
