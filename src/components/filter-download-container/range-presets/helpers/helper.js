import {
  convertDate,
  getNormalizedDate,
  getPresetDateRange
} from "../../../dataset-data/dataset-data-helper/dataset-data-helper";
import {formatDate} from "../../../download-wrapper/helpers";
import Analytics from "../../../../utils/analytics/analytics";

export const analyticsFields =  {
  category: "Date Picker Presets",
  action: 'Pick Date Click',
  label: ''
};

export const generateFormattedDate = (dateRange) => {
  let label = '';
  if (dateRange && dateRange.to && dateRange.from) {
    const from = formatDate(dateRange.from);
    const to = formatDate(dateRange.to);
    label = `${from} - ${to}`;
  }

  return label;
};

export const generateAnalyticsEvent = (label) => {
  // No need to console this out as we won't see a ga "collect" event called in the network activity
  if (!label) {
    return;
  }
  const curAnalyticsFields = Object.assign({}, analyticsFields);
  curAnalyticsFields.label = label;

  Analytics.event(curAnalyticsFields);

  // GA4 Data Layer - Date Picker Click
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'Pick Date Click',
    'eventLabel': label,
  });
};

export const DATE_RANGE_OBJ = {
  from: null, // JSDate
  to: null, // JSDate
  min: null, // JSDate
  selectionPath: ''
};

export default function determineDateRange(table, preset) {
  if (!table || !preset) {
    return null;
  }
  let dateRangeObj = Object.assign(DATE_RANGE_OBJ);
  const years = preset.years;

  if (years && !isNaN(Number(years))) {
    let selectionPathStr = `${years}_year`;
    if(Number(years) > 1){
      selectionPathStr += 's'
    }
    dateRangeObj = getPresetDateRange(preset.years, table.latestDate, table.earliestDate);
    dateRangeObj.selectionPath = selectionPathStr;
  } else if (preset.key === 'all') {
    dateRangeObj = {
      from: getNormalizedDate(table.earliestDate),
      to: getNormalizedDate(table.latestDate),
      min: table.earliestDate,
      selectionPath: 'all_years'
    };
  } else if (preset.key === 'current') {
    const dateForCurrentDateButton = convertDate(table.latestDate);

    dateRangeObj = {
      from: dateForCurrentDateButton,
      to: dateForCurrentDateButton,
      min: table.earliestDate,
      selectionPath: 'current_report'
    };
  } else {
    return null;
  }

  return dateRangeObj;
}

export const prepAvailableDates = (dataDateRange) => {
  if (dataDateRange) {
    return {
      from: new Date(dataDateRange.earliestDate.replace(/-/g, '/')),
      to: new Date(dataDateRange.latestDate.replace(/-/g, '/')),
      earliestDate: dataDateRange.earliestDate,
      latestDate: dataDateRange.latestDate
    }
  }
};
