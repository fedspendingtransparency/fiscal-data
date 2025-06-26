import { convertDate } from '../../../dataset-data/dataset-data-helper/dataset-data-helper';
import { formatDateForApi } from '../../../../utils/api-utils';

export const getDaysArray = (start, end) => {
  const arr = [];
  for (let dt = convertDate(start); dt <= convertDate(end); dt.setDate(dt.getDate() + 1)) {
    arr.push(formatDateForApi(new Date(dt)));
  }
  return arr;
};
