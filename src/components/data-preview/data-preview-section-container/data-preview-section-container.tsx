import React, { FunctionComponent, useContext, useEffect, useMemo, useState } from 'react';
import GLOBALS from '../../../helpers/constants';
import { useSetRecoilState } from 'recoil';
import { disableDownloadButtonState } from '../../../recoil/disableDownloadButtonState';
import { buildDateFilter, buildSortParams, fetchAllTableData, fetchTableMeta, formatDateForApi, MAX_PAGE_SIZE } from '../../../utils/api-utils';
import { queryClient } from '../../../../react-query-client';
import { setTableConfig } from '../../dataset-data/table-section-container/set-table-config';
import Analytics from '../../../utils/analytics/analytics';
import { determineUserFilterUnmatchedForDateRange } from '../../filter-download-container/user-filter/user-filter';
import { SetNoChartMessage } from '../../dataset-data/table-section-container/set-no-chart-message';
import AggregationNotice from '../../dataset-data/table-section-container/aggregation-notice/aggregation-notice';
import DataPreviewTable from '../data-preview-table/data-preview-table';
import {
  loadingIcon,
  loadingSection,
  noticeContainer,
  sectionBorder,
  tableContainer,
  tableSection,
  titleContainer,
} from './data-preview-section-container.module.scss';
import ChartTableDisplay from '../data-preview-chart-table-display/data-preview-chart-table-display';
import { DataTableContext } from '../data-preview-context';
import DynamicConfig from '../../dataset-data/table-section-container/dynamic-config/dynamicConfig';
import Experimental from '../../experimental/experimental';
import LoadingIndicator from '../../loading-indicator/loading-indicator';

type DataPreviewSectionProps = {
  config;
  dateRange;
  selectedTable;
  apiData;
  apiError;
  userFilterSelection;
  setUserFilterSelection;
  selectedPivot;
  setSelectedPivot;
  serverSidePagination;
  isLoading;
  setIsLoading;
  tabChangeHandler;
  handleIgnorePivots;
  ignorePivots;
  allTablesSelected;
  handleConfigUpdate;
  tableColumnSortData;
  setTableColumnSortData;
  hasPublishedReports;
  publishedReports;
  resetFilters;
  setResetFilters;
  detailViewState;
  setDetailViewState;
  customFormatting;
  summaryValues;
  setSummaryValues;
  allActiveFilters;
  setAllActiveFilters;
};

