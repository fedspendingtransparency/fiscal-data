import React, { useEffect, useState } from 'react';
import { FunctionComponent } from 'react';
import DownloadReportTable from '../download-report-table/download-report-table';
import { reportsTip, note, publishDate } from './reports-section.module.scss';
import DatasetSectionContainer from '../../dataset-section-container/dataset-section-container';
import { getPublishedDates } from '../../../helpers/dataset-detail/report-helpers';
import ReportDatePicker from '../report-date-picker/report-date-picker';

export const title = 'Reports and Files';
export interface IReports {
  path: string;
  report_date: Date;
  report_group_desc: string;
  report_group_id: number;
  report_group_sort_order_nbr: number;
}

interface IDataset {
  publishedReportsTip?: string;
}

const ReportsSection: FunctionComponent<{ publishedReportsProp: IReports[]; dataset: IDataset }> = ({ publishedReportsProp, dataset }) => {
  const [currentReports, setCurrentReports] = useState<IReports[]>();
  const [allReports, setAllReports] = useState<IReports[]>();
  const [isDailyReport, setIsDailyReport] = useState<boolean>();
  const [latestReportDate, setLatestReportDate] = useState<Date>();
  const [earliestReportDate, setEarliestReportDate] = useState<Date>();
  const [allReportDates, setAllReportDates] = useState<string[]>();
  const [allReportYears, setAllReportYears] = useState<string[]>();
  const [selectedDate, setSelectedDate] = useState<Date>();

  const isReportGroupDailyFrequency = (reports: IReports[]): boolean => {
    let yearRepresented = 0;
    let monthRepresented = 0;
    let groupDescRepresented = '';
    let isDaily = false;
    // sort by report_group_id so report groups will be compared in order
    reports.sort((a, b) => a.report_group_id - b.report_group_id);
    for (let i = 0; i < reports.length; i++) {
      const reportYear = reports[i].report_date.getFullYear();
      const reportMonth = reports[i].report_date.getMonth();
      const groupDesc = reports[i].report_group_desc;
      if (yearRepresented === reportYear && monthRepresented === reportMonth && groupDescRepresented === groupDesc) {
        isDaily = true;
        break;
      } else {
        yearRepresented = reportYear;
        monthRepresented = reportMonth;
        groupDescRepresented = groupDesc;
      }
    }
    return isDaily;
  };

  const updateReportSelection = (date, isDaily, sortedReports) => {
    console.log(date);
    if (date) {
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();

      const filteredReports = sortedReports.filter((report: IReports) => {
        const dateStr = report.report_date.toString();
        return dateStr.includes(month) && dateStr.includes(year) && ((isDaily && dateStr.includes(day)) || !isDaily);
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
          sortedReports.map((report: IReports) => allDates.push(report.report_date.toDateString()));
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

  const getDisplayStatus = (reports: IReports[]) => {
    return reports && reports.length > 0 ? 'block' : 'none';
  };

  return (
    <div style={{ display: getDisplayStatus(publishedReportsProp) }}>
      <DatasetSectionContainer title={title} id="reports-and-files">
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
