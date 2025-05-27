import React, { FunctionComponent, useEffect, useState } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import { IDatasetApi } from '../../models/IDatasetApi';
import { filtersContainer } from '../published-reports/reports-section/reports-section.module.scss';
import { apiPrefix, basicFetch } from '../../utils/api-utils';
import { format } from 'date-fns';
import { buildEndpoint } from './generative-report-helper';
import GenerativeReportsEmptyTable from './generative-reports-empty-table/generative-reports-empty-table';
import GenerativeReportsAccountFilter from './generative-reports-account-filter/generative-reports-account-filter';
import DatePicker from '../published-reports/report-date-picker/date-picker';
import { withWindowSize } from 'react-fns';
import { reportsConfig } from './reports-config';
import { DownloadReportTable } from '../published-reports/download-report-table/download-report-table';
import DataPreviewDatatableBanner from '../data-preview/data-preview-datatable-banner/data-preview-datatable-banner';

export const title = 'Reports and Files';
export const notice = 'Banner Notice';
export const defaultSelection = { label: '(None selected)', value: '' };

const GenerativeReportsSection: FunctionComponent<{ apisProp: IDatasetApi[] }> = ({ apisProp, width, reportGenKey, dataset }) => {
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

  const getSummaryReportData = async (dateField, reportData, summary, reportDataKey?) => {
    if (!summary || reportData.length === 0) return [];
    const config = summary.values || summary;
    const key = reportDataKey || config.dataKey;
    const secondary = reportData[0][key];
    const endpointUrl = buildEndpoint(selectedDate, dateField, secondary, config.dataKey, config);
    try {
      const res = await basicFetch(`${apiPrefix}${endpointUrl}`);
      return res.data;
    } catch {
      return [];
    }
  };

  const getReportData = async (report, reportConfig) => {
    const { dateField, apiFilter, endpoint } = report;
    const { sort } = reportConfig;
    const { field: accountField } = apiFilter;
    const endpointUrl = buildEndpoint(selectedDate, dateField, selectedAccount.value, accountField, { endpoint, sort });
    const res = await basicFetch(`${apiPrefix}${endpointUrl}`);
    const summaryData = await getSummaryReportData(dateField, res.data, reportConfig.summaryConfig.values, reportConfig.summaryConfig.reportDataKey);
    const summaryTableData = await getSummaryReportData(
      dateField,
      res.data,
      reportConfig.summaryConfig.table,
      reportConfig.summaryConfig.reportDataKey
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
        infoValue.value = `${selectedAccount.label}, ${secondary}`;
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
          <DatePicker
            isDaily={false}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            latestDate={latestReportDate}
            earliestDate={earliestReportDate}
            allDates={allReportDates}
            allYears={allReportYears}
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

        <DataPreviewDatatableBanner bannerNotice={dataset?.publishedReportsTip} isReport={true} />
      </DatasetSectionContainer>
    </div>
  );
};

export default withWindowSize(GenerativeReportsSection);
