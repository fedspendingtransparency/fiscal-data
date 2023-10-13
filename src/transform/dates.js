const convertAPIDate = dbDate => {
  const [yr, mo, day] = dbDate.split('-');
  return `${mo}/${day}/${yr}`;
};

const convertJSDateToAPI = jsDate => {
  if (!jsDate || !(jsDate instanceof Date)) {
    return null;
  }

  const yearStr = jsDate.getFullYear();
  const monthStr = (jsDate.getMonth() + 1).toString().padStart(2, '0');
  const dayStr = jsDate
    .getDate()
    .toString()
    .padStart(2, '0');

  return `${yearStr}-${monthStr}-${dayStr}`;
};

const getDateRange = apis => {
  const dateRange = {
    earliestDate: null,
    latestDate: null,
    lastUpdated: null,
  };

  if (apis) {
    const apiLen = apis.length;
    // Gatsby camelCases the fields; whereas, the API (post-build test) has the raw,
    // snake_cased fields.
    const earliestDateStr = apis[0].earliestDate ? 'earliestDate' : 'earliest_date';
    const latestDateStr = apis[0].latestDate ? 'latestDate' : 'latest_date';
    const lastUpdatedStr = apis[0].lastUpdated ? 'lastUpdated' : 'last_updated';
    if (apiLen > 1) {
      dateRange.earliestDate = apis.map(api => api[earliestDateStr]).sort()[0];

      const latestDates = apis.filter(api => api[latestDateStr]).map(api => api[latestDateStr]);

      dateRange.latestDate = latestDates.sort()[latestDates.length - 1];

      const lastUpdatedDates = apis.filter(api => api[lastUpdatedStr]).map(api => api[lastUpdatedStr]);

      dateRange.lastUpdated = lastUpdatedDates.sort()[lastUpdatedDates.length - 1];
    } else {
      dateRange.earliestDate = apis[0][earliestDateStr];
      dateRange.latestDate = apis[0][latestDateStr];
      dateRange.lastUpdated = apis[0][lastUpdatedStr];
    }
  }
  Object.keys(dateRange).forEach(obj => (dateRange[obj] = convertAPIDate(dateRange[obj])));

  return dateRange;
};

exports.convertAPIDate = convertAPIDate;
exports.getDateRange = getDateRange;
exports.convertJSDateToAPI = convertJSDateToAPI;
