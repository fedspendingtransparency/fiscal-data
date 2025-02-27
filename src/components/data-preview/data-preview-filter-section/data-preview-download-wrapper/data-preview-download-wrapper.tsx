import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { downloadsContext } from '../../../persist/download-persist/downloads-persist';
import { useRecoilValue } from 'recoil';
import { dateForFilename, fileFromPath } from './download-wrapper-helper';
import DataPreviewDownloadSelect from './data-preview-download-select/data-preview-download-select';
import { dataTableDapGaEventLabelState } from '../../../../recoil/dataTableDapGaEventLabelState';
import { IDataset } from '../../../../models/IDataset';
import { IDatasetApi } from '../../../../models/IDatasetApi';
import { IPivotOption } from '../../../../models/data-preview/IPivotOption';
import { reactTableFilteredDateRangeState } from '../../../../recoil/reactTableFilteredState';

type DownloadProps = {
  selectedTable: IDatasetApi;
  allTablesSelected: boolean;
  dateRange: { from: Date; to: Date };
  dataset: IDataset;
  isFiltered: boolean;
  selectedUserFilter;
  tableColumnSortData;
  selectedDetailViewFilter;
  width: number;
  isDisabled: boolean;
  selectedPivot: IPivotOption;
};

const DataPreviewDownloadWrapper: FunctionComponent<DownloadProps> = ({
  selectedTable,
  allTablesSelected,
  dateRange,
  dataset,
  selectedPivot,
  isFiltered,
  selectedUserFilter,
  tableColumnSortData,
  selectedDetailViewFilter,
  width,
  isDisabled,
}) => {
  //TODO Add download modal to section -  any related code has been commented out for now

  // let tableName = selectedTable && selectedTable.tableName ? selectedTable.tableName : 'N/A';
  // if (allTablesSelected) {
  //   tableName = `All Data Tables (${dataset.apis.length})`;
  // }

  const siteDownloads = useContext(downloadsContext);
  const [open, setOpen] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [datasetDownloadInProgress, setDatasetDownloadInProgress] = useState(false);
  const [changeMadeToCriteria, setChangeMadeToCriteria] = useState(false);
  const { setDownloadRequest, downloadsInProgress, downloadsPrepared, setCancelDownloadRequest } = siteDownloads;
  const filteredDateRange = useRecoilValue(reactTableFilteredDateRangeState);

  // const globalDisableDownloadButton = useRecoilValue(dataTableDapGaEventLabelState);

  // const makeDownloadButtonAvailable = () => {
  //   if (datasetDownloadInProgress) {
  //     setDatasetDownloadInProgress(false);
  //     /**
  //      * This is used by the downloadsInProgress useEffect to not disable the
  //      * button again if the user happened to change something before the download
  //      * process advances.
  //      */
  //     setChangeMadeToCriteria(true);
  //   }
  // };

  // const handleCancelRequest = value => {
  //   if (setCancelDownloadRequest) {
  //     setCancelDownloadRequest(value);
  //   }
  // };

  const downloadClickHandler = (fileType, event) => {
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
      fileType,
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

  // const onClose = () => {
  //   setOpen(false);
  // };

  // useEffect(() => {
  //   makeDownloadButtonAvailable();
  // }, [allTablesSelected, selectedTable, dateRange]);

  // useEffect(() => {
  //   if (downloadsInProgress === undefined) return;
  //   if (changeMadeToCriteria) return;
  //   setDatasetDownloadInProgress(downloadsInProgress.some(dl => dl.datasetId === dataset.datasetId));
  // }, [downloadsInProgress, changeMadeToCriteria]);

  // useEffect(() => {
  //   if (datasetDownloadInProgress === undefined) return;
  //   setDisableButton(datasetDownloadInProgress);
  // }, [datasetDownloadInProgress]);
  //
  // useEffect(() => {
  //   setDisableButton(globalDisableDownloadButton);
  // }, [globalDisableDownloadButton]);

  return (
    <div data-test-id="wrapper">
      {/*<DownloadModal open={open} onClose={onClose} downloadsPrepared={downloadsPrepared} setCancelDownloadRequest={handleCancelRequest} />*/}
      <DataPreviewDownloadSelect
        width={width}
        dateRange={dateRange}
        selectedTable={selectedTable}
        dataset={dataset}
        selectedPivot={selectedPivot}
        downloadClickHandler={downloadClickHandler}
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default DataPreviewDownloadWrapper;
