import React, { FunctionComponent, useEffect, useState } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import DataPreviewSectionContainer from './data-preview-section-container/data-preview-section-container';
import {
  breakpointXl,
  chartTableVisibility,
  dataPreview,
  dataPreviewHeader,
  detailViewBack,
  detailViewButton,
  detailViewIcon,
  selectedTableName,
  summaryTableHeader,
} from './data-preview.module.scss';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { isValidDateRange } from '../../helpers/dates/date-helpers';
import { getPublishedDates } from '../../helpers/dataset-detail/report-helpers';
import { TableCache } from '../dataset-data/table-cache/table-cache';
import { matchTableFromApiTables, parseTableSelectionFromUrl, rewriteUrl } from '../dataset-data/dataset-data-helper/dataset-data-helper';
import { getApiData } from '../dataset-data/dataset-data-api-helper/dataset-data-api-helper';
import { queryClient } from '../../../react-query-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataPreviewFilterSection from './data-preview-filter-section/data-preview-filter-section';
import DataPreviewTableSelectDropdown from './data-preview-dropdown/data-preview-table-select-dropdown';
import Analytics from '../../utils/analytics/analytics';
import { withWindowSize } from 'react-fns';
import DataPreviewDatatableBanner from './data-preview-datatable-banner/data-preview-datatable-banner';
import { IDataPreview } from '../../models/data-preview/IDataPreview';
import DataPreviewChart from './data-preview-chart/data-preview-chart';
import DataTableProvider from './data-preview-context';
import SummaryTable from './data-preview-summary-table/data-preview-summary-table';
import moment from 'moment';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';

