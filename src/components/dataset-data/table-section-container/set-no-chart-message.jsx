import NotShownMessage from './not-shown-message/not-shown-message';
import { differenceInHours } from 'date-fns';
import React from 'react';
import { getMessageForUnmatchedUserFilter } from '../../filter-download-container/user-filter/user-filter';
import CustomLink from '../../links/custom-link/custom-link';

export const SetNoChartMessage = (
  selectedTable,
  selectedPivot,
  dateRange,
  allTablesSelected,
  userFilterSelection,
  userFilterUnmatchedForDateRange,
  customNotShownMessage,
  emptyData
) => {
  const { dataDisplays, userFilter } = selectedTable;
  const { pivotView } = selectedPivot ?? {};
  if (allTablesSelected) {
    const allTablesMessage =
      'With the current "All Data Tables" selection, you may download the data, but the table and chart previews are not applicable.';
    return <NotShownMessage heading={allTablesMessage} />;
  } else if (dataDisplays && dataDisplays.every(dd => dd.chartType === 'none')) {
    if (customNotShownMessage && selectedTable.apiId !== 141) {
      const copy = (
        <>
          The Fiscal Data team is working to address an issue with the charts for this dataset. Please check back later or contact us via email at{' '}
          <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov">fiscaldata@fiscal.treasury.gov</CustomLink> with questions.
        </>
      );
      return <NotShownMessage heading="This chart is undergoing updates" bodyText={copy} />;
    } else {
      return <NotShownMessage heading="There are no charts for this Data Table." />;
    }
  } else if (selectedPivot && pivotView && pivotView.chartType === 'none') {
    return (
      <NotShownMessage
        heading="Use the dropdown to select a pivot option to display the chart"
        bodyText="This data table cannot be rendered as a chart until a pivot option is applied."
      />
    );
  } else if (userFilter && !userFilterSelection?.value) {
    return <NotShownMessage heading={`Select from ${userFilter.label} options above to display the chart.`} />;
  } else if (userFilterUnmatchedForDateRange) {
    return getMessageForUnmatchedUserFilter(selectedTable);
  } else if (dateRange && dateRange.to && dateRange.from && differenceInHours(dateRange.to, dateRange.from) < 24) {
    return (
      <NotShownMessage
        heading="Select a different date range to display a chart"
        bodyText="No chart is available for the selected date range because it is too narrow to effectively chart."
      />
    );
  } else if (emptyData && pivotView) {
    return (
      <NotShownMessage
        heading="Select a different date range to display a chart"
        bodyText="No chart is available for the selected date range because it is too narrow to effectively chart."
      />
    );
  }
};
