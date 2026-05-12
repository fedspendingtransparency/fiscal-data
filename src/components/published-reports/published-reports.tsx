import React, { FunctionComponent } from 'react';
import ReportsSection from './reports-section/reports-section';
import Experimental from '../experimental/experimental';
import GenerativeReportsSection from './generative-reports-section/generative-reports-section';
import FilterReportsSection from './filter-reports-section/filter-reports-section';
import { IDatasetConfig } from '../../models/IDatasetConfig';
import { ErrorBoundary } from 'react-error-boundary';

export const sectionTitle = 'Reports and Files';

const PublishedReports: FunctionComponent<{ pageConfig: IDatasetConfig }> = ({ pageConfig }) => {
  return (
    <>
      {pageConfig.reportGenKey && <GenerativeReportsSection dataset={pageConfig} />}
      <ErrorBoundary fallback={<h1>THIS IS THE FALLBACK COMP. TEST</h1>}>
        <ReportsSection dataset={pageConfig} />
      </ErrorBoundary>
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
