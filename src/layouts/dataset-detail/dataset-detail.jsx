import React, { useEffect, useState } from 'react';
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
  const [pageConfig, setPageConfig] = useState(pageContext.config);
  const [finalDatesNotFound, setFinalDatesNotFound] = useState(true);
  const [selectedTable, setSelectedTable] = useState({});
  const updatedPageConfig = useMetadataUpdater(pageContext);
  const updatedDatasetData = useMetadataUpdater(data.allDatasets.datasets);

  const canonical= `/datasets${pageContext.config.slug}`;

  useEffect(() => {
    setPageConfig(updatedPageConfig.config);
    setFinalDatesNotFound(false);
  }, [updatedPageConfig]);

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
        techSpecs={pageConfig.techSpecs}
        dictionary={pageContext.config.dictionary}
        bannerCallout={pageContext?.config.bannerCallout}
      />

      <DDNav title={pageContext.config.name} />
      <div className="bodyBackground">
        <DatasetAbout config={pageContext.config} test={test} />
        <DatasetData setSelectedTableProp={setSelectedTable}
                     finalDatesNotFound={finalDatesNotFound}
                     config={pageConfig}
                     location={location}
                     publishedReportsProp={pageConfig.publishedReports}
        />
        <ApiQuickGuide selectedTable={selectedTable} config={pageContext.config} />
        <RelatedDatasets datasets={updatedDatasetData} referrer={pageContext.config.name} />
      </div>
    </SiteLayout>

  )
};

export default LocationAware(DatasetDetail);
