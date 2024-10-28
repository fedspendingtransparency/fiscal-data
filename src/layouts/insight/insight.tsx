import React from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import { explainerDescriptionGenerators } from '../explainer/sections/sections';
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

const InsightPageLayout = ({ pageContext }) => {
  const { pageName, seoConfig, heroImage } = pageContext;

  return (
    <SiteLayout isPreProd={false}>
      <PageHelmet pageTitle={seoConfig.pageTitle} description={seoConfig.description} keywords={seoConfig.keywords} />
      <div className={insightsContainer}>
        <h1 className={sectionHeading}>{heroImage.heading}</h1>
        <span className={lastUpdated}>Last Updated: Month DD, YYYY</span>
        <div className={contentContainer}>
          <div className={mainContent}>
            {insightsSections[pageName].map(s => (
              <React.Fragment key={s.index}>
                <section className={sectionContainer}>{s.component}</section>
              </React.Fragment>
            ))}
            <div>
              <h2>Data Sources and Methodologies:</h2> {insightsDataSources[pageName]}
            </div>
          </div>
          <div className={relatedContent}>
            <SocialShare copy={insightSocialShareMap[pageName]} pageName="" headerLevel="h2" />
            <CitationList header="Explore More" citations={exploreMoreCitationsMap[pageName]} />
            <CitationList header="Discover Datasets" citations={discoverDatasetsCitationsMap[pageName]} />
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default InsightPageLayout;
