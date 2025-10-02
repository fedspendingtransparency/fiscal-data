import React, { FunctionComponent } from 'react';
import ReportsSection from './reports-section/reports-section';
import Experimental from '../experimental/experimental';
import GenerativeReportsSection from './generative-reports-section/generative-reports-section';
import FilterReportsSection from './filter-reports-section/filter-reports-section';
import { IDatasetConfig } from '../../models/IDatasetConfig';
import LowerEnvironmentFeature from '../lower-environment-feature/lower-environment-feature';

export const sectionTitle = 'Reports and Files';

const PublishedReports: FunctionComponent<{ pageConfig: IDatasetConfig }> = ({ pageConfig }) => {
  return (
    <>
      {pageConfig.reportGenKey && (
        <LowerEnvironmentFeature featureId="reportGeneration">
          <GenerativeReportsSection dataset={pageConfig} />
        </LowerEnvironmentFeature>
      )}
      <ReportsSection dataset={pageConfig} />
      {pageConfig.runTimeReportConfig && pageConfig.runTimeReportConfig?.experimental && (
        <Experimental featureId="fipReportsSection">
          <FilterReportsSection dataset={pageConfig} />
        </Experimental>
      )}
      {pageConfig.runTimeReportConfig && !pageConfig.runTimeReportConfig?.experimental && <FilterReportsSection dataset={pageConfig} />}
    </>
  );
};

export default PublishedReports;
