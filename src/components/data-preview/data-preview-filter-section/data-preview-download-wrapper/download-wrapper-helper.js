import { ensureDoubleDigitDate } from '../../../download-wrapper/helpers';
import { REACT_TABLE_MAX_NON_PAGINATED_SIZE } from '../../../../utils/api-utils';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCloudDownload } from '@fortawesome/free-solid-svg-icons/faCloudDownload';
import { pxToNumber } from '../../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../../variables.module.scss';

export const fileFromPath = path => (path && path.length ? path.substring(path.lastIndexOf('/') + 1) : null);

export const dateForFilename = fileDate => {
  const fullYear = fileDate.getFullYear();
  const month = ensureDoubleDigitDate(fileDate.getMonth() + 1);
  const date = ensureDoubleDigitDate(fileDate.getDate());

  return `${fullYear}${month}${date}`;
};

export const shouldUseDirectDownload = (tableSize, allTablesSelected) => {
  return tableSize !== null && tableSize <= REACT_TABLE_MAX_NON_PAGINATED_SIZE && !allTablesSelected;
};

export const getDownloadIcon = (width, active) => {
  const desktopWidth = width >= pxToNumber(breakpointLg);
  if (desktopWidth) {
    return active ? faCaretUp : faCaretDown;
  } else {
    return active ? faCloudDownload : faCaretRight;
  }
};
