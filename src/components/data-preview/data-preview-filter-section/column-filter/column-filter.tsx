import React, { FunctionComponent, useContext, useState } from 'react';
import { faCheck, faTable } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from '../../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../../dropdown-container/dropdown-container';
import { DataTableContext } from '../../data-preview-context';
import DataTableSelectAll from '../../../data-table/column-select/select-all/data-table-select-all';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  additionalSection,
  checkbox_label,
  checkbox_wrapper,
  label_checkmark_container,
  label_checkmark_text,
  label_text,
  optionCheckbox,
  sectionContainer,
  sectionHeading,
} from '../../../checkbox/checkbox.module.scss';
import { buttonContainer } from '../../../data-table/column-select/data-table-column-selector.module.scss';

interface iColumnFilter {
  allTablesSelected: boolean;
}

const ColumnFilter: FunctionComponent<iColumnFilter> = ({
  allTablesSelected,
  isDisabled,
  resetToDefault,
  // setSelectColumnPanel,
  // defaultSelectedColumns,
  // table,
}) => {
  const { defaultColumns, additionalColumns, allColumns: fields, defaultSelectedColumns, tableState: table } = useContext(DataTableContext);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [active, setActive] = useState(false);
  const displayDefault = defaultSelectedColumns && defaultSelectedColumns.length > 0;
  console.log('display default', displayDefault);
  const filterDropdownButton = (
    <DropdownLabelButton
      label="Columns"
      selectedOption={!!table ? table.getVisibleFlatColumns().length + '/' + fields?.length : ''}
      icon={faTable}
      active={active}
      setActive={setActive}
      disabled={allTablesSelected || isDisabled}
    />
  );

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
            <span className={label_text}>{columnDef.header}</span>
          </label>
        );
      })}
    </>
  );

  return (
    <>
      <DropdownContainer dropdownButton={filterDropdownButton} setActive={setActive}>
        {active && (
          <>
            <DataTableSelectAll
              table={table}
              resetToDefault={resetToDefault}
              defaultColumns={displayDefault ? defaultSelectedColumns : additionalColumns}
            />
            <div className={buttonContainer}>
              {displayDefault ? (
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
          </>
        )}
      </DropdownContainer>
    </>
  );
};

export default ColumnFilter;
