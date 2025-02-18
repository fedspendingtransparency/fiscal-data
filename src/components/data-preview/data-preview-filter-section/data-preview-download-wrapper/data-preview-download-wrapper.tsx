import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { downloadsContext } from '../../../persist/download-persist/downloads-persist';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { reactTableFilteredDateRangeState } from '../../../../recoil/reactTableFilteredState';
import {
  calcDictionaryDownloadSize,
  convertDataDictionaryToCsv,
  triggerDataDictionaryDownload,
} from '../../../download-wrapper/data-dictionary-download-helper';
import { disableDownloadButtonState } from '../../../../recoil/disableDownloadButtonState';
import { tableRowLengthState } from '../../../../recoil/smallTableDownloadData';
import { generateAnalyticsEvent } from '../../../../layouts/dataset-detail/helper';
import { ensureDoubleDigitDate, formatDate } from '../../../download-wrapper/helpers';
import Analytics from '../../../../utils/analytics/analytics';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { isValidDateRange } from '../../../../helpers/dates/date-helpers';
import { REACT_TABLE_MAX_NON_PAGINATED_SIZE } from '../../../../utils/api-utils';
import DataPreviewDownloadButton from './data-preview-download-button/data-preview-download-button';
import { cancelEventActionStr, closeEventActionStr } from '../../../download-wrapper/download-wrapper';
import { DownloadContext } from '../../../../contexts/downloader/download-context';
import { dateForFilename, generateDownloadLabel, getDownloadIcon } from './download-wrapper-helper';

type DownloadProps = {
  selectedTable;
  allTablesSelected;
  dateRange;
  dataset;
  isFiltered;
  selectedUserFilter;
  tableColumnSortData;
  filteredDateRange;
  selectedDetailViewFilter;
  width: number;
};

const DataPreviewDownloadWrapper: FunctionComponent<DownloadProps> = ({
  selectedTable,
  allTablesSelected,
  dateRange,
  dataset,
  isFiltered,
  selectedUserFilter,
  tableColumnSortData,
  filteredDateRange,
  selectedDetailViewFilter,
  width,
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
  const { setDownloadRequest, downloadsInProgress, downloadsPrepared, setCancelDownloadRequest } = siteDownloads;
  const setDapGaEventLabel = useSetRecoilState(reactTableFilteredDateRangeState);
  const [gaEventLabel, setGaEventLabel] = useState();
  const [active, setActive] = useState(false);

  const dataDictionaryCsv = convertDataDictionaryToCsv(dataset);
  const ddSize = calcDictionaryDownloadSize(dataDictionaryCsv);
  const globalDisableDownloadButton = useRecoilValue(disableDownloadButtonState);
  const tableSize = useRecoilValue(tableRowLengthState);

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
  };

  const toggleButtonChange = value => {
    setSelectedFileType(value);
    makeDownloadButtonAvailable();
  };

  const handleCancelRequest = value => {
    generateAnalyticsEvent(gaEventLabel, cancelEventActionStr);
    if (setCancelDownloadRequest) {
      setCancelDownloadRequest(value);
    }
  };

  const metadataDownloader = async () => {
    Analytics.event({
      category: 'Dataset Dictionary Download',
      action: 'Data Dictionary Click',
      label: dataset.name,
    });
    return triggerDataDictionaryDownload(dataDictionaryCsv, dataset.name);
  };

  const downloadClickHandler = event => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setChangeMadeToCriteria(false);
    const apis = allTablesSelected ? dataset.apis.slice() : selectedTable;
    const downloadName = allTablesSelected ? `${(dataset.slug + '').replace(/\//g, '')}_all_tables` : `${fileFromPath(selectedTable.downloadName)}`;
    const downloadEntry = {
      datasetId: dataset.datasetId,
      apis: apis,
      dateRange: {
        from: new Date(dateRange.from.getTime()),
        to: new Date(dateRange.to.getTime()),
      },
      selectedFileType,
      filename: `${downloadName}_${dateForFilename(dateRange.from)}_${dateForFilename(dateRange.to)}.zip`,
      requestTime: Date.now(),
      selectedUserFilter,
      tableColumnSortData,
      filteredDateRange,
      selectedDetailViewFilter,
    };
    setDownloadRequest(downloadEntry);
    setOpen(true);

    return false;
  };

  const onClose = () => {
    generateAnalyticsEvent(gaEventLabel, closeEventActionStr);
    setOpen(false);
  };

  useEffect(() => {
    makeDownloadButtonAvailable();
    setDownloadLabel(generateDownloadLabel(datasetDownloadInProgress, allTablesSelected, selectedFileType, dataset));
  }, [allTablesSelected, selectedFileType, selectedTable, dateRange]);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setGaEventLabel(`Table Name: ${selectedTable?.tableName}, Type: ${selectedFileType}, Date Range: ${dateRange.from}-${dateRange.to}`);
    }
  }, [selectedTable, dateRange, selectedFileType]);

  useEffect(() => {
    setDapGaEventLabel(gaEventLabel);
  }, [gaEventLabel]);

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
    setDatasetDownloadInProgress(downloadsInProgress.some(dl => dl.datasetId === dataset.datasetId));
  }, [downloadsInProgress, changeMadeToCriteria]);

  useEffect(() => {
    if (datasetDownloadInProgress === undefined) return;
    setDownloadLabel(generateDownloadLabel(datasetDownloadInProgress, allTablesSelected, selectedFileType, dataset));
    setIcon(getDownloadIcon(datasetDownloadInProgress));
    setDisableButton(datasetDownloadInProgress);
  }, [datasetDownloadInProgress]);

  useEffect(() => {
    setDisableButton(globalDisableDownloadButton);
  }, [globalDisableDownloadButton]);

  const determineDirectDownload = () => {
    if (tableSize !== null && tableSize <= REACT_TABLE_MAX_NON_PAGINATED_SIZE && !allTablesSelected) {
      // return <p>This is where the download will go</p>;
      return <p>this is where local download logic will go</p>;
    } else {
      return <p>this is where api download logic will go</p>;
    }
  };

  return (
    <div data-test-id="data-preview-download">
      <DataPreviewDownloadButton active={active} setActive={setActive} width={width} />
    </div>
  );
};

export default DataPreviewDownloadWrapper;
