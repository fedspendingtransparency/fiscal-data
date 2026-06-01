import React, { ReactElement } from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import {
  contentContainer,
  featureContentContainer,
  mainContent,
  relatedContent,
  sectionContainer,
  sectionHeading,
  socialShareDesktop,
  socialShareMobile,
  subTitle,
} from './featured-content.module.scss';
import SocialShare from '../../components/social-share/social-share';
import CitationList from '../../components/citation-list/citation-list';
import InsightsImage from '../../components/insights-image/insights-image';
import GlossaryProvider from '../../components/glossary/glossary-context/glossary-context';
import { featuredContentSections } from './featured-content-pages/sections';
import {
  discoverDatasetsCitationsMap,
  exploreMoreCitationsMap,
  featuredContentImageMap,
  featuredContentPageName,
  featuredContentSocialShareMap,
} from './featured-content-helpers';

interface IFeatureContentSection {
  component: ReactElement;
  index: number;
}

const FeatureContentPageLayout = ({ pageContext }) => {
  const { pageName, heroImage } = pageContext;
  const image = featuredContentImageMap[pageName];

  return (
    <GlossaryProvider>
      <SiteLayout isPreProd={false}>
        <div className={featureContentContainer}>
          <h1 className={sectionHeading}>{heroImage.heading}</h1>
          {image && <InsightsImage imageRefDesktop={image.imageRefDesktop} imageRefMobile={image.imageRefMobile} altText={image.altText} />}
          {heroImage.subHeading !== '' && <h2 className={subTitle}>{heroImage.subHeading}</h2>}
          <div data-testid="social-share-mobile" className={socialShareMobile}>
            <SocialShare
              copy={featuredContentSocialShareMap[pageName]}
              pageName={featuredContentPageName[pageName]}
              headerLevel="h2"
              displayStyle="responsive"
            />
          </div>
          <div className={contentContainer}>
            <div className={mainContent}>
              {featuredContentSections[pageName]?.map((section: IFeatureContentSection) => (
                <React.Fragment key={section.index}>
                  <section className={sectionContainer}>{section.component}</section>
                </React.Fragment>
              ))}
            </div>
            <aside className={relatedContent}>
              <div data-testid="social-share-desktop" className={socialShareDesktop}>
                <SocialShare
                  copy={featuredContentSocialShareMap[pageName]}
                  pageName={featuredContentPageName[pageName]}
                  headerLevel="h2"
                  displayStyle="responsive"
                />
              </div>
              <CitationList header="Explore More" citations={exploreMoreCitationsMap[pageName]} pageName={featuredContentPageName[pageName]} />
              <CitationList
                header="Discover Datasets"
                citations={discoverDatasetsCitationsMap[pageName]}
                pageName={featuredContentPageName[pageName]}
              />
            </aside>
          </div>
        </div>
      </SiteLayout>
    </GlossaryProvider>
  );
};

export default FeatureContentPageLayout;

export const Head = ({ pageContext }) => {
  const { seoConfig, pageName } = pageContext;

  return (
    <>
      <PageHelmet
        pageTitle={seoConfig.pageTitle}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        socialShare={featuredContentSocialShareMap[pageName]}
      />
    </>
  );
};
