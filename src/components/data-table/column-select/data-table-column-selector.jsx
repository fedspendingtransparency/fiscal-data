import React, { useEffect, useState } from 'react';
import Checkbox from '../../checkbox/checkbox';
import SelectAll from '../../select-all/selectAll';
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
  title
} from '../../dtg-table/dtg-table-column-selector.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faUndo } from '@fortawesome/free-solid-svg-icons';

const desktop = 1015;

const DataTableColumnSelector = (
  {
    fields,
    isVisible,
    changeHandler,
    resetToDefault,
    setSelectColumnPanel,
    isReset,
    defaultSelectedColumns,
    defaultInvisibleColumns,
    table,
    setColumnVisibility,
    allColumns
  }) => {

  const [defaultColumns, setDefaultColumns] = useState([]);
  const [additionalColumns, setAdditionalColumns] = useState([]);


  // We need to be able to access the accessorKey (which is a type violation) hence the ts ignore
  if (defaultSelectedColumns) {
    for (const column of allColumns) {
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
      }
      else if (!defaultSelectedColumns.includes(column.id)) {
        constructedAdditionalColumns.push(column);
      }
    }
    constructedAdditionalColumns.sort((a, b) => {
      return a.id.localeCompare(b.id);
    })
    setDefaultColumns(constructedDefaultColumns);
    setAdditionalColumns(constructedAdditionalColumns);
  }

  useEffect(() => {
    if (defaultSelectedColumns) {
      constructDefaultColumnsFromTableData();
    }
  }, []);

  return (
  <section className={columnSelectContainer}>
    <div className={headingWrapper}>
      <div className={heading}>
        <div className={title}>{window.innerWidth < desktop ? 'Columns' : 'Visible Columns'}</div>
        <button onClick={() => setSelectColumnPanel(false)}
                onKeyPress={() => setSelectColumnPanel(false)}
                className={closeButton}
                aria-label="Close select control panel"
        >
            <FontAwesomeIcon icon={faXmark} className={closeIcon} />
        </button>
      </div>
      <div className={selectedValues}>{fields.filter(field => field.active === true).length} selected of {fields.length}</div>
    </div>
    <div className={selectAllContainer}>
      <SelectAll
        className={selectAllColumns}
        fields={table.getIsAllColumnsVisible()}
        isVisible={isVisible}
        onUpdateFields={table.getToggleAllColumnsVisibilityHandler}
        resetToFalse={table.getToggleAllColumnsVisibilityHandler}
      />
      <button className={reset} onClick={resetToDefault} onKeyDown={resetToDefault}>
        <FontAwesomeIcon className={resetIcon} icon={faUndo} />
        Reset
      </button>
    </div>
    <div className={buttonContainer}>
      <Checkbox
        checkboxData={(fields.filter(field => field.default === true))
          .concat(fields.filter(field => field.default !== true))}
        changeHandler={changeHandler}
      />
    </div>
  </section>
)};

export default DataTableColumnSelector;
