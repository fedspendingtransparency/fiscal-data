import React, { ReactElement } from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import {
  sectionHeading,
  mainContent,
  lastUpdated,
  contentContainer,
  relatedContent,
  insightsContainer,
  sectionContainer,
} from './insight.module.scss';
import SocialShare from '../../components/social-share/social-share';
import { discoverDatasetsCitationsMap, exploreMoreCitationsMap, insightSocialShareMap } from '../../helpers/insights/insight-helpers';
import CitationList from '../../components/citation-list/citation-list';
import { insightsDataSources, insightsSections } from './sections/sections';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../variables.module.scss';

interface IInsightSection {
  component: ReactElement;
  index: number;
}

const InsightPageLayout = ({ pageContext, width }) => {
  const { pageName, seoConfig, heroImage } = pageContext;

  return (
    <SiteLayout isPreProd={false}>
      <PageHelmet pageTitle={seoConfig.pageTitle} description={seoConfig.description} keywords={seoConfig.keywords} />
      <div className={insightsContainer}>
        <h1 className={sectionHeading}>{heroImage.heading}</h1>
        {width < pxToNumber(breakpointLg) && (
          <SocialShare copy={insightSocialShareMap[pageName]} pageName="" headerLevel="h2" displayStyle="responsive" />
        )}
        <span className={lastUpdated}>Last Updated: Month DD, YYYY</span>
        <div className={contentContainer}>
          <div className={mainContent}>
            {insightsSections[pageName]?.map((section: IInsightSection) => (
              <React.Fragment key={section.index}>
                <section className={sectionContainer}>{section.component}</section>
              </React.Fragment>
            ))}
            <div>
              <h2>Data Sources and Methodologies:</h2> {insightsDataSources[pageName]}
            </div>
          </div>
          <div className={relatedContent}>
            {width >= pxToNumber(breakpointLg) && (
              <SocialShare copy={insightSocialShareMap[pageName]} pageName="Interest Expense" headerLevel="h2" displayStyle="responsive" />
            )}
            <CitationList header="Explore More" citations={exploreMoreCitationsMap[pageName]} />
            <CitationList header="Discover Datasets" citations={discoverDatasetsCitationsMap[pageName]} />
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default withWindowSize(InsightPageLayout);
