import { monthFullNames, monthNames } from '../../utils/api-utils';
import { isDate } from 'date-fns';

export const getPublishedDates = reports => {
  if (!reports) {
    return reports;
  }

  reports.forEach(report => {
    const reportDate = report.report_date;
    if (isDate(reportDate)) return;
    const [year, month, day] = reportDate.split('-');
    report.report_date = new Date(year, month - 1, day, 0, 0, 0);
  });

  return reports;
};

export const formatReportDate = (publishedDate, fullMonth, isDailyReport) => {
  console.log(publishedDate);
  const monthName = fullMonth ? monthFullNames[publishedDate.getMonth()] : monthNames[publishedDate.getMonth()];
  const dayInclusion = isDailyReport ? ' ' + publishedDate.getDate() + ',' : '';
  return `${monthName}${dayInclusion} ${publishedDate.getFullYear()}`;
};

export const getDateLabelForReport = (_report, isDailyReport, fullMonth) => {
  const report = _report || {};
  const publishedDate = report.report_date;
  if (publishedDate instanceof Date) {
    return formatReportDate(publishedDate, fullMonth, isDailyReport);
  } else {
    return '';
  }
};

export const getLatestReport = reports => {
  return reports.sort((a, b) => b.report_date.getTime() - a.report_date.getTime())[0];
};
