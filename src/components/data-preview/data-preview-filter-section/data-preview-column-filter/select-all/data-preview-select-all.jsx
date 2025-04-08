import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { checkmarkText, container, labelCheckmarkContainer, selectAll } from './data-preview-select-all.module.scss';

const SelectAll = ({ table, defaultColumns }) => {
  const defaultState = () => {
    const selectedColumns = table.getVisibleFlatColumns();
    if (table.getIsSomeColumnsVisible() && selectedColumns.length === defaultColumns.length) {
      for (const column of selectedColumns) {
        if (!defaultColumns.includes(column.id)) {
          return false;
        }
      }
      return true;
    }
  };

  const checked = () => table.getIsAllColumnsVisible() || (!defaultState() && table.getIsSomeColumnsVisible());

  const onButtonClick = () => {
    if (table.getIsAllColumnsVisible() || !table.getIsSomeColumnsVisible()) {
      table.toggleAllColumnsVisible();
    } else {
      table.setColumnVisibility(true);
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
          checked={checked()}
          className={selectAll}
        />
        <span className={labelCheckmarkContainer}>
          <span className={checkmarkText}>
            <FontAwesomeIcon
              icon={!table.getIsAllColumnsVisible() && table.getIsSomeColumnsVisible() && !defaultState() ? faMinus : faCheck}
              size="sm"
            />
          </span>
        </span>
        All Columns
      </label>
    </div>
  );
};

export default SelectAll;
