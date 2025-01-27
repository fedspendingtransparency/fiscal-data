import React, { FunctionComponent } from 'react';
import NotShownMessage from '../../dataset-data/table-section-container/not-shown-message/not-shown-message';
import { getMessageForDefaultApiFilter, getMessageForUnmatchedUserFilter } from '../../filter-download-container/user-filter/user-filter';
import { allTablesSelectedBody, emptyDataMessageBody } from '../../dataset-data/chart-table-toggle/chart-table-toggle';

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
}) => {
  let emptyDataMessage = null;

  if (allTablesSelected) {
    emptyDataMessage = <NotShownMessage heading={allTablesSelectedBody} />;
  } else if (userFilterUnmatchedForDateRange) {
    emptyDataMessage = getMessageForUnmatchedUserFilter(selectedTable);
  } else if (apiFilterDefault) {
    emptyDataMessage = getMessageForDefaultApiFilter(selectedTable);
  } else if (emptyData) {
    emptyDataMessage = <NotShownMessage heading="Change selections in order to preview data" bodyText={emptyDataMessageBody} />;
  }
  return <>{emptyDataMessage ? emptyDataMessage : table}</>;
};

export default ChartTableDisplay;
