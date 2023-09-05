import NotShownMessage from './not-shown-message/not-shown-message';
import { differenceInHours } from "date-fns";
import React from 'react';
import {getMessageForUnmatchedUserFilter} from "../../filter-download-container/user-filter/user-filter";

export const SetNoChartMessage = (selectedTable, selectedPivot, dateRange, allTablesSelected,
                                  userFilterSelection, userFilterUnmatchedForDateRange) => {

  const {dataDisplays, userFilter} = selectedTable;
  if (allTablesSelected) {
    return (
      <NotShownMessage
        heading='With the current "All Data Tables" selection, we are unable to render a Table or Chart at this time.'
      />);
  } else if (dataDisplays && dataDisplays.every(dd => dd.chartType === 'none')) {

    return (
      <NotShownMessage
        heading="There are no charts for this Data Table."
      />);
  } else if (selectedPivot && selectedPivot.pivotView && selectedPivot.pivotView.chartType === 'none') {
    return (
      <NotShownMessage
        heading="Use the dropdown to select a pivot option to display the chart"
        bodyText="This data table cannot be rendered as a chart until a pivot option is applied."
      />);
  } else if (userFilter && !userFilterSelection?.value) {
    return (
      <NotShownMessage
        heading={`Select from ${userFilter.label} options above to display the chart.`}
      />);
  } else if (userFilterUnmatchedForDateRange) {
    return getMessageForUnmatchedUserFilter(selectedTable);
  } else if (dateRange && dateRange.to && dateRange.from &&
    differenceInHours(dateRange.to, dateRange.from) < 24) {
    return (
      <NotShownMessage
        heading="Select a different date range to display a chart"
        bodyText="No chart is available for the selected date range because it is too narrow to effectively chart."
      />);
  }
};
