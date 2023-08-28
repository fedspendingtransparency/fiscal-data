export const getYearReportOptions = (reports) => {
  const yearsFound = [];

  const options = [];

  reports.forEach(report => {
    const year = report.report_date.getFullYear();

    if (yearsFound.indexOf(year) === -1) {
      yearsFound.push(year);
      options.push({
        label: year,
        value: year
      })
    }
  });


  options.sort((a, b) => {
    if (!a.value) {
      return -1
    } else if (a.value > b.value) {
      return -1
    } else if (a.value < b.value) {
      return 1
    } else {
      return 0;
    }
  })

  options.unshift({
    label: 'Select A Year',
    value: null
  })

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
      filteredList = [{
        label: `Please refine your search between the years ${yearOptions[yearOptions.length - 1].label} and ${yearOptions[0].label}.`,
        value: null
      }];
    }
  }
  return filteredList;
};

export const getDayOptions = (reports) => {
  const options = reports.map(report => {
    return { label: report.report_date.getDate(), value: report };
  });
  options.unshift({
    label: 'Select A Day',
    value: null
  })
  return options;
};

export const getMonthOptions = (reports) => {
  const shortMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  const options = [];

  reports.forEach(r => {
    const i = r.report_date.getMonth();
    if (!options.some(option => option.value === i)) {
      options.push({
        label: shortMonths[i],
        value: i
      });
    }
  });

  options.sort((a, b) => {
    if (!a.value) {
      return -1
    } else if (a.value < b.value) {
      return -1
    } else if (a.value > b.value) {
      return 1
    } else {
      return 0;
    }
  })

  options.unshift({
    label: 'Select A Month',
    value: null
  })
  return options;
}
