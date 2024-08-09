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
  const [isDailyReport, setIsDailyReport] = useState<boolean>();

  const isReportGroupDailyFrequency = (reports: IReports[]): boolean => {
    let yearRepresented = 0;
    let monthRepresented = 0;
    let groupDescRepresented = '';
    let isDaily = false;
    // sort by report_group_id so report groups will be compared in order
    reports.sort((a, b) => a.report_group_id - b.report_group_id);
    console.log(reports);
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

  useEffect(() => {
    // todo - Use a better manner of reassigning the report_date prop to jsdates.
    if (publishedReportsProp?.length > 0) {
      const sortedReports = getPublishedDates(publishedReportsProp).sort((a, b) => b.report_date - a.report_date);
      const latestReportDate = sortedReports[0].report_date;
      const day = latestReportDate.getDate();
      const month = latestReportDate.toLocaleString('default', { month: 'short' });
      const year = latestReportDate.getFullYear();
      const isDaily = sortedReports && isReportGroupDailyFrequency(sortedReports);
      setIsDailyReport(isDaily);
      // console.log(isDaily, day, month, year);
      // sortedReports.sort((a, b) => a.report_group_id - b.report_group_id);

      const filteredReports = sortedReports.filter(
        (report: IReports) =>
          report.report_date.toString().includes(month) &&
          report.report_date.toString().includes(year) &&
          ((isDaily && report.report_date.toString().includes(day)) || !isDaily)
      );
      filteredReports.sort((a, b) => a.report_group_sort_order_nbr - b.report_group_sort_order_nbr);
      console.log(filteredReports);
      if (filteredReports.length > 0) {
        setCurrentReports(filteredReports);
      }
    }
  }, [publishedReportsProp]);

  const getDisplayStatus = (reports: IReports[]) => {
    return reports && reports.length > 0 ? 'block' : 'none';
  };

  return (
    <div style={{ display: getDisplayStatus(publishedReportsProp) }}>
      <DatasetSectionContainer title={title} id="reports-and-files">
        <ReportDatePicker isDailyReport={isDailyReport} />
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
