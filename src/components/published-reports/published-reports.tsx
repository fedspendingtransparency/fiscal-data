import React, { FunctionComponent } from 'react';
import ReportsSection from './reports-section/reports-section';
import Experimental from '../experimental/experimental';
import GenerativeReportsSection from '../generative-reports-section/generative-reports-section';

const PublishedReports: FunctionComponent = ({ pageConfig }) => {
  return (
    <>
      {pageConfig.reportGenKey && (
        <Experimental featureId="defaultReportTable">
          <GenerativeReportsSection dataset={pageConfig} />
        </Experimental>
      )}
      <ReportsSection publishedReportsProp={pageConfig.publishedReports} dataset={pageConfig} />
    </>
  );
};

export default PublishedReports;
