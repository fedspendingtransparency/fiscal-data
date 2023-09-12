/* eslint-disable */

import React, {useEffect, useState} from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import * as Scroll from 'react-scroll';
import { Link} from 'react-scroll'
import BreadCrumbs from '../../components/breadcrumbs/breadcrumbs';
import PageHelmet from "../../components/page-helmet/page-helmet";
import GettingStarted from '../../components/api-documentation/getting-started/getting-started';
import Endpoints from '../../components/api-documentation/endpoints/endpoints';
import Methods from "../../components/api-documentation/methods/methods";
import Parameters from "../../components/api-documentation/parameters/parameters";
import Responses from "../../components/api-documentation/responses/responses";
import Aggregation from '../../components/api-documentation/aggregation/aggregation';
import Examples from '../../components/api-documentation/examples/examples';
import TOCButton from "../../components/table-of-contents/toc-button/toc-button";
import * as tocStyles from '../../components/table-of-contents/toc.module.scss';
import * as styles from './api.module.scss';
import DataRegistry from "../../components/api-documentation/data-registry/data-registry";
import {updateAddressPath} from "../../helpers/address-bar/address-bar";
import {scrollOptionsSmooth} from "../../utils/scroll-config";

const ApiDocumentationPage = ({location}) => {

  const tocList = [
    {
      id: 'getting-started',
      headingLevel: styles.headingLevel2,
      title: 'Getting Started'
    },
    {
      id: 'what-is-an-api',
      headingLevel: styles.headingLevel3,
      title: 'What is an API?'
    },
    {
      id: 'what-is-a-dataset',
      headingLevel: styles.headingLevel3,
      title: 'What is a dataset?'
    },
    {
      id: 'api-endpoint-url-structure',
      headingLevel: styles.headingLevel3,
      title: 'API Endpoint URL structure'
    },
    {
      id: 'how-to-access-our-api',
      headingLevel: styles.headingLevel3,
      title: 'How to Access our API'
    },
    {
      id: 'license-and-authorization',
      headingLevel: styles.headingLevel3,
      title: 'License & Authorization'
    },
    {
      id: 'change-log',
      headingLevel: styles.headingLevel3,
      title: 'Change Log'
    },
    {
      id: 'endpoints',
      headingLevel: styles.headingLevel2,
      title: 'Endpoints'
    },
    {
      id: 'list-of-endpoints',
      headingLevel: styles.headingLevel3,
      title: 'List of Endpoints'
    },
    {
      id: 'fields-by-endpoint',
      headingLevel: styles.headingLevel3,
      title: 'Fields by Endpoint'
    },
    {
      id: 'data-registry',
      headingLevel: styles.headingLevel2,
      title: 'Fiscal Service Data Registry'
    },
    {
      id: 'methods',
      headingLevel: styles.headingLevel2,
      title: 'Methods'
    },
    {
      id: 'parameters',
      headingLevel: styles.headingLevel2,
      title: 'Parameters'
    },
    {
      id: 'fields',
      headingLevel: styles.headingLevel3,
      title: 'Fields'
    },
    {
      id: 'data-types',
      headingLevel: styles.headingLevel4,
      title: 'Data Types'
    },
    {
      id: 'fields-fields-by-endpoint',
      headingLevel: styles.headingLevel4,
      title: 'Fields by Endpoint'
    },
    {
      id: 'filters',
      headingLevel: styles.headingLevel3,
      title: 'Filters'
    },
    {
      id: 'parameters-sorting',
      headingLevel: styles.headingLevel3,
      title: 'Sorting'
    },
    {
      id: 'parameters-format',
      headingLevel: styles.headingLevel3,
      title: 'Format'
    },
    {
      id: 'parameters-pagination',
      headingLevel: styles.headingLevel3,
      title: 'Pagination'
    },
    {
      id: 'responses-response-objects',
      headingLevel: styles.headingLevel2,
      title: 'Responses & Response Objects'
    },
    {
      id: 'responses-response-codes',
      headingLevel: styles.headingLevel3,
      title: 'Response Codes'
    },
    {
      id: 'responses-meta-object',
      headingLevel: styles.headingLevel3,
      title: 'Meta Object'
    },
    {
      id: 'responses-links-object',
      headingLevel: styles.headingLevel3,
      title: 'Links Object'
    },
    {
      id: 'responses-data-object',
      headingLevel: styles.headingLevel3,
      title: 'Data Object'
    },
    {
      id: 'responses-error-object',
      headingLevel: styles.headingLevel3,
      title: 'Error Object'
    },
    {
      id: 'responses-pagination-header',
      headingLevel: styles.headingLevel3,
      title: 'Pagination Header'
    },
    {
      id: 'aggregation-sums',
      headingLevel: styles.headingLevel2,
      title: 'Aggregation & Sums'
    },
    {
      id: 'examples-code-snippets',
      headingLevel: styles.headingLevel2,
      title: 'Examples and Code Snippets'
    },
    {
      id: 'examples-fields',
      headingLevel: styles.headingLevel3,
      title: 'Fields'
    },
    {
      id: 'examples-filters',
      headingLevel: styles.headingLevel3,
      title: 'Filters'
    },
    {
      id: 'examples-sorting',
      headingLevel: styles.headingLevel3,
      title: 'Sorting'
    },
    {
      id: 'examples-format',
      headingLevel: styles.headingLevel3,
      title: 'Format'
    },
    {
      id: 'examples-pagination',
      headingLevel: styles.headingLevel3,
      title: 'Pagination'
    },
    {
      id: 'examples-aggregation',
      headingLevel: styles.headingLevel3,
      title: 'Aggregation'
    },
    {
      id: 'examples-pivoting',
      headingLevel: styles.headingLevel3,
      title: 'Pivoting'
    },
    {
      id: 'examples-multi-dimension-datasets',
      headingLevel: styles.headingLevel3,
      title: 'Multi-dimension Datasets'
    }
  ];

  const breadCrumbLinks = [
    {
      name: 'API Documentation'
    },
    {
      name: 'Home',
      link: '/'
    }
  ];

  const [tocIsOpen, setTocIsOpen] = useState(false);
  const [scrollToId, setScrollToId] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  const handleSelectLink = (e) => {
    const target = e.target;
    const enterKey = 'Enter';
    if(target && e.key === enterKey){
      const curClass = target.className;
      if(curClass.includes(styles.link)){
        target.click();
      }
    }
  };

  const handleScroll = () => {
    setScrollPosition(window.pageYOffset);
  };

  useEffect(() => {
    // Capture keyboard events on the TOC
    window.addEventListener('keyup', handleSelectLink);

    window.addEventListener('scroll',  handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keyup', handleSelectLink);
    };
  }, []);

  useEffect(() => {
    if (scrollToId) {
      Scroll.scroller.scrollTo(scrollToId,{
        smooth: true,
        spy: true,
        duration: 600,
        delay: 200
      });
      setScrollToId(null);
    }
  },[tocIsOpen]);

  function handleToggle(e, id) {
    if (id) {
      setScrollToId(id);
      updateAddressPath(id, location);
    }
    else {
      if (!tocIsOpen) {
        Scroll.animateScroll.scrollToTop(scrollOptionsSmooth);
      }
      else {
        Scroll.animateScroll.scrollTo(lastScrollPosition, scrollOptionsSmooth);
      }
    }
    setLastScrollPosition(scrollPosition);
    setTocIsOpen(!tocIsOpen);
  }

  let toggleStyles = tocIsOpen ? styles.tocOpen : styles.tocClosed;

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
          <BreadCrumbs links={breadCrumbLinks}/>
          <h1 className="title">API Documentation</h1>
        </div>
      </div>
      <div className={`pageWrapper ${styles.apiPageWrapper}`}>
        <div className={tocStyles.tocWrapper}>
          <div id={styles.toc} className={`${toggleStyles} ${tocStyles.tocCont}`}>
            <h2 className={tocStyles.tocHeader}>
              Table of Contents
            </h2>
            {
              tocList.map((d,i) => {
                return <div key={`toc${i}`}>
                  <Link className={`${styles.link} ${d.headingLevel}`}
                        data-test-id={`tocLink${i}`}
                        tabIndex={0}
                        activeClass={styles.activeLink}
                        to={d.id}
                        smooth={true}
                        spy={true}
                        duration={600}
                        delay={200}
                        onClick={(e) => {handleToggle(e, d.id)}}>
                    {d.title}
                  </Link>
                </div>
              })
            }
          </div>
        </div>
        <div id={styles.content} className={toggleStyles}>
          <GettingStarted location={location}/>
          <Endpoints/>
          <DataRegistry/>
          <Methods/>
          <Parameters/>
          <Responses/>
          <Aggregation/>
          <Examples/>
        </div>
        <TOCButton handleToggle={handleToggle} state={tocIsOpen}/>
      </div>
    </SiteLayout>
  )
}

export default ApiDocumentationPage;
