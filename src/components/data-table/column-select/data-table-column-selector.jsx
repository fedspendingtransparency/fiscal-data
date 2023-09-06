import React, { useEffect, useState } from 'react';
import {
  selectAllContainer,
  reset,
  selectAllColumns,
  resetIcon,
  closeIcon,
  closeButton,
  columnSelectContainer,
  selectedValues,
  heading,
  headingWrapper,
  title,
  buttonContainer,
  toggleButton,
  checkmarkText,
} from './data-table-column-selector.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faUndo, faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
import {
  additionalSection,
  checkbox_label,
  checkbox_wrapper,
  label_checkmark_container,
  label_checkmark_text,
  label_text,
  optionCheckbox,
  sectionHeading,
} from '../../checkbox/checkbox.module.scss';
import classnames from 'classnames';
import DataTableSelectAll from './select-all/data-table-select-all';

const desktop = 1015;

const DataTableColumnSelector = ({ fields, resetToDefault, setSelectColumnPanel, defaultSelectedColumns, defaultInvisibleColumns, table }) => {
  const [defaultColumns, setDefaultColumns] = useState([]);
  const [additionalColumns, setAdditionalColumns] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);

  // We need to be able to access the accessorKey (which is a type violation) hence the ts ignore
  if (defaultSelectedColumns) {
    for (const column of fields) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!defaultSelectedColumns.includes(column.accessorKey)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        defaultInvisibleColumns[column.accessorKey] = false;
      }
    }
  }

  const constructDefaultColumnsFromTableData = () => {
    const constructedDefaultColumns = [];
    const constructedAdditionalColumns = [];
    for (const column of table.getAllLeafColumns()) {
      if (defaultSelectedColumns.includes(column.id)) {
        constructedDefaultColumns.push(column);
      } else if (!defaultSelectedColumns.includes(column.id)) {
        constructedAdditionalColumns.push(column);
      }
    }
    constructedAdditionalColumns.sort((a, b) => {
      return a.id.localeCompare(b.id);
    });
    setDefaultColumns(constructedDefaultColumns);
    setAdditionalColumns(constructedAdditionalColumns);
  };

  useEffect(() => {
    if (defaultSelectedColumns) {
      constructDefaultColumnsFromTableData();
    }
  }, []);

  const CheckBoxList = columnList => (
    <>
      {columnList.map(column => {
        return (
          <label className={checkbox_label}>
            <div key={column.id} className={checkbox_wrapper}>
              <input type="checkbox" checked={column.getIsVisible()} onChange={column.getToggleVisibilityHandler()} className={optionCheckbox} />
              <span className={label_checkmark_container}>
                <span className={label_checkmark_text}>
                  <FontAwesomeIcon icon={faCheck} size="sm" />
                </span>
              </span>
            </div>
            <span className={label_text}>{column.columnDef.header}</span>
          </label>
        );
      })}
    </>
  );

  return (
    <section className={columnSelectContainer}>
      <div className={headingWrapper}>
        <div className={heading}>
          <div className={title}>{window.innerWidth < desktop ? 'Columns' : 'Visible Columns'}</div>
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
          {table.getVisibleFlatColumns().length} selected of {fields?.length}
        </div>
      </div>
      <DataTableSelectAll table={table} resetToDefault={resetToDefault} />
      <div className={buttonContainer}>
        {defaultSelectedColumns ? (
          <div>
            <div>
              <span className={sectionHeading}>DEFAULTS</span>
              {CheckBoxList(defaultColumns)}
            </div>
            <div>
              <span className={classnames([sectionHeading, additionalSection])}>ADDITIONAL</span>
              {CheckBoxList(additionalColumns)}
            </div>
          </div>
        ) : (
          <div>
            {table.getAllLeafColumns().map(column => {
              return (
                <div key={column.id} className="px-1">
                  <label>
                    <input type="checkbox" checked={column.getIsVisible()} onChange={column.getToggleVisibilityHandler()} /> {column.columnDef.header}
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default DataTableColumnSelector;
