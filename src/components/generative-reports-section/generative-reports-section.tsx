import React, { useEffect, useState } from 'react';
import { FunctionComponent } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import { IDatasetApi } from '../../models/IDatasetApi';
import GenerativeReportsEmptyTable from './generative-reports-empty-table/generative-reports-empty-table';
import { filtersContainer } from '../published-reports/reports-section/reports-section.module.scss';
import GenerativeReportsAccountFilter from './generative-reports-account-filter/generative-reports-account-filter';

export const title = 'Reports and Files';
export const notice = 'Banner Notice';

const GenerativeReportsSection: FunctionComponent<{ apisProp: IDatasetApi[]; useDefaultReportTable: boolean }> = ({
  apisProp,
  useDefaultReportTable,
}) => {
  const [accounts, setAllAccounts] = useState({
    Federal: [],
    State: [],
  });

  useEffect(() => {
    const flatten = label => {
      return apisProp
        .map(api => api.apiFilter.optionValues[label])
        .filter(item => item?.length)
        .flat()
        .filter(item => item !== 'null');
    };

    let federal = flatten('Federal');
    let state = flatten('State');
    const all = flatten('all');
    federal = [...new Set(federal)];
    state = [...new Set(state.concat(all))];
    const updated = { Federal: federal, State: state };

    setAllAccounts(updated);
    console.log(updated);
  }, [apisProp, setAllAccounts]);

  return (
    <>
      {useDefaultReportTable && (
        <div>
          <DatasetSectionContainer title={title} id={'generative-reports-and-files'}>
            <div className={filtersContainer}>
              <GenerativeReportsAccountFilter accounts={accounts} setAllAccounts={setAllAccounts} />
            </div>
            <GenerativeReportsEmptyTable />
          </DatasetSectionContainer>
        </div>
      )}
    </>
  );
};

export default GenerativeReportsSection;
