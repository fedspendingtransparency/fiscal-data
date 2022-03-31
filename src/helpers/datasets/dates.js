const getMaxDate = (datasets, dateAbstract) => {
  let maxDate = '0';
  if (datasets && datasets.length && dateAbstract && typeof dateAbstract === 'function') {
    datasets.forEach((dataset) => {
      const dateVal = dateAbstract(dataset);
      if (dateVal) {
        const [compDateMonth, compDateDay, compDateYear] = dateVal.split('/');
        const compDate = compDateYear + '-' + compDateMonth + '-' + compDateDay;
        if (maxDate.localeCompare(compDate) < 0 ) {
          maxDate = compDate;
        }
      }
    });
  }
  const [latestDateYear, latestDateMonth, latestDateDay] = maxDate.split('-');
  return new Date(latestDateYear - 0, latestDateMonth - 1, latestDateDay - 0).setHours(0,0,0,0);
};

const dates = {
  getMaxDate
};

export default dates;
