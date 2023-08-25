import React, { useState, useEffect } from 'react';
import { withWindowSize } from 'react-fns';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import FilterAndDownload from '../filter-download-container/filter-download-container';
import DataTableSelect from "../datatable-select/datatable-select";
import RangePresets from '../filter-download-container/range-presets/range-presets';
import TableSectionContainer from './table-section-container/table-section-container';
import ReportDataToggle from './report-data-toggle/report-data-toggle';
import PublishedReports from '../published-reports/published-reports';
import {
  matchTableFromApiTables,
  parseTableSelectionFromUrl,
  rewriteUrl
} from './dataset-data-helper/dataset-data-helper';
import { getPublishedDates } from '../../helpers/dataset-detail/report-helpers';
import { getApiData } from './dataset-data-api-helper/dataset-data-api-helper';
import { TableCache } from './table-cache/table-cache';
import { isValidDateRange } from '../../helpers/dates/date-helpers';
import Analytics from '../../utils/analytics/analytics';
import { breakpointSm } from '../../variables.module.scss';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';

export const desktopTitle = 'Preview & Download';
export const tabletMobileTitle = 'Preview';

export const DatasetDataComponent = ({
  config,
  finalDatesNotFound,
  location,
  publishedReportsProp,
  setSelectedTableProp,
  width
}) => {
  const title = width >= pxToNumber(breakpointSm) ? desktopTitle : tabletMobileTitle;
  // config.apis should always be available; but, fallback in case
  const apis = config ? config.apis : [null];

  const [isFiltered, setIsFiltered] = useState(true);
  const [selectedTable, setSelectedTable] = useState();
  const [allTablesSelected, setAllTablesSelected] = useState(false);
  const [dateRange, setDateRange] = useState();
  const [isCustomDateRange, setIsCustomDateRange] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [serverSidePagination, setServerSidePagination] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const [publishedReports, setPublishedReports] = useState([]);
  const [selectedPivot, setSelectedPivot] = useState();
  const [initReports, setInitReports] = useState(null);
  const [perPage, setPerPage] = useState(null);
  const [ignorePivots, setIgnorePivots] = useState(false);
  const [configUpdated, setConfigUpdated] = useState(false);
  const [userFilterSelection, setUserFilterSelection] = useState(null);
  const [tableColumnSortData, setTableColumnSortData] = useState([]);
  const [tableCaches] = useState({});

  let loadByPage;

  const shouldUseLoadByPage = (pivot) => {
    return selectedTable && selectedTable.isLargeDataset && pivot &&
      pivot.pivotView &&
      pivot.pivotView.chartType === 'none';
  };

  const clearDisplayData = () => {
    loadByPage = shouldUseLoadByPage(selectedPivot);

    if (loadByPage) {
      setServerSidePagination(selectedTable.endpoint);
    } else {
      setServerSidePagination(null);
    }
    setIsLoading(false);
    setApiData(null);
    setApiError(false);
  };

  const updateDataDisplay = (data) => {
    clearDisplayData();
    setTimeout(() => setApiData(data)); // then on the next tick, setup the new data
  };

  const handleSelectedTableChange = (table) => {
    if (table.allDataTables) {
      setAllTablesSelected(true);
    } else {
      setAllTablesSelected(false);
      setSelectedTable(table);
    }

    Analytics.event({
      category: 'Data Table Selector',
      action: 'Pick Table Click',
      label: table.tableName
    });
  };

  const handleDateRangeChange = (range) => {
    if (range && isValidDateRange(
      range.from,
      range.to,
      config.techSpecs.earliestDate,
      config.techSpecs.latestDate
    )) {
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
    const idealSelectedTable =
      matchTableFromApiTables(selectedTable, apis)
      || parseTableSelectionFromUrl(location, apis);
    if(idealSelectedTable && idealSelectedTable.tableName){
      setSelectedTable(idealSelectedTable);
    }
  }, [apis]);

  // while published Reports metadata is loaded at page load, don't initialize
  // the published report component with data until the user first selects that tab,
  // to prevent unnecessary loading of report previews
  useEffect(() => {
    // assign value to initReports only the first time the published reports tab is selected
    if (activeTab === 2 && !initReports) {
      setInitReports(publishedReports);
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedTable) {
      setDateRange(null);
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

  // When dateRange changes, fetch new data
  useEffect(() => {
    if (!finalDatesNotFound && selectedTable && (selectedPivot || ignorePivots) &&
      dateRange && !allTablesSelected) {
      const cache = tableCaches[selectedTable.apiId];
      const cachedDisplay = cache.getCachedDataDisplay(dateRange, selectedPivot, selectedTable);
      if (cachedDisplay) {
        updateDataDisplay(cachedDisplay);
      } else {
        clearDisplayData();
        let canceledObj = { isCanceled: false, abortController: new AbortController() };

        if (!loadByPage || ignorePivots) {
          getApiData(dateRange, selectedTable, selectedPivot, setIsLoading, setApiData, setApiError,
            canceledObj, tableCaches[selectedTable.apiId]).then(() => {
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

  return (
    <DatasetSectionContainer id="preview-and-download" title={title}>
      <ReportDataToggle onChange={setActiveTab} reports={publishedReports} />
      <div className={activeTab === 1 ? '' : 'hidden'}>
        {
          tableColumnSortData &&
          <FilterAndDownload
            data-testid="filterAndDownload"
            dateRange={dateRange}
            isFiltered={isFiltered}
            selectedTable={selectedTable}
            dataset={config}
            allTablesSelected={allTablesSelected}
            isCustomDateRange={isCustomDateRange}
            selectedUserFilter={userFilterSelection}
            tableColumnSortData={tableColumnSortData}
          >
            <DataTableSelect
              apis={apis}
              selectedTable={selectedTable}
              setSelectedTable={handleSelectedTableChange}
              allTablesSelected={allTablesSelected}
              earliestDate={config.techSpecs.earliestDate}
              latestDate={config.techSpecs.latestDate}
            />
            {selectedTable &&
            <RangePresets
              setDateRange={handleDateRangeChange}
              selectedTable={selectedTable}
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
                latestDate: config.techSpecs.latestDate
              }
              }
              finalDatesNotFound={finalDatesNotFound}
            />
            }
          </FilterAndDownload>
        }
        {dateRange &&
        <TableSectionContainer
          config={config}
          dateRange={dateRange}
          selectedTable={selectedTable}
          userFilterSelection={userFilterSelection}
          apiData={apiData}
          isLoading={isLoading}
          apiError={apiError}
          selectedPivot={selectedPivot}
          setSelectedPivot={setSelectedPivot}
          serverSidePagination={serverSidePagination}
          selectedTab={selectedTab}
          tabChangeHandler={setSelectedTab}
          perPage={perPage}
          setPerPage={setPerPage}
          handleIgnorePivots={setIgnorePivots}
          allTablesSelected={allTablesSelected}
          handleConfigUpdate={() => setConfigUpdated(true)}
          setTableColumnSortData={setTableColumnSortData}
          hasPublishedReports={!!publishedReports}
          publishedReports={publishedReports}
        />
        }
      </div>
      <div className={activeTab === 2 ? '' : 'hidden'}>
        {selectedTable && initReports &&
        <PublishedReports reports={publishedReports} dataset={config} />
        }
      </div>
    </DatasetSectionContainer>
  )
}

// Despite the default export below, the bare component is exported separately above so
// that the [location] prop can easily be directly specified in unit test renders without any
// use or mocking of [withWindowSize] - tlp 2021-11-17

export default withWindowSize(DatasetDataComponent);
