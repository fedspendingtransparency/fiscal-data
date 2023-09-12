import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import DtgTableHeading from './dtg-table-heading/dtg-table-heading';
import DtgTableRow from './dtg-table-row/dtg-table-row';
import { loadingTimeout, netLoadingDelay, setColumns } from './dtg-table-helper';
import PaginationControls, { defaultPerPageOptions } from '../pagination/pagination-controls';
import { pagedDatatableRequest, formatDateForApi } from '../../utils/api-utils';
import NotShownMessage from '../dataset-data/table-section-container/not-shown-message/not-shown-message';

import * as styles from './dtg-table.module.scss';
import CustomLink from '../links/custom-link/custom-link';
import Experimental from '../experimental/experimental';
import DtgTableColumnSelector from './dtg-table-column-selector';
import DataTable from '../data-table/data-table';

const defaultRowsPerPage = 5;
const selectColumnRowsPerPage = 10;

export default function DtgTable({
  tableProps,
  perPage,
  setPerPage,
  selectColumnPanel,
  setSelectColumnPanel,
  setTableColumnSortData,
  resetFilters,
  setResetFilters,
  setFiltersActive,
}) {
  const {
    dePaginated,
    rawData,
    width,
    noBorder,
    tableName,
    shouldPage,
    excludeCols,
    selectedTable,
    selectedPivot,
    dateRange,
    columnConfig,
    caption,
    selectColumns,
    hasPublishedReports,
    publishedReports,
  } = tableProps;

  const [reactTableData, setReactTableData] = useState(null);

  useEffect(() => {
    if (tableProps) {
      if (dePaginated !== undefined) {
        if (dePaginated !== null) {
          if (reactTableData === null) {
            setReactTableData(dePaginated);
          }
        } else {
          if (rawData !== null) {
            if (reactTableData === null) {
              setReactTableData(rawData);
            }
          }
        }
      }
    }
  }, [tableProps]);

  const data = tableProps.data !== undefined && tableProps.data !== null ? tableProps.data : [];
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(
    perPage ? perPage : selectColumns ? selectColumnRowsPerPage : !shouldPage && data.length > defaultRowsPerPage ? data.length : defaultRowsPerPage
  );
  const [tableData, setTableData] = useState(!shouldPage ? data : []);
  const [apiError, setApiError] = useState(tableProps.apiError || false);
  const [maxPage, setMaxPage] = useState(1);
  const [maxRows, setMaxRows] = useState(data.length > 0 ? data.length : 1);
  const [rowsShowing, setRowsShowing] = useState({ begin: 1, end: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [emptyDataMessage, setEmptyDataMessage] = useState();
  const [showPaginationControls, setShowPaginationControls] = useState();
  const [columnSelectValues, setColumnSelectValues] = useState([]);
  const [activeColumns, setActiveColumns] = useState([]);
  const [isReset, setIsReset] = useState(false);
  const [selectColumnsTableWidth, setSelectColumnsTableWidth] = useState(width ? (isNaN(width) ? width : `${width}px`) : 'auto');

  let loadCanceled = false;

  let debounce;
  let loadTimer;

  const rowText = ['rows', 'rows'];

  const tableWidth = width ? (isNaN(width) ? width : `${width}px`) : 'auto';
  const dataProperties = {
    keys: tableData[0] ? Object.keys(tableData[0]) : [],
    excluded: excludeCols !== undefined ? excludeCols : [],
  };
  const columns = setColumns(dataProperties, columnConfig);

  const changeTableWidth = col => {
    if (selectColumns) {
      const colCount = col ? col.length : 0;
      const curWidth = colCount > 5 ? colCount * 200 : '100%';
      setSelectColumnsTableWidth(curWidth ? (isNaN(curWidth) ? curWidth : `${curWidth}px`) : 'auto');
      setActiveColumns(col);
    }
  };

  const handlePerPageChange = numRows => {
    const numItems = numRows >= maxRows ? maxRows : numRows;
    setItemsPerPage(numItems);
    setRowsShowing({
      begin: 1,
      end: numItems,
    });
    setCurrentPage(1);
    if (setPerPage) {
      setPerPage(numRows);
    }
  };

  const getPagedData = resetPage => {
    if (debounce || loadCanceled) {
      clearTimeout(debounce);
    }
    if (!loadCanceled) {
      debounce = setTimeout(() => {
        makePagedRequest(resetPage);
      }, 400);
    }
  };

  const makePagedRequest = async resetPage => {
    if (selectedTable && selectedTable.endpoint && !loadCanceled) {
      loadTimer = setTimeout(() => loadingTimeout(loadCanceled, setIsLoading), netLoadingDelay);

      const from = formatDateForApi(dateRange.from);
      const to = formatDateForApi(dateRange.to);
      const startPage = resetPage ? 1 : currentPage;

      pagedDatatableRequest(selectedTable, from, to, selectedPivot, startPage, itemsPerPage)
        .then(res => {
          if (!loadCanceled) {
            setEmptyDataMessage(null);
            if (res.data.length < 1) {
              setIsLoading(false);
              clearTimeout(loadTimer);
              setEmptyDataMessage(
                <NotShownMessage
                  heading="Change selections in order to preview data"
                  bodyText={`With the current Date Range selected we are unable to render a
                    preview at this time.`}
                />
              );
            }

            const totalCount = res.meta['total-count'];
            const start = startPage === 1 ? 0 : (startPage - 1) * itemsPerPage;
            const rowsToShow = start + itemsPerPage;
            const stop = rowsToShow > totalCount ? totalCount : rowsToShow;
            setRowsShowing({
              begin: start + 1,
              end: stop,
            });
            setMaxPage(res.meta['total-pages']);
            if (maxRows !== totalCount) setMaxRows(totalCount);
            setTableData(res.data);
          }
        })
        .catch(err => {
          if (startPage === 1) {
            setRowsShowing({ begin: 0, end: 0 });
            setMaxRows(0);
          }
          console.error(err);
          if (!loadCanceled) {
            setApiError(err);
          }
        })
        .finally(() => {
          if (!loadCanceled) {
            setIsLoading(false);
            clearTimeout(loadTimer);
          }
        });
    }
  };

  const getCurrentData = () => {
    if (tableProps.apiError && currentPage === 1) {
      setRowsShowing({ begin: 0, end: 0 });
      setMaxRows(0);
    } else {
      const start = currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage;
      const rowsToShow = start + itemsPerPage;
      const stop = rowsToShow > data.length ? data.length : rowsToShow;
      setRowsShowing({ begin: start + 1, end: stop });
      setMaxPage(Math.ceil(data.length / itemsPerPage));
      setTableData(data.slice(start, stop));
    }
  };

  const handleJump = page => {
    const pageNum = Math.max(1, page);
    setCurrentPage(Math.min(pageNum, maxPage));
  };

  const populateRows = currentColumns => {
    const tableRows = [];
    tableData.forEach((row, index) => {
      tableRows.push(<DtgTableRow columns={currentColumns} data={row} key={index} />);
    });
    setRows(tableRows);
  };

  const isPaginationControlNeeded = () => currentPage > 1 || (!apiError && !tableProps.apiError && maxRows > defaultPerPageOptions[0]);

  const updateSmallFractionDataType = () => {
    //Overwrite type for special case number format handling
    if (selectedTable && selectedTable.apiId === 178) {
      selectedTable.fields[2].dataType = 'SMALL_FRACTION';
    }
  };

  const setDefaultColumnsToSelect = () => {
    const selectColArray = [];
    const activeColArray = [];

    setIsReset(true);

    columns.forEach(col => {
      const colDefault = selectColumns ? selectColumns.includes(col.property) : false;
      const selectCol = Object.assign({ label: col.name }, { field: col.property }, { active: colDefault }, { default: colDefault });
      if (colDefault === true) {
        activeColArray.push(col);
      }

      selectColArray.push(selectCol);
    });

    setColumnSelectValues(selectColArray);
    populateRows(activeColArray);
    changeTableWidth(activeColArray);
  };

  const columnSelectChangeHandler = update => {
    const selectColArray = [];
    const activeColArray = [];

    setIsReset(false);

    columnSelectValues.forEach(col => {
      const currentCol = col;
      if (update.find(updatedCol => updatedCol.field === col.field)) {
        activeColArray.push(columns.find(column => column.property === col.field));
        currentCol.active = true;
      } else {
        currentCol.active = false;
      }

      selectColArray.push(currentCol);
    });

    setColumnSelectValues(selectColArray);
    populateRows(activeColArray);
    changeTableWidth(activeColArray);
  };

  useEffect(() => {
    updateSmallFractionDataType();
    setCurrentPage(1);
    setApiError(false);

    const ssp = tableProps.serverSidePagination;
    ssp !== undefined && ssp !== null ? getPagedData(true) : getCurrentData();
    return () => {
      loadCanceled = true;
    };
  }, [selectedTable, dateRange]);

  useEffect(() => {
    setApiError(false);
    const ssp = tableProps.serverSidePagination;
    ssp !== undefined && ssp !== null ? getPagedData(false) : getCurrentData();
    return () => {
      loadCanceled = true;
    };
  }, [tableProps.data, tableProps.serverSidePagination, itemsPerPage, currentPage]);

  useEffect(() => {
    if (selectColumns && activeColumns) {
      populateRows(activeColumns);
    } else {
      populateRows(columns);
    }
  }, [tableData]);

  useEffect(() => {
    if (data && data.length) {
      setMaxRows(apiError ? 0 : data.length);
    }
  }, [data]);

  useEffect(() => {
    if (!tableProps.data) {
      setCurrentPage(1);
    }
    setDefaultColumnsToSelect();
  }, [tableProps.data]);

  useEffect(() => {
    setShowPaginationControls(isPaginationControlNeeded());
  }, [maxRows]);

  if (maxRows === 1) {
    rowText[0] = '';
    rowText[1] = 'row';
  }
  const pagingProps = {
    itemsPerPage,
    handlePerPageChange,
    handleJump,
    maxPage,
    tableName,
    currentPage,
    maxRows,
  };

  return (
    <div className={styles.overlayContainer}>
      {/* Loading Indicator */}
      {isLoading && (
        <>
          <div data-test-id="loading-overlay" className={styles.overlay} />
          <div className={styles.loadingIcon}>
            <FontAwesomeIcon data-test-id="loading-icon" icon={faSpinner} spin pulse /> Loading...
          </div>
        </>
      )}
      <Experimental exclude featureId="react-table-poc">
        <div data-test-id="table-content" className={styles.overlayContainerNoFooter}>
          {/* API Error Message */}
          {(apiError || tableProps.apiError) && !emptyDataMessage && (
            <>
              <div data-test-id="error-overlay" className={styles.overlay} />
              <div data-test-id="api-error" className={styles.apiError}>
                <p>
                  <strong>Table failed to load.</strong>
                </p>
                <p>
                  There was an error with our API and we are unable to load this table. Please try your request again or{' '}
                  <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov?subject=Contact Us">contact us</CustomLink> for assistance.
                </p>
              </div>
            </>
          )}

          <div className={styles.selectColumnsWrapper}>
            {/* Table Wrapper */}
            <div className={noBorder ? [styles.wrapper, styles.noBorder].join(' ') : styles.wrapper}>
              {/* Empty Data Message */}
              {emptyDataMessage && emptyDataMessage}

              {/* Table */}
              {!emptyDataMessage && !selectColumns ? (
                <table {...tableProps.aria} style={{ width: tableWidth }}>
                  {caption !== undefined && <caption className="sr-only">{caption}</caption>}
                  <DtgTableHeading columns={columns} />
                  <tbody>{rows}</tbody>
                </table>
              ) : (
                <table {...tableProps.aria} style={{ width: selectColumnsTableWidth }}>
                  {caption !== undefined && <caption className="sr-only">{caption}</caption>}
                  <DtgTableHeading columns={activeColumns} />
                  <tbody>{rows}</tbody>
                </table>
              )}
            </div>

            <div
              data-testid="selectColumnsMainContainer"
              className={selectColumnPanel ? styles.selectColumnPanelActive : styles.selectColumnPanel}
              style={{ height: `${itemsPerPage * 41 + 48.4}px` }}
            >
              {selectColumns && (
                <DtgTableColumnSelector
                  isVisible={true}
                  fields={columnSelectValues}
                  changeHandler={update => columnSelectChangeHandler(update)}
                  resetToDefault={setDefaultColumnsToSelect}
                  setSelectColumnPanel={setSelectColumnPanel}
                  isReset={isReset}
                />
              )}
            </div>
          </div>
        </div>
        {/* Table Footer */}
        {shouldPage && (
          <div data-test-id="table-footer" className={styles.tableFooter}>
            <div data-test-id="rows-showing" className={styles.rowsShowing}>
              {`Showing ${rowsShowing.begin} - ${rowsShowing.end} ${rowText[0]} of ${maxRows} ${rowText[1]}`}
            </div>
            {showPaginationControls && <PaginationControls pagingProps={pagingProps} />}
          </div>
        )}
      </Experimental>
      <Experimental featureId="react-table-poc">
        {reactTableData && (
          <DataTable
            rawData={reactTableData}
            defaultSelectedColumns={selectColumns}
            setTableColumnSortData={setTableColumnSortData}
            hideCellLinks={true}
            shouldPage={shouldPage}
            pagingProps={pagingProps}
            showPaginationControls={showPaginationControls}
            hasPublishedReports={hasPublishedReports}
            publishedReports={publishedReports}
            setSelectColumnPanel={setSelectColumnPanel}
            selectColumnPanel={selectColumnPanel}
            resetFilters={resetFilters}
            setResetFilters={setResetFilters}
            pageSize={10}
            setFiltersActive={setFiltersActive}
          />
        )}
      </Experimental>
    </div>
  );
}

DtgTable.propTypes = {
  tableProps: PropTypes.shape({}),
};

DtgTable.defaultProps = {
  tableProps: {
    columnConfig: {
      property: '',
      name: '',
      type: '',
    },
  },
};
