import React, { useEffect, useState } from 'react';
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
  const [latestReportDate, setLatestReportDate] = useState<Date>();
  const [earliestReportDate, setEarliestReportDate] = useState<Date>();
  const [allReportDates, setAllReportDates] = useState<string[]>([]);
  const [allReportYears, setAllReportYears] = useState<string[]>([]);

  useEffect(() => {
    if (apisProp && apisProp.length > 0) {
      const earliestReport = new Date(Math.min(...apisProp.map(api => new Date(api.earliestDate).getTime())));
      const latestReport = new Date(Math.max(...apisProp.map(api => new Date(api.latestDate).getTime())));
      setEarliestReportDate(earliestReport);
      setLatestReportDate(latestReport);
      setSelectedDate(latestReport);
    }
  }, [apisProp]);

  useEffect(() => {
    if (earliestReportDate && latestReportDate) {
      const earliestFormat = earliestReportDate.toISOString().slice(0, 7);
      const latestFormat = latestReportDate.toISOString().slice(0, 7);
      setAllReportDates([earliestFormat, latestFormat]);

      const earliestYear = earliestReportDate.getFullYear();
      const latestYear = latestReportDate.getFullYear();
      const years = [];
      for (let year = earliestYear; year <= latestYear; year++) {
        years.push(String(year));
      }
      setAllReportYears(years);
    }
  }, [earliestReportDate, latestReportDate]);

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
                latestReportDate={latestReportDate}
                earliestReportDate={earliestReportDate}
                allReportDates={allReportDates}
                allReportYears={allReportYears}
                ignoreDisabled={true}
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
