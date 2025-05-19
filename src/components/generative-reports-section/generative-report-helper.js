import { formatDateForApi } from '../../utils/api-utils';
import { getFirstOfTheMonth, getLastOfTheMonth } from '../../utils/date-utils';

export const buildFilterParam = (date, dateField, account, accountField) => {
  const startDate = formatDateForApi(getFirstOfTheMonth(date));
  const endDate = formatDateForApi(getLastOfTheMonth(date));
  return `${dateField}:gte:${startDate},${dateField}:lte:${endDate},${accountField}:eq:${account}`;
};

export const buildSortParam = sortFields => {
  let sortStr = '';
  sortFields.forEach((field, i) => {
    sortStr = sortStr + field;
    if (i < sortFields.length - 1) {
      sortStr = sortStr + ',';
    }
  });
  return sortStr;
};

export const buildEndpoint = (date, dateField, accountValue, accountField, endpointConfig) => {
  const sortStr = buildSortParam(endpointConfig.sort);
  const filterStr = buildFilterParam(date, dateField, accountValue, accountField);
  return `${endpointConfig.endpoint}?filter=${filterStr}&sort=${sortStr}`;
};
