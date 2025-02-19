import React, { FunctionComponent } from 'react';
import NotShownMessage from '../../dataset-data/table-section-container/not-shown-message/not-shown-message';
import { getMessageForDefaultApiFilter, getMessageForUnmatchedUserFilter } from '../../filter-download-container/user-filter/user-filter';
import { allTablesSelectedBody, emptyDataMessageBody } from '../../dataset-data/chart-table-toggle/chart-table-toggle';
import TableNotice from './table-notice/table-notice';
import EmptyTable from './empty-table/empty-table';
import { tableNotice } from './data-preview-chart-table-display.module.scss';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../variables.module.scss';

const ChartTableDisplay: FunctionComponent = ({
  table,
  allTablesSelected,
  selectedTable,
  emptyData,
  unchartable,
  legend,
  selectedTab,
  chart,
  userFilterUnmatchedForDateRange,
  apiFilterDefault,
  pivotSelected,
  width,
}) => {
  let emptyDataMessage = null;
  console.log('apifilter', apiFilterDefault);

  const allTableHeading = 'The current "All Data Tables" selection is for download only';
  const allTableBody = "To download the data, select the 'Download' button and choose the desired format.";

  const additionalFiltersHeading = 'This table requires additional filters';
  const additionalFiltersBody = 'Select an account in the filter section above to display the data.';

  if (allTablesSelected) {
    emptyDataMessage = <TableNotice heading={allTableHeading} bodyText={allTableBody} />;
  } else if (apiFilterDefault) {
    emptyDataMessage = <TableNotice heading={additionalFiltersHeading} bodyText={additionalFiltersBody} />;
  }

  //TODO: Add in additional cases for the table notice
  // else if (userFilterUnmatchedForDateRange) {
  //   emptyDataMessage = getMessageForUnmatchedUserFilter(selectedTable);
  // } else if (apiFilterDefault) {
  //   emptyDataMessage = getMessageForDefaultApiFilter(selectedTable);
  // } else if (emptyData) {
  //   emptyDataMessage = <NotShownMessage heading="Change selections in order to preview data" bodyText={emptyDataMessageBody} />;
  // }

  return (
    <>
      {emptyDataMessage ? (
        <>
          <EmptyTable mobileDisplay={width < pxToNumber(breakpointLg)} />
          <div className={tableNotice}>{emptyDataMessage}</div>
        </>
      ) : (
        table
      )}
    </>
  );
};

export default ChartTableDisplay;
