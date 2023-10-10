import React, {useEffect, useRef, useState} from 'react';
import {
  closePanelIcon,
  closeButton,
  columnSelectContainer,
  selectedValues,
  heading,
  headingWrapper,
  title,
  buttonContainer,
} from './data-table-column-selector.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import {
  additionalSection,
  checkbox_label,
  checkbox_wrapper,
  label_checkmark_container,
  label_checkmark_text,
  label_text,
  optionCheckbox,
  sectionHeading,
  sectionContainer,
} from '../../checkbox/checkbox.module.scss';
import classnames from 'classnames';
import DataTableSelectAll from './select-all/data-table-select-all';

const desktop = 1015;

const DataTableColumnSelector = ({
  fields,
  resetToDefault,
  setSelectColumnPanel,
  defaultSelectedColumns,
  table,
  defaultColumns,
  additionalColumns,
  dataTableRef
}) => {
  const [tabLocation, setTabLocation] = useState(null);
  const CheckBoxList = columnList => (
    <>
      {columnList.map(({id, getIsVisible, getToggleVisibilityHandler, columnDef}) => {
        return (
          <label className={checkbox_label} key={id}>
            <div className={checkbox_wrapper}>
              <input 
                type="checkbox" 
                checked={getIsVisible()} 
                onChange={getToggleVisibilityHandler()}
                className={optionCheckbox} 
              />
              <span className={label_checkmark_container}>
                <span className={label_checkmark_text}>
                  <FontAwesomeIcon icon={faCheck} size="sm" />
                </span>
              </span>
            </div>
            <span className={label_text}>{columnDef.header}</span>
          </label>
        );
      })}
    </>
  );

  useEffect(() => {
    const selectColumnClose = document.querySelector(`[data-testid='selectColumns']`);
    selectColumnClose.focus();
    setTabLocation(false);
  }, [tabLocation]);

  return (
    <section 
      className={columnSelectContainer} 
    >
      <div className={headingWrapper}>
        <div className={heading}>
          <div className={title}>{window.innerWidth < desktop ? 'Columns' : 'Visible Columns'}</div>
          <button
            ref={dataTableRef}
            onClick={() => setSelectColumnPanel(false)}
            onKeyDown={(e) => {
              if(e.key === 'Enter'){
                setSelectColumnPanel(false)}
              }
            }
            className={closeButton}
            aria-label="Close select control panel"
            data-testid="selectColumns"
          >
            <FontAwesomeIcon icon={faXmark} className={closePanelIcon} />
          </button>
        </div>
        <div className={selectedValues}>
          {table.getVisibleFlatColumns().length} selected of {fields?.length}
        </div>
      </div>
      <DataTableSelectAll table={table} resetToDefault={resetToDefault} defaultColumns={defaultSelectedColumns} />
      <div className={buttonContainer}>
        {defaultSelectedColumns ? (
          <div>
            <div className={sectionContainer}>
              <span className={sectionHeading}>DEFAULTS</span>
              {CheckBoxList(defaultColumns)}
            </div>
            <div className={sectionContainer}>
              <span className={classnames([sectionHeading, additionalSection])}>ADDITIONAL</span>
              {CheckBoxList(additionalColumns)}
            </div>
          </div>
        ) : (
          <div className={sectionContainer}>{CheckBoxList(table.getAllLeafColumns())}</div>
        )}
      </div>
    </section>
  );
};

export default DataTableColumnSelector;
