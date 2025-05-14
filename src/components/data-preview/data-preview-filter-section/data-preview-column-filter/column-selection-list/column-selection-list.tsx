import React, { FunctionComponent, useState } from 'react';
import {
  additionalSection,
  buttonContainer,
  checkbox_label,
  checkbox_wrapper,
  label_checkmark_container,
  label_checkmark_text,
  optionCheckbox,
  sectionContainer,
  sectionHeading,
} from './column-selection-list.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { underlineMatchedString } from '../../../../search-bar/search-bar-helper';
import SelectAll from '../select-all/data-preview-select-all';

interface IColumnSelectionList {
  displayDefault;
  additionalColumns;
  defaultColumns;
  filteredColumns;
  filter: string;
}

const ColumnSelectionList: FunctionComponent<IColumnSelectionList> = ({
  displayDefault,
  defaultColumns,
  additionalColumns,
  filteredColumns,
  filter,
  pendingColumnSelection,
  setPendingColumnSelection,
  selectedColumns,
  table,
}) => {
  const [allColumnsSelected, setAllColumnsSelected] = useState(false);
  const [checkboxesSelected, setCheckboxesSelected] = useState([...selectedColumns]);

  const handleChange = col => {
    console.log('change!');
    const index = pendingColumnSelection.findIndex(pendingCol => col.id === pendingCol.id);
    if (index < 0) {
      setPendingColumnSelection([...pendingColumnSelection, col]);
    } else {
      const updatedSelection = [...pendingColumnSelection];
      updatedSelection.splice(index, 1);
      setPendingColumnSelection(updatedSelection);
    }
  };

  const checkboxClick = col => {
    const index = checkboxesSelected.findIndex(x => x.id === col.id);
    let test;
    if (index >= 0) {
      test = checkboxesSelected;
      test.splice(index, 1);
    } else {
      test = [...checkboxesSelected, col];
    }
    setCheckboxesSelected(test);
  };

  const CheckBoxList = columnList => (
    <>
      {columnList?.map(col => {
        const { id, columnDef } = col;
        return (
          <label className={checkbox_label} key={id}>
            <div className={checkbox_wrapper}>
              <input
                type="checkbox"
                checked={checkboxesSelected.findIndex(x => x.id === col.id) >= 0}
                onClick={() => checkboxClick(col)}
                onChange={() => handleChange(col)}
                onKeyDown={e => e.key === 'Enter' && handleChange(col)}
                className={optionCheckbox}
              />
              <span className={label_checkmark_container}>
                <span className={label_checkmark_text}>
                  <FontAwesomeIcon icon={faCheck} size="sm" />
                </span>
              </span>
            </div>
            <span>{underlineMatchedString(columnDef.header, filter)}</span>
          </label>
        );
      })}
    </>
  );

  return (
    <div style={{ maxHeight: '15.75rem' }}>
      {filter.length === 0 && (
        <SelectAll
          checkboxesSelected={checkboxesSelected}
          setAllColumnsSelected={setAllColumnsSelected}
          allColumnsSelected={allColumnsSelected}
          allColumns={table.getAllLeafColumns()}
          setCheckboxesSelected={setCheckboxesSelected}
          pendingColumnSelection={pendingColumnSelection}
          setPendingColumnSelection={setPendingColumnSelection}
        />
      )}
      <div className={buttonContainer}>
        {displayDefault && filter.length === 0 ? (
          <div>
            <div className={sectionContainer}>
              <span className={sectionHeading}>DEFAULTS</span>
              {CheckBoxList(defaultColumns)}
            </div>
            <div className={sectionContainer}>
              <span className={`${sectionHeading} ${additionalSection}`}>ADDITIONAL</span>
              {CheckBoxList(additionalColumns)}
            </div>
          </div>
        ) : (
          <div className={sectionContainer}>{CheckBoxList(filteredColumns)}</div>
        )}
      </div>
    </div>
  );
};

export default ColumnSelectionList;
