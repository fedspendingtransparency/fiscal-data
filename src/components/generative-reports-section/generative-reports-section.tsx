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
  const [earliestDate, setEarliestDate] = useState<Date>(new Date('2020-01-01'));
  const [latestDates, setLatestDates] = useState<Date>(new Date('2020-01-01'));

  useEffect(() => {
    if (apisProp?.length > 0) {
      const earliest = new Date(Math.min(...apisProp?.map(api => new Date(api.earliestDate).getTime())));
      const latest = new Date(Math.max(...apisProp?.map(api => new Date(api.latestDate).getTime())));
      setEarliestDate(earliest);
      setLatestDates(latest);
    }
  }, [apisProp]);
  const generateDatesArray = (start: Date, end: Date): string[] => {
    const dates: string[] = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(current.toISOString().slice(0, 10));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const generateYearsArray = (start: Date, end: Date): string[] => {
    const years: string[] = [];
    for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
      years.push(String(year));
    }
    return years;
  };
  const isDailyReport = false;
  const allReportDates = generateDatesArray(earliestDate, latestDates);

  const allReportYears = generateYearsArray(earliestDate, latestDates);

  return (
    <>
      {useDefaultReportTable && (
        <div>
          <DatasetSectionContainer title={title} id={'generative-reports-and-files'}>
            <div className={filtersContainer}>
              <ReportDatePicker
                isDailyReport={isDailyReport}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                latestReportDate={latestDates}
                earliestReportDate={earliestDate}
                allReportDates={allReportDates}
                allReportYears={allReportYears}
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
