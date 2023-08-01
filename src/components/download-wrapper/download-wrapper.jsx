import React, { useContext, useEffect, useState } from 'react';
import * as styles from './download-wrapper.module.scss';
import Truncator from '../truncate/truncate';
import DownloadItemButton from "./download-item-button/download-item-button";
import Analytics from "../../utils/analytics/analytics";
import {
  calcDictionaryDownloadSize,
  convertDataDictionaryToCsv,
  triggerDataDictionaryDownload
} from "./download-helpers";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faFileDownload, faSpinner } from "@fortawesome/free-solid-svg-icons";
import DownloadToggle from "./download-toggle/download-toggle";
import { isValidDateRange } from '../../helpers/dates/date-helpers';
import DownloadModal from '../download-modal/download-modal';
import { downloadsContext } from '../persist/download-persist/downloads-persist';
import { generateAnalyticsEvent } from '../../layouts/dataset-detail/helper';
import { ensureDoubleDigitDate, formatDate} from "./helpers";
import globalConstants from '../../helpers/constants';

const gaEventLabels = globalConstants.gaEventLabels;
export const cancelEventLabelStr = gaEventLabels.cancelDL;
export const closeEventLabelStr = gaEventLabels.closeDLDialog;

const DownloadWrapper =
  ({
     selectedTable,
     allTablesSelected,
     dateRange,
     dataset,
     isFiltered,
     selectedUserFilter,
     tableColumnSortData
  }) => {

  let tableName = selectedTable && selectedTable.tableName ? selectedTable.tableName : 'N/A';
  if (allTablesSelected) {
    tableName = `All Data Tables (${dataset.apis.length})`;
  }

  const allString = 'ALL';
  const siteDownloads = useContext(downloadsContext);
  const [selectedFileType, setSelectedFileType] = useState('csv');
  const [dateString, setDateString] = useState('');
  const [open, setOpen] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [downloadLabel, setDownloadLabel] = useState(null);
  const [datasetDownloadInProgress, setDatasetDownloadInProgress] = useState(false);
  const [changeMadeToCriteria, setChangeMadeToCriteria] = useState(false);
  const [icon, setIcon] = useState(null);
  const {
    setDownloadRequest,
    downloadsInProgress,
    downloadsPrepared,
    setCancelDownloadRequest
  } = siteDownloads;

  const dataDictionaryCsv = convertDataDictionaryToCsv(dataset);
  const ddSize = calcDictionaryDownloadSize(dataDictionaryCsv);

  const makeDownloadButtonAvailable = () => {
    if (datasetDownloadInProgress) {
      setDatasetDownloadInProgress(false);
      /**
       * This is used by the downloadsInProgress useEffect to not disable the
       * button again if the user happened to change something before the download
       * process advances.
       */
      setChangeMadeToCriteria(true);
    }
  }

  const toggleButtonChange = (value) => {
    setSelectedFileType(value);
    makeDownloadButtonAvailable();
  };

  const handleCancelRequest = (value) => {
    generateAnalyticsEvent(cancelEventLabelStr);
    if(setCancelDownloadRequest) {
      setCancelDownloadRequest(value);
    }
  };

  const fileFromPath = (path) => (path && path.length)
    ? path.substring(path.lastIndexOf('/')+1)
    : null;

  const dateForFilename = (fileDate) => {
    const fullYear = fileDate.getFullYear();
    const month = ensureDoubleDigitDate(fileDate.getMonth() + 1);
    const date = ensureDoubleDigitDate(fileDate.getDate());

    return `${fullYear}${month}${date}`;
  }

  const metadataDownloader = async () => {
    Analytics.event({
      category: 'Dataset Dictionary Download',
      action: dataset.name
    });
    return triggerDataDictionaryDownload(dataDictionaryCsv, dataset.name)
  };

  const downloadClickHandler = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setChangeMadeToCriteria(false);
    const apis = allTablesSelected ? dataset.apis.slice() : selectedTable;
    const downloadName = allTablesSelected
      ? `${(dataset.slug + '').replace(/\//g, '')}_all_tables`
      : `${fileFromPath(selectedTable.downloadName)}`;
    const downloadEntry = {
      datasetId: dataset.datasetId,
      apis: apis,
      dateRange: {
        from: new Date(dateRange.from.getTime()),
        to: new Date(dateRange.to.getTime())
      },
      selectedFileType,
      filename:
        `${downloadName}_${dateForFilename(dateRange.from)}_${dateForFilename(dateRange.to)}.zip`,
      requestTime: Date.now(),
      selectedUserFilter,
      tableColumnSortData
    };
    setDownloadRequest(downloadEntry);
    setOpen(true);

    return false;
  };

  const onClose = () => {
    generateAnalyticsEvent(closeEventLabelStr);
    setOpen(false);
  };

  const generateDownloadLabel = (inProgress) => {
    if (allTablesSelected && inProgress) {
      return `Downloading Files`;
    } else if (allTablesSelected && !inProgress) {
      return `Download ${dataset.apis.length} ${selectedFileType.toUpperCase()} Files`;
    } else if (!allTablesSelected && inProgress) {
      return `Downloading File`;
    } else if (!allTablesSelected && !inProgress) {
      return `Download ${selectedFileType.toUpperCase()} File`;
    }
  }

  const setIconComponent = (inProgress) => {
    return inProgress
      ? <FontAwesomeIcon icon={faSpinner} className="fa-pulse" data-test-id="report-icon" />
      : <FontAwesomeIcon icon={faFileDownload} data-test-id="report-icon" />;
  }

  useEffect(() => {
    makeDownloadButtonAvailable();
    setDownloadLabel(generateDownloadLabel(datasetDownloadInProgress));
    }, [allTablesSelected, selectedFileType, selectedTable, dateRange]);

  useEffect(() => {
    if (dateRange) {
      const from = formatDate(dateRange.from);
      const to = formatDate(dateRange.to);
      const { earliestDate, latestDate } = dataset.techSpecs;

      if (isValidDateRange(from, to, earliestDate, latestDate)) {
        setDateString(`${from} - ${to}`);
      }
    }
  }, [dateRange]);

  useEffect(() => {
    if (downloadsInProgress === undefined) return;
    if (changeMadeToCriteria) return;
    setDatasetDownloadInProgress(
      downloadsInProgress.some((dl) => dl.datasetId === dataset.datasetId));
  }, [downloadsInProgress, changeMadeToCriteria]);

  useEffect(() => {
    if (datasetDownloadInProgress === undefined) return;
    setDownloadLabel(generateDownloadLabel(datasetDownloadInProgress));
    setIcon(setIconComponent(datasetDownloadInProgress));
    setDisableButton(datasetDownloadInProgress);
  }, [datasetDownloadInProgress]);

  return (
    <div className={styles.wrapper} data-test-id="wrapper">
      <DownloadModal
        open={open}
        onClose={onClose}
        downloadsPrepared={downloadsPrepared}
        setCancelDownloadRequest={handleCancelRequest}
      />
      <div className={styles.downloadDescription}>
        <div data-test-id="tableName" className={styles.describer}>
          <strong>Data Table:</strong>
          <div>
            <Truncator>
              <span data-test-id="tableNameText">{tableName}</span>
            </Truncator>
          </div>
        </div>
        <div className={styles.describer}>
          <strong>Date Range:</strong>
          {!isFiltered && (
            <span data-test-id="allString" className={styles.dateString}> {allString}</span>
          )}
          <div data-test-id="dateString" className={styles.dateString}> {dateString}</div>
        </div>
        {(selectedTable?.userFilter) && (
          <div className={styles.describer}>
            <strong data-testid="userFilterLabel">{selectedTable.userFilter.label}:</strong>
            <div data-testid="userFilterValue" className={styles.dateString}>
              {(selectedUserFilter && selectedUserFilter.value) ?
                  selectedUserFilter.label :
                  '(None selected)'}
            </div>
          </div>
        )}
      </div>

      <DownloadToggle onChange={toggleButtonChange} />
      <div>
        <DownloadItemButton
          icon={icon}
          label={downloadLabel}
          disabled={disableButton}
          handleClick={downloadClickHandler}
        />
      </div>
      <div>
        <DownloadItemButton
          label="Download Data Dictionary"
          fileSize={ddSize}
          asyncAction={metadataDownloader}
        />
      </div>
    </div>
  )
}

export default DownloadWrapper;
