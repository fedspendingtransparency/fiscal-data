import React, { useEffect, useState } from 'react';
import ComboSelectDropdown from '../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';
import DropdownLabelButton from '../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import Analytics from '../../../utils/analytics/analytics';

const DataPreviewPivotSelect = ({ table, pivotSelection, setSelectedPivot, pivotsUpdated }) => {
  const [pivotViewDropdownActive, setPivotViewDropdownActive] = useState(false);
  const [pivotValueDropdownActive, setPivotValueDropdownActive] = useState(false);
  const [rawDataSelected, setRawDataSelected] = useState(true);
  const [pivotSelected, setPivotSelected] = useState(null);

  const pivotViewButton = <DropdownLabelButton selectedOption="--" setActive={setPivotViewDropdownActive} active={pivotViewDropdownActive} />;
  const pivotValueButton = <DropdownLabelButton selectedOption="--" setActive={setPivotValueDropdownActive} active={pivotValueDropdownActive} />;

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

    // Analytics.event({
    //   category: 'Chart Enabled',
    //   action: 'Pivot View Click',
    //   label: `${view.title}, ${datasetName}, ${table.tableName}`,
    // });

    setSelectedPivot({ pivotView: view, pivotValue: valueField });
    setPivotOptions(view.dimensionField ? curPivotFields : [{ prettyName: '— N / A —' }]);
    setPivotViewDropdownActive(false);
  };

  const pivotValueChangeHandler = valueField => {
    if (valueField?.prettyName !== '— N / A —') {
      //   Analytics.event({
      //     category: 'Chart Enabled',
      //     action: 'Pivot Value Click',
      //     label: `${valueField?.prettyName}, ${datasetName}, ${table.tableName}`,
      //   });

      setSelectedPivot({ pivotView: pivotSelection.pivotView, pivotValue: valueField });
      setPivotValueDropdownActive(false);
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
      console.log(pivot.pivotView.dimensionField ? localPivotFields : [{ prettyName: '— N / A —' }]);
    }
  }, [table, pivotsUpdated]);

  return (
    <>
      {table.tableName}
      <label>
        <input type="radio" value="Raw Data" checked={rawDataSelected} />
        Raw Data
      </label>
      <label>
        <input type="radio" value="Pivot" checked={!!pivotSelected} />
        Pivot
      </label>
      <div>
        <DropdownContainer dropdownButton={pivotViewButton} setActive={setPivotViewDropdownActive}>
          <ComboSelectDropdown
            selectedOption={pivotSelection.pivotView}
            setDropdownActive={setPivotViewDropdownActive}
            active={pivotViewDropdownActive}
            // searchBarActive="Pivot View"
            disableSearchBar={true}
            options={table.dataDisplays}
            optionLabelKey="title"
            updateSelection={pivotViewChangeHandler}
          />
        </DropdownContainer>
        <DropdownContainer dropdownButton={pivotValueButton} setActive={setPivotValueDropdownActive}>
          <ComboSelectDropdown
            options={pivotOptions}
            optionLabelKey="prettyName"
            selectedOption={pivotSelection.pivotValue}
            setDropdownActive={setPivotValueDropdownActive}
            active={pivotValueDropdownActive}
            // searchBarActive="Pivot Value"
            disableSearchBar={true}
            updateSelection={pivotValueChangeHandler}
          />
        </DropdownContainer>
      </div>
    </>
  );
};

export default DataPreviewPivotSelect;
