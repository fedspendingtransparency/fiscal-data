import pdf from '../../../../static/images/file-type-icons/file_type_pdf_icon.svg';
import xls from '../../../../static/images/file-type-icons/file_type_xls_icon.svg';
import txt from '../../../../static/images/file-type-icons/file_type_txt_icon.svg';
import xml from '../../../../static/images/file-type-icons/file_type_xml_icon.svg';
import { monthFullNames } from '../../../utils/api-utils';

export const getYearReportOptions = reports => {
  const yearsFound = [];

  const options = [];

  reports.forEach(report => {
    const year = report.report_date.getFullYear();

    if (yearsFound.indexOf(year) === -1) {
      yearsFound.push(year);
      options.push({
        label: year,
        value: year,
      });
    }
  });

  options.sort((a, b) => {
    if (!a.value) {
      return -1;
    } else if (a.value > b.value) {
      return -1;
    } else if (a.value < b.value) {
      return 1;
    } else {
      return 0;
    }
  });

  options.unshift({
    label: 'Select A Year',
    value: null,
  });

  return options;
};

export const matchingYearsFilter = (options, digits) => {
  if (options && options.length && digits) {
    return options.filter(opt => opt.label.toString().indexOf(digits) !== -1);
  }
};

export const filterYearOptions = (yearOptions, filterDigits) => {
  let filteredList = yearOptions;
  if (filterDigits) {
    filteredList = matchingYearsFilter(yearOptions, filterDigits);
    if (filteredList.length === 0) {
      // No reports for years matching ${filterDigits}
      filteredList = [
        {
          label: `Please refine your search between the years ${yearOptions[yearOptions.length - 1].label} and ${yearOptions[0].label}.`,
          value: null,
        },
      ];
    }
  }
  return filteredList;
};

export const getDayOptions = reports => {
  const options = reports.map(report => {
    return { label: report.report_date.getDate(), value: report };
  });
  options.unshift({
    label: 'Select A Day',
    value: null,
  });
  return options;
};

export const getMonthOptions = reports => {
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const options = [];

  reports.forEach(r => {
    const i = r.report_date.getMonth();
    if (!options.some(option => option.value === i)) {
      options.push({
        label: shortMonths[i],
        value: i,
      });
    }
  });

  options.sort((a, b) => {
    if (!a.value) {
      return -1;
    } else if (a.value < b.value) {
      return -1;
    } else if (a.value > b.value) {
      return 1;
    } else {
      return 0;
    }
  });

  options.unshift({
    label: 'Select A Month',
    value: null,
  });
  return options;
};

export const splitFileName = (name, index) => {
  const start = name.substring(0, index);
  const end = name.substring(index);
  return { start: start, end: end };
};

export const getFileTypeImage = fileType => {
  switch (fileType) {
    case '.pdf':
      return pdf;
    case '.txt':
      return txt;
    case '.xml':
      return xml;
    default:
      // making the fileType have a default value if null for alt image purposes
      return xls;
  }
};

export const isReportGroupDailyFrequency = reports => {
  let yearRepresented = 0;
  let monthRepresented = 0;
  let dayRepresented = 0;
  let groupDescRepresented = '';
  let isDaily = false;
  // sort by report_group_id so report groups will be compared in order
  reports.sort((a, b) => a.report_group_id - b.report_group_id);
  for (let i = 0; i < reports.length; i++) {
    const reportYear = reports[i].report_date.getFullYear();
    const reportMonth = reports[i].report_date.getMonth();
    const reportDay = reports[i].report_date.getDay();
    const groupDesc = reports[i].report_group_desc;
    if (yearRepresented === reportYear && monthRepresented === reportMonth && groupDescRepresented === groupDesc && dayRepresented !== reportDay) {
      isDaily = true;
      break;
    } else {
      yearRepresented = reportYear;
      monthRepresented = reportMonth;
      dayRepresented = reportDay;
      groupDescRepresented = groupDesc;
    }
  }
  return isDaily;
};

export const isValidReportGroup = report => {
  return report.report_group_id !== undefined && Number(report.report_group_id) > -1;
};

export const makeReportGroups = reports => {
  const tempObj = {};
  reports.filter(isValidReportGroup).forEach(report => {
    if (!tempObj[report.report_group_desc]) {
      tempObj[report.report_group_desc] = [];
    }
    tempObj[report.report_group_desc].push(report);
  });
  const groups = [];
  Object.entries(tempObj).forEach(([key, val]) => {
    const label = getFileDisplay(val[0]).fullName;
    groups.push({
      label: label,
      id: val[0].report_group_id,
      value: val,
      sortOrderNumber: val[0].report_group_sort_order_nbr,
      daily: isReportGroupDailyFrequency(val),
    });
  });
  return groups.sort((a, b) => {
    return a.sortOrderNumber - b.sortOrderNumber;
  });
};

export const getFileDisplay = curReportFile => {
  if (curReportFile) {
    const groupName = curReportFile.report_group_desc;
    const splitReportPath = curReportFile.path.split('.');
    if (splitReportPath.length > 0) {
      const reportFileType = splitReportPath[splitReportPath.length - 1];
      const apiFileType = '(.' + reportFileType + ')';
      const downloadFileType = '.' + reportFileType;
      // Remove parenthesis from file name -> ex. fileName (.pdf) to fileName.pdf
      let fullDisplayName = groupName.replace(' ' + apiFileType, downloadFileType);
      if (reportFileType === 'xlsx') {
        fullDisplayName = groupName.replace(' ' + '(.xls)', '.xls');
      }
      //Split file name so overflow ellipsis can be used in the middle of the name
      const fileDisplayName = splitFileName(fullDisplayName, fullDisplayName.length - 8);
      return { fullName: fullDisplayName, displayName: fileDisplayName || '', fileType: downloadFileType };
    }
  }
};
export const getGeneratedReportFileDisplay = curReportFile => {
  if (curReportFile && curReportFile.name) {
    const splitReportPath = curReportFile.name.split('.');
    if (splitReportPath?.length > 0) {
      const reportFileType = splitReportPath[splitReportPath.length - 1];
      const downloadFileType = '.' + reportFileType;
      const fileDisplayName = splitFileName(curReportFile.name, curReportFile.name.length - 8);
      return { fullName: curReportFile.name, displayName: fileDisplayName || '', fileType: downloadFileType };
    }
  }
};

export const getAllReportDates = (isDaily, sortedReports) => {
  const allDates = [];
  const allYears = [];

  if (isDaily) {
    sortedReports.map(report => {
      const reportDt = report.report_date;
      const reportMonth = monthFullNames[reportDt.getMonth()];
      const reportDay = reportDt.getDate();
      const reportYear = reportDt.getFullYear();
      const dateStr = reportMonth + ' ' + reportDay + ', ' + reportYear;
      allDates.push(dateStr);
    });
  } else {
    sortedReports.forEach(report => {
      const reportDt = report.report_date;
      const dateStr = reportDt.toLocaleString('default', { month: 'long', year: 'numeric' });
      allDates.push(dateStr);
      allYears.push(reportDt.getFullYear());
    });
  }
  return { allDates, allYears };
};
