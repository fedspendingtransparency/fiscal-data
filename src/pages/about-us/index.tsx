/* istanbul ignore file */

/* TODO: When MDX POC is no longer useful, remove experimental aspects and
   dependencies, remove above istanbul ignore header above
 */

import React, { FunctionComponent, useEffect, useState} from "react";
import {graphql} from "gatsby";
import PageHelmet from "../../components/page-helmet/page-helmet";
import SiteLayout from '../../components/siteLayout/siteLayout';
import About from './about-section/about-section';
import FAQ from './faq-section/faq-section';
import Contact from './contact-section/contact-section';
import AboutMDX from '../../components/about-us/about-section/about-section';
import FAQMDX from '../../components/about-us/faq-section/faq-section';
import ContactMDX from '../../components/about-us/contact-section/contact-section';
import { tocBuilder } from '../../components/about-us/toc/toc'; // todo - toc cms
import TOCData from './toc-data.json';
import BreadCrumbs from "../../components/breadcrumbs/breadcrumbs";
import SecondaryNav from "../../components/secondary-nav/secondary-nav";
import Experimental from "../../components/experimental/experimental";

import { tocHeader } from '../../components/table-of-contents/toc.module.scss';
import {
  aboutPageWrapper,
  activeLink,
  hoverLink,
  content,
  linkClass
} from './about-us.module.scss';
const tocSections = ['about-section','faq','contact-section'];

const AboutUsPage: FunctionComponent = ({data}) => {
  const breadCrumbLinks = [
    {
      name: 'About Us'
    },
    {
      name: 'Home',
      link: '/'
    }
  ];

  const [highlight, doHighlight] = useState(0);
  const [mdxAST, setMdxAST] = useState([]); // todo - Uncomment for toc cms

  const tocHeaderComponent = (
    <h2 data-test-id="about-page-header" className={tocHeader}>
      Table of Contents
    </h2>
  );

  useEffect(() => {
    if (data && data.allMdx && data.allMdx.edges) {
      let curAST = [];
      const edges = data.allMdx.edges;
      for (let i = 0, il = tocSections.length; i < il; i++) {
        const curId = tocSections[i];
        for (let j = edges.length; j--;) {
          if (edges[j].node.frontmatter.id === curId) {
            curAST = curAST.concat(tocBuilder(edges[j].node.mdxAST.children,
              [null,'headingLevel2','headingLevel3']));
          }
        }
      }
      curAST.forEach((d,i) => {
        d.index = i;
      })

      setMdxAST(curAST);
    }
  }, []);


  return (
    <SiteLayout isPreProd={false}>
      <PageHelmet
        pageTitle="About Us"
        description="Fiscal Data inspires trust in government by providing access to open federal
          financial data in machine-readable formats with one easy-to-use website."
        keywords="U.S. Treasury, Fiscal Data, machine readable data, API, government, government
          financial data, debt, Treasury, US government"
        image=""
        canonical=""
        datasetDetails=""
      />
      <div className="pageHeader">
        <div className="content">
          <BreadCrumbs links={breadCrumbLinks} />
          <h1 data-test-id="pageTitle" className="title">About Us</h1>
        </div>
      </div>
      <div data-test-id="about-page-wrapper" className={`pageWrapper  ${aboutPageWrapper}`}>
        <Experimental featureId="aboutUsMDX" exclude>
          <SecondaryNav
            sections={TOCData}
            activeClass={activeLink}
            hoverClass={hoverLink}
            headerComponent={tocHeaderComponent}
          >
            <div
              id={content}
              className={content}
              data-test-id="about-content"
            >
              <About />
              <FAQ triggerHighlight={highlight} />
              <Contact />
            </div>
          </SecondaryNav>
        </Experimental>
        <Experimental featureId="aboutUsMDX" exclude={false}>
          <SecondaryNav
            sections={mdxAST}
            activeClass={activeLink}
            hoverClass={hoverLink}
            linkClass={linkClass}
            headerComponent={tocHeaderComponent}
          >
            <div
              id={content}
              className={content}
              data-test-id="about-content"
            >
              <AboutMDX />
              <FAQMDX triggerHighlight={highlight} />
              <ContactMDX onUnsupportedSubject={() => doHighlight(prevState => prevState + 1)} />
            </div>
          </SecondaryNav>
        </Experimental>
      </div>
    </SiteLayout>
  )
};

export default AboutUsPage;

export const pageQuery = graphql`
    query {
      allMdx(filter: {frontmatter: {id: {in: [
      "about-section","faq","contact-section"]}}}) {
        edges {
          node {
            frontmatter {
              id
            }
            mdxAST
          }
        }
      }
    }
`;
