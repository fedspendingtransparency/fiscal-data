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

export const initializeFilterConfigMap = (selectedTable, datePreset, visibleOptions, pivotView) => {
  const filterMap = {};
  const { fields: fieldsArray, dateField } = selectedTable;
  const arr = pivotView ? visibleOptions : fieldsArray;
  arr?.forEach(field => {
    const { dataType, columnName } = field;
    if (dataType === 'DATE') {
      const dateConfig = {};
      dateConfig.pendingStartDate = null;
      dateConfig.pendingEndDate = null;
      if (columnName === dateField && datePreset) {
        dateConfig.defaultStartDate = datePreset?.from?.toString();
        dateConfig.defaultEndDate = datePreset?.to?.toString();
      }
      filterMap[columnName] = dateConfig;
    } else {
      filterMap[columnName] = { pendingValue: '', filterValue: '' };
      field.filterValue = '';
    }
  });
  return filterMap;
};
