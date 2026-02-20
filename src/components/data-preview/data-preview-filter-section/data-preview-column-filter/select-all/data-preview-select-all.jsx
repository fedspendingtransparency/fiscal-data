import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import React from 'react';
import { checkmarkText, container, labelCheckmarkContainer, selectAll } from './data-preview-select-all.module.scss';

const SelectAll = ({
  allColumnsSelected,
  setAllColumnsSelected,
  allColumns,
  checkboxesSelected,
  setCheckboxesSelected,
  pendingColumnSelection,
  setPendingColumnSelection,
  disabledFields = [],
}) => {
  const updateColumnSelection = selectAll => {
    const selectAllUpdates = pendingColumnSelection;
    allColumns.forEach(col => {
      if (!disabledFields.includes(col.id) && !disabledFields.includes(col.columnDef.header)) {
        const columnVisibility = selectAll ? col.getIsVisible() : !col.getIsVisible();
        const pendingColumnIndex = pendingColumnSelection.findIndex(pendingCol => pendingCol.id === col.id);
        if (pendingColumnIndex >= 0) {
          if (columnVisibility) {
            //remove from pending updates if column is already selected / deselected
            selectAllUpdates.splice(pendingColumnIndex, 1);
          }
        } else if (!columnVisibility) {
          //add to pending updates if column will need to be selected / deselected
          selectAllUpdates.push(col);
        }
      }
    });
    return selectAllUpdates;
  };

  const onButtonClick = () => {
    const updatedValue = !allColumnsSelected;
    setAllColumnsSelected(updatedValue);
    setPendingColumnSelection(updateColumnSelection(updatedValue));
    setCheckboxesSelected(updatedValue ? allColumns : disabledFields);
  };

  return (
    <div className={container}>
      <label>
        <input
          name="selectAll"
          onKeyDown={e => e.key === 'Enter' && onButtonClick()}
          onChange={onButtonClick}
          type="checkbox"
          checked={checkboxesSelected.length > 0}
          className={selectAll}
        />
        <span className={labelCheckmarkContainer}>
          <span className={checkmarkText}>
            <FontAwesomeIcon icon={allColumns.length === checkboxesSelected.length ? faCheck : faMinus} size="sm" />
          </span>
        </span>
        All Columns
      </label>
    </div>
  );
};

export default SelectAll;
