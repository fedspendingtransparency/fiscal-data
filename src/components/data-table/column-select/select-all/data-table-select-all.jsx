import { container, row, checkmarkText, labelCheckmarkContainer } from '../../../select-all/select-all.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo';
import React from 'react';
import { resetIcon, reset, selectAllContainer, selectAll } from '../data-table-column-selector.module.scss';

const SelectAll = ({ table, resetToDefault, defaultColumns }) => {
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
    <>
      <div className={selectAllContainer}>
        <div className={container}>
          <div className={row}>
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
              Select All
            </label>
          </div>
        </div>
        <button className={reset} onClick={resetToDefault} onKeyDown={e => e.key === 'Enter' && resetToDefault()}>
          <FontAwesomeIcon className={resetIcon} icon={faUndo} />
          Reset
        </button>
      </div>
    </>
  );
};

export default SelectAll;
