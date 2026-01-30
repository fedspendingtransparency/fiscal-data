import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faTable } from '@fortawesome/free-solid-svg-icons';
import DtgTable from '../../dtg-table/dtg-table';
import ChartTableToggle from '../chart-table-toggle/chart-table-toggle';
import DatasetChart from '../dataset-chart/dataset-chart';
import PivotOptions from './pivot-options/pivot-options';
import PivotToggle from './pivot-toggle/pivot-toggle';
import { setTableConfig } from './set-table-config';
import { SetNoChartMessage } from './set-no-chart-message';
import AggregationNotice from './aggregation-notice/aggregation-notice';
import GLOBALS from '../../../helpers/constants';
import DynamicConfig from './dynamic-config/dynamicConfig';
import Experimental from '../../experimental/experimental';
import { determineUserFilterUnmatchedForDateRange } from '../../filter-download-container/user-filter/user-filter';
import { buildDateFilter, buildSortParams, fetchAllTableData, fetchTableMeta, formatDateForApi, MAX_PAGE_SIZE } from '../../../utils/api-utils';
import {
  active,
  barContainer,
  barExpander,
  detailViewBack,
  detailViewButton,
  detailViewIcon,
  header,
  headerWrapper,
  loadingIcon,
  loadingSection,
  noticeContainer,
  sectionBorder,
  tableContainer,
  tableSection,
  titleContainer,
} from './table-section-container.module.scss';
import SummaryTable from './summary-table/summary-table';
import { useSetRecoilState } from 'recoil';
import { disableDownloadButtonState } from '../../../recoil/disableDownloadButtonState';
import { queryClient } from '../../../../react-query-client';
import Analytics from '../../../utils/analytics/analytics';
import LoadingIndicator from '../../loading-indicator/loading-indicator';
import dayjs from 'dayjs';

