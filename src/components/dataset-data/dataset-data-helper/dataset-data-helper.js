import { isBefore, subYears, format, addDays } from 'date-fns';

export const convertDate = (date) => {
  // .replace() resolves weird -1 day issue https://stackoverflow.com/a/31732581/564406
  const stringDate = date !== null && date !== undefined
    ? date.replace(/-/g, '/')
    : format(new Date(), 'yyyy-MM-dd');
  const returnDate = new Date(stringDate);
  returnDate.setHours(0, 0, 0, 0);
  return returnDate;
};


export const getNormalizedDate = (dateStr) => {
  const curDate = dateStr !== null && dateStr !== undefined
    ? dateStr.replace(/-/g, '/') : dateStr;
  let returnDate = curDate;

  if(curDate){
    returnDate = new Date(curDate);
    returnDate.setHours(0,0,0,0);
  }

  return returnDate;
};

export const getPresetDateRange = (years, latest, earliest) => {
  // .replace() resolves weird -1 day issue https://stackoverflow.com/a/31732581/564406
  const rangeTo = convertDate(latest);

  const stringDate = earliest !== null && earliest !== undefined
    ? earliest.replace(/-/g, '/')
    : '1790/01/01';
  const earliestAsDate = new Date(stringDate);
  earliestAsDate.setHours(0, 0, 0, 0);
  let yearsPrior = subYears(rangeTo, years);
  yearsPrior = addDays(yearsPrior, 1);
  yearsPrior.setHours(0, 0, 0, 0);

  const rangeFrom = isBefore(earliestAsDate, yearsPrior) ? yearsPrior : earliestAsDate;

  return { from: rangeFrom, to: rangeTo, min: earliest };
};

export const matchTableFromApiTables = (curSelectedTable, apiTables) => {
  let matchedTable = null;
  if (curSelectedTable && curSelectedTable.apiId && Array.isArray(apiTables)) {
    const curTable = apiTables.filter(table => table.apiId === curSelectedTable.apiId);
    matchedTable = curTable ? curTable[0] : null;
  }

  return matchedTable;
};

export const parseTableSelectionFromUrl = (location, tables) => {
  if (Array.isArray(tables)) {
    if (location && location.pathname) {
      const segments = location.pathname.split(/[/?]+/);
      const tableSegment = segments.length > 2 ? segments[3] : false;
      const tableInUrl = tableSegment ? tables
      .find(table => table.pathName === tableSegment) : false;
      return tableInUrl ? tableInUrl : tables[0];
    } else {
      return tables[0];
    }
  }
};

export const rewriteUrl = (table, slug, location) => {
  if (window && window.history && table) {
    const urlRewrite = `/datasets${slug}${table.pathName}${(location && location.search
      ? location.search : '')}`;
    window.history.replaceState("", "", urlRewrite);
    return urlRewrite;
  }
};

export const thinDataAsNeededForChart = (dataRows, slug, dateField, selectedTable) => {
  if ((slug === '/debt-to-the-penny/') || (slug === '/qtcb-historical-interest-rates/' &&
    (!selectedTable || !selectedTable.isLargeDataset))) {
    let latestYearMonth = '0';
    const subset = dataRows.slice().reverse().reduce((acc, d) => {

      const yearMonth = d[dateField].substring(0,7);

      if (latestYearMonth !== yearMonth) {
        latestYearMonth = yearMonth;
        acc.push(d);
      }
      return acc;
    }, []);
    if (!subset.includes(dataRows[0])) {
      subset.push(dataRows[0]);
    }
    return subset;
  } else {
    return dataRows;
  }
};
