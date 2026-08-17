import React, { ReactElement } from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import {
  contentContainer,
  insightsContainer,
  mainContent,
  relatedContent,
  sectionContainer,
  socialShareDesktop,
  socialShareMobile,
} from './insight.module.scss';
import SocialShare from '../../components/social-share/social-share';
import {
  discoverDatasetsCitationsMap,
  exploreMoreCitationsMap,
  insightHeroMap,
  insightLastUpdated,
  insightSocialShareMap,
  insightsPageName,
} from '../../helpers/insights/insight-helpers';
import CitationList from '../../components/citation-list/citation-list';
import { insightsDataSources, insightsDescriptionGenerators, insightsSections } from './sections/sections';
import { InsightHeroImage } from './insight-hero-image/insight-hero-image';
import { InsightLastUpdated } from './sections/interest-expense/last-updated/insight-last-updated';
import GlossaryProvider from '../../components/glossary/glossary-context/glossary-context';

interface IInsightSection {
  component: ReactElement;
  index: number;
}

const InsightPageLayout = ({ pageContext }) => {
  const { pageName, heroImage } = pageContext;

  return (
    <GlossaryProvider>
      <SiteLayout isPreProd={false}>
        <div className={insightsContainer}>
          <InsightHeroImage heading={heroImage.heading}>{insightHeroMap[pageName].component()}</InsightHeroImage>
          <div data-testid="social-share-mobile" className={socialShareMobile}>
            <SocialShare copy={insightSocialShareMap[pageName]} pageName={insightsPageName[pageName]} headerLevel="h2" displayStyle="responsive" />
          </div>
          <InsightLastUpdated endpoint={insightLastUpdated[pageName]?.endpoint} />
          <div className={contentContainer}>
            <div className={mainContent}>
              {insightsSections[pageName]?.map((section: IInsightSection) => (
                <React.Fragment key={section.index}>
                  <section className={sectionContainer}>{section.component}</section>
                </React.Fragment>
              ))}
              <section>
                <h2>Data Sources and Methodologies:</h2> {insightsDataSources[pageName]}
              </section>
            </div>
            <aside className={relatedContent}>
              <div data-testid="social-share-desktop" className={socialShareDesktop}>
                <SocialShare
                  copy={insightSocialShareMap[pageName]}
                  pageName={insightsPageName[pageName]}
                  headerLevel="h2"
                  displayStyle="responsive"
                />
              </div>
              <CitationList header="Explore More" citations={exploreMoreCitationsMap[pageName]} pageName={insightsPageName[pageName]} />
              <CitationList header="Discover Datasets" citations={discoverDatasetsCitationsMap[pageName]} pageName={insightsPageName[pageName]} />
            </aside>
          </div>
        </div>
      </SiteLayout>
    </GlossaryProvider>
  );
};

export default InsightPageLayout;

export const Head = ({ pageContext }) => {
  const { seoConfig, pageName } = pageContext;

  return (
    <>
      <PageHelmet
        pageTitle={seoConfig.pageTitle}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        descriptionGenerator={insightsDescriptionGenerators[pageName]}
        socialShare={insightSocialShareMap[pageName]}
      />
    </>
  );
};
