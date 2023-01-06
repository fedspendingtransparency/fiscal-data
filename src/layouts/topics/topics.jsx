import React from 'react';
import * as styles from './topics.module.scss';
import LocationAware from "../../components/location-aware/location-aware";
import SiteLayout from "../../components/siteLayout/siteLayout";
import MastHead from './masthead/masthead';
import DatasetSectionContainer from '../../components/dataset-section-container/dataset-section-container';
import RelatedDatasets from "../../components/related-datasets/related-datasets";
import {mockDatasets} from '../../components/datasets/mockData/mockDatasets';
import RelatedAnalysesCards from "../../images/relatedAnalysesCards.png";
import * as relatedDatasetsStyles from "../../components/related-datasets/related-datasets.module.scss";
import HighlightCard from "./highlight-card/highlight-card";
import PageHelmet from '../../components/page-helmet/page-helmet';

const Topics = ({pageContext}) => {

  const config = pageContext.config;

  return (
    <SiteLayout isPreProd={pageContext.isPreProd}>
      <PageHelmet pageTitle={config.label} />
      <MastHead title={config.label} />
      <DatasetSectionContainer id={'highlights'} title={'Debt Highlights'}>
        {
          mockDatasets.map((dataset, i) => (
          <div className={relatedDatasetsStyles.cardWrapper} key={i} >
            <HighlightCard dataset={dataset} context={'Highlight Card'} />
          </div>
          ))
        }
      </DatasetSectionContainer>
      <RelatedDatasets datasets={mockDatasets} referrer={pageContext.config.name} />
      <DatasetSectionContainer id={'related-analyses'} title={'Related Analyses'}>
        <img alt="" src={RelatedAnalysesCards} className={styles.relatedAnalysesCards} />
      </DatasetSectionContainer>
    </SiteLayout>
  )
};

export default LocationAware(Topics);
