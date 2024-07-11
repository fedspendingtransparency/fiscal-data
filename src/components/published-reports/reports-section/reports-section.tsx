import React from 'react';
import { FunctionComponent } from 'react';
import DownloadReportTable from '../download-report-table/download-report-table';
import { sectionHeader } from './reports-section.module.scss';
import DatasetAboutTabs from '../../dataset-properties-tabs/dataset-properties-tabs';
import DatasetSectionContainer from '../../dataset-section-container/dataset-section-container';

// interface ReportsSection {}

export const title = 'Reports and Files';

// const ReportsSection: FunctionComponent<ReportsSection> = () => {
const ReportsSection= () => {
  return (
    <>
      <DatasetSectionContainer title={title} id="dataset-properties">
        <div>Published Date</div>
        <DownloadReportTable />
      </DatasetSectionContainer>

    </>
  );
}

export default ReportsSection;
