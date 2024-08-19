import React, { useEffect, useState } from 'react';
import { containerBar, formControl, selectLabel, dropdownContainer } from './pivot-options.module.scss';
import SelectControl from '../../../select-control/select-control';

const PivotOptions = ({ table, pivotSelection, setSelectedPivot, pivotsUpdated }) => {
  // console.log(table, pivotSelection, pivotsUpdated);
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

    setSelectedPivot({ pivotView: view, pivotValue: valueField });
    setPivotOptions(view.dimensionField ? curPivotFields : [{ prettyName: '— N / A —' }]);
  };

  const pivotValueChangeHandler = valueField => {
    if (valueField?.prettyName !== '— N / A —') {
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
      //DO NOT UNCOMMENT
      // if (pivot?.pivotView) {
      setSelectedPivot(pivot);
      setPivotOptions(pivot.pivotView.dimensionField ? localPivotFields : [{ prettyName: '— N / A —' }]);
      // }
      // else {
      //   console.log('here!');
      //   setSelectedPivot(null);
      //   setPivotOptions(null);
      // }
    }
  }, [table, pivotsUpdated]);

  return (
    <>
      {table && table.dataDisplays && table.dataDisplays.length > 1 && pivotSelection && pivotOptions && (
        <div className={containerBar} data-testid="pivotOptionsBar">
          <span className={formControl}>
            <span className={selectLabel} data-testid="pivotSelectLabel">
              Pivot View:
            </span>
            <span className={dropdownContainer}>
              <SelectControl
                data-testid="pivot-options-view"
                options={table.dataDisplays}
                optionLabelKey="title"
                ariaLabel="pivot view"
                selectedOption={pivotSelection.pivotView}
                changeHandler={pivotViewChangeHandler}
              />
            </span>
          </span>
          <span className={formControl}>
            <span className={selectLabel} data-testid="pivotSelectLabel">
              Pivot Value:
            </span>
            <span className={dropdownContainer}>
              <SelectControl
                options={pivotOptions}
                optionLabelKey="prettyName"
                ariaLabel="pivot value"
                selectedOption={pivotSelection.pivotValue}
                changeHandler={pivotValueChangeHandler}
              />
            </span>
          </span>
        </div>
      )}
    </>
  );
};
export default PivotOptions;