const DataPreviewSectionContainer: FunctionComponent<DataPreviewSectionProps> = ({
  config,
  dateRange,
  selectedTable,
  apiData,
  apiError,
  userFilterSelection,
  setUserFilterSelection,
  selectedPivot,
  setSelectedPivot,
  serverSidePagination,
  isLoading,
  setIsLoading,
  tabChangeHandler,
  handleIgnorePivots,
  ignorePivots,
  allTablesSelected,
  handleConfigUpdate,
  tableColumnSortData,
  setTableColumnSortData,
  hasPublishedReports,
  publishedReports,
  resetFilters,
  setResetFilters,
  detailViewState,
  setDetailViewState,
  customFormatting,
  summaryValues,
  setSummaryValues,
  allActiveFilters,
  setAllActiveFilters,
  width,
  apiFilterDefault,
  setApiFilterDefault,
  setPivotsUpdated,
  pivotsUpdated,
}) => {
  const { tableProps, setTableProps } = useContext(DataTableContext);
  const tableName = selectedTable.tableName;
  const [showPivotBar, setShowPivotBar] = useState(true);
  const [legend, setLegend] = useState(window.innerWidth > GLOBALS.breakpoints.large);
  const [legendToggledByUser, setLegendToggledByUser] = useState(false);
  const [hasPivotOptions, setHasPivotOptions] = useState(false);
  const [userFilteredData, setUserFilteredData] = useState(null);
  const [noChartMessage, setNoChartMessage] = useState(null);
  const [userFilterUnmatchedForDateRange, setUserFilterUnmatchedForDateRange] = useState(false);
  const [selectColumnPanel, setSelectColumnPanel] = useState(false);
  const [perPage, setPerPage] = useState(null);
  const [reactTableSorting, setReactTableSort] = useState([]);
  const [tableMeta, setTableMeta] = useState(null);
  const [manualPagination, setManualPagination] = useState(false);
  const [apiErrorState, setApiError] = useState(apiError || false);
  const [chartData, setChartData] = useState(null);

  const setDisableDownloadButton = useSetRecoilState(disableDownloadButtonState);

  const applyApiFilter = () => selectedTable?.apiFilter?.displayDefaultData || (userFilterSelection !== null && userFilterSelection?.value !== null);

  const getDepaginatedData = async () => {
    if (!selectedTable?.apiFilter || (selectedTable.apiFilter && applyApiFilter())) {
      let from = formatDateForApi(dateRange.from);
      let to = formatDateForApi(dateRange.to);

      // redemption_tables and sb_value are exception scenarios where the date string needs to
      // be YYYY-MM.
      if (selectedTable.endpoint.indexOf('redemption_tables') > -1 || selectedTable.endpoint.indexOf('sb_value') > -1) {
        from = from.substring(0, from.lastIndexOf('-'));
        to = to.substring(0, to.lastIndexOf('-'));
      }

      const dateFilter = buildDateFilter(selectedTable, from, to);
      const sortParam = buildSortParams(selectedTable, selectedPivot);
      const apiFilterParam =
        selectedTable?.apiFilter?.field && userFilterSelection?.value !== null && userFilterSelection?.value !== undefined
          ? `,${selectedTable?.apiFilter?.field}:eq:${userFilterSelection.value}`
          : '';
      let meta;
      return await queryClient
        .ensureQueryData({
          queryKey: ['tableDataMeta', selectedTable, from, to, userFilterSelection],
          queryFn: () => fetchTableMeta(sortParam, selectedTable, apiFilterParam, dateFilter),
        })
        .then(async res => {
          const totalCount = res.meta['total-count'];
          if (!selectedPivot?.pivotValue) {
            meta = res.meta;
            if (totalCount !== 0 && totalCount <= MAX_PAGE_SIZE * 2) {
              const tableData = await queryClient.ensureQueryData({
                queryKey: ['tableData', selectedTable, from, to, userFilterSelection],
                queryFn: () => fetchAllTableData(sortParam, totalCount, selectedTable, apiFilterParam, dateFilter),
              });
              setApiError(false);
              return tableData;
            } else if (totalCount === 0) {
              setIsLoading(false);
              setUserFilterUnmatchedForDateRange(true);
              setManualPagination(false);
              return null;
            }
          }
        })
        .catch(err => {
          if (err.name === 'AbortError') {
            console.info('Action cancelled.');
          } else {
            console.error('API error', err);
            setApiError(err);
            setIsLoading(false);
          }
        })
        .finally(() => {
          if (meta) {
            setTableMeta(meta);
          }
        });
    } else if (selectedTable?.apiFilter && userFilterSelection === null) {
      setIsLoading(false);
    }
  };

  const refreshTable = async () => {
    if (allTablesSelected) return;
    selectedPivot = selectedPivot || {};
    const { columnConfig, width } = setTableConfig(config, selectedTable, selectedPivot, apiData);

    // DetailColumnConfig is used for the TIPS and CPI detail view table
    const { columnConfig: detailColumnConfig } = config.detailView ? setTableConfig(config, config.detailView, selectedPivot, apiData) : {};
    let displayData = apiData ? apiData.data : null;

    if (userFilterSelection?.value && apiData?.data) {
      displayData = apiData.data.filter(rr => rr[selectedTable.userFilter.field] === userFilterSelection.value);
      setUserFilteredData({ ...apiData, data: displayData });
    } else {
      setUserFilteredData(null);
    }

    // Format chart data to match table decimal formatting for currency types
    if (selectedPivot.pivotValue && selectedPivot.pivotView.roundingDenomination && apiData?.data) {
      const copy = JSON.parse(JSON.stringify(apiData.data));
      displayData = copy.map(d => {
        columnConfig.forEach(config => {
          if (d[config.property] && !isNaN(d[config.property]) && config.type.includes('CURRENCY')) {
            const decimalPlaces = parseInt(config.type.split('CURRENCY')[1]);
            const absVal = Math.abs(d[config.property].toString());
            d[config.property] = absVal.toFixed(decimalPlaces);
          }
        });
        return d;
      });
      setChartData({ ...apiData, data: displayData });
    }

    setTableProps({
      dePaginated: selectedTable.isLargeDataset === true ? await getDepaginatedData() : null,
      hasPublishedReports,
      publishedReports,
      rawData: { ...apiData, data: displayData }.data ? { ...apiData, data: displayData } : apiData,
      data: displayData, //null for server-side pagination
      config,
      columnConfig,
      detailColumnConfig,
      width,
      noBorder: true,
      shouldPage: true,
      tableName,
      serverSidePagination,
      selectedTable,
      selectedPivot,
      dateRange,
      apiError: apiErrorState,
      selectColumns: selectedTable.selectColumns ? selectedTable.selectColumns : [], // if selectColumns is not defined in endpointConfig.js, default to allowing all columns be selectable
      hideColumns: selectedTable.hideColumns,
      excludeCols: ['CHART_DATE'],
      aria: { 'aria-labelledby': 'main-data-table-title' },
      customFormatting,
    });
  };

  useMemo(async () => {
    await refreshTable();
  }, [apiData, userFilterSelection, apiError]);

  useMemo(async () => {
    if (serverSidePagination || userFilterSelection) {
      await refreshTable();
    }
  }, [dateRange]);

  useMemo(async () => {
    if (config?.sharedApiFilterOptions && userFilterSelection) {
      await refreshTable();
    }
  }, [selectedTable]);

  const handlePivotConfigUpdated = () => {
    setPivotsUpdated(!pivotsUpdated);
    handleConfigUpdate();
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !legendToggledByUser) {
      setLegend(window.innerWidth > GLOBALS.breakpoints.large);
    }
  }, [window.innerWidth]);

  useEffect(() => {
    const hasPivotOptions = selectedTable.dataDisplays && selectedTable.dataDisplays.length > 1;
    setHasPivotOptions(hasPivotOptions);
    setReactTableSort([]);
    if (!config?.sharedApiFilterOptions) {
      setUserFilterSelection(null);
    }
  }, [selectedTable, allTablesSelected]);

  useEffect(() => {
    if (!allTablesSelected) {
      setDisableDownloadButton(userFilterUnmatchedForDateRange || (apiFilterDefault && !selectedTable?.apiFilter?.displayDefaultData));
    } else {
      setDisableDownloadButton(false);
    }
  }, [userFilterUnmatchedForDateRange, apiFilterDefault]);

  useEffect(() => {
    if (allTablesSelected) {
      setDisableDownloadButton(false);
    }
    if (selectedTable?.apiFilter && !selectedTable.apiFilter?.displayDefaultData && userFilterSelection?.value === null) {
      setApiFilterDefault(true);
      setManualPagination(false);
    }
  }, [userFilterSelection]);

  const legendToggler = e => {
    if (e.key === undefined || e.key === 'Enter') {
      if (legend) {
        Analytics.event({
          category: 'Chart Enabled',
          action: 'Hide Legend Click',
          label: `${config.name}, ${selectedTable.tableName}`,
        });
      }
      e.preventDefault();
      setLegend(!legend);
      setLegendToggledByUser(true);
      setSelectColumnPanel(!selectColumnPanel);
    }
  };

  const pivotToggler = () => {
    if (showPivotBar) {
      Analytics.event({
        category: 'Chart Enabled',
        action: 'Hide Pivot Options Click',
        label: `${config.name}, ${selectedTable.tableName}`,
      });
    }
    setShowPivotBar(!showPivotBar);
  };
  const getDateFieldForChart = () => {
    if (selectedPivot && selectedPivot.pivotView && selectedPivot.pivotView.aggregateOn && selectedPivot.pivotView.aggregateOn.length) {
      return 'CHART_DATE'; // aggregation cases in pivoted data this only for charting calculation
    } else {
      return selectedTable.dateField;
    }
  };
  const dateFieldForChart = getDateFieldForChart();

  useEffect(() => {
    const userFilterUnmatched = determineUserFilterUnmatchedForDateRange(selectedTable, userFilterSelection, userFilteredData);
    setUserFilterUnmatchedForDateRange(userFilterUnmatched);
    setApiFilterDefault(!allTablesSelected && selectedTable?.apiFilter && (userFilterSelection === null || userFilterSelection?.value === null));
    setNoChartMessage(
      SetNoChartMessage(
        selectedTable,
        selectedPivot,
        dateRange,
        allTablesSelected,
        userFilterSelection,
        userFilterUnmatched,
        config?.customNoChartMessage
      )
    );
  }, [selectedTable, selectedPivot, dateRange, allTablesSelected, userFilterSelection, userFilteredData, config?.customNoChartMessage]);

  return (
    <>
      <div>
        <Experimental featureId="chartingConfigurationTool">
          <DynamicConfig
            selectedTable={selectedTable}
            handleIgnorePivots={handleIgnorePivots}
            handlePivotsUpdated={handlePivotConfigUpdated}
            refreshTable={refreshTable}
          />
        </Experimental>
      </div>
      <div data-test-id="table-container" className={sectionBorder}>
        <div className={titleContainer}>
          {dateFieldForChart === 'CHART_DATE' && (
            <div className={noticeContainer}>
              <AggregationNotice />
            </div>
          )}
        </div>
        <div className={tableContainer}>
          {isLoading && <LoadingIndicator loadingClass={loadingIcon} overlayClass={loadingSection} />}
          <ChartTableDisplay
            allTablesSelected={allTablesSelected}
            selectedTable={selectedTable}
            apiFilterDefault={apiFilterDefault}
            emptyData={
              !isLoading &&
              !serverSidePagination &&
              (!apiData || !apiData.data || !apiData.data.length) &&
              (!tableMeta || tableMeta?.count === 0) &&
              !apiError
            }
            table={
              <div className={!allTablesSelected ? tableSection : ''}>
                {(apiData || serverSidePagination || apiError) && tableProps && (
                  <DataPreviewTable
                    selectColumnPanel={selectColumnPanel}
                    setDetailViewState={setDetailViewState}
                    detailViewState={detailViewState}
                    setSummaryValues={setSummaryValues}
                    pivotSelected={selectedPivot}
                    setSelectColumnPanel={setSelectColumnPanel}
                    selectedTable={selectedTable}
                    perPage={perPage}
                    setPerPage={setPerPage}
                    tableColumnSortData={tableColumnSortData}
                    setTableColumnSortData={setTableColumnSortData}
                    resetFilters={resetFilters}
                    setResetFilters={setResetFilters}
                    tableMeta={tableMeta}
                    manualPagination={manualPagination}
                    setManualPagination={setManualPagination}
                    reactTable
                    rawDataTable
                    userFilterSelection={userFilterSelection}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    sorting={reactTableSorting}
                    setSorting={setReactTableSort}
                    allActiveFilters={allActiveFilters}
                    setAllActiveFilters={setAllActiveFilters}
                    disableDateRangeFilter={selectedTable?.apiFilter?.disableDateRangeFilter}
                    datasetName={config.name}
                    hasDownloadTimestamp={config.downloadTimestamp}
                    apiErrorState={apiErrorState}
                  />
                )}
              </div>
            }
            width={width}
          />
        </div>
      </div>
    </>
  );
};

export default DataPreviewSectionContainer;
