import { convertDate } from '../../../dataset-data/dataset-data-helper/dataset-data-helper';
import { formatDateForApi } from '../../../../utils/api-utils';

export const getDaysArray = (start, end) => {
  const arr = [];
  for (let dt = convertDate(start); dt <= convertDate(end); dt.setDate(dt.getDate() + 1)) {
    arr.push(formatDateForApi(new Date(dt)));
  }
  return arr;
};

export const basePreset = [{ label: 'All', key: 'all', years: null }];
export const customPreset = { label: 'Custom', key: 'custom', years: null };
// If a data table has less than 5 years of data, we need to find the next best option to select
// by default.
export const fallbackPresets = ['1yr', 'current', 'all'];

export const inializeFilterConfigMap = (fieldsArray, datePreset, selectedTable) => {
  const filterMap = {};
  fieldsArray.forEach(field => {
    if (field.dataType === 'DATE') {
      const dateConfig = {};
      dateConfig.pendingStartDate = null;
      dateConfig.pendingEndDate = null;
      if (field.columnName === selectedTable?.dateField && datePreset) {
        dateConfig.defaultStartDate = datePreset?.from?.toString();
        dateConfig.defaultEndDate = datePreset?.to?.toString();
      }
      filterMap[field.columnName] = dateConfig;
    } else {
      filterMap[field.columnName] = { pendingValue: '', filterValue: '' };
    }
  });
  return filterMap;
};
