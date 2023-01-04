import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable, faSpinner } from "@fortawesome/free-solid-svg-icons";
import DtgTable from "../../dtg-table/dtg-table";
import ChartTableToggle from '../chart-table-toggle/chart-table-toggle';
import DatasetChart from '../dataset-chart/dataset-chart';
import PivotOptions from './pivot-options/pivot-options';
import PivotToggle from './pivot-toggle/pivot-toggle';
import * as styles from './table-section-container.module.scss';
import { setTableConfig } from './set-table-config';
import { useEffect } from 'react';
import { SetNoChartMessage } from './set-no-chart-message';
import AggregationNotice from './aggregation-notice/aggregation-notice';
import GLOBALS from '../../../helpers/constants';
import DynamicConfig from "./dynamic-config/dynamicConfig";
import Experimental from "../../experimental/experimental";

const TableSectionContainer = ({
  config,
  dateRange,
  selectedTable,
  apiData,
  apiError,
  perPage,
  selectedPivot,
  setPerPage,
  setSelectedPivot,
  serverSidePagination,
  isLoading,
  selectedTab,
  tabChangeHandler,
  handleIgnorePivots,
  ignorePivots,
  allTablesSelected,
  handleConfigUpdate
}) => {
  const tableName = selectedTable.tableName;
  const [showPivotBar, setShowPivotBar] = useState(true);
  const [tableProps, setTableProps] = useState();
  const [legend, setLegend] = useState(window.innerWidth > GLOBALS.breakpoints.large);
  const [legendToggledByUser, setLegendToggledByUser] = useState(false);
  const [pivotsUpdated, setPivotsUpdated] = useState(false);
  const [hasPivotOptions, setHasPivotOptions] = useState(false);

  const refreshTable = () => {
    if (allTablesSelected) return;
    selectedPivot = selectedPivot || {};
    const { columnConfig, width } = setTableConfig(config, selectedTable, selectedPivot, apiData);

    setTableProps({
      data: apiData ? apiData.data : null, //null for server-side pagination
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
      excludeCols: ['CHART_DATE'],
      aria: {"aria-labelledby": "main-data-table-title"}
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
  }, [apiData, apiError]);

  useEffect(() => {
    // only refresh the table on date range changes if server side pagination is in effect
    if (serverSidePagination) {
      refreshTable();
    }
  }, [dateRange]);

  useEffect(() => {
    const hasPivotOptions = selectedTable.dataDisplays && selectedTable.dataDisplays.length > 1;
    setHasPivotOptions(hasPivotOptions);
  }, [selectedTable]);

  const legendToggler = (e) => {
    if (e.key === undefined || e.key === 'Enter') {
      e.preventDefault();
      setLegend(!legend);
      setLegendToggledByUser(true);
    }
  };

  const pivotToggler = () => {
    setShowPivotBar(!showPivotBar);
  };

  const getDateFieldForChart = () => {
    if (selectedPivot && selectedPivot.pivotView &&
      selectedPivot.pivotView.aggregateOn && selectedPivot.pivotView.aggregateOn.length) {
      return 'CHART_DATE'; // aggregation cases in pivoted data this only for charting calculation
    } else {
      return selectedTable.dateField;
    }
  };

  const dateFieldForChart = getDateFieldForChart();
  const noChartMessage = SetNoChartMessage(
    selectedTable,
    selectedPivot,
    dateRange,
    allTablesSelected
  );

  return (
    <div>
      <div className={styles.titleContainer}>
        <div className={styles.headerWrapper}>
          <FontAwesomeIcon icon={faTable} data-testid='table-icon' size='1x' />
          <h3 className={styles.header} data-testid='tableName' id='main-data-table-title'>
            {tableName}
          </h3>
          {!!hasPivotOptions &&
            <PivotToggle clickHandler={pivotToggler} open={showPivotBar} />
          }
          <Experimental featureId='chartingConfigurationTool'>
            <DynamicConfig
              selectedTable={selectedTable}
              handleIgnorePivots={handleIgnorePivots}
              handlePivotsUpdated={handlePivotConfigUpdated}
              refreshTable={refreshTable}
            />
          </Experimental>
        </div>
          {dateFieldForChart === 'CHART_DATE' && (
            <div className={styles.noticeContainer}><AggregationNotice /></div>
          )}
          <div className={styles.barContainer}>
            <div
              className={`${styles.barExpander} ${showPivotBar ? styles.active : ''}`}
              data-testid='pivotOptionsDrawer'
            >
              <PivotOptions table={selectedTable}
                            pivotSelection={selectedPivot}
                            setSelectedPivot={setSelectedPivot}
                            pivotsUpdated={pivotsUpdated}
              />
            </div>
          </div>
      </div>
      <div className={styles.tableContainer}>
        {(isLoading) &&
          <div data-testid='loadingSection'>
            <div className={styles.loadingSection} />
            <div className={styles.loadingIcon}>
              <FontAwesomeIcon data-testid='loadingIcon' icon={faSpinner} spin pulse /> Loading...
            </div>
          </div>
        }
        {(apiData || serverSidePagination || apiError) &&
          <ChartTableToggle
            legend={legend}
            selectedTab={selectedTab}
            showToggle={!noChartMessage}
            onToggleLegend={legendToggler}
            emptyData={
              !isLoading
              && !serverSidePagination
              && (!apiData || !apiData.data || !apiData.data.length)
              && !apiError
            }
            unchartable={noChartMessage !== undefined}
            currentTab={selectedTab}
            onTabChange={tabChangeHandler}
            table={
              tableProps ?
                <DtgTable
                  tableProps={tableProps}
                  perPage={perPage}
                  setPerPage={setPerPage}
                /> :
                ''
            }
            chart={
              (noChartMessage && !ignorePivots) ?
                noChartMessage :
                <DatasetChart
                  legend={legend}
                  dateRange={dateRange}
                  data={apiData}
                  slug={config.slug}
                  currentTable={selectedTable}
                  dateField={dateFieldForChart}
                  isVisible={(selectedTab === 1)}
                  selectedPivot={selectedPivot}
                />
            }
            allTablesSelected={allTablesSelected}
          />
        }
      </div>
    </div>
  )
};

export default TableSectionContainer;
