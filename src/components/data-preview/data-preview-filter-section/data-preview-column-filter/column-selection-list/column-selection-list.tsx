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
import { underlineMatchedString } from '../../../../search-bar/search-bar-helper';

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
}) => {
  const [filteredColumns, setFilteredColumns] = useState(table?.getAllLeafColumns());

  useEffect(() => {
    const filteredList = table.getAllLeafColumns().filter(col => col.columnDef.header.toUpperCase().includes(filter.toUpperCase()));
    setFilteredColumns(filteredList);
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
            <span>{underlineMatchedString(columnDef.header, filter)}</span>
          </label>
        );
      })}
    </>
  );

  return (
    <div style={{ maxHeight: '15.75rem' }}>
      {filter.length === 0 && <SelectAll table={table} defaultColumns={displayDefault ? defaultSelectedColumns : additionalColumns} />}
      <div className={buttonContainer}>
        {displayDefault && filter.length === 0 ? (
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
          <div className={sectionContainer}>{CheckBoxList(filteredColumns)}</div>
        )}
      </div>
    </div>
  );
};

export default ColumnSelectionList;
