import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
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
}) => {
  const onButtonClick = () => {
    const updatedValue = !allColumnsSelected;
    setAllColumnsSelected(updatedValue);
    if (updatedValue) {
      const updates = pendingColumnSelection;
      allColumns.forEach(col => {
        const pendingIndex = pendingColumnSelection.findIndex(c => c.id === col.id);
        if (pendingIndex >= 0) {
          const viz = col.getIsVisible();
          if (viz) {
            updates.splice(pendingIndex, 1);
          }
        } else if (!col.getIsVisible()) {
          updates.push(col);
        }
      });
      setPendingColumnSelection(updates);
      setCheckboxesSelected(allColumns);
    } else {
      const updates = pendingColumnSelection;
      allColumns.forEach(col => {
        const pendingIndex = pendingColumnSelection.findIndex(c => c.id === col.id);
        if (pendingIndex >= 0) {
          const viz = !col.getIsVisible();
          if (viz) {
            updates.splice(pendingIndex, 1);
          }
        } else if (col.getIsVisible()) {
          updates.push(col);
        }
      });
      setPendingColumnSelection(updates);
      setCheckboxesSelected([]);
    }
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
