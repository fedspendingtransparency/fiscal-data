import React, { useState } from 'react';
import { FunctionComponent } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import { IPublishedReportDataJson } from '../../models/IPublishedReportDataJson';
import { IDatasetConfig } from '../../models/IDatasetConfig';
import GenerativeReportsEmptyTable from './generative-reports-empty-table/generative-reports-empty-table';
import { filtersContainer } from '../published-reports/reports-section/reports-section.module.scss';
import GenerativeReportsAccountFilter from './generative-reports-account-filter/generative-reports-account-filter';

export const title = 'Reports and Files';
export const notice = 'Banner Notice';

const GenerativeReportsSection: FunctionComponent<{ publishedReportsProp: IPublishedReportDataJson[]; dataset: IDatasetConfig }> = ({
  publishedReportsProp,
  dataset,
  useDefaultReportTable,
}) => {
  const setAllAccounts = accounts => {
    console.log(accounts);
  };

  return (
    <>
      {useDefaultReportTable && (
        <div>
          <DatasetSectionContainer title={title} id={'generative-reports-and-files'}>
            <div className={filtersContainer}>
              <GenerativeReportsAccountFilter setAllAccounts={setAllAccounts} />
            </div>
            <GenerativeReportsEmptyTable />
          </DatasetSectionContainer>
        </div>
      )}
    </>
  );
};

export default GenerativeReportsSection;
