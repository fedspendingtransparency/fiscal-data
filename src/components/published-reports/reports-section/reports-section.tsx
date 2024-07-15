import React from 'react';
import { FunctionComponent } from 'react';
import DownloadReportTable from '../download-report-table/download-report-table';
import { publishDate } from './reports-section.module.scss';
import DatasetSectionContainer from '../../dataset-section-container/dataset-section-container';

export const title = 'Reports and Files';

const ReportsSection: FunctionComponent = () => {
  return (
    <>
      <DatasetSectionContainer title={title} id="reports-and-files">
        <div className={publishDate}>Published Date</div>
        <DownloadReportTable />
      </DatasetSectionContainer>
    </>
  );
};

export default ReportsSection;
