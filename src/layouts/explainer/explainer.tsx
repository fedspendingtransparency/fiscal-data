import React, { FunctionComponent } from "react";
import BreadCrumbs from "../../components/breadcrumbs/breadcrumbs";
import PageHelmet from "../../components/page-helmet/page-helmet";
import SiteLayout from "../../components/siteLayout/siteLayout";
import explainerSections, {
  explainerDataSources,
  explainerDescriptionGenerators,
} from "./sections/sections";
import HeroImage from "./hero-image/hero-image";
import { IExplainerPage } from "../../models/IExplainerPage";
import {
  explainerAnalyticsLabelMap,
  explainerClassMap,
  explainerColorMap,
  explainerHeroMap,
  explainerRelatedDatasetMap,
  explainerSocialShareMap,
} from "./explainer-helpers/explainer-helpers";

import {
  breadCrumbsContainer,
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
} from "./explainer.module.scss";
import SecondaryNav from "../../components/secondary-nav/secondary-nav";
import SocialShare from "./social-share/social-share";
import ExplainerRelatedDatasets from "./explainer-related-datasets/explainer-related-datasets";
import DataSourcesMethodologies from "./data-sources-methodologies/data-sources-methodologies";
import ComingSoon from "./explainer-components/hightlighted-text/highlighted-text";
import DeskTopSubNav from "./explainer-components/explainer-sub-nav/explainer-sub-nav";
import MobileSubNav from "./explainer-components/mobile-explainer-sub-nav/mobile-explainer-sub-nav";
import { breakpointLg } from "../../../src/variables.module.scss";

const ExplainerPageLayout: FunctionComponent<IExplainerPage> = ({
  path,
  pageContext,
}) => {
  const {
    pageName,
    breadCrumbLinkName,
    heroImage,
    seoConfig,
    relatedDatasets,
    glossary,
    cpiDataByYear,
  } = pageContext;

  const breadCrumbLinks: Record<string, unknown>[] = [
    {
      name: breadCrumbLinkName,
      link: path,
    },
    {
      name: "Home",
      link: "/",
    },
  ];

  const isAFGPage = () => {
    const isBrowser = () => typeof window !== "undefined";
    let isAFG = false;
    isBrowser() && window.location.href.includes("americas-finance-guide")
      ? (isAFG = true)
      : (isAFG = false);
    return isAFG;
  };

  return (
    <SiteLayout isPreProd={false}>
      <PageHelmet
        pageTitle={seoConfig.pageTitle}
        description={seoConfig.description}
        descriptionGenerator={explainerDescriptionGenerators[pageName] || false}
        keywords=""
        image=""
        canonical=""
        datasetDetails=""
      />

      {isAFGPage ? (
        <>
          <div className={mobileSubNav}>
            <MobileSubNav hidePosition={160} />
          </div>
          <div className={desktopSubNav}>
            <DeskTopSubNav hidePosition={160} />
          </div>
        </>
      ) : (
        <div className={breadCrumbsContainer}>
          <BreadCrumbs links={breadCrumbLinks} />
        </div>
      )}

      <div className={mainContainer}>
        <HeroImage
          heading={heroImage.heading}
          subHeading={heroImage.subHeading}
          primaryColor={explainerColorMap[pageName].primary}
          secondaryColor={explainerColorMap[pageName].secondaryLight}
          pageName={pageName}
        >
          {explainerHeroMap[pageName].component(glossary)}
        </HeroImage>
        <div className={contentContainer}>
          <SecondaryNav
            sections={explainerSections[pageName]}
            activeClass={explainerClassMap[pageName].active}
            hoverClass={explainerClassMap[pageName].hover}
            analytics={true}
            analyticsCategory={"Explainers"}
            analyticsPageLabel={explainerAnalyticsLabelMap[pageName]}
          >
            <div className={socialShareContainer}>
              <div className={socialShare}>
                <SocialShare
                  title={explainerSocialShareMap[pageName].title}
                  description={explainerSocialShareMap[pageName].description}
                  body={explainerSocialShareMap[pageName].body}
                  emailSubject={explainerSocialShareMap[pageName].emailSubject}
                  emailBody={explainerSocialShareMap[pageName].emailBody}
                  url={explainerSocialShareMap[pageName].url}
                  image={explainerSocialShareMap[pageName].image}
                  pageName={explainerAnalyticsLabelMap[pageName]}
                />
              </div>
              <div className={mainContent}>
                {explainerSections[pageName].map(s => (
                  <React.Fragment key={s.index}>
                    <section id={s.id} className={section}>
                      {s.comingSoon && <ComingSoon />}
                      <h2
                        className={sectionHeading}
                        style={{ color: explainerColorMap[pageName].primary }}
                        data-testid="section-heading"
                      >
                        {s.title}
                      </h2>
                      {s.component(glossary, cpiDataByYear)}
                      {s.index !== explainerSections[pageName].length - 1 && (
                        <div
                          className={sectionBorder}
                          style={{
                            backgroundColor:
                              explainerColorMap[pageName].secondary,
                          }}
                        />
                      )}
                    </section>
                  </React.Fragment>
                ))}
                <section className={section}>
                  <DataSourcesMethodologies pageName={pageName}>
                    {explainerDataSources[pageName]}
                  </DataSourcesMethodologies>
                </section>
              </div>
            </div>
          </SecondaryNav>
        </div>
        <div className={relatedDatasetsStyle}>
          <ExplainerRelatedDatasets
            datasets={relatedDatasets}
            referrer={"example"}
            header={explainerRelatedDatasetMap[pageName]}
          />
        </div>
      </div>
    </SiteLayout>
  );
};

export default ExplainerPageLayout;
