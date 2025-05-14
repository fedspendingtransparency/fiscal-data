import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { checkmarkText, container, labelCheckmarkContainer, selectAll } from './data-preview-select-all.module.scss';

const SelectAll = ({ allColumnsSelected, setAllColumnsSelected, checkboxesSelected, allSelected }) => {
  const onButtonClick = () => {
    const updatedValue = !allColumnsSelected;
    setAllColumnsSelected(updatedValue);
    if (updatedValue) {
      console.log('select all checkboxes');
    } else {
      console.log('deselect all checkboxes');
    }
  };

  return (
    <div className={container}>
      <label>
        <input
          name="selectAll"
          onKeyDown={e => e.key === 'Enter' && onButtonClick()}
          onClick={onButtonClick}
          type="checkbox"
          checked={checkboxesSelected.length > 0}
          // defaultChecked={allColumnsSelected}
          className={selectAll}
        />
        <span className={labelCheckmarkContainer}>
          <span className={checkmarkText}>
            <FontAwesomeIcon icon={allSelected ? faCheck : faMinus} size="sm" />
          </span>
        </span>
        All Columns
      </label>
    </div>
  );
};

export default SelectAll;
