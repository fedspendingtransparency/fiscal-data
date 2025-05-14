import React, { FunctionComponent, useEffect, useState } from 'react';
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
import SelectAll from '../select-all/data-preview-select-all';

interface IColumnSelectionList {
  displayDefault;
  additionalColumns;
  defaultColumns;
  filteredColumns;
  filter: string;
}

const ColumnSelectionList: FunctionComponent<IColumnSelectionList> = ({
  displayDefault,
  defaultColumns,
  additionalColumns,
  filteredColumns,
  filter,
  pendingColumnSelection,
  setPendingColumnSelection,
  selectedColumns,
  table,
}) => {
  const [allColumnsSelected, setAllColumnsSelected] = useState(false);

  const handleChange = col => {
    const index = pendingColumnSelection.findIndex(pendingCol => col.id === pendingCol.id);
    if (index < 0) {
      setPendingColumnSelection([...pendingColumnSelection, col]);
    } else {
      const updatedSelection = [...pendingColumnSelection];
      updatedSelection.splice(index, 1);
      setPendingColumnSelection(updatedSelection);
    }
  };

  const defaultSelection = col => {
    const currentlySelected = selectedColumns.findIndex(x => x.id === col.id) >= 0;
    const pendingSelected = pendingColumnSelection.findIndex(x => x.id === col.id) >= 0;
    return pendingSelected ? !currentlySelected : currentlySelected;
  };

  // useEffect(() => {
  //   console.log('allColumnsSelected: ', allColumnsSelected);
  //   if (allColumnsSelected) {
  //     console.log('select all columns');
  //     // setPendingColumnSelection([...table.getAllLeafColumns()]);
  //   } else {
  //     console.log('deselect all column');
  //     //incorrect from inialization
  //     // setPendingColumnSelection([]);
  //   }
  // }, [allColumnsSelected]);

  const sortSelected = () => {
    const selected = [];
    const deselected = [];
    pendingColumnSelection.forEach(col => {
      if (col.getIsVisible()) {
        deselected.push(col);
      } else {
        selected.push(col);
      }
    });
    return { selected, deselected };
  };

  useEffect(() => {
    const totalSelection = [...selectedColumns, ...pendingColumnSelection];
    const { selected, deselected } = sortSelected();

    if (deselected.length === 0 && selected.length + selectedColumns.length === table.getAllLeafColumns().length) {
      console.log('mark all columns button as selected', selected, selectedColumns);
      // setAllColumnsSelected(true);
    } else if (selectedColumns.length - deselected.length === 0) {
      console.log('mark all columns button as unselected');
      //   setAllColumnsSelected(false);
    } else {
      console.log('mark all columns button as indeterminate');
    }
  }, [pendingColumnSelection]);

  const CheckBoxList = columnList => (
    <>
      {columnList?.map(col => {
        const { id, columnDef } = col;
        return (
          <label className={checkbox_label} key={id}>
            <div className={checkbox_wrapper}>
              <input
                type="checkbox"
                // checked={allColumnsSelected || undefined}
                defaultChecked={defaultSelection(col)}
                onChange={() => handleChange(col)}
                onKeyDown={e => e.key === 'Enter' && handleChange(col)}
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
      {filter.length === 0 && <SelectAll setAllColumnsSelected={setAllColumnsSelected} allColumnsSelected={allColumnsSelected} />}
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
