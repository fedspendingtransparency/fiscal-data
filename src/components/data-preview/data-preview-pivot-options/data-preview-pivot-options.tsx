import React, { FunctionComponent, useEffect, useState } from 'react';
import Analytics from '../../../utils/analytics/analytics';

type PivotOptions = {
  datasetName;
  table;
  pivotSelection;
  setSelectedPivot;
  pivotsUpdated;
};

const DataPreviewPivotOptions: FunctionComponent<PivotOptions> = ({ datasetName, table, pivotSelection, setSelectedPivot, pivotsUpdated }) => {
  const [pivotOptions, setPivotOptions] = useState();
  const [pivotFields, setPivotFields] = useState();

  const setAppropriatePivotValue = pivotOptions => {
    let valueField = pivotOptions[0];
    const curSelectedPivotValue = pivotSelection.pivotValue;
    if (curSelectedPivotValue) {
      if (pivotOptions.some(pivot => pivot.columnName === curSelectedPivotValue.columnName)) {
        valueField = curSelectedPivotValue;
      }
    }
    return valueField;
  };

  const pivotViewChangeHandler = view => {
    let valueField = null;
    let curPivotFields = pivotFields;
    if (view.dimensionField) {
      const uniquePivotValues = view.uniquePivotValues;
      if (uniquePivotValues && uniquePivotValues.length) {
        curPivotFields = uniquePivotValues;
      }
      valueField = setAppropriatePivotValue(curPivotFields);
    }

    Analytics.event({
      category: 'Chart Enabled',
      action: 'Pivot View Click',
      label: `${view.title}, ${datasetName}, ${table.tableName}`,
    });

    setSelectedPivot({ pivotView: view, pivotValue: valueField });
    setPivotOptions(view.dimensionField ? curPivotFields : [{ prettyName: '— N / A —' }]);
  };

  const pivotValueChangeHandler = valueField => {
    if (valueField?.prettyName !== '— N / A —') {
      Analytics.event({
        category: 'Chart Enabled',
        action: 'Pivot Value Click',
        label: `${valueField?.prettyName}, ${datasetName}, ${table.tableName}`,
      });

      setSelectedPivot({ pivotView: pivotSelection.pivotView, pivotValue: valueField });
    }
  };

  const getPivotFields = table => {
    if (table && table.valueFieldOptions) {
      return table.fields.filter(field => table.valueFieldOptions.indexOf(field.columnName) !== -1);
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (table && !table.allDataTables) {
      const localPivotFields = getPivotFields(table);
      setPivotFields(localPivotFields);
      const pivot = {
        pivotView: table.dataDisplays ? table.dataDisplays[0] : null,
        pivotValue: localPivotFields && table.dataDisplays[0].dimensionField ? localPivotFields[0] : null,
      };
      setSelectedPivot(pivot);
      setPivotOptions(pivot.pivotView.dimensionField ? localPivotFields : [{ prettyName: '— N / A —' }]);
    }
  }, [table, pivotsUpdated]);

  return <></>;
};

export default DataPreviewPivotOptions;