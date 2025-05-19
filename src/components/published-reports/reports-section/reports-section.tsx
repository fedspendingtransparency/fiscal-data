import React, { FunctionComponent, useEffect, useState } from 'react';
import DownloadReportTable from '../download-report-table/download-report-table';
import { filtersContainer } from './reports-section.module.scss';
import DatasetSectionContainer from '../../dataset-section-container/dataset-section-container';
import { getPublishedDates } from '../../../helpers/dataset-detail/report-helpers';
import ReportDatePicker from '../report-date-picker/report-date-picker';
import { getAllReportDates, isReportGroupDailyFrequency } from '../util/util';
import { IDatasetConfig } from '../../../models/IDatasetConfig';
import ReportFilter from '../report-filter/report-filter';
import { IPublishedReportDataJson } from '../../../models/IPublishedReportDataJson';
import DataPreviewDatatableBanner from '../../data-preview/data-preview-datatable-banner/data-preview-datatable-banner';

export const title = 'Reports and Files';

const ReportsSection: FunctionComponent<{ publishedReportsProp: IPublishedReportDataJson[]; dataset: IDatasetConfig }> = ({
  publishedReportsProp,
  dataset,
}) => {
  const [currentReports, setCurrentReports] = useState<IPublishedReportDataJson[]>();
  const [allReports, setAllReports] = useState<IPublishedReportDataJson[]>();
  const [isDailyReport, setIsDailyReport] = useState<boolean>();
  const [latestReportDate, setLatestReportDate] = useState<Date>();
  const [earliestReportDate, setEarliestReportDate] = useState<Date>();
  const [allReportDates, setAllReportDates] = useState<string[]>();
  const [allReportYears, setAllReportYears] = useState<string[]>();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [filterByReport, setFilterByReport] = useState<boolean>();
  const hideReportDatePicker = dataset?.hideReportDatePicker;

  const updateReportSelection = (date: Date, isDaily: boolean, sortedReports: IPublishedReportDataJson[]) => {
    if (date) {
      const selectedDay = date.getDate();
      const selectedMonth = date.toLocaleString('default', { month: 'short' });
      const selectedYear = date.getFullYear();

      const filteredReports = sortedReports.filter((report: IPublishedReportDataJson) => {
        const reportDate = new Date(report.report_date);
        const reportDay = reportDate.getDate();
        const reportMonth = reportDate.toLocaleString('default', { month: 'short' });
        const reportYear = reportDate.getFullYear();
        return selectedMonth === reportMonth && selectedYear === reportYear && ((isDaily && selectedDay === reportDay) || !isDaily);
      });
      filteredReports.sort((a, b) => a.report_group_sort_order_nbr - b.report_group_sort_order_nbr);
      if (filteredReports.length > 0) {
        setCurrentReports(filteredReports);
      }
    }
  };

  useEffect(() => {
    if (publishedReportsProp?.length > 0 && !filterByReport) {
      const sortedReports = getPublishedDates(publishedReportsProp).sort((a, b) => b.report_date - a.report_date);
      setAllReports(sortedReports);
    }
  }, [publishedReportsProp]);

  useEffect(() => {
    // todo - Use a better manner of reassigning the report_date prop to jsdates.
    if (allReports?.length > 0) {
      const sortedReports = getPublishedDates(allReports).sort((a, b) => b.report_date - a.report_date);
      const latestReport = sortedReports[0].report_date;
      if (latestReport.toString() !== 'Invalid Date') {
        const earliestReport = sortedReports[sortedReports.length - 1].report_date;
        setLatestReportDate(latestReport);
        setEarliestReportDate(earliestReport);
        setSelectedDate(latestReport);
        const isDaily = sortedReports && isReportGroupDailyFrequency(sortedReports);
        setIsDailyReport(isDaily);

        const { allDates, allYears } = getAllReportDates(isDaily, sortedReports);
        setAllReportDates(allDates);
        setAllReportYears(allYears);
        updateReportSelection(latestReport, isDaily, sortedReports);
      }
    }
  }, [allReports]);

  useEffect(() => {
    if (allReports) {
      updateReportSelection(selectedDate, isDailyReport, allReports);
    }
  }, [selectedDate, allReports]);

  useEffect(() => {
    setFilterByReport(dataset?.reportSelection === 'byReport');
  }, []);

  const getDisplayStatus = (reports: IPublishedReportDataJson[]) => {
    return reports && reports.length > 0 ? 'block' : 'none';
  };

  return (
    <div style={{ display: getDisplayStatus(publishedReportsProp) }}>
      <DatasetSectionContainer title={title} id="reports-and-files">
        {!hideReportDatePicker && (
          <div className={filtersContainer}>
            {filterByReport && <ReportFilter reports={publishedReportsProp} setAllReports={setAllReports} />}
            {latestReportDate && (
              <ReportDatePicker
                isDailyReport={isDailyReport}
                latestReportDate={latestReportDate}
                earliestReportDate={earliestReportDate}
                allReportDates={allReportDates}
                allReportYears={allReportYears}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            )}
          </div>
        )}
        <DownloadReportTable reports={currentReports} isDailyReport={isDailyReport} />
        {dataset?.publishedReportsTip && <DataPreviewDatatableBanner bannerNotice={dataset.publishedReportsTip} isReport={true} />}
      </DatasetSectionContainer>
    </div>
  );
};

export default ReportsSection;
