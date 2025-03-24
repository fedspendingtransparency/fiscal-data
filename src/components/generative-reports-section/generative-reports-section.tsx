import React, { useState } from 'react';
import { FunctionComponent } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import { IDatasetApi } from '../../models/IDatasetApi';
import GenerativeReportsEmptyTable from './generative-reports-empty-table/generative-reports-empty-table';
import { filtersContainer } from '../published-reports/reports-section/reports-section.module.scss';
import GenerativeReportsAccountFilter from './generative-reports-account-filter/generative-reports-account-filter';
import ReportDatePicker from '../published-reports/report-date-picker/report-date-picker';

export const title = 'Reports and Files';
export const notice = 'Banner Notice';

const GenerativeReportsSection: FunctionComponent<{ apisProp: IDatasetApi[]; useDefaultReportTable: boolean }> = ({
  apisProp,
  useDefaultReportTable,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const earliestDate = new Date(apisProp[0]?.earliestDate);
  const latestDate = new Date(apisProp[0].latestDate);

  return (
    <>
      {useDefaultReportTable && (
        <div>
          <DatasetSectionContainer title={title} id={'generative-reports-and-files'}>
            <div className={filtersContainer}>
              <ReportDatePicker
                isDailyReport={false}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                latestReportDate={latestDate}
                earliestReportDate={earliestDate}
                allReportDates={[]}
                allReportYears={[]}
              />
              <GenerativeReportsAccountFilter apiData={apisProp} />
            </div>
            <GenerativeReportsEmptyTable />
          </DatasetSectionContainer>
        </div>
      )}
    </>
  );
};

export default GenerativeReportsSection;