const TableSectionContainer = ({
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
  selectedTab,
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
}) => {
  const tableName = selectedTable.tableName;
  const [showPivotBar, setShowPivotBar] = useState(true);
  const [tableProps, setTableProps] = useState();
  const [legend, setLegend] = useState(window.innerWidth > GLOBALS.breakpoints.large);
  const [legendToggledByUser, setLegendToggledByUser] = useState(false);
  const [pivotsUpdated, setPivotsUpdated] = useState(false);
  const [hasPivotOptions, setHasPivotOptions] = useState(false);
  const [userFilteredData, setUserFilteredData] = useState(null);
  const [noChartMessage, setNoChartMessage] = useState(null);
  const [userFilterUnmatchedForDateRange, setUserFilterUnmatchedForDateRange] = useState(false);
  const [apiFilterDefault, setApiFilterDefault] = useState(!!selectedTable?.apiFilter);
  const [selectColumnPanel, setSelectColumnPanel] = useState(false);
  const [perPage, setPerPage] = useState(null);
  const [reactTableSorting, setReactTableSort] = useState([]);
  const [tableMeta, setTableMeta] = useState(null);
  const [manualPagination, setManualPagination] = useState(false);
  const [apiErrorState, setApiError] = useState(apiError || false);
  const [chartData, setChartData] = useState(null);

  const setDisableDownloadButton = useSetRecoilState(disableDownloadButtonState);
  const formatDate = detailDate => {
    const fieldType = selectedTable.fields.find(field => field.columnName === config.detailView?.field)?.dataType;
    const customFormat = selectedTable?.customFormatting?.find(config => config.type === 'DATE');
    return customFormat?.dateFormat && fieldType === 'DATE' ? dayjs(detailDate).format(customFormat.dateFormat) : detailDate;
  };

  const formattedDetailViewState = formatDate(detailViewState?.value);

  const applyApiFilter = () => selectedTable?.apiFilter?.displayDefaultData || (userFilterSelection !== null && userFilterSelection?.value !== null);
  console.log('apiFilter: ', applyApiFilter());

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
              try {
                return await queryClient.ensureQueryData({
                  queryKey: ['tableData', selectedTable, from, to, userFilterSelection],
                  queryFn: () => fetchAllTableData(sortParam, totalCount, selectedTable, apiFilterParam, dateFilter),
                });
              } catch (error) {
                console.warn(error);
              }
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
          }
        })
        .finally(() => {
          if (meta) {
            setTableMeta(meta);
            setApiError(false);
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
      <div data-testid="table-container" className={sectionBorder}>
        <div className={titleContainer}>
          <div className={headerWrapper}>
            {!!detailViewState && selectedTab === 0 && (
              <button className={detailViewButton} onClick={() => setDetailViewState(null)} data-testid="detailViewCloseButton">
                <FontAwesomeIcon className={detailViewIcon} icon={faArrowLeftLong} data-testid="arrow-icon" size="1x" />
                <span className={detailViewBack} data-testid="backButton">
                  Back
                </span>
              </button>
            )}
            <FontAwesomeIcon icon={faTable} data-testid="table-icon" size="1x" />
            {!!detailViewState ? (
              <h3 className={header} data-testid="tableName" id="main-data-table-title">
                {`${tableName} > ${formattedDetailViewState}`}
              </h3>
            ) : (
              <h3 className={header} data-testid="tableName" id="main-data-table-title">
                {tableName}
              </h3>
            )}
            {!!hasPivotOptions && <PivotToggle clickHandler={pivotToggler} open={showPivotBar} />}
            <Experimental featureId="chartingConfigurationTool">
              <DynamicConfig
                selectedTable={selectedTable}
                handleIgnorePivots={handleIgnorePivots}
                handlePivotsUpdated={handlePivotConfigUpdated}
                refreshTable={refreshTable}
              />
            </Experimental>
          </div>
          {dateFieldForChart === 'CHART_DATE' && (
            <div className={noticeContainer}>
              <AggregationNotice />
            </div>
          )}
          <div className={barContainer}>
            <div className={`${barExpander} ${showPivotBar ? active : ''}`} data-testid="pivotOptionsDrawer">
              <PivotOptions
                datasetName={config?.name}
                table={selectedTable}
                pivotSelection={selectedPivot}
                setSelectedPivot={setSelectedPivot}
                pivotsUpdated={pivotsUpdated}
              />
            </div>
          </div>
        </div>
        <div className={tableContainer}>
          {isLoading && <LoadingIndicator loadingClass={loadingIcon} overlayClass={loadingSection} />}
          {!!detailViewState && (
            <SummaryTable
              summaryTable={config?.detailView?.summaryTableFields}
              summaryValues={summaryValues}
              columnConfig={tableProps?.columnConfig}
              customFormatConfig={selectedTable?.customFormatting}
            />
          )}
          <div className={selectedTab === 0 && !allTablesSelected ? tableSection : ''}>
            {(apiData || serverSidePagination || apiError) && (
              <ChartTableToggle
                legend={legend}
                selectedTab={selectedTab}
                showToggleChart={!noChartMessage}
                showToggleTable={tableProps?.selectColumns}
                userFilterUnmatchedForDateRange={userFilterUnmatchedForDateRange}
                apiFilterDefault={apiFilterDefault && !selectedTable?.apiFilter?.displayDefaultData}
                onToggleLegend={legendToggler}
                emptyData={
                  !isLoading && !serverSidePagination && !userFilterSelection && (!apiData || !apiData.data || !apiData.data.length) && !apiError
                }
                unchartable={noChartMessage !== undefined}
                currentTab={selectedTab}
                datasetName={config?.name}
                onTabChange={tabChangeHandler}
                selectedTable={selectedTable}
                setResetFilters={setResetFilters}
                textFilteringDisabled={manualPagination}
                pivotSelected={selectedPivot}
                table={
                  tableProps ? (
                    <DtgTable
                      selectColumnPanel={selectColumnPanel}
                      setDetailViewState={setDetailViewState}
                      detailViewState={detailViewState}
                      setSummaryValues={setSummaryValues}
                      pivotSelected={selectedPivot}
                      setSelectColumnPanel={setSelectColumnPanel}
                      tableProps={tableProps}
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
                      datasetName={config.name}
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
                      hasDownloadTimestamp={config.downloadTimestamp}
                    />
                  ) : (
                    ''
                  )
                }
                chart={() => {
                  const generatedMessage = SetNoChartMessage(
                    selectedTable,
                    selectedPivot,
                    dateRange,
                    allTablesSelected,
                    userFilterSelection,
                    determineUserFilterUnmatchedForDateRange(selectedTable, userFilterSelection, userFilteredData),
                    config?.customNoChartMessage,
                    apiData?.data?.length === 0
                  );
                  if (generatedMessage && !ignorePivots) {
                    return generatedMessage;
                  } else {
                    return (
                      <DatasetChart
                        legend={legend}
                        dateRange={dateRange}
                        data={userFilteredData ? userFilteredData : chartData ? chartData : apiData}
                        slug={config.slug}
                        currentTable={selectedTable}
                        dateField={dateFieldForChart}
                        isVisible={selectedTab === 1}
                        selectedPivot={selectedPivot}
                      />
                    );
                  }
                }}
                allTablesSelected={allTablesSelected}
                filtersActive={allActiveFilters?.length > 0}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TableSectionContainer;
