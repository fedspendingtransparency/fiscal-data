import GLOBALS from '../../../helpers/constants';

export const selectedTable = {
  apiId: 100,
  name: 'Harold Dotter',
  endpoint: 'v99/guardwings',
  dateField: 'dummy_date',
  latestDate: '12/25/2050',
  latestDateFormatted: '2050-12-25' // for test reference
};

export const selectedTableWithDateException = {
  apiId: GLOBALS.ENDPOINTS_WITH_YEAR_MONTH_DATE_FORMAT[0],
  name: 'Harold Dotter',
  endpoint: 'v99/guardwings',
  dateField: 'dummy_date',
  latestDate: '12/25/2050',
  latestDateFormatted: '2050-12-25' // for test reference
};
