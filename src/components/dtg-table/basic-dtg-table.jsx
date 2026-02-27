import React from 'react';
import PropTypes from 'prop-types';
import { overlayContainer, overlayContainerNoFooter } from './dtg-table.module.scss';
import { ErrorBoundary } from 'react-error-boundary';
import DtgTableApiError from './dtg-table-api-error/dtg-table-api-error';
import BasicTable from '../data-table/test/basic-table';

export default function BasicDtgTable({
  tableProps,
  perPage,
  setPerPage,
  resetFilters,
  setResetFilters,
  allowColumnWrap,
  sorting,
  setSorting,
  allActiveFilters,
  setAllActiveFilters,
  enableDownload,
}) {
  return (
    <div className={overlayContainer}>
      {/* Loading Indicator */}
      {/*{!isLoading && !reactTableData && !selectedTable?.apiFilter && <LoadingIndicator loadingClass={loadingIcon} overlayClass={overlay} />}*/}
      {/* Data Dictionary and Dataset Detail tables */}
      {tableProps?.data && (
        <div className={overlayContainerNoFooter}>
          {/* API Error Message */}
          {tableProps.apiError && <DtgTableApiError />}
          <ErrorBoundary FallbackComponent={() => <></>}>
            <BasicTable
              enableDownload={enableDownload}
              resetFilters={resetFilters}
              setResetFilters={setResetFilters}
              allowColumnWrap={allowColumnWrap}
              sorting={sorting}
              setSorting={setSorting}
              allActiveFilters={allActiveFilters}
              setAllActiveFilters={setAllActiveFilters}
              tableProps={tableProps}
              perPage={perPage}
              // hideCellLinks={true}
              // rowsShowing={rowsShowing}
              // setTableSorting={setTableSorting}
              // chartTable={chartTable}
            />
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}

BasicDtgTable.propTypes = {
  tableProps: PropTypes.shape({}),
};

BasicDtgTable.defaultProps = {
  tableProps: {
    columnConfig: {
      property: '',
      name: '',
      type: '',
    },
  },
};
