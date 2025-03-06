import React, { useEffect, useState } from 'react';
import { FunctionComponent } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import { IPublishedReportDataJson } from '../../models/IPublishedReportDataJson';
import { IDatasetConfig } from '../../models/IDatasetConfig';
import GenerativeReportsTable from './generative-reports-table/generative-reports-table';
export const title = 'Reports and Files';
export const notice = 'Banner Notice';

const GenerativeReportsSection: FunctionComponent<{ publishedReportsProp: IPublishedReportDataJson[]; dataset: IDatasetConfig }> = ({
  publishedReportsProp,
  dataset,
}) => {
  return (
    <div>
      <DatasetSectionContainer title={title} id={'generative-reports-and-files'}>
        <div style={{ position: 'relative' }}>
          <div>Generative Report Section Test</div>
          <GenerativeReportsTable apiFilterDefault={true} />
        </div>
      </DatasetSectionContainer>
    </div>
  );
};

export default GenerativeReportsSection;
