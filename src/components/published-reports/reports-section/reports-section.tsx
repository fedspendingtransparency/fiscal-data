import React, { useEffect, useState } from 'react';
import { FunctionComponent } from 'react';
import DownloadReportTable from '../download-report-table/download-report-table';
import { publishDate } from './reports-section.module.scss';
import DatasetSectionContainer from '../../dataset-section-container/dataset-section-container';
import { getPublishedDates } from '../../../helpers/dataset-detail/report-helpers';

export const title = 'Reports and Files';

const ReportsSection: FunctionComponent<{ publishedReportsProp }> = ({ publishedReportsProp }) => {
  const [publishedReports, setPublishedReports] = useState([]);
  const [latestMonth, setLatestMonth] = useState();
  const [latestYear, setLatestYear] = useState();
  const [currentReports, setCurrentReports] = useState();

  const isReportGroupDailyFrequency = reports => {
    let yearRepresented = 0;
    let monthRepresented = 0;
    let groupDescRepresented = '';

    let isDaily = false;
    for (let i = 0; i < reports.length; i++) {
      const reportYear = reports[i].report_date.getFullYear();
      const reportMonth = reports[i].report_date.getMonth();
      const groupDesc = reports[i].report_group_desc;
      // TODO Update logic to cover all reports
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
    console.log(publishedReportsProp);
    if (publishedReportsProp?.length > 0) {
      const sortedReports = getPublishedDates(publishedReportsProp).sort((a, b) => b.report_date - a.report_date);
      const latestReportDate = sortedReports[0].report_date;
      const day = latestReportDate.getDate();
      const month = latestReportDate.toLocaleString('default', { month: 'short' });
      const year = latestReportDate.getFullYear();
      setLatestYear(year);
      setLatestMonth(month);
      setPublishedReports(sortedReports);
      const isDaily = sortedReports && isReportGroupDailyFrequency(sortedReports);
      const filteredReports = sortedReports.filter(
        x =>
          x.report_date.toString().includes(month) &&
          x.report_date.toString().includes(year) &&
          ((!!isDaily && x.report_date.toString().includes(day)) || !isDaily)
      );
      console.log('filtered reports', filteredReports, isDaily);
      if (filteredReports.length > 0) {
        setCurrentReports(filteredReports);
      }
      console.log(month, year, filteredReports);
      console.log(sortedReports);
    }
  }, [publishedReportsProp]);

  const getDisplayStatus = reports => {
    return reports && reports.length > 0 ? 'block' : 'none';
  };

  return (
    <div style={{ display: getDisplayStatus(publishedReportsProp) }}>
      <DatasetSectionContainer title={title} id="reports-and-files">
        <div className={publishDate}>Published Date</div>
        <DownloadReportTable reports={currentReports} />
      </DatasetSectionContainer>
    </div>
  );
};

export default ReportsSection;
