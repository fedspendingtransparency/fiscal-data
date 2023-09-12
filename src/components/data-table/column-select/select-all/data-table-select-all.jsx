import * as styles from '../../../select-all/select-all.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMinus, faUndo } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { resetIcon, reset, selectAllContainer } from '../data-table-column-selector.module.scss';

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
        <div className={styles.container}>
          <div className={styles.row}>
            <label>
              <input
                name="selectAll"
                onKeyDown={e => e.key === 'Enter' && onButtonClick()}
                onChange={onButtonClick}
                type="checkbox"
                checked={checked()}
              />
              <span className={styles.labelCheckmarkContainer}>
                <span className={styles.checkmarkText}>
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
