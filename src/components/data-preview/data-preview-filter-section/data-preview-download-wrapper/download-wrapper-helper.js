import { ensureDoubleDigitDate } from '../../../download-wrapper/helpers';
import { REACT_TABLE_MAX_NON_PAGINATED_SIZE } from '../../../../utils/api-utils';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';

export const fileFromPath = path => (path && path.length ? path.substring(path.lastIndexOf('/') + 1) : null);

export const dateForFilename = fileDate => {
  const fullYear = fileDate.getFullYear();
  const month = ensureDoubleDigitDate(fileDate.getMonth() + 1);
  const date = ensureDoubleDigitDate(fileDate.getDate());

  return `${fullYear}${month}${date}`;
};

export const generateDownloadLabel = (inProgress, allTablesSelected, selectedFileType, dataset) => {
  if (allTablesSelected && inProgress) {
    return `Downloading Files`;
  } else if (allTablesSelected && !inProgress) {
    return `Download ${dataset.apis.length} ${selectedFileType.toUpperCase()} Files`;
  } else if (!allTablesSelected && inProgress) {
    return `Downloading File`;
  } else if (!allTablesSelected && !inProgress) {
    return `Download ${selectedFileType.toUpperCase()} File`;
  }
};

export const useDirectDownload = (tableSize, allTablesSelected) => {
  return tableSize !== null && tableSize <= REACT_TABLE_MAX_NON_PAGINATED_SIZE && !allTablesSelected;
};

export const getDownloadIcon = inProgress => {
  return inProgress ? (
    <FontAwesomeIcon icon={faSpinner} className="fa-pulse" data-test-id="report-icon" />
  ) : (
    <FontAwesomeIcon icon={faFileDownload} data-test-id="report-icon" />
  );
};
