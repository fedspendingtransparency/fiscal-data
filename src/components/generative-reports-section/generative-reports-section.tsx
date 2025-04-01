import React, { FunctionComponent, useEffect, useState } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import { IDatasetApi } from '../../models/IDatasetApi';
import { filtersContainer } from '../published-reports/reports-section/reports-section.module.scss';
import GenerativeReportsAccountFilter from './generative-reports-account-filter/generative-reports-account-filter';
import ReportDatePicker from '../published-reports/report-date-picker/report-date-picker';
import { apiPrefix, basicFetch } from '../../utils/api-utils';
import { DownloadReportTable } from '../published-reports/download-report-table/download-report-table';
import GenerativeReportsEmptyTable from './generative-reports-empty-table/generative-reports-empty-table';
import { format } from 'date-fns';
import { buildFilterParam, buildSortParam } from './generative-report-helper';

export const title = 'Reports and Files';
export const notice = 'Banner Notice';
export const defaultSelection = { label: '(None selected)', value: '' };

const GenerativeReportsSection: FunctionComponent<{ apisProp: IDatasetApi[]; useDefaultReportTable: boolean }> = ({
  apisProp,
  useDefaultReportTable,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [latestReportDate, setLatestReportDate] = useState<Date>();
  const [earliestReportDate, setEarliestReportDate] = useState<Date>();
  const [allReportDates, setAllReportDates] = useState<string[]>([]);
  const [allReportYears, setAllReportYears] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState(defaultSelection);
  const [activeReports, setActiveReports] = useState([]);
  const [allReports, setAllReports] = useState([]);

  useEffect(() => {
    if (apisProp && apisProp.length > 0) {
      console.log(apisProp);
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

  const getReportData = async report => {
    const { dateField, apiFilter, alwaysSortWith } = report;
    const { field: accountField } = apiFilter;
    const filterStr = buildFilterParam(selectedDate, dateField, selectedAccount.value, accountField);
    const sortStr = buildSortParam(alwaysSortWith);
    const endpointUrl = report.endpoint + `?filter=${filterStr}&sort=${sortStr}`;
    return await basicFetch(`${apiPrefix}${endpointUrl}`).then(res => {
      return res.data;
    });
  };

  useEffect(() => {
    (async () => {
      if (selectedAccount.value) {
        const reports = [];
        for (const report of apisProp) {
          const curReport = {
            name: `${report.tableName} - ${selectedAccount.label}.pdf`,
            date: format(selectedDate, 'MMMM yyyy'),
            size: '?',
            downloadName: `${selectedAccount.label}.pdf`,
            data: await getReportData(report),
          };
          reports.push(curReport);
        }
        setAllReports(reports);
      }
    })();
  }, [selectedAccount, selectedDate]);

  useEffect(() => {
    const reports = [];
    allReports.forEach(report => {
      if (report.data.length > 0) {
        reports.push(report);
      }
    });
    setActiveReports(reports);
  }, [allReports]);

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
              <GenerativeReportsAccountFilter apiData={apisProp} selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} />
            </div>
            {activeReports?.length === 0 && <GenerativeReportsEmptyTable />}
            {activeReports?.length > 0 && <DownloadReportTable reports={activeReports} isDailyReport={false} width={1000} generatedReport={true} />}
          </DatasetSectionContainer>
        </div>
      )}
    </>
  );
};

export default GenerativeReportsSection;