export const DataPreview: FunctionComponent<IDataPreview> = ({
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
  const [pivotsUpdated, setPivotsUpdated] = useState(false);

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
      } else if (selectedTable?.apiFilter?.disableDateRangeFilter) {
        const defaultYear = new Date().getFullYear();
        const defaultMonth = new Date().getMonth();
        const startDate = new Date(defaultYear, defaultMonth, 1);
        const endDate = new Date(defaultYear, defaultMonth + 1, 0);
        // setSelectedMonth({ value: selectedTable?.apiFilter?.futureDated ? defaultMonth + 2 : defaultMonth + 1, label: monthFullNames[defaultMonth] });
        // setSelectedYear({ value: defaultYear, label: defaultYear });
        setDateRange({ from: startDate, to: endDate });
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
    }
  }, [selectedTable]);

  useEffect(() => {
    if (detailApi) {
      // resetting cache index here lets table data refresh on detail view state change
      tableCaches[detailApi.apiId] = null;
      setDateRange(null);
      setIsFiltered(true);
      setApiError(false);
      if (!tableCaches[detailApi.apiId]) {
        tableCaches[detailApi.apiId] = new TableCache();
      }
      setDetailViewDownloadFilter(
        !!detailViewState
          ? {
              field: config.detailView.field,
              label: config.detailView.label,
              value: detailViewState.value,
            }
          : null
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

  const updateTableData = () => {
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
  };

  const dateFieldForChart = getDateFieldForChart();

  // When pivot changes, fetch new data
  useEffect(() => {
    if (!finalDatesNotFound && selectedTable && (selectedPivot || ignorePivots) && dateRange && !allTablesSelected) {
      updateTableData();
    }
  }, [selectedPivot, ignorePivots, finalDatesNotFound]);

  // When dateRange changes, fetch new data
  useEffect(() => {
    if (
      !finalDatesNotFound &&
      selectedTable &&
      (apiData?.length === 0 || !apiData || detailApi) &&
      (selectedPivot || ignorePivots) &&
      dateRange &&
      !allTablesSelected
    ) {
      updateTableData();
    }
  }, [dateRange]);

  useEffect(() => {
    if (allTablesSelected) {
      setTableColumnSortData([]);
    }
    setUserFilterSelection(null);
  }, [allTablesSelected]);

  const formatDate = detailDate => {
    const fieldType = selectedTable.fields.find(field => field.columnName === config.detailView?.field)?.dataType;
    const customFormat = selectedTable?.customFormatting?.find(config => config.type === 'DATE');
    return customFormat?.dateFormat && fieldType === 'DATE' ? moment(detailDate).format(customFormat.dateFormat) : detailDate;
  };

  const checkDataDisplays = config.apis.every(api => (api?.dataDisplays?.length || 0) <= 1);
  const dropdownWidth = width >= pxToNumber(breakpointXl) ? '20rem' : '100%';

  return (
    <DataTableProvider config={config} detailViewState={detailViewState}>
      <DatasetSectionContainer id="data-preview-table">
        <div className={dataPreview}>
          <h2 className={dataPreviewHeader}>Data Preview</h2>
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
              pivotsUpdated={pivotsUpdated}
              hideDropdown={(config.apis.length === 1 || (detailApi && config.apis.length === 2)) && checkDataDisplays}
              detailViewState={detailViewState}
              width={width}
            />
          )}
        </div>
        {!!detailViewState ? (
          <div className={summaryTableHeader}>
            <button className={detailViewButton} onClick={() => setDetailViewState(null)} data-testid="detailViewCloseButton">
              <FontAwesomeIcon className={detailViewIcon} icon={faCaretLeft} data-testid="arrow-icon" size="1x" />
              <span className={detailViewBack} data-testid="backButton">
                Back
              </span>
            </button>
            <h3 className={selectedTableName} data-testid="tableName" id="main-data-table-title">
              {`${selectedTable?.tableName} > ${formatDate(detailViewState?.value)}`}
            </h3>
          </div>
        ) : (
          <h3 className={selectedTableName} data-testid="tableName" id="main-data-table-title">
            {selectedTable?.tableName}
            {selectedPivot?.pivotValue?.prettyName ? `: ${selectedPivot?.pivotValue?.prettyName} (${selectedPivot?.pivotView?.title})` : ''}
          </h3>
        )}
        {!!detailViewState && (
          <SummaryTable
            summaryTable={config?.detailView?.summaryTableFields}
            summaryValues={summaryValues}
            customFormatConfig={selectedTable?.customFormatting}
          />
        )}
        {config.datatableBanner && <DataPreviewDatatableBanner bannerNotice={config.datatableBanner} />}
        {selectedTable?.userFilter?.notice && <DataPreviewDatatableBanner bannerNotice={selectedTable.userFilter.notice} />}
        {selectedTable?.apiFilter?.notice && <DataPreviewDatatableBanner bannerNotice={selectedTable.apiFilter.notice} />}
        <div>
          {tableColumnSortData && selectedTable && (
            <DataPreviewFilterSection
              width={width}
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
              currentDateButton={config.currentDateButton}
              datePreset={config.datePreset}
              customRangePreset={config.customRangePreset}
              datasetDateRange={{
                earliestDate: config.techSpecs.earliestDate,
                latestDate: config.techSpecs.latestDate,
              }}
              dropdownWidth={dropdownWidth}
            >
              {dateRange && (
                <>
                  <div className={viewMode === 'chart' ? chartTableVisibility : undefined} aria-hidden={viewMode === 'chart'}>
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
                      pivotsUpdated={pivotsUpdated}
                      setPivotsUpdated={setPivotsUpdated}
                    />
                  </div>

                  <div className={viewMode === 'table' ? chartTableVisibility : undefined} aria-hidden={viewMode === 'table'}>
                    <DataPreviewChart
                      dateRange={dateRange}
                      data={apiData}
                      slug={config.slug}
                      currentTable={selectedTable}
                      selectedPivot={selectedPivot}
                      dateField={dateFieldForChart}
                    />
                  </div>
                </>
              )}
            </DataPreviewFilterSection>
          )}
        </div>
      </DatasetSectionContainer>
    </DataTableProvider>
  );
};

export default withWindowSize(DataPreview);
