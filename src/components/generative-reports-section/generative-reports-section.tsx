import React, { FunctionComponent, useEffect, useState } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import { IDatasetApi } from '../../models/IDatasetApi';
import { filtersContainer } from '../published-reports/reports-section/reports-section.module.scss';
import { apiPrefix, basicFetch } from '../../utils/api-utils';
import { format } from 'date-fns';
import { buildFilterParam, buildSortParam } from './generative-report-helper';
import GenerativeReportsEmptyTable from './generative-reports-empty-table/generative-reports-empty-table';
import GenerativeReportsAccountFilter from './generative-reports-account-filter/generative-reports-account-filter';
import ReportDatePicker from '../published-reports/report-date-picker/report-date-picker';
import { withWindowSize } from 'react-fns';
import { reportsConfig } from './reports-config';
import { DownloadReportTable } from '../published-reports/download-report-table/download-report-table';

export const title = 'Reports and Files';
export const notice = 'Banner Notice';
export const defaultSelection = { label: '(None selected)', value: '' };

const GenerativeReportsSection: FunctionComponent<{ apisProp: IDatasetApi[] }> = ({ apisProp, width }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [latestReportDate, setLatestReportDate] = useState<Date>();
  const [earliestReportDate, setEarliestReportDate] = useState<Date>();
  const [allReportDates, setAllReportDates] = useState<string[]>([]);
  const [allReportYears, setAllReportYears] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState(defaultSelection);
  const [activeReports, setActiveReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [apiErrorMessage, setApiErrorMessage] = useState(false);

  const getReportData = async (report, reportConfig) => {
    const { dateField, apiFilter } = report;
    const { sort } = reportConfig;
    const { field: accountField } = apiFilter;
    const filterStr = buildFilterParam(selectedDate, dateField, selectedAccount.value, accountField);
    const sortStr = buildSortParam(sort);
    const endpointUrl = report.endpoint + `?filter=${filterStr}&sort=${sortStr}`;
    try {
      const res = await basicFetch(`${apiPrefix}${endpointUrl}`);
      return res.data;
    } catch (error) {
      setApiErrorMessage(true);
      return [];
    }
  };

  const setSummaryValues = (reportConfig, formattedDate, reportData) => {
    const { reportInfo } = reportConfig;

    reportInfo.forEach(summaryValue => {
      if (summaryValue.filter === 'date') {
        summaryValue.value = formattedDate;
      } else if (summaryValue.filter === 'account' && reportData.length > 0 && summaryValue.secondaryField) {
        const secondary = reportData[0][summaryValue.secondaryField];
        summaryValue.value = selectedAccount.label + ', ' + secondary;
      }
    });
  };

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

  useEffect(() => {
    (async () => {
      if (selectedAccount.value) {
        const reports = [];
        for (const report of apisProp) {
          const reportConfig = reportsConfig.utf[report.apiId];
          const formattedDate = format(selectedDate, 'MMMM yyyy');
          const downloadDate = format(selectedDate, 'MMyyyy');
          const reportData = await getReportData(report, reportConfig);
          const curReport = {
            id: report.apiId,
            name: `${report.tableName} - ${selectedAccount.label}.pdf`,
            date: formattedDate,
            size: '2KB',
            downloadName: `${reportConfig.downloadName}_${selectedAccount.label}_${downloadDate}.pdf`,
            data: reportData,
            config: reportConfig,
            colConfig: report,
          };
          reports.push(curReport);
          setSummaryValues(reportConfig, formattedDate, reportData);
        }
        setAllReports(reports);
      } else {
        setAllReports([]);
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
    <div>
      <DatasetSectionContainer title={title} id="reports-and-files">
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
        {/*{apiErrorMessage && <DtgTableApiError />}*/}
        {activeReports?.length === 0 && <GenerativeReportsEmptyTable width={width} apiErrorMessage={apiErrorMessage} />}
        {activeReports?.length > 0 && <DownloadReportTable isDailyReport={false} generatedReports={activeReports} width={width} />}
        {/*{activeReports?.length > 0 && <DownloadReportTable isDailyReport={false} generatedReports={activeReports} width={width} />}*/}
      </DatasetSectionContainer>
    </div>
  );
};

export default withWindowSize(GenerativeReportsSection);
