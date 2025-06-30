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

export const createFilterConfigs = (fields, datePreset, selectedTable) => {
  const fieldsConfig = JSON.parse(JSON.stringify(fields));
  fieldsConfig.forEach(field => {
    if (field.dataType === 'DATE') {
      if (!field?.pendingStartDate) {
        field.pendingStartDate = null;
      }
      if (!field?.pendingEndDate) {
        field.pendingEndDate = null;
      }
      if (field.columnName === selectedTable?.dateField && datePreset) {
        field.defaultStartDate = datePreset?.from?.toString();
        field.defaultEndDate = datePreset?.to?.toString();
      }
    } else {
      if (!field?.pendingValue) {
        field.pendingValue = '';
      }
    }
  });
  return fieldsConfig;
};
