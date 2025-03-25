import React, { FunctionComponent, useEffect, useState } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import DataPreviewSectionContainer from './data-preview-section-container/data-preview-section-container';
import {
  dataPreview,
  dataPreviewHeader,
  dataPreviewTitle,
  detailViewNotice,
  increaseSpacing,
  lockIcon,
  placeholderButton,
  placeholderText,
  selectedTableName,
} from './data-preview.module.scss';
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
import Analytics from '../../utils/analytics/analytics';
import { withWindowSize } from 'react-fns';
import DataPreviewDatatableBanner from './data-preview-datatable-banner/data-preview-datatable-banner';
import { IDataPreview } from '../../models/data-preview/IDataPreview';
import DataPreviewChart from './data-preview-chart/data-preview-chart';

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
  const [selectedTable, setSelectedTable] = useState();
  const [allTablesSelected, setAllTablesSelected] = useState(false);
  const [dateRange, setDateRange] = useState(); // TODO: remove this... using before hooking date picker to table
  const [isCustomDateRange, setIsCustomDateRange] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [serverSidePagination, setServerSidePagination] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [publishedReports, setPublishedReports] = useState([]);
  const [selectedPivot, setSelectedPivot] = useState();
  const [ignorePivots, setIgnorePivots] = useState(false);
  const [configUpdated, setConfigUpdated] = useState(false);
  const [userFilterSelection, setUserFilterSelection] = useState(null);
  const [tableColumnSortData, setTableColumnSortData] = useState([]);
  const [tableCaches] = useState({});
  const [resetFilters, setResetFilters] = useState(false);
  const [detailViewState, setDetailViewState] = useState(null);
  const [summaryValues, setSummaryValues] = useState(null);
  const [detailViewDownloadFilter, setDetailViewDownloadFilter] = useState(null);
  const [allActiveFilters, setAllActiveFilters] = useState([]);
  const [apiFilterDefault, setApiFilterDefault] = useState(!!selectedTable?.apiFilter);
  const [viewMode, setViewMode] = useState('table');

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
      // setYears(generateYearOptions(selectedTable?.earliestDate, selectedTable?.latestDate));
      const defaultYear = new Date().getFullYear();
      const defaultMonth = new Date().getMonth();
      if (selectedTable?.apiFilter?.disableDateRangeFilter) {
        const startDate = new Date(defaultYear, defaultMonth, 1);
        const endDate = new Date(defaultYear, defaultMonth + 1, 0);
        // setSelectedMonth({ value: selectedTable?.apiFilter?.futureDated ? defaultMonth + 2 : defaultMonth + 1, label: monthFullNames[defaultMonth] });
        // setSelectedYear({ value: defaultYear, label: defaultYear });
        setDateRange({ from: startDate, to: endDate });
      }
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
  const getDateFieldForChart = () => {
    if (selectedPivot && selectedPivot.pivotView && selectedPivot.pivotView.aggregateOn && selectedPivot.pivotView.aggregateOn.length) {
      return 'CHART_DATE'; // aggregation cases in pivoted data this only for charting calculation
    } else {
      return selectedTable?.dateField;
    }
  };

  const dateFieldForChart = getDateFieldForChart();

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
            selectedTable={selectedTable}
            setSelectedTable={handleSelectedTableChange}
            allTablesSelected={allTablesSelected}
            earliestDate={config.techSpecs.earliestDate}
            latestDate={config.techSpecs.latestDate}
            disableAllTables={config?.disableAllTables}
            selectedPivot={selectedPivot}
            setSelectedPivot={setSelectedPivot}
            hideDropdown={config.apis.length === 1 && config.apis[0]?.dataDisplays?.length <= 1}
          />
        )}
      </div>
      <div className={selectedTableName}>{selectedTable?.tableName}</div>
      {config.datatableBanner && <DataPreviewDatatableBanner bannerNotice={config.datatableBanner} />}
      {selectedTable?.userFilter?.notice && <DataPreviewDatatableBanner bannerNotice={selectedTable.userFilter.notice} />}
      {selectedTable?.apiFilter?.notice && <DataPreviewDatatableBanner bannerNotice={selectedTable.apiFilter.notice} />}
      <div>
        {tableColumnSortData && selectedTable && (
          <DataPreviewFilterSection
            data-testid="filterAndDownload"
            dateRange={dateRange}
            setDateRange={setDateRange}
            isFiltered={isFiltered}
            selectedTable={!!detailViewState ? detailApi : selectedTable}
            selectedPivot={selectedPivot}
            dataset={config}
            allTablesSelected={allTablesSelected}
            isCustomDateRange={isCustomDateRange}
            selectedUserFilter={userFilterSelection}
            tableColumnSortData={tableColumnSortData}
            selectedDetailViewFilter={detailViewDownloadFilter}
            apiFilterDefault={apiFilterDefault}
            setIsFiltered={setIsFiltered}
            handleDateRangeChange={handleDateRangeChange}
            setIsCustomDateRange={setIsCustomDateRange}
            finalDatesNotFound={finalDatesNotFound}
            detailApi={detailApi}
            detailViewState={detailViewState}
            apiData={apiData}
            viewMode={viewMode}
            setViewMode={setViewMode}
          >
            {selectedTable && (
              <>
                {!selectedTable?.apiFilter?.disableDateRangeFilter && (
                  <DateRangeFilter
                    setDateRange={setDateRange}
                    handleDateRangeChange={handleDateRangeChange}
                    selectedTable={!!detailViewState ? detailApi : selectedTable}
                    apiData={apiData}
                    onUserFilter={setUserFilterSelection}
                    setIsFiltered={setIsFiltered}
                    currentDateButton={config.currentDateButton}
                    datePreset={config.datePreset}
                    customRangePreset={config.customRangePreset}
                    setIsCustomDateRange={setIsCustomDateRange}
                    allTablesSelected={allTablesSelected}
                    datasetDateRange={{
                      earliestDate: config.techSpecs.earliestDate,
                      latestDate: config.techSpecs.latestDate,
                    }}
                    finalDatesNotFound={finalDatesNotFound}
                    setResetFilters={setResetFilters}
                    datatableBanner={config.datatableBanner}
                    hideButtons={detailApi && !detailViewState}
                  />
                )}
                {selectedTable?.apiFilter?.disableDateRangeFilter && <div className={increaseSpacing}></div>}
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
            {dateRange &&
              (viewMode === 'table' ? (
                <DataPreviewSectionContainer
                  config={config}
                  dateRange={dateRange}
                  selectedTable={selectedTable}
                  userFilterSelection={userFilterSelection}
                  setUserFilterSelection={setUserFilterSelection}
                  apiData={apiData}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  apiError={apiError}
                  selectedPivot={selectedPivot}
                  setSelectedPivot={setSelectedPivot}
                  serverSidePagination={serverSidePagination}
                  selectedTab={selectedTab}
                  tabChangeHandler={setSelectedTab}
                  handleIgnorePivots={setIgnorePivots}
                  allTablesSelected={allTablesSelected}
                  handleConfigUpdate={() => setConfigUpdated(true)}
                  tableColumnSortData={tableColumnSortData}
                  setTableColumnSortData={setTableColumnSortData}
                  hasPublishedReports={!!publishedReports}
                  publishedReports={publishedReports}
                  resetFilters={resetFilters}
                  setResetFilters={setResetFilters}
                  setDetailViewState={setDetailViewState}
                  detailViewState={detailViewState}
                  customFormatting={selectedTable?.customFormatting}
                  summaryValues={summaryValues}
                  setSummaryValues={setSummaryValues}
                  allActiveFilters={allActiveFilters}
                  setAllActiveFilters={setAllActiveFilters}
                  width={width}
                  apiFilterDefault={apiFilterDefault}
                  setApiFilterDefault={setApiFilterDefault}
                />
              ) : (
                <>
                  <DataPreviewChart
                    legend={false}
                    dateRange={dateRange}
                    data={apiData}
                    slug={config.slug}
                    currentTable={selectedTable}
                    isVisible={true}
                    chartCitation={false}
                    selectedPivot={selectedPivot}
                    dateField={dateFieldForChart}
                  />
                </>
              ))}
          </DataPreviewFilterSection>
        )}
      </div>
    </DatasetSectionContainer>
  );
};

export default withWindowSize(DataPreview);
