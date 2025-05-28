import React, { FunctionComponent } from 'react';
import ReportsSection from './reports-section/reports-section';
import Experimental from '../experimental/experimental';
import GenerativeReportsSection from './generative-reports-section/generative-reports-section';
import FilterReportsSection from './filter-reports-section/filter-reports-section';
import { IDatasetConfig } from '../../models/IDatasetConfig';

export const sectionTitle = 'Reports and Files';

const PublishedReports: FunctionComponent<{ pageConfig: IDatasetConfig }> = ({ pageConfig }) => {
  return (
    <>
      {pageConfig.reportGenKey && (
        <Experimental featureId="defaultReportTable">
          <GenerativeReportsSection dataset={pageConfig} />
        </Experimental>
      )}
      <ReportsSection dataset={pageConfig} />
      {pageConfig.runTimeReportConfig && (
        <Experimental featureId="fipReportsSection">
          <FilterReportsSection reportConfig={pageConfig.runTimeReportConfig} />
        </Experimental>
      )}
    </>
  );
};

export default PublishedReports;
