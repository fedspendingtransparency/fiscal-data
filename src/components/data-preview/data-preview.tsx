import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import DataPreviewSectionContainer from './data-preview-section-container/data-preview-section-container';
import { detailViewNotice, lockIcon, placeholderButton, placeholderText } from './data-preview.module.scss';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { isValidDateRange } from '../../helpers/dates/date-helpers';
import { getPublishedDates } from '../../helpers/dataset-detail/report-helpers';
import { TableCache } from '../dataset-data/table-cache/table-cache';
import { matchTableFromApiTables, parseTableSelectionFromUrl, rewriteUrl } from '../dataset-data/dataset-data-helper/dataset-data-helper';
import { getApiData } from '../dataset-data/dataset-data-api-helper/dataset-data-api-helper';
import { queryClient } from '../../../react-query-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataPreviewFilterSection from './data-preview-filter-section/data-preview-filter-section';
import DateRangeFilter from './data-preview-filter-section/date-range-filter/date-range-filter';
import DataPreviewTableSelectDropdown from './data-preview-dropdown/data-preview-table-select-dropdown';
import { dataPreview, dataPreviewHeader, dataPreviewTitle, selectedTableName } from './data-preview.module.scss';
import Analytics from '../../utils/analytics/analytics';
import { withWindowSize } from 'react-fns';
import DataPreviewDatatableBanner from './data-preview-datatable-banner/data-preview-datatable-banner';
import { IDataPreview } from '../../models/data-preview/IDataPreview';
import { DatasetDetailContext } from '../../contexts/dataset-detail-context';

