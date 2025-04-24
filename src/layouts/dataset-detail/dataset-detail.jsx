import React, { useEffect, useState } from 'react';
import PageHelmet from '../../components/page-helmet/page-helmet';
import DDNav from '../../components/dataset-detail-nav/dataset-detail-nav';
import Masthead from '../../components/masthead/masthead';
import DatasetAbout from '../../components/dataset-about/dataset-about';
import DatasetData from '../../components/dataset-data/dataset-data';
import ApiQuickGuide from '../../components/api-quick-guide/api-quick-guide';
import RelatedDatasets from '../../components/related-datasets/related-datasets';
import { graphql } from 'gatsby';
import SiteLayout from '../../components/siteLayout/siteLayout';
import LocationAware from '../../components/location-aware/location-aware';
import { useMetadataUpdater } from '../../helpers/metadata/use-metadata-updater-hook';
import DatasetIntroduction from '../../components/dataset-introduction/dataset-introduction';
import BannerCallout from '../../components/banner-callout/banner-callout';
import Experimental from '../../components/experimental/experimental';
import { bannerCalloutContainer } from '../../components/masthead/masthead.module.scss';
import ReportsSection from '../../components/published-reports/reports-section/reports-section';
import GenerativeReportsSection from '../../components/generative-reports-section/generative-reports-section';
import DataPreview from '../../components/data-preview/data-preview';

export const query = graphql`
  query relatedDatasets($relatedDatasets: [String]) {
    allDatasets(filter: { datasetId: { in: $relatedDatasets } }) {
      datasets: nodes {
        datasetId
        slug
        name
        apis {
          apiId
        }
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
        hideRawDataTable
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
  const canonical = `/datasets${pageContext.config.slug}`;
  const hideRawDataTable = pageContext.config?.hideRawDataTable;
  const bannerCallout = pageContext.config.bannerCallout;

  useEffect(() => {
    setPageConfig(updatedPageConfig.config);
    setFinalDatesNotFound(false);
  }, [updatedPageConfig]);

  const determineBannerType = () => {
    if (bannerCallout.banner === 'SavingsBondsDelay' || bannerCallout.banner === 'TreasuryDirectDelay') {
      return 'warning';
    } else {
      return 'info';
    }
  };

  return (
    <SiteLayout isPreProd={pageContext.isPreProd}>
      <PageHelmet
        datasetDetails={pageContext?.config}
        pageTitle={pageContext?.seoConfig?.pageTitle || ''}
        description={pageContext?.seoConfig?.description || ''}
        keywords={pageContext?.seoConfig?.keywords || ''}
        canonical={canonical}
      />
      <Masthead title={pageContext.config.name} bannerCallout={pageContext?.config.bannerCallout} />
      <DDNav hasPublishedReports={!!pageConfig.publishedReports} hideRawDataTable={hideRawDataTable} />
      <div className="ddpBodyBackground">
        {bannerCallout && (
          <div className={bannerCalloutContainer} data-testid="callout">
            <BannerCallout bannerCallout={bannerCallout} bannerType={determineBannerType()} />
          </div>
        )}
        <DatasetIntroduction
          summaryText={pageContext.config.summaryText}
          techSpecs={pageConfig.techSpecs}
          dictionary={pageContext.config.dictionary}
          numTables={pageConfig.apis.length}
          dateExpected={pageConfig.dateExpected}
          timeExpected={pageConfig.timeExpected}
          config={pageContext.config}
        />
        {pageConfig.reportGenDefaultTable && (
          <Experimental featureId="defaultReportTable">
            <GenerativeReportsSection apisProp={pageConfig.apis} />
          </Experimental>
        )}
        <ReportsSection publishedReportsProp={pageConfig.publishedReports} dataset={pageConfig} />
        {!hideRawDataTable && (
          <>
            <Experimental featureId="dataPreview">
              <DataPreview
                setSelectedTableProp={setSelectedTable}
                finalDatesNotFound={finalDatesNotFound}
                config={pageConfig}
                location={location}
                publishedReportsProp={pageConfig.publishedReports}
              />
            </Experimental>
            <DatasetData
              setSelectedTableProp={setSelectedTable}
              finalDatesNotFound={finalDatesNotFound}
              config={pageConfig}
              location={location}
              publishedReportsProp={pageConfig.publishedReports}
            />
          </>
        )}
        <DatasetAbout config={pageContext.config} test={test} />
        {!hideRawDataTable && (
          <>
            <ApiQuickGuide selectedTable={selectedTable} config={pageContext.config} />
            <RelatedDatasets datasets={updatedDatasetData} referrer={pageContext.config.name} />
          </>
        )}
      </div>
    </SiteLayout>
  );
};

export default LocationAware(DatasetDetail);
