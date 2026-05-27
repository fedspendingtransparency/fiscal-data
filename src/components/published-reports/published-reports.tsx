import React, { FunctionComponent } from 'react';
import ReportsSection from './reports-section/reports-section';
import Experimental from '../experimental/experimental';
import GenerativeReportsSection from './generative-reports-section/generative-reports-section';
import FilterReportsSection from './filter-reports-section/filter-reports-section';
import { IDatasetConfig } from '../../models/IDatasetConfig';
import { ErrorBoundary } from 'react-error-boundary';
import CustomLink from '../links/custom-link/custom-link';
import { reportErrorWrapper } from './published-reports.module.scss';

const reportErrorMessage = (
  <div className={reportErrorWrapper}>
    <div>
      <p>
        <strong>Reports and Files section has failed to load.</strong>
      </p>
      <p>
        There was an error and we are unable to load this section. Please try your request again or{' '}
        <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov?subject=Contact Us">contact us</CustomLink> for assistance.
      </p>
    </div>
  </div>
);

export const sectionTitle = 'Reports and Files';

const PublishedReports: FunctionComponent<{ pageConfig: IDatasetConfig }> = ({ pageConfig }) => {
  return (
    <>
      {pageConfig.reportGenKey && <GenerativeReportsSection dataset={pageConfig} />}
      <ErrorBoundary fallback={reportErrorMessage}>
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
