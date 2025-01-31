import React, { ReactElement } from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import { mainContent, contentContainer, relatedContent, insightsContainer, sectionContainer } from './insight.module.scss';
import SocialShare from '../../components/social-share/social-share';
import {
  discoverDatasetsCitationsMap,
  exploreMoreCitationsMap,
  insightHeroMap,
  insightLastUpdated,
  insightSocialShareMap,
} from '../../helpers/insights/insight-helpers';
import CitationList from '../../components/citation-list/citation-list';
import { insightsDataSources, insightsDescriptionGenerators, insightsSections } from './sections/sections';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../variables.module.scss';
import { InsightHeroImage } from './insight-hero-image/insight-hero-image';
import { InsightLastUpdated } from './sections/interest-expense/last-updated/insight-last-updated';
import GlossaryProvider from '../../components/glossary/glossary-context/glossary-context';

interface IInsightSection {
  component: ReactElement;
  index: number;
}

const InsightPageLayout = ({ pageContext, width }) => {
  const { pageName, seoConfig, heroImage } = pageContext;

  return (
    <GlossaryProvider>
      <SiteLayout isPreProd={false}>
        <PageHelmet
          pageTitle={seoConfig.pageTitle}
          description={seoConfig.description}
          keywords={seoConfig.keywords}
          descriptionGenerator={insightsDescriptionGenerators[pageName]}
        />
        <div className={insightsContainer}>
          <InsightHeroImage heading={heroImage.heading}>{insightHeroMap[pageName].component()}</InsightHeroImage>
          {width < pxToNumber(breakpointLg - 1) && (
            <SocialShare copy={insightSocialShareMap[pageName]} pageName={pageName} headerLevel="h2" displayStyle="responsive" />
          )}
          <InsightLastUpdated endpoint={insightLastUpdated[pageName].endpoint} />
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
    </GlossaryProvider>
  );
};

export default withWindowSize(InsightPageLayout);
