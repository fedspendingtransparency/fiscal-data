/* eslint-disable */

import React, { useEffect, useState } from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import { Link, scrollSpy, Events, animateScroll } from 'react-scroll';
import BreadCrumbs from '../../components/breadcrumbs/breadcrumbs';
import PageHelmet from '../../components/page-helmet/page-helmet';
import GettingStarted from '../../components/api-documentation/getting-started/getting-started';
import Endpoints from '../../components/api-documentation/endpoints/endpoints';
import Methods from '../../components/api-documentation/methods/methods';
import Parameters from '../../components/api-documentation/parameters/parameters';
import Responses from '../../components/api-documentation/responses/responses';
import Aggregation from '../../components/api-documentation/aggregation/aggregation';
import Examples from '../../components/api-documentation/examples/examples';
import TOCButton from '../../components/table-of-contents/toc-button/toc-button';
import { tocCont, tocHeader, tocWrapper } from '../../components/table-of-contents/toc.module.scss';
import { toc, content, link, activeLink, tocOpen, tocClosed, apiPageWrapper } from './api.module.scss';
import DataRegistry from '../../components/api-documentation/data-registry/data-registry';
import { updateAddressPath } from '../../helpers/address-bar/address-bar';
import { scrollOptionsSmooth } from '../../utils/scroll-config';
import { globalNavOffset } from '../../components/secondary-nav/secondary-nav';
import { tocList } from '../../helpers/api-documentation-sections';

const ApiDocumentationPage = ({ location }) => {
  const breadCrumbLinks = [
    {
      name: 'API Documentation',
    },
    {
      name: 'Home',
      link: '/',
    },
  ];

  const [tocIsOpen, setTocIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  const handleSelectLink = e => {
    const target = e.target;
    const enterKey = 'Enter';
    if (target && e.key === enterKey) {
      const curClass = target.className;
      if (curClass.includes(link)) {
        target.click();
      }
    }
  };

  const handleScroll = event => {
    setScrollPosition(window.pageYOffset);
  };

  useEffect(() => {
    // Capture keyboard events on the TOC
    window.addEventListener('keyup', handleSelectLink);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keyup', handleSelectLink);
    };
  }, []);

  // The below useEffect block handles the active section scroll interaction.
  // When the user clicks on a section to scroll to in the nav, all sections save for the selected one have target set to false.
  // This ensures that the active class is only applied to the selected section. The current selected section is also tracked via the 'current'
  // property. This property ensures the active styling can be applied to the section BEFORE the scroll to that section has completed.
  // Finally, on scroll end the target property is set to true for all sections, ensuring the active class is properly applied when the
  // user scrolls normally.
  useEffect(() => {
    Events.scrollEvent.register('begin', to => {
      tocList.forEach(s => {
        s.target = false;
      });

      if (to) {
        const section = tocList.find(s => s.id === to);
        section.target = true;
        section.current = true;
      }
    });

    Events.scrollEvent.register('end', () => {
      setTimeout(() => {
        tocList.forEach(section => {
          if (!section.target) {
            section.target = true;
          }
          if (section.current) {
            section.current = false;
          }
        });
      }, 100);
    });

    scrollSpy.update();

    return () => {
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    };
  }, []);

  function handleToggle(e, id) {
    if (id) {
      updateAddressPath(id, location);
    } else {
      if (!tocIsOpen) {
        animateScroll.scrollToTop(scrollOptionsSmooth);
      } else {
        animateScroll.scrollTo(lastScrollPosition, scrollOptionsSmooth);
      }
    }

    setLastScrollPosition(scrollPosition);
    setTocIsOpen(!tocIsOpen);
  }

  let toggleStyles = tocIsOpen ? tocOpen : tocClosed;

  return (
    <SiteLayout>
      <PageHelmet
        data-test-id="helmet"
        pageTitle="API Documentation"
        description="Detailed instructions for data scientists on how to access Fiscal Data’s datasets using APIs, including information on endpoints, filters, and more."
        keywords="API, US Treasury, HTTP, JSON, API request, open data, U.S. Department of the Treasury, Fiscal Service, government finances"
      />
      <div className="pageHeader">
        <div className="content">
          <BreadCrumbs links={breadCrumbLinks} />
          <h1 className="title">API Documentation</h1>
        </div>
      </div>
      <div className={`pageWrapper ${apiPageWrapper}`}>
        <div className={tocWrapper}>
          <div id={toc} className={`${toggleStyles} ${tocCont}`}>
            <h2 className={tocHeader}>Table of Contents</h2>
            {tocList.map((d, i) => {
              return (
                <div key={`toc${i}`}>
                  <Link
                    className={`${link} ${d.headingLevel} ${d.target && d.current && activeLink}`}
                    data-test-id={`tocLink${i}`}
                    tabIndex={0}
                    activeClass={d.target ? activeLink : ''}
                    to={d.id}
                    smooth={true}
                    spy={true}
                    duration={600}
                    delay={200}
                    onClick={e => {
                      handleToggle(e, d.id);
                    }}
                    offset={globalNavOffset}
                  >
                    {d.title}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        <div id={content} className={toggleStyles}>
          <GettingStarted location={location} />
          <Endpoints />
          <DataRegistry />
          <Methods />
          <Parameters />
          <Responses />
          <Aggregation />
          <Examples />
        </div>
        <TOCButton handleToggle={handleToggle} state={tocIsOpen} />
      </div>
    </SiteLayout>
  );
};

export default ApiDocumentationPage;
