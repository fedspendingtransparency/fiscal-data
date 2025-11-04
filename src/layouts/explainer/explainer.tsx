import React, { FunctionComponent } from 'react';
import PageHelmet from '../../components/page-helmet/page-helmet';
import SiteLayout from '../../components/siteLayout/siteLayout';
import explainerSections, { explainerDataSources, explainerDescriptionGenerators } from './sections/sections';
import HeroImage from './hero-image/hero-image';
import { IExplainerPage } from '../../models/IExplainerPage';
import {
  explainerAnalyticsLabelMap,
  explainerClassMap,
  explainerColorMap,
  explainerHeroMap,
  explainerRelatedDatasetMap,
  explainerSocialShareMap,
} from './explainer-helpers/explainer-helpers';

import {
  contentContainer,
  relatedDatasetsStyle,
  mainContainer,
  mainContent,
  section,
  sectionBorder,
  sectionHeading,
  socialShareContainer,
  socialShare,
  mobileSubNav,
  desktopSubNav,
} from './explainer.module.scss';
import SecondaryNav from '../../components/secondary-nav/secondary-nav';
import SocialShare from '../../components/social-share/social-share';
import ExplainerRelatedDatasets from './explainer-related-datasets/explainer-related-datasets';
import DataSourcesMethodologies from './data-sources-methodologies/data-sources-methodologies';
import ComingSoon from './explainer-components/highlighted-text/highlighted-text';
import DeskTopSubNav from './explainer-components/explainer-sub-nav/explainer-sub-nav';
import MobileSubNav from './explainer-components/mobile-explainer-sub-nav/mobile-explainer-sub-nav';
import GlossaryProvider from '../../components/glossary/glossary-context/glossary-context';

const ExplainerPageLayout: FunctionComponent<IExplainerPage> = ({ pageContext }) => {
  const { pageName, heroImage, seoConfig, relatedDatasets, cpiDataByYear, isAFG, cpi12MonthPercentChange } = pageContext;

  const cpiData = {
    cpiDataByYear: cpiDataByYear,
    cpi12MonthPercentChange: cpi12MonthPercentChange,
  };

  return (
    <GlossaryProvider>
      <SiteLayout isPreProd={false}>
        <PageHelmet
          pageTitle={seoConfig.pageTitle}
          description={seoConfig.description}
          descriptionGenerator={explainerDescriptionGenerators[pageName] || false}
          keywords={seoConfig.keywords}
          image=""
          canonical=""
          datasetDetails=""
        />
        {isAFG && (
          <>
            <div className={mobileSubNav}>
              <MobileSubNav hidePosition={160} pageName={pageName} />
            </div>
            <div className={desktopSubNav}>
              <DeskTopSubNav hidePosition={160} />
            </div>
          </>
        )}
        <div className={mainContainer}>
          <HeroImage
            heading={heroImage.heading}
            subHeading={heroImage.subHeading}
            primaryColor={explainerColorMap[pageName].primary}
            secondaryColor={explainerColorMap[pageName].hero}
            pageName={pageName}
          >
            {explainerHeroMap[pageName].component()}
          </HeroImage>
          <div className={contentContainer}>
            <SecondaryNav
              sections={explainerSections[pageName]}
              activeClass={explainerClassMap[pageName].active}
              hoverClass={explainerClassMap[pageName].hover}
              analytics={true}
              analyticsCategory="Explainers"
              analyticsPageLabel={explainerAnalyticsLabelMap[pageName]}
              tocScrollOffset={-32}
            >
              <div className={socialShareContainer}>
                <aside className={socialShare}>
                  <SocialShare
                    copy={explainerSocialShareMap[pageName]}
                    pageName={explainerAnalyticsLabelMap[pageName]}
                    displayStyle="responsive"
                    explainer
                  />
                </aside>
                <div className={mainContent}>
                  {explainerSections[pageName].map(s => (
                    <React.Fragment key={s.index}>
                      <section id={s.id} className={section}>
                        {s.comingSoon && <ComingSoon />}
                        <h2 className={sectionHeading} style={{ color: explainerColorMap[pageName].primary }} data-testid="section-heading">
                          {s.title}
                        </h2>
                        {s.component(cpiData)}
                        {s.index !== explainerSections[pageName].length - 1 && (
                          <div
                            className={sectionBorder}
                            style={{
                              backgroundColor: explainerColorMap[pageName].secondary,
                            }}
                          />
                        )}
                      </section>
                    </React.Fragment>
                  ))}
                  <section className={section}>
                    <DataSourcesMethodologies pageName={pageName}>{explainerDataSources[pageName]}</DataSourcesMethodologies>
                  </section>
                </div>
              </div>
            </SecondaryNav>
          </div>
          <div className={relatedDatasetsStyle}>
            <ExplainerRelatedDatasets
              datasets={relatedDatasets}
              referrer={explainerAnalyticsLabelMap[pageName]}
              header={explainerRelatedDatasetMap[pageName]}
              explainer={true}
            />
          </div>
        </div>
      </SiteLayout>
    </GlossaryProvider>
  );
};

export default ExplainerPageLayout;
