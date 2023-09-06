import * as styles from '../../../select-all/select-all.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMinus, faUndo } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {
  resetIcon,
  reset,
  selectAllContainer,
} from '../data-table-column-selector.module.scss';

const SelectAll = ({ table, resetToDefault }) => {
  return (
    <>
      <div className={selectAllContainer}>
        <div className={styles.container}>
          <div className={styles.row}>
            <label>
              <input
                name="selectAll"
                onKeyDown={e =>
                  e.key === 'Enter' &&
                  table.getToggleAllColumnsVisibilityHandler()
                }
                onChange={table.getToggleAllColumnsVisibilityHandler()}
                type="checkbox"
                checked={
                  table.getIsAllColumnsVisible() ||
                  table.getIsSomeColumnsVisible()
                }
              />
              <span className={styles.labelCheckmarkContainer}>
                <span className={styles.checkmarkText}>
                  <FontAwesomeIcon
                    icon={
                      !table.getIsAllColumnsVisible() &&
                      table.getIsSomeColumnsVisible()
                        ? faMinus
                        : faCheck
                    }
                    size="sm"
                  />
                </span>
              </span>
              Select All
            </label>
          </div>
        </div>
        <button
          className={reset}
          onClick={resetToDefault}
          onKeyDown={resetToDefault}
        >
          <FontAwesomeIcon className={resetIcon} icon={faUndo} />
          Reset
        </button>
      </div>
    </>
  );
};

export default SelectAll;
