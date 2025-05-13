import React, { FunctionComponent } from 'react';
import SelectAll from '../select-all/data-preview-select-all';
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

interface IColumnSelectionList {
  table;
  displayDefault;
  defaultSelectedColumns;
  additionalColumns;
  defaultColumns;
  filteredColumns;
  filter: string;
}

const ColumnSelectionList: FunctionComponent<IColumnSelectionList> = ({
  table,
  displayDefault,
  defaultSelectedColumns,
  defaultColumns,
  additionalColumns,
  filteredColumns,
  filter,
  pendingColumnSelection,
  setPendingColumnSelection,
}) => {
  const handleChange = col => {
    const index = pendingColumnSelection.findIndex(pendingCol => col.id === pendingCol.id);
    if (index < 0) {
      setPendingColumnSelection([...pendingColumnSelection, col]);
    } else {
      const updatedSelection = [...pendingColumnSelection];
      updatedSelection.splice(index, 1);
      setPendingColumnSelection(updatedSelection);
    }
  };

  const isChecked = (col, isVisible) => {
    const pendingChange = pendingColumnSelection.findIndex(pendingCol => col.id === pendingCol.id);
    console.log(col, pendingChange > 0 ? !isVisible : isVisible);
    return pendingChange > 0 ? !isVisible : isVisible;
  };

  const CheckBoxList = columnList => (
    <>
      {columnList.map(col => {
        const { id, getIsVisible, toggleVisibility, columnDef } = col;
        return (
          <label className={checkbox_label} key={id}>
            <div className={checkbox_wrapper}>
              <input
                type="checkbox"
                checked={isChecked(col, getIsVisible())}
                onChange={() => handleChange(col)}
                onKeyDown={e => e.key === 'Enter' && toggleVisibility()}
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
      {filter.length === 0 && <SelectAll table={table} defaultColumns={displayDefault ? defaultSelectedColumns : additionalColumns} />}
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
