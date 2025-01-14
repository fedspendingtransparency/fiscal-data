import React, { ReactElement, useEffect, useState } from 'react';
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
import { Skeleton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface IInsightSection {
  component: ReactElement;
  index: number;
}

const InsightPageLayout = ({ pageContext, width }) => {
  const { pageName, seoConfig, heroImage } = pageContext;
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
        setLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

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
        {isLoading ? (
          <div>
            <Skeleton width={'99%'} variant="text" sx={{
              minHeight: 130,
              marginTop: 0.5,
              marginBottom: 0.5,
              transition: 'opacity 2s'}}
            />
          </div>
        ) : (
          <>
            <InsightHeroImage heading={heroImage.heading}>{insightHeroMap[pageName].component()}</InsightHeroImage>
            {width < pxToNumber(breakpointLg) && (
              <SocialShare copy={insightSocialShareMap[pageName]} pageName="" headerLevel="h2" displayStyle="responsive" />
            )}
          </>
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
            {isLoading ? (
              <div>
                <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
              </div>
            ) : (
              <>
                {width >= pxToNumber(breakpointLg) && (
                  <SocialShare copy={insightSocialShareMap[pageName]} pageName="Interest Expense" headerLevel="h2" displayStyle="responsive" />
              )}
              </>
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
