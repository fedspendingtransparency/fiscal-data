import React, { FunctionComponent } from 'react';
import ReportsSection from './reports-section/reports-section';
import Experimental from '../experimental/experimental';
import GenerativeReportsSection from './generative-reports-section/generative-reports-section';
import FilterReportsSection from './filter-reports-section/filter-reports-section';

const PublishedReports: FunctionComponent = ({ pageConfig }) => {
  //TODO: add experimental tag
  return (
    <>
      {pageConfig.reportGenKey && (
        <Experimental featureId="defaultReportTable">
          <GenerativeReportsSection dataset={pageConfig} />
        </Experimental>
      )}
      <ReportsSection publishedReportsProp={pageConfig.publishedReports} dataset={pageConfig} />
      {pageConfig.runTimeReportConfig && <FilterReportsSection reportConfig={pageConfig.runTimeReportConfig} />}
    </>
  );
};

export default PublishedReports;
