import React, { FunctionComponent, useEffect, useState } from 'react';
import ComboSelectDropdown from '../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';
import DropdownLabelButton from '../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import {
  buttonContainer,
  buttonLabel,
  disabled,
  pivotSectionContainer,
  radioButton,
  sectionContainer,
  tableName,
} from './data-preview-pivot-select.module.scss';
import { IPivotSelect } from '../../../models/data-preview/IPivotSelect';
import { IPivotOption } from '../../../models/data-preview/IPivotOption';
import { IPivotView } from '../../../models/data-preview/IPivotView';
import { IPivotValue } from '../../../models/data-preview/IPivotValue';

const DataPreviewPivotSelect: FunctionComponent<IPivotSelect> = ({
  table,
  pivotToApply,
  setPivotToApply,
  tableViewSelection,
  setTableViewSelection,
  pivotsUpdated,
}) => {
  const [pivotViewDropdownActive, setPivotViewDropdownActive] = useState(false);
  const [pivotValueDropdownActive, setPivotValueDropdownActive] = useState(false);
  const [pivotViewOptions, setPivotViewOptions] = useState<IPivotView[]>();
  const [pivotValueOptions, setPivotValueOptions] = useState<IPivotValue[]>();
  const [pivotFields, setPivotFields] = useState();

  const pivotViewButton = (
    <div className={`${buttonContainer} ${tableViewSelection === 'rawData' && disabled}`}>
      <label className={buttonLabel} htmlFor="pivotView">
        Pivot View
      </label>
      <DropdownLabelButton
        selectedOption={pivotToApply?.pivotView?.title}
        setActive={setPivotViewDropdownActive}
        active={pivotViewDropdownActive}
        disabled={tableViewSelection === 'rawData'}
        ariaLabel="Select Pivot View"
        name="pivotView"
      />
    </div>
  );

  const pivotValueButton = (
    <div className={`${buttonContainer} ${tableViewSelection === 'rawData' && disabled}`}>
      <label className={buttonLabel} htmlFor="pivotValue">
        Pivot Value
      </label>
      <DropdownLabelButton
        selectedOption={pivotToApply?.pivotValue?.prettyName}
        setActive={setPivotValueDropdownActive}
        active={pivotValueDropdownActive}
        disabled={tableViewSelection === 'rawData'}
        ariaLabel="Select Pivot Value"
        name="pivotValue"
      />
    </div>
  );

  const setAppropriatePivotValue = pivotOptions => {
    let valueField = pivotOptions[0];
    const curSelectedPivotValue = pivotToApply?.pivotValue;
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
    setPivotToApply({ pivotView: view, pivotValue: valueField });
    setPivotValueOptions(view.dimensionField ? curPivotFields : [{ prettyName: '— N / A —' }]);
    setPivotViewDropdownActive(false);
  };

  const pivotValueChangeHandler = valueField => {
    if (valueField?.prettyName !== '— N / A —') {
      setPivotToApply({ pivotView: pivotToApply?.pivotView, pivotValue: valueField });
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

  const displayPivotOptions = () => {
    return !!pivotViewOptions && !table.allDataTables && table.dataDisplays && table.dataDisplays?.length > 1;
  };

  const updateTableViewSelection = view => {
    setTableViewSelection(view);
  };

  useEffect(() => {
    if (table && !table.allDataTables && table.dataDisplays && table.dataDisplays?.length > 1) {
      const pivotViews: IPivotView[] = table.dataDisplays.filter(view => view.title !== 'Complete Table');
      setPivotViewOptions(pivotViews);
      const localPivotFields = getPivotFields(table);
      setPivotFields(localPivotFields);
      const pivot: IPivotOption = {
        pivotView: pivotViews ? pivotViews[0] : null,
        pivotValue: localPivotFields && pivotViews[0].dimensionField ? localPivotFields[0] : null,
      };
      if (!pivotToApply) {
        setPivotToApply(pivot);
      }
      setPivotValueOptions(pivot.pivotView.dimensionField ? localPivotFields : [{ prettyName: '— N / A —' }]);
    }
  }, [table, pivotsUpdated]);

  return (
    <div className={sectionContainer}>
      <div className={tableName}>{table?.tableName}</div>
      <label className={radioButton}>
        <input type="radio" name="table-data" checked={tableViewSelection === 'rawData'} onChange={() => updateTableViewSelection('rawData')} />
        Raw Data
      </label>
      {displayPivotOptions() && (
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
                selectedOption={pivotToApply?.pivotView}
                setDropdownActive={setPivotViewDropdownActive}
                active={pivotViewDropdownActive}
                disableSearchBar={true}
                options={pivotViewOptions}
                optionLabelKey="title"
                updateSelection={pivotViewChangeHandler}
              />
            </DropdownContainer>
            <DropdownContainer dropdownButton={pivotValueButton} setActive={setPivotValueDropdownActive}>
              <ComboSelectDropdown
                options={pivotValueOptions}
                optionLabelKey="prettyName"
                selectedOption={pivotToApply?.pivotValue}
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
