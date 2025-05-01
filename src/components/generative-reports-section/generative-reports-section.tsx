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

const GenerativeReportsSection: FunctionComponent<{ apisProp: IDatasetApi[] }> = ({ apisProp, width, reportGenKey }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [latestReportDate, setLatestReportDate] = useState<Date>();
  const [earliestReportDate, setEarliestReportDate] = useState<Date>();
  const [allReportDates, setAllReportDates] = useState<string[]>([]);
  const [allReportYears, setAllReportYears] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState(defaultSelection);
  const [activeReports, setActiveReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [apiErrorMessage, setApiErrorMessage] = useState(false);
  const [noMatchingData, setNoMatchingData] = useState(false);

  const getSummaryReportData = async (report, reportConfig, reportData, endpoint, dataKey, sortKey) => {
    if (!reportConfig[endpoint] || reportData.length === 0) return;
    const { dateField } = report;
    const summarySort = reportConfig[sortKey];
    const sortString = buildSortParam(summarySort);
    const reportDataKey = reportConfig.reportDataKey ? reportConfig.reportDataKey : reportConfig[dataKey];
    const secondary = reportData[0][reportDataKey];
    const filterString = buildFilterParam(selectedDate, dateField, secondary, reportConfig[dataKey]);
    const endpointUrl = reportConfig[endpoint] + `?filter=${filterString}&sort=${sortString}`;
    const res = await basicFetch(`${apiPrefix}${endpointUrl}`);
    return res.data;
  };
  const getReportData = async (report, reportConfig) => {
    const { dateField, apiFilter } = report;
    const { sort } = reportConfig;
    const { field: accountField } = apiFilter;
    const filterStr = buildFilterParam(selectedDate, dateField, selectedAccount.value, accountField);
    const sortStr = buildSortParam(sort);
    const endpointUrl = report.endpoint + `?filter=${filterStr}&sort=${sortStr}`;
    const res = await basicFetch(`${apiPrefix}${endpointUrl}`);
    const summaryData = await getSummaryReportData(report, reportConfig, res.data, 'summaryEndpoint', 'summaryDataKey', 'summarySort');
    const summaryTableData = await getSummaryReportData(
      report,
      reportConfig,
      res.data,
      'summaryTableEndpoint',
      'summaryTableKey',
      'summaryTableSort'
    );

    return { tableData: res.data, summaryData, summaryTableData };
  };

  const setSummaryValues = (reportConfig, formattedDate, reportData, summaryData) => {
    const { reportInfo, reportSummary } = reportConfig;

    reportInfo.forEach(infoValue => {
      if (infoValue.filter === 'date') {
        infoValue.value = formattedDate;
      } else if (infoValue.filter === 'account' && reportData.length > 0 && infoValue.secondaryField) {
        const secondary = reportData[0][infoValue.secondaryField];
        infoValue.value = selectedAccount.label + ', ' + secondary;
      }
    });
    if (reportSummary && summaryData) {
      reportSummary.forEach((summaryValue, index) => {
        if (summaryData[index]) {
          summaryValue.value = summaryData[index][summaryValue.field];
        }
      });
    }
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
          const reportConfig = reportsConfig[reportGenKey][report.apiId];
          const formattedDate = format(selectedDate, 'MMMM yyyy');
          const downloadDate = format(selectedDate, 'MMyyyy');
          let reportData;
          try {
            reportData = await getReportData(report, reportConfig);
          } catch (error) {
            setApiErrorMessage(true);
            break;
          }
          setApiErrorMessage(false);
          const curReport = {
            id: report.apiId,
            name: `${report.tableName} - ${selectedAccount.label}.pdf`,
            date: formattedDate,
            size: '2KB',
            downloadName: `${reportConfig.downloadName}_${selectedAccount.label}_${downloadDate}.pdf`,
            data: reportData.tableData,
            summaryData: reportData.summaryTableData,
            config: reportConfig,
            colConfig: report,
          };
          reports.push(curReport);
          setSummaryValues(reportConfig, formattedDate, reportData.tableData, reportData.summaryData);
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

  useEffect(() => {
    if (selectedAccount.label !== '(None selected)') {
      setNoMatchingData(true);
    } else {
      setNoMatchingData(false);
    }
  }, [activeReports]);

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
        {(activeReports?.length === 0 || apiErrorMessage) && (
          <GenerativeReportsEmptyTable width={width} apiErrorMessage={apiErrorMessage} noMatchingData={noMatchingData} reportGenKey={reportGenKey} />
        )}
        {activeReports?.length > 0 && !apiErrorMessage && (
          <DownloadReportTable isDailyReport={false} generatedReports={activeReports} width={width} setApiErrorMessage={setApiErrorMessage} />
        )}
      </DatasetSectionContainer>
    </div>
  );
};

export default withWindowSize(GenerativeReportsSection);
