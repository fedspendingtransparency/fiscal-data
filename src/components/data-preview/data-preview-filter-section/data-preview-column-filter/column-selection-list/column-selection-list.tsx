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

interface IColumnSelectionList {
  table;
  displayDefault;
  defaultSelectedColumns;
  additionalColumns;
  defaultColumns;
}

const ColumnSelectionList: FunctionComponent<IColumnSelectionList> = ({
  table,
  displayDefault,
  defaultSelectedColumns,
  additionalColumns,
  defaultColumns,
}) => {
  const CheckBoxList = columnList => (
    <>
      {columnList.map(({ id, getIsVisible, toggleVisibility, getToggleVisibilityHandler, columnDef }) => {
        return (
          <label className={checkbox_label} key={id}>
            <div className={checkbox_wrapper}>
              <input
                type="checkbox"
                checked={getIsVisible()}
                onChange={getToggleVisibilityHandler()}
                onKeyDown={e => e.key === 'Enter' && toggleVisibility()}
                className={optionCheckbox}
              />
              <span className={label_checkmark_container}>
                <span className={label_checkmark_text}>
                  <FontAwesomeIcon icon={faCheck} size="sm" />
                </span>
              </span>
            </div>
            <span>{columnDef.header}</span>
          </label>
        );
      })}
    </>
  );

  return (
    <>
      <SelectAll table={table} defaultColumns={displayDefault ? defaultSelectedColumns : additionalColumns} />
      <div className={buttonContainer}>
        {displayDefault ? (
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
          <div className={sectionContainer}>{CheckBoxList(table.getAllLeafColumns())}</div>
        )}
      </div>
    </>
  );
};

export default ColumnSelectionList;
