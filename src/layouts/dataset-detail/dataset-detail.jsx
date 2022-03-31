import React, { useEffect, useState } from 'react';
import configStore from './redux/config/config';
import PageHelmet from '../../components/page-helmet/page-helmet';
import DDNav from '../../components/dataset-detail-nav/dataset-detail-nav';
import Masthead from '../../components/masthead/masthead';
import DatasetAbout from '../../components/dataset-about/dataset-about';
import DatasetData from '../../components/dataset-data/dataset-data';
import ApiQuickGuide from '../../components/api-quick-guide/api-quick-guide';
import RelatedDatasets from "../../components/related-datasets/related-datasets";
import { graphql } from "gatsby";
import SiteLayout from '../../components/siteLayout/siteLayout';
import LocationAware from '../../components/location-aware/location-aware';
import { useMetadataUpdater } from "../../helpers/metadata/use-metadata-updater-hook";
import { updateConfig } from "./helper";

export const query =
  graphql`
      query relatedDatasets($relatedDatasets: [String]) {
        allDatasets(filter: {datasetId: {in: $relatedDatasets}}) {
          datasets: nodes {
            datasetId
            slug
            name
            tagLine
            relatedTopics
            techSpecs {
              earliestDate
              latestDate
              updateFrequency
              lastUpdated
              fileFormat
            }
            dictionary
          }
        }
      }
    `;

const DatasetDetail = ({ data, pageContext, location, test }) => {
  const [finalDatesNotFound, setFinalDatesNotFound] = useState(true);
  const [selectedTable, setSelectedTable] = useState({});
  const updatedPageConfig = useMetadataUpdater(pageContext);
  const updatedDatasetData = useMetadataUpdater(data.allDatasets.datasets);
  const canonical= `/datasets${pageContext.config.slug}`;

  useEffect(() => {
    if (finalDatesNotFound) {
      // Update the value for configStore when new data is available
      if (updatedPageConfig && updatedPageConfig.config) {
        updateConfig(updatedPageConfig.config);
      }
      // Set flag so its known that the data set's dates have been updated and/or confirmed
      setFinalDatesNotFound(false);
    }
  }, [updatedPageConfig]);

  useEffect(() => {
    // Set the value for configStore to pageContext.config at page load
    if (pageContext && pageContext.config) {
      updateConfig(pageContext.config);
    }
  }, []);

  return (
    <SiteLayout isPreProd={pageContext.isPreProd}>
      <PageHelmet datasetDetails={pageContext?.config}
                  pageTitle={pageContext?.seoConfig?.pageTitle || ''}
                  description={pageContext?.seoConfig?.description || ''}
                  keywords={pageContext?.seoConfig?.keywords || ''}
                  canonical={canonical}
      />
      <Masthead
        title={pageContext.config.name}
        tagLine={pageContext.config.tagLine}
        dictionary={pageContext.config.dictionary}
      />
      <DDNav title={pageContext.config.name} />
      <div className="bodyBackground">
        <DatasetAbout config={pageContext.config} test={test} />
        <DatasetData setSelectedTableProp={setSelectedTable}
                     finalDatesNotFound={finalDatesNotFound}
                     location={location}
        />
        <ApiQuickGuide selectedTable={selectedTable} config={pageContext.config} />
        <RelatedDatasets datasets={updatedDatasetData} referrer={pageContext.config.name} />
      </div>
    </SiteLayout>

  )
};

export default LocationAware(DatasetDetail);
