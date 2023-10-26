import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTable } from '@fortawesome/free-solid-svg-icons';
import DtgTable from '../../dtg-table/dtg-table';
import ChartTableToggle from '../chart-table-toggle/chart-table-toggle';
import DatasetChart from '../dataset-chart/dataset-chart';
import PivotOptions from './pivot-options/pivot-options';
import PivotToggle from './pivot-toggle/pivot-toggle';
import * as styles from './table-section-container.module.scss';
import { setTableConfig } from './set-table-config';
import { SetNoChartMessage } from './set-no-chart-message';
import AggregationNotice from './aggregation-notice/aggregation-notice';
import GLOBALS from '../../../helpers/constants';
import DynamicConfig from './dynamic-config/dynamicConfig';
import Experimental from '../../experimental/experimental';
import { determineUserFilterUnmatchedForDateRange } from '../../filter-download-container/user-filter/user-filter';
import { apiPrefix, basicFetch, buildSortParams, formatDateForApi, MAX_PAGE_SIZE } from '../../../utils/api-utils';
import { useRecoilState, useRecoilValue } from 'recoil';
import { reactTableDePaginatedDataState, reactTablePageState } from '../../../recoil/reactTableDataState';

const TableSectionContainer = ({
  config,
  dateRange,
  selectedTable,
  apiData,
  apiError,
  userFilterSelection,
  selectedPivot,
  setSelectedPivot,
  serverSidePagination,
  isLoading,
  selectedTab,
  tabChangeHandler,
  handleIgnorePivots,
  ignorePivots,
  allTablesSelected,
  handleConfigUpdate,
  setTableColumnSortData,
  hasPublishedReports,
  publishedReports,
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
  const [selectColumnPanel, setSelectColumnPanel] = useState(false);
  const [perPage, setPerPage] = useState(null);
  const [resetFilters, setResetFilters] = useState(false);
  const [filtersActive, setFiltersActive] = useState(false);
  const pageValue = useRecoilValue(reactTablePageState);
  const [depaginatedDataState, setDepaginatedDataState] = useRecoilState(reactTableDePaginatedDataState);
  const [totalCount, setTotalCount] = useState(0);
  const [incrementValue1, setIncrementValue1] = useState(3);
  const [incrementValue2, setIncrementValue2] = useState(4);

  const getDepaginatedDataIncremental = async () => {
    const from = formatDateForApi(dateRange.from);
    const to = formatDateForApi(dateRange.to);
    const sortParam = buildSortParams(selectedTable, selectedPivot);
    const data = await basicFetch(
      `${apiPrefix}${selectedTable.endpoint}?filter=${selectedTable.dateField}:gte:${from},${selectedTable.dateField}` +
        `:lte:${to}&sort=${sortParam}`
    ).then(async res => {
      const rowCount = res.meta['total-count'];
      if (rowCount > MAX_PAGE_SIZE) {
        return await basicFetch(
          `${apiPrefix}${selectedTable.endpoint}?filter=${selectedTable.dateField}:gte:${from},${selectedTable.dateField}` +
            `:lte:${to}&sort=${sortParam}&page[number]=${incrementValue1}&page[size]=${5000}`
        ).then(async page1res => {
          const page2res = await basicFetch(
            `${apiPrefix}${selectedTable.endpoint}?filter=${selectedTable.dateField}:gte:${from},${selectedTable.dateField}` +
              `:lte:${to}&sort=${sortParam}&page[number]=${incrementValue2}&page[size]=${5000}`
          );
          page1res.data = page1res.data.concat(page2res.data);
          return page1res;
        });
      } else {
        return await basicFetch(
          `${apiPrefix}${selectedTable.endpoint}?filter=${selectedTable.dateField}:gte:${from},${selectedTable.dateField}` +
            `:lte:${to}&sort=${sortParam}&page[size]=${rowCount}`
        );
      }
    });
    return data.data;
  };

  const getDepaginatedDataInitial = async () => {
    const from = formatDateForApi(dateRange.from);
    const to = formatDateForApi(dateRange.to);
    const sortParam = buildSortParams(selectedTable, selectedPivot);

    const data = await basicFetch(
      `${apiPrefix}${selectedTable.endpoint}?filter=${selectedTable.dateField}:gte:${from},${selectedTable.dateField}` +
        `:lte:${to}&sort=${sortParam}`
    ).then(async res => {
      const totalCount = res.meta['total-count'];
      setTotalCount(Number(totalCount));
      if (totalCount > MAX_PAGE_SIZE) {
        return await basicFetch(
          `${apiPrefix}${selectedTable.endpoint}?filter=${selectedTable.dateField}:gte:${from},${selectedTable.dateField}` +
            `:lte:${to}&sort=${sortParam}&page[number]=${1}&page[size]=${5000}`
        ).then(async page1res => {
          const page2res = await basicFetch(
            `${apiPrefix}${selectedTable.endpoint}?filter=${selectedTable.dateField}:gte:${from},${selectedTable.dateField}` +
              `:lte:${to}&sort=${sortParam}&page[number]=${2}&page[size]=${5000}`
          );
          page1res.data = page1res.data.concat(page2res.data);
          return page1res;
        });
      } else {
        return await basicFetch(
          `${apiPrefix}${selectedTable.endpoint}?filter=${selectedTable.dateField}:gte:${from},${selectedTable.dateField}` +
            `:lte:${to}&sort=${sortParam}&page[size]=${totalCount}`
        );
      }
    });
    return data;
  };

  useEffect(async () => {
    setDepaginatedDataState(await getDepaginatedDataInitial());
  }, []);

  const refreshTable = async depageData => {
    if (allTablesSelected) return;
    selectedPivot = selectedPivot || {};
    const { columnConfig, width } = setTableConfig(config, selectedTable, selectedPivot, apiData);

    let displayData = apiData ? apiData.data : null;
    if (userFilterSelection?.value && apiData?.data) {
      displayData = apiData.data.filter(rr => rr[selectedTable.userFilter.field] === userFilterSelection.value);
      setUserFilteredData({ ...apiData, data: displayData });
    } else {
      setUserFilteredData(null);
    }

    setTableProps({
      dePaginated: selectedTable.isLargeDataset === true ? depageData : null,
      hasPublishedReports,
      publishedReports,
      rawData: { ...apiData, data: displayData }.data ? { ...apiData, data: displayData } : apiData,
      data: displayData, //null for server-side pagination
      columnConfig,
      width,
      noBorder: true,
      shouldPage: true,
      tableName,
      serverSidePagination,
      selectedTable,
      selectedPivot,
      dateRange,
      apiError,
      selectColumns: config.selectColumns,
      hideColumns: config.hideColumns,
      excludeCols: ['CHART_DATE'],
      aria: { 'aria-labelledby': 'main-data-table-title' },
    });
  };

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
    // refresh the table anytime apiData or apiError update
    refreshTable();
  }, [apiData, userFilterSelection, apiError]);

  useEffect(() => {
    // only refresh the table on date range changes if server side pagination is in effect
    // this hook is the culprit for the unneeded loading for react table.
    if (serverSidePagination && depaginatedDataState) {
      refreshTable(depaginatedDataState);
    }
    if (userFilterSelection) {
      refreshTable();
    }
  }, [dateRange, depaginatedDataState]);

  useEffect(async () => {
    if (depaginatedDataState) {
      if (pageValue > depaginatedDataState.data.length / 10 - 1 && depaginatedDataState.data.length < totalCount) {
        const appendedData = await getDepaginatedDataIncremental();
        setDepaginatedDataState(prev => ({ ...prev, data: prev.data.concat(appendedData) }));
        setIncrementValue1(prev => prev + 2);
        setIncrementValue2(prev => prev + 2);
      }
    }
  }, [pageValue]);

  useEffect(() => {
    console.log(depaginatedDataState);
  }, [depaginatedDataState]);

  useEffect(() => {
    const hasPivotOptions = selectedTable.dataDisplays && selectedTable.dataDisplays.length > 1;
    setHasPivotOptions(hasPivotOptions);
  }, [selectedTable]);

  const legendToggler = e => {
    if (e.key === undefined || e.key === 'Enter') {
      e.preventDefault();
      setLegend(!legend);
      setLegendToggledByUser(true);
      setSelectColumnPanel(!selectColumnPanel);
    }
  };

  const pivotToggler = () => {
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

    setNoChartMessage(SetNoChartMessage(selectedTable, selectedPivot, dateRange, allTablesSelected, userFilterSelection, userFilterUnmatched));
  }, [selectedTable, selectedPivot, dateRange, allTablesSelected, userFilterSelection, userFilteredData]);

  return (
    <div>
      <div className={styles.titleContainer}>
        <div className={styles.headerWrapper}>
          <FontAwesomeIcon icon={faTable} data-testid="table-icon" size="1x" />
          <h3 className={styles.header} data-testid="tableName" id="main-data-table-title">
            {tableName}
          </h3>
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
          <div className={styles.noticeContainer}>
            <AggregationNotice />
          </div>
        )}
        <div className={styles.barContainer}>
          <div className={`${styles.barExpander} ${showPivotBar ? styles.active : ''}`} data-testid="pivotOptionsDrawer">
            <PivotOptions table={selectedTable} pivotSelection={selectedPivot} setSelectedPivot={setSelectedPivot} pivotsUpdated={pivotsUpdated} />
          </div>
        </div>
      </div>
      <div className={styles.tableContainer}>
        {isLoading && (
          <div data-testid="loadingSection">
            <div className={styles.loadingSection} />
            <div className={styles.loadingIcon}>
              <FontAwesomeIcon data-testid="loadingIcon" icon={faSpinner} spin pulse /> Loading...
            </div>
          </div>
        )}
        {(apiData || serverSidePagination || apiError) && (
          <ChartTableToggle
            legend={legend}
            selectedTab={selectedTab}
            showToggleChart={!noChartMessage}
            showToggleTable={config.selectColumns}
            userFilterUnmatchedForDateRange={userFilterUnmatchedForDateRange}
            onToggleLegend={legendToggler}
            emptyData={!isLoading && !serverSidePagination && (!apiData || !apiData.data || !apiData.data.length) && !apiError}
            unchartable={noChartMessage !== undefined}
            currentTab={selectedTab}
            onTabChange={tabChangeHandler}
            selectedTable={selectedTable}
            setResetFilters={setResetFilters}
            table={
              tableProps ? (
                <DtgTable
                  selectColumnPanel={selectColumnPanel}
                  setSelectColumnPanel={setSelectColumnPanel}
                  tableProps={tableProps}
                  perPage={perPage}
                  setPerPage={setPerPage}
                  setTableColumnSortData={setTableColumnSortData}
                  resetFilters={resetFilters}
                  setResetFilters={setResetFilters}
                  setFiltersActive={setFiltersActive}
                />
              ) : (
                ''
              )
            }
            chart={
              noChartMessage && !ignorePivots ? (
                noChartMessage
              ) : (
                <DatasetChart
                  legend={legend}
                  dateRange={dateRange}
                  data={userFilteredData ? userFilteredData : apiData}
                  slug={config.slug}
                  currentTable={selectedTable}
                  dateField={dateFieldForChart}
                  isVisible={selectedTab === 1}
                  selectedPivot={selectedPivot}
                />
              )
            }
            allTablesSelected={allTablesSelected}
            filtersActive={filtersActive}
          />
        )}
      </div>
    </div>
  );
};

export default TableSectionContainer;
