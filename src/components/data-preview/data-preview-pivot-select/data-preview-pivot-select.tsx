import React, { useEffect, useState } from 'react';
import ComboSelectDropdown from '../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';
import DropdownLabelButton from '../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import Analytics from '../../../utils/analytics/analytics';
import { tableName, sectionContainer, radioButton, pivotSectionContainer } from './data-preview-pivot-select.module.scss';

const DataPreviewPivotSelect = ({ table, pivotSelection, setSelectedPivot, pivotsUpdated }) => {
  const [pivotViewDropdownActive, setPivotViewDropdownActive] = useState(false);
  const [pivotValueDropdownActive, setPivotValueDropdownActive] = useState(false);
  const [tableViewSelection, setTableViewSelection] = useState('rawData');
  const [pivotOptions, setPivotOptions] = useState();
  const [pivotFields, setPivotFields] = useState();

  const pivotViewButton = (
    <>
      Pivot View
      <DropdownLabelButton
        selectedOption={pivotSelection.pivotView?.title}
        setActive={setPivotViewDropdownActive}
        active={pivotViewDropdownActive}
        disabled={tableViewSelection === 'rawData'}
      />
    </>
  );

  const pivotValueButton = (
    <>
      Pivot Value
      <DropdownLabelButton
        selectedOption={pivotSelection.pivotValue?.title}
        setActive={setPivotValueDropdownActive}
        active={pivotValueDropdownActive}
        disabled={tableViewSelection === 'rawData'}
      />
    </>
  );

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
      // Analytics.event({
      //   category: 'Chart Enabled',
      //   action: 'Pivot Value Click',
      //   label: `${valueField?.prettyName}, ${datasetName}, ${table.tableName}`,
      // });

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
    if (table && !table.allDataTables && table.dataDisplays && table.dataDisplays.length > 1) {
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

  const updateTableViewSelection = view => {
    setTableViewSelection(view);
  };

  return (
    <div className={sectionContainer}>
      <div className={tableName}>{table?.tableName}</div>
      <label className={radioButton}>
        <input type="radio" name="table-data" checked={tableViewSelection === 'rawData'} onChange={() => updateTableViewSelection('rawData')} />
        Raw Data
      </label>
      {table && table.dataDisplays && table.dataDisplays.length > 1 && pivotSelection && pivotOptions && (
        <>
          <label className={radioButton}>
            <input
              type="radio"
              name="table-data"
              checked={tableViewSelection === 'pivotData'}
              onChange={() => updateTableViewSelection('pivotData')}
            />
            Pivot Data
          </label>
          <div className={pivotSectionContainer}>
            <DropdownContainer dropdownButton={pivotViewButton} setActive={setPivotViewDropdownActive}>
              <ComboSelectDropdown
                selectedOption={pivotSelection.pivotView}
                setDropdownActive={setPivotViewDropdownActive}
                active={pivotViewDropdownActive}
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
                disableSearchBar={true}
                updateSelection={pivotValueChangeHandler}
              />
            </DropdownContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default DataPreviewPivotSelect;
