import React, { useEffect, useState } from 'react';
import { FunctionComponent } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import { IPublishedReportDataJson } from '../../models/IPublishedReportDataJson';
import { IDatasetConfig } from '../../models/IDatasetConfig';
import GenerativeReportsEmptyTable from './generative-reports-empty-table/generative-reports-empty-table';
export const title = 'Reports and Files';
export const notice = 'Banner Notice';

const GenerativeReportsSection: FunctionComponent<{ publishedReportsProp: IPublishedReportDataJson[]; dataset: IDatasetConfig }> = ({
  publishedReportsProp,
  dataset,
}) => {
  const footerMessage =
    'Note: Daily Treasury Statement reports dated before FY 1998 are grouped by fiscal year. Once inside the desired year, scroll to the specific month and day.';
  return (
    <div>
      <DatasetSectionContainer title={title} id={'generative-reports-and-files'}>
        <GenerativeReportsEmptyTable />
      </DatasetSectionContainer>
    </div>
  );
};

export default GenerativeReportsSection;
