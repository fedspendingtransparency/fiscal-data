import { buildColumnConfig } from '../../dtg-table/dtg-table-helper';
import GLOBALS from '../../../helpers/constants';

const determineTableWidth = fields => {
  const fieldCount = fields ? fields.length : 0;
  return fieldCount > 5 ? fieldCount * 200 : '100%';
};

const adjustColumnWidths = config => {
  if (config.length < 5) {
    config.forEach((obj, index) => {
      if (index < config.length - 1) {
        obj.width = 20;
      }
    });
  }
  return config;
};

const createPivotFields = (apiData, dateField, pivot) => {
  let fieldsToUse;
  if (pivot && pivot.pivotView && pivot.pivotView.aggregateOn) {
    fieldsToUse = Object.keys(apiData.meta.labels).filter(k => k !== dateField);
    if (pivot.pivotView.title === 'Complete Table') {
      fieldsToUse = fieldsToUse.filter(k => !GLOBALS.DATE_RELATED_META_TYPES.includes(apiData.meta.dataTypes[k]));
    }
  } else {
    fieldsToUse = Object.keys(apiData.meta.labels);
  }
  return fieldsToUse
    .map(k => {
      return {
        columnName: k,
        prettyName: apiData.meta.labels[k],
        dataType: apiData.meta.dataTypes[k],
        isPrimaryDateCol: k === dateField || apiData.meta.dataTypes[k] === 'AGGREGATION_DATE',
      };
    })
    .sort((a, b) => {
      // in case of pivot, sort columns alphabetically for consistency
      if (!a || !b) {
        if (a) {
          return 1;
        }
        if (b) {
          return -1;
        }
        return 0;
      }
      if (a.dataType && a.dataType.indexOf('DATE') !== -1) return -1;
      if (b.dataType && b.dataType.indexOf('DATE') !== -1) return 1;

      if (!a.prettyName || !b.prettyName) {
        if (a.prettyName) {
          return 1;
        }
        if (b.prettyName) {
          return -1;
        }
        return 0;
      }
      return a.prettyName.localeCompare(b.prettyName);
    });
};

export const setTableConfig = (config, selectedTable, selectedPivot, apiData) => {
  let fields;
  if (
    apiData &&
    apiData.data &&
    apiData.data.length &&
    apiData.meta &&
    selectedPivot && (selectedPivot.pivotValue || (selectedPivot.pivotView && selectedPivot.pivotView.aggregateOn !== null))
  ) {
    fields = createPivotFields(apiData, selectedTable.dateField, selectedPivot);
  } else {
    fields = config.apis.find(api => api.apiId === selectedTable.apiId).fields;
  }

  const columnConfig = adjustColumnWidths(buildColumnConfig(fields));
  const width = determineTableWidth(fields);

  return {
    width,
    columnConfig,
  };
};
