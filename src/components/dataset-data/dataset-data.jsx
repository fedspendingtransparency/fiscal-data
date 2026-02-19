import React, { useEffect, useState } from 'react';
import { withWindowSize } from 'react-fns';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import FilterAndDownload from '../filter-download-container/filter-download-container';
import DataTableSelect from '../datatable-select/datatable-select';
import RangePresets from '../filter-download-container/range-presets/range-presets';
import TableSectionContainer from './table-section-container/table-section-container';
import { matchTableFromApiTables, parseTableSelectionFromUrl, rewriteUrl } from './dataset-data-helper/dataset-data-helper';
import { getPublishedDates } from '../../helpers/dataset-detail/report-helpers';
import { getApiData } from './dataset-data-api-helper/dataset-data-api-helper';
import { TableCache } from './table-cache/table-cache';
import { isValidDateRange } from '../../helpers/dates/date-helpers';
import Analytics from '../../utils/analytics/analytics';
import { useRecoilValue } from 'recoil';
import { reactTableFilteredDateRangeState } from '../../recoil/reactTableFilteredState';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { bannerContainer, detailViewNotice, lockIcon, placeholderButton, placeholderText } from './dataset-data.module.scss';
import { queryClient } from '../../../react-query-client';
import UserFilter from '../filter-download-container/user-filter/user-filter';
import DatatableBanner from '../filter-download-container/datatable-banner/datatable-banner';
import BannerCallout from '../banner-callout/banner-callout';

export const DatasetDataComponent = ({ config, finalDatesNotFound, location, publishedReportsProp, setSelectedTableProp, width }) => {
  // config.apis should always be available; but, fallback in case

  const apis = config ? config.apis : [null];
  const filteredApis = apis.filter(api => api?.apiId !== config?.detailView?.apiId);
  const detailApi = apis.find(api => api?.apiId && api?.apiId === config?.detailView?.apiId);
  const [isFiltered, setIsFiltered] = useState(true);
  const [selectedTable, setSelectedTable] = useState();
  const [allTablesSelected, setAllTablesSelected] = useState(false);
  const [dateRange, setDateRange] = useState();
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
  const [disableDownloadBanner, setDisableDownloadBanner] = useState(false);
  const filteredDateRange = useRecoilValue(reactTableFilteredDateRangeState);

  let loadByPage;
  const title = 'Data Preview';
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
      setSelectedPivot(null);
      rewriteUrl(selectedTable, config.slug, location);
      setIsFiltered(true);
      setApiError(false);
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

  // When dateRange changes, fetch new data
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
  }, [dateRange, selectedPivot, ignorePivots, finalDatesNotFound]);

  useEffect(() => {
    if (allTablesSelected) {
      setTableColumnSortData([]);
    }
    setUserFilterSelection(null);
  }, [allTablesSelected]);

  useEffect(() => {
    setTableColumnSortData([]);
  }, [selectedTable]);

  return (
    <div data-testid="datasetData">
      <DatasetSectionContainer id="data-table" title={title}>
        {tableColumnSortData && (
          <FilterAndDownload
            data-testid="filterAndDownload"
            dateRange={dateRange}
            isFiltered={isFiltered}
            selectedTable={!!detailViewState ? detailApi : selectedTable}
            dataset={config}
            allTablesSelected={allTablesSelected}
            isCustomDateRange={isCustomDateRange}
            selectedUserFilter={userFilterSelection}
            tableColumnSortData={tableColumnSortData}
            filteredDateRange={filteredDateRange}
            selectedDetailViewFilter={detailViewDownloadFilter}
            setDisableDownloadBanner={setDisableDownloadBanner}
            selectedPivot={selectedPivot}
          >
            <DataTableSelect
              apis={filteredApis}
              selectedTable={selectedTable}
              setSelectedTable={handleSelectedTableChange}
              allTablesSelected={allTablesSelected}
              earliestDate={config.techSpecs.earliestDate}
              latestDate={config.techSpecs.latestDate}
              disableAllTables={config?.disableAllTables}
            />
            {selectedTable && (
              <>
                {!selectedTable?.apiFilter?.disableDateRangeFilter && (
                  <RangePresets
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
                {disableDownloadBanner && (
                  <div className={bannerContainer}>
                    <BannerCallout bannerCallout={{ banner: 'XMLLargeDownloadDisabled' }} bannerType="infoYellow" />
                  </div>
                )}
                {selectedTable.userFilter && (
                  <UserFilter
                    selectedTable={selectedTable}
                    onUserFilter={setUserFilterSelection}
                    apiData={apiData}
                    setResetFilters={setResetFilters}
                  />
                )}
                {selectedTable.apiFilter && (
                  <UserFilter
                    selectedTable={selectedTable}
                    onUserFilter={setUserFilterSelection}
                    setResetFilters={setResetFilters}
                    allTablesSelected={allTablesSelected}
                    setDateRange={setDateRange}
                  />
                )}
              </>
            )}
            {config.datatableBanner && <DatatableBanner bannerNotice={config.datatableBanner} />}
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
          </FilterAndDownload>
        )}
        {dateRange && (
          <TableSectionContainer
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
          />
        )}
      </DatasetSectionContainer>
    </div>
  );
};

// Despite the default export below, the bare component is exported separately above so
// that the [location] prop can easily be directly specified in unit test renders without any
// use or mocking of [withWindowSize] - tlp 2021-11-17

export default withWindowSize(DatasetDataComponent);
