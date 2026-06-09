import React, { ReactElement } from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import {
  contentContainer,
  featuredContentContainer,
  mainContent,
  pageContent,
  relatedContent,
  sectionContainer,
  socialShareDesktop,
  socialShareMobile,
  subTitle,
  rectangleBar,
} from './featured-content.module.scss';
import SocialShare from '../../components/social-share/social-share';
import CitationList from '../../components/citation-list/citation-list';
import GlossaryProvider from '../../components/glossary/glossary-context/glossary-context';
import FeaturedContentHero from './hero-image/featured-content-hero';
import FeaturedContentImage from './feature-content-image/feature-content-image';
import { featuredContentSections } from './featured-content-pages/sections';
import { getFeaturedContentPage } from './featured-content-helpers';

interface IFeaturedContentSection {
  component: ReactElement;
  index: number;
}

const FeaturedContentPageLayout = ({ pageContext }) => {
  const { pageName, heroImage } = pageContext;
  const featuredContentPage = getFeaturedContentPage(pageName);
  const colors = featuredContentPage?.colors || {};
  const image = featuredContentPage?.image;
  const pageTitle = featuredContentPage?.title;
  const socialShare = featuredContentPage?.socialShare;
  const exploreMoreCitations = featuredContentPage?.links?.exploreMore || [];
  const discoverDatasetsCitations = featuredContentPage?.links?.discoverDatasets || [];

  return (
    <GlossaryProvider>
      <SiteLayout isPreProd={false}>
        <div className={featuredContentContainer}>
          <FeaturedContentHero heading={heroImage.heading} primaryColor={colors.primary} secondaryColor={colors.secondary} />
          <div className={pageContent}>
            <div data-testid="social-share-mobile" className={socialShareMobile}>
              <SocialShare copy={socialShare} pageName={pageTitle} headerLevel="h2" displayStyle="responsive" />
            </div>
            <div className={contentContainer}>
              <div className={mainContent}>
                {image && (
                  <FeaturedContentImage imageRefDesktop={image.imageRefDesktop} imageRefMobile={image.imageRefMobile} altText={image.altText} />
                )}
                <div className={rectangleBar} style={{ backgroundColor: colors.primary }} />
                {heroImage.subHeading !== '' && (
                  <h2 className={subTitle} style={{ color: colors.primary }}>
                    {heroImage.subHeading}
                  </h2>
                )}
                {featuredContentSections[pageName]?.map((section: IFeaturedContentSection) => (
                  <React.Fragment key={section.index}>
                    <section className={sectionContainer}>{section.component}</section>
                  </React.Fragment>
                ))}
              </div>
              <aside className={relatedContent}>
                <div data-testid="social-share-desktop" className={socialShareDesktop}>
                  <SocialShare copy={socialShare} pageName={pageTitle} headerLevel="h2" displayStyle="responsive" />
                </div>
                <CitationList header="Explore More" citations={exploreMoreCitations} pageName={pageTitle} />
                <CitationList header="Discover Datasets" citations={discoverDatasetsCitations} pageName={pageTitle} />
              </aside>
            </div>
          </div>
        </div>
      </SiteLayout>
    </GlossaryProvider>
  );
};

export default FeaturedContentPageLayout;

export const Head = ({ pageContext }) => {
  const { seoConfig, pageName } = pageContext;
  const featuredContentPage = getFeaturedContentPage(pageName);

  return (
    <>
      <PageHelmet
        pageTitle={seoConfig.pageTitle}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        socialShare={featuredContentPage?.socialShare}
      />
    </>
  );
};