const DataPreview: FunctionComponent<IDataPreview> = ({
  config,
  finalDatesNotFound,
  location,
  publishedReportsProp,
  setSelectedTableProp,
  width,
}) => {
  // config.apis should always be available; but, fallback in case
  const apis = config ? config.apis : [null];
  const filteredApis = apis.filter(api => api?.apiId !== config?.detailView?.apiId);
  const detailApi = apis.find(api => api?.apiId && api?.apiId === config?.detailView?.apiId);
  const [isFiltered, setIsFiltered] = useState(true);
  const [isCustomDateRange, setIsCustomDateRange] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [serverSidePagination, setServerSidePagination] = useState(false);
  const [publishedReports, setPublishedReports] = useState([]);
  const [ignorePivots, setIgnorePivots] = useState(false);
  const [configUpdated, setConfigUpdated] = useState(false);
  const [tableCaches] = useState({});
  const [detailViewDownloadFilter, setDetailViewDownloadFilter] = useState(null);

  const {
    selectedTable,
    setSelectedTable,
    selectedPivot,
    setSelectedPivot,
    detailViewState,
    allTablesSelected,
    setAllTablesSelected,
    tableColumnSortData,
    setTableColumnSortData,
    setUserFilterSelection,
    setIsLoading,
    dateRange,
    setDateRange,
  } = useContext(DatasetDetailContext);

  let loadByPage;
  const shouldUseLoadByPage = pivot => {
    return selectedTable && selectedTable.isLargeDataset && pivot && pivot.pivotView && pivot.pivotView.chartType === 'none';
  };

  const clearDisplayData = () => {
    loadByPage = shouldUseLoadByPage(selectedPivot);

    if (loadByPage) {
      setServerSidePagination(selectedTable.endpoint);
    } else {
      setServerSidePagination(null);
    }
    setApiData(null);
    setApiError(false);
  };

  const updateDataDisplay = data => {
    clearDisplayData();
    setTimeout(() => setApiData(data)); // then on the next tick, setup the new data
  };

  const handleSelectedTableChange = table => {
    if (table.allDataTables) {
      setAllTablesSelected(true);
    } else {
      setAllTablesSelected(false);
      setSelectedTable(table);
    }

    Analytics.event({
      category: 'Data Table Selector',
      action: 'Pick Table Click',
      label: table.tableName,
    });
  };

  const handleDateRangeChange = range => {
    if (range && isValidDateRange(range.from, range.to, config.techSpecs.earliestDate, config.techSpecs.latestDate)) {
      setDateRange(range);
    }
  };

  useEffect(() => {
    // todo - Use a better manner of reassigning the report_date prop to jsdates.
    setPublishedReports(getPublishedDates(publishedReportsProp));
  }, [publishedReportsProp]);

  useEffect(() => {
    if (configUpdated) {
      tableCaches[selectedTable.apiId] = new TableCache();
      const tableFromUrl = parseTableSelectionFromUrl(location, apis);
      setSelectedTable(tableFromUrl);
      setConfigUpdated(false);
    }
  }, [configUpdated]);

  // The following useEffect fires on this component's init and when the summary metadata is
  // called. If new dates are available, then we should be updating the page to reflect the
  // newest dates.
  useEffect(() => {
    const idealSelectedTable = matchTableFromApiTables(selectedTable, apis) || parseTableSelectionFromUrl(location, apis);
    if (idealSelectedTable && idealSelectedTable.tableName) {
      setSelectedTable(idealSelectedTable);
    }
  }, [apis]);

  useEffect(() => {
    if (selectedTable) {
      if (!selectedTable?.apiFilter?.disableDateRangeFilter) {
        setDateRange(null);
      }
      rewriteUrl(selectedTable, config.slug, location);
      setIsFiltered(true);
      setApiError(false);
      setTableColumnSortData([]);
      if (!tableCaches[selectedTable.apiId]) {
        tableCaches[selectedTable.apiId] = new TableCache();
      }
      setSelectedTableProp(selectedTable);
    }
  }, [selectedTable]);

  useEffect(() => {
    if (detailApi) {
      // resetting cache index here lets table data refresh on detail view state change
      tableCaches[detailApi.apiId] = null;
      setDateRange(null);
      setSelectedPivot(null);
      setIsFiltered(true);
      setApiError(false);
      if (!tableCaches[detailApi.apiId]) {
        tableCaches[detailApi.apiId] = new TableCache();
      }
      setDetailViewDownloadFilter(
        !!detailViewState ? { field: config.detailView.field, label: config.detailView.label, value: detailViewState.value } : null
      );
    }
  }, [detailViewState]);

  // When pivot changes, fetch new data
  useEffect(() => {
    if (!finalDatesNotFound && selectedTable && (selectedPivot || ignorePivots) && dateRange && !allTablesSelected) {
      const displayedTable = detailViewState ? detailApi : selectedTable;
      const cache = tableCaches[displayedTable.apiId];
      const cachedDisplay = cache?.getCachedDataDisplay(dateRange, selectedPivot, displayedTable);
      if (cachedDisplay) {
        updateDataDisplay(cachedDisplay);
      } else {
        clearDisplayData();
        let canceledObj = { isCanceled: false, abortController: new AbortController() };
        if (!loadByPage || ignorePivots) {
          getApiData(
            dateRange,
            displayedTable,
            selectedPivot,
            setIsLoading,
            setApiData,
            setApiError,
            canceledObj,
            tableCaches[displayedTable.apiId],
            detailViewState,
            config?.detailView?.field,
            queryClient
          ).then(() => {
            // nothing to cancel if the request completes normally.
            canceledObj = null;
          });
        }
        return () => {
          if (!canceledObj) return;
          canceledObj.isCanceled = true;
          canceledObj.abortController.abort();
        };
      }
    }
  }, [selectedPivot, ignorePivots, finalDatesNotFound]);

  // When dateRange changes, fetch new data
  useEffect(() => {
    if (
      !finalDatesNotFound &&
      selectedTable &&
      (apiData?.length === 0 || !apiData) &&
      (selectedPivot || ignorePivots) &&
      dateRange &&
      !allTablesSelected
    ) {
      const displayedTable = detailViewState ? detailApi : selectedTable;
      const cache = tableCaches[displayedTable.apiId];
      const cachedDisplay = cache?.getCachedDataDisplay(dateRange, selectedPivot, displayedTable);
      if (cachedDisplay) {
        updateDataDisplay(cachedDisplay);
      } else {
        clearDisplayData();
        let canceledObj = { isCanceled: false, abortController: new AbortController() };
        if (!loadByPage || ignorePivots) {
          getApiData(
            dateRange,
            displayedTable,
            selectedPivot,
            setIsLoading,
            setApiData,
            setApiError,
            canceledObj,
            tableCaches[displayedTable.apiId],
            detailViewState,
            config?.detailView?.field,
            queryClient
          ).then(() => {
            // nothing to cancel if the request completes normally.
            canceledObj = null;
          });
        }
        return () => {
          if (!canceledObj) return;
          canceledObj.isCanceled = true;
          canceledObj.abortController.abort();
        };
      }
    }
  }, [dateRange]);

  useEffect(() => {
    if (allTablesSelected) {
      setTableColumnSortData([]);
    }
    setUserFilterSelection(null);
  }, [allTablesSelected]);

  return (
    <DatasetSectionContainer id="data-preview-table">
      <div className={dataPreview}>
        <div className={dataPreviewHeader}>
          <span className={dataPreviewTitle}>Data Preview</span>
        </div>
        {selectedTable && (
          <DataPreviewTableSelectDropdown
            apis={filteredApis}
            handleSelectedTableChange={handleSelectedTableChange}
            earliestDate={config.techSpecs.earliestDate}
            latestDate={config.techSpecs.latestDate}
            disableAllTables={config?.disableAllTables}
            hideDropdown={config.apis.length === 1 && config.apis[0]?.dataDisplays?.length <= 1}
          />
        )}
      </div>
      <div className={selectedTableName}>{selectedTable?.tableName}</div>
      {config.datatableBanner && <DataPreviewDatatableBanner bannerNotice={config.datatableBanner} />}
      {selectedTable?.userFilter?.notice && <DataPreviewDatatableBanner bannerNotice={selectedTable.userFilter.notice} />}
      {selectedTable?.apiFilter?.notice && <DataPreviewDatatableBanner bannerNotice={selectedTable.apiFilter.notice} />}
      <>
        {tableColumnSortData && selectedTable && (
          <DataPreviewFilterSection
            isFiltered={isFiltered}
            selectedTable={!!detailViewState ? detailApi : selectedTable}
            selectedPivot={selectedPivot}
            dataset={config}
            isCustomDateRange={isCustomDateRange}
            selectedDetailViewFilter={detailViewDownloadFilter}
          >
            {selectedTable && (
              <>
                {!selectedTable?.apiFilter?.disableDateRangeFilter && (
                  <DateRangeFilter
                    handleDateRangeChange={handleDateRangeChange}
                    selectedTable={!!detailViewState ? detailApi : selectedTable}
                    apiData={apiData}
                    setIsFiltered={setIsFiltered}
                    currentDateButton={config.currentDateButton}
                    datePreset={config.datePreset}
                    customRangePreset={config.customRangePreset}
                    setIsCustomDateRange={setIsCustomDateRange}
                    datasetDateRange={{
                      earliestDate: config.techSpecs.earliestDate,
                      latestDate: config.techSpecs.latestDate,
                    }}
                    finalDatesNotFound={finalDatesNotFound}
                    datatableBanner={config.datatableBanner}
                    hideButtons={detailApi && !detailViewState}
                  />
                )}
              </>
            )}
            {!selectedTable && (
              <div data-testid="dateRangePlaceholder">
                <h3 className={placeholderText}>Date Range</h3>
                <div className={placeholderButton} />
              </div>
            )}
            {detailApi && !detailViewState && (
              <div className={detailViewNotice}>
                <FontAwesomeIcon icon={faLock} className={lockIcon} /> {config.detailView?.dateRangeLockCopy}
              </div>
            )}
            {dateRange && (
              <DataPreviewSectionContainer
                config={config}
                apiData={apiData}
                apiError={apiError}
                serverSidePagination={serverSidePagination}
                handleConfigUpdate={() => setConfigUpdated(true)}
                hasPublishedReports={!!publishedReports}
                publishedReports={publishedReports}
                customFormatting={selectedTable?.customFormatting}
                width={width}
              />
            )}
          </DataPreviewFilterSection>
        )}
      </>
    </DatasetSectionContainer>
  );
};

export default withWindowSize(DataPreview);
