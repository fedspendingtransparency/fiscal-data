import React from 'react';
import { relatedAnalysesCardsStyle } from './topics.module.scss';
import LocationAware from '../../components/location-aware/location-aware';
import SiteLayout from '../../components/siteLayout/siteLayout';
import MastHead from './masthead/masthead';
import DatasetSectionContainer from '../../components/dataset-section-container/dataset-section-container';
import RelatedDatasets from '../../components/related-datasets/related-datasets';
import { mockDatasets } from '../../components/datasets/mockData/mockDatasets';
import RelatedAnalysesCards from '../../images/relatedAnalysesCards.png';
import { cardWrapper } from '../../components/related-datasets/related-datasets.module.scss';
import HighlightCard from './highlight-card/highlight-card';
import PageHelmet from '../../components/page-helmet/page-helmet';

const Topics = ({ pageContext }) => {
  const config = pageContext.config;

  return (
    <SiteLayout isPreProd={pageContext.isPreProd}>
      <MastHead title={config.label} />
      <DatasetSectionContainer id="highlights" title="Debt Highlights">
        {mockDatasets.map((dataset, i) => (
          <div className={cardWrapper} key={i}>
            <HighlightCard dataset={dataset} context="Highlight Card" />
          </div>
        ))}
      </DatasetSectionContainer>
      <RelatedDatasets datasets={mockDatasets} referrer={pageContext.config.name} />
      <DatasetSectionContainer id="related-analyses" title="Related Analyses">
        <img alt="" src={RelatedAnalysesCards} className={relatedAnalysesCardsStyle} />
      </DatasetSectionContainer>
    </SiteLayout>
  );
};

export default LocationAware(Topics);

export const Head = ({ pageContext }) => {
  const config = pageContext.config;
  return <PageHelmet pageTitle={config.label} />;
};
