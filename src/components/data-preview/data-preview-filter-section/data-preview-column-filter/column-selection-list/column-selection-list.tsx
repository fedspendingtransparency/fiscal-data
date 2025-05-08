import React, { FunctionComponent, useEffect, useState } from 'react';
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
  filter,
  setFilter,
}) => {
  const [displayDefaultColumns, setDisplayDefaultColumns] = useState(defaultColumns);
  const [displayAdditionalColumns, setDisplayAdditionalColumns] = useState(additionalColumns);

  useEffect(() => {
    const filteredDefaultColumns = defaultColumns.filter(col => col.columnDef.header.toUpperCase().includes(filter.toUpperCase()));
    const filteredAdditionalColumns = additionalColumns.filter(col => col.columnDef.header.toUpperCase().includes(filter.toUpperCase()));

    setDisplayDefaultColumns(filteredDefaultColumns);
    setDisplayAdditionalColumns(filteredAdditionalColumns);
    console.log(filteredAdditionalColumns, filteredDefaultColumns);
  }, [filter]);

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
      {filter.length === 0 && <SelectAll table={table} defaultColumns={displayDefault ? defaultSelectedColumns : additionalColumns} />}
      <div className={buttonContainer}>
        {displayDefault ? (
          <div>
            <div className={sectionContainer}>
              {filter.length === 0 && <span className={sectionHeading}>DEFAULTS</span>}
              {CheckBoxList(displayDefaultColumns)}
            </div>
            <div className={sectionContainer}>
              {filter.length === 0 && <span className={`${sectionHeading} ${additionalSection}`}>ADDITIONAL</span>}
              {CheckBoxList(displayAdditionalColumns)}
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
