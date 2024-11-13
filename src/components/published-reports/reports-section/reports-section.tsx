import React, { useEffect, useState } from 'react';
import { FunctionComponent } from 'react';
import DownloadReportTable from '../download-report-table/download-report-table';
import { reportsTip, note, filtersContainer, reportFilterContainer } from './reports-section.module.scss';
import DatasetSectionContainer from '../../dataset-section-container/dataset-section-container';
import { getPublishedDates } from '../../../helpers/dataset-detail/report-helpers';
import ReportDatePicker from '../report-date-picker/report-date-picker';
import { monthFullNames } from '../../../utils/api-utils';
import { isReportGroupDailyFrequency } from '../util/util';
import { IDatasetConfig } from '../../../models/IDatasetConfig';
import ReportFilter from '../report-filter/report-filter';

export const title = 'Reports and Files';
export interface IReports {
  path: string;
  report_date: Date;
  report_group_desc: string;
  report_group_id: number;
  report_group_sort_order_nbr: number;
  label: string;
}

const ReportsSection: FunctionComponent<{ publishedReportsProp: IReports[]; dataset: IDatasetConfig }> = ({ publishedReportsProp, dataset }) => {
  const [currentReports, setCurrentReports] = useState<IReports[]>();
  const [allReports, setAllReports] = useState<IReports[]>();
  const [isDailyReport, setIsDailyReport] = useState<boolean>();
  const [latestReportDate, setLatestReportDate] = useState<Date>();
  const [earliestReportDate, setEarliestReportDate] = useState<Date>();
  const [allReportDates, setAllReportDates] = useState<string[]>();
  const [allReportYears, setAllReportYears] = useState<string[]>();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [filterByReport, setFilterByReport] = useState<boolean>();

  const updateReportSelection = (date: Date, isDaily: boolean, sortedReports: IReports[]) => {
    if (date) {
      const selectedDay = date.getDate();
      const selectedMonth = date.toLocaleString('default', { month: 'short' });
      const selectedYear = date.getFullYear();

      const filteredReports = sortedReports.filter((report: IReports) => {
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
    // todo - Use a better manner of reassigning the report_date prop to jsdates.
    if (publishedReportsProp?.length > 0) {
      const sortedReports = getPublishedDates(publishedReportsProp).sort((a, b) => b.report_date - a.report_date);
      const latestReport = sortedReports[0].report_date;
      if (latestReport.toString() !== 'Invalid Date') {
        const earliestReport = sortedReports[sortedReports.length - 1].report_date;
        setLatestReportDate(latestReport);
        setEarliestReportDate(earliestReport);
        setSelectedDate(latestReport);
        const allDates = [];
        const allYears = [];

        const isDaily = sortedReports && isReportGroupDailyFrequency(sortedReports);
        setIsDailyReport(isDaily);
        if (isDaily) {
          sortedReports.map((report: IReports) => {
            const reportDt = report.report_date;
            const reportMonth = monthFullNames[reportDt.getMonth()];
            const reportDay = reportDt.getDate();
            const reportYear = reportDt.getFullYear();
            const dateStr = reportMonth + ' ' + reportDay + ', ' + reportYear;
            allDates.push(dateStr);
          });
        } else {
          sortedReports.forEach((report: IReports) => {
            const reportDt = report.report_date;
            const dateStr = reportDt.toLocaleString('default', { month: 'long', year: 'numeric' });
            allDates.push(dateStr);
            allYears.push(reportDt.getFullYear());
          });
        }
        setAllReports(sortedReports);
        setAllReportDates(allDates);
        setAllReportYears(allYears);

        updateReportSelection(latestReport, isDaily, sortedReports);
      }
    }
  }, [publishedReportsProp]);

  useEffect(() => {
    updateReportSelection(selectedDate, isDailyReport, allReports);
  }, [selectedDate]);

  useEffect(() => {
    setFilterByReport(dataset?.reportSelection === 'byReport');
  }, []);

  const getDisplayStatus = (reports: IReports[]) => {
    return reports && reports.length > 0 ? 'block' : 'none';
  };

  return (
    <div style={{ display: getDisplayStatus(publishedReportsProp) }}>
      <DatasetSectionContainer title={title} id="reports-and-files">
        <div className={filtersContainer}>
          {filterByReport && (
            <div className={reportFilterContainer}>
              <ReportFilter reports={publishedReportsProp} />
            </div>
          )}
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
        <DownloadReportTable reports={currentReports} isDailyReport={isDailyReport} />
        {dataset?.publishedReportsTip && (
          <div className={reportsTip}>
            <span className={note}>Note: </span>
            <span>{dataset.publishedReportsTip}</span>
          </div>
        )}
      </DatasetSectionContainer>
    </div>
  );
};

export default ReportsSection;
