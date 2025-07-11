import React, { FunctionComponent, useState } from 'react';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import { dropdownContent } from '../date-range-month-picker.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { dropdownButton } from './month-picker.module.scss';

const MonthPicker: FunctionComponent = ({ text, setSelectedDate, selectedDate }) => {
  const [dropdownActive, setDropdownActive] = useState(false);
  const button = (
    <button onClick={() => setDropdownActive(!dropdownActive)} className={dropdownButton}>
      {text}: <FontAwesomeIcon icon={dropdownActive ? faCaretUp : faCaretDown} />
    </button>
  );
  return (
    <>
      <DropdownContainer dropdownButton={button} setActive={setDropdownActive}>
        {dropdownActive && <div className={dropdownContent}>content</div>}
      </DropdownContainer>
    </>
  );
};

export default MonthPicker;
