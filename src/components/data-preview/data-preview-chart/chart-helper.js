import { chartHooks } from './data-preview-chart';

export const dataTableChartNotesText =
  'To optimize display performance, this chart represents data' +
  ' points for the first record of each month plus the latest available record. The complete set' +
  ' of data points for this date range can be found under the Table tab and are available through' +
  ' the API endpoint for this data table.';

export const determineFormat = (fields, dataTypes) => {
  const isPercentage = fields.every(f => dataTypes[f].toLowerCase() === 'percentage');
  const isCurrency = fields.every(f => dataTypes[f].toLowerCase() === 'currency' || dataTypes[f].substring(0, 8).toLowerCase() === 'currency');
  return isPercentage ? 'RATE' : isCurrency;
};

export const setFieldsToChart = (fields, pivot) => {
  const whiteList = ['currency', 'number', 'percentage'];
  const blackList = ['src_line_nbr', 'table_nbr', 'total_incoming_transfers_cnt', 'from_legacy_system_cnt', 'from_commercial_book_entry_cnt'];
  const filteredChartFields = Object.keys(fields).filter(
    f =>
      (whiteList.indexOf(fields[f].toLowerCase()) !== -1 || whiteList.indexOf(fields[f].substring(0, 8).toLowerCase()) !== -1) &&
      blackList.indexOf(f.toLowerCase()) === -1
  );
  // pivot has synthetic columns, so order them alphabetically for display in the legend
  if (pivot && pivot.pivotView && pivot.pivotView.dimensionField) {
    return filteredChartFields.sort((a, b) => a.localeCompare(b));
  } else {
    return filteredChartFields;
  }
};

export const callbacks = {
  onHover: (on, item, hasUpdates, chartFields) => {
    const isActiveField = chartFields.some(field => field.field === item.field && field.active);
    if (isActiveField && chartHooks.onHover && hasUpdates) {
      chartHooks.onHover(on, item.field);
    }
  },
  onLabelChange: (update, chartFields, setChartFields) => {
    if (!(chartFields && setChartFields && chartHooks.onFieldUpdates)) {
      return;
    }

    const selectedFields = update.map(r => r.field);

    chartFields.forEach(r => {
      r.active = selectedFields.indexOf(r.field) !== -1;
    });

    chartHooks.onFieldUpdates(selectedFields);
    setChartFields(chartFields.slice());
  },
};
