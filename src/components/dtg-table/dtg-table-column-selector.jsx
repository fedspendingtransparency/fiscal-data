import React from 'react';
import Checkbox from '../checkbox/checkbox';
import SelectAll from '../select-all/selectAll';
import {
  buttonContainer,
  closeButton,
  closeIcon,
  resetIcon,
  selectAllColumns,
  selectAllContainer,
  selectedValues,
  reset,
  columnSelectContainer,
  heading,
  headingWrapper,
  title,
} from './dtg-table-column-selector.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faUndo } from '@fortawesome/free-solid-svg-icons';

const desktop = 1015;

const DtgTableColumnSelector = ({
  fields,
  isVisible,
  changeHandler,
  resetToDefault,
  setSelectColumnPanel,
  isReset,
}) => {
  return (
    <section className={columnSelectContainer}>
      <div className={headingWrapper}>
        <div className={heading}>
          <div className={title}>
            {window.innerWidth < desktop ? 'Columns' : 'Visible Columns'}
          </div>
          <button
            onClick={() => setSelectColumnPanel(false)}
            onKeyPress={() => setSelectColumnPanel(false)}
            className={closeButton}
            aria-label="Close select control panel"
          >
            <FontAwesomeIcon icon={faXmark} className={closeIcon} />
          </button>
        </div>
        <div className={selectedValues}>
          {fields.filter(field => field.active === true).length} selected of{' '}
          {fields.length}
        </div>
      </div>
      <div className={selectAllContainer}>
        <SelectAll
          className={selectAllColumns}
          fields={fields}
          isVisible={isVisible}
          onUpdateFields={changeHandler}
          resetToFalse={isReset}
        />
        <button
          className={reset}
          onClick={resetToDefault}
          onKeyDown={resetToDefault}
        >
          <FontAwesomeIcon className={resetIcon} icon={faUndo} />
          Reset
        </button>
      </div>
      <div className={buttonContainer}>
        <Checkbox
          checkboxData={fields
            .filter(field => field.default === true)
            .concat(fields.filter(field => field.default !== true))}
          changeHandler={changeHandler}
        />
      </div>
    </section>
  );
};

export default DtgTableColumnSelector;
