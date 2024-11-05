import React, { FunctionComponent, useState } from 'react';
import DropdownLabelButton from '../../dropdown-label-button/dropdown-label-button';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import DropdownContainer from '../../dropdown-label-button/dropdown-container';
import ComboSelectDropdown from '../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';

const ReportFilter: FunctionComponent = () => {
  const mockOptions = [
    { value: 'test', label: 'test' },
    { value: 'test2', label: 'test2' },
  ];
  const [active, setActive] = useState(false);

  const [selectedReport, setSelectedReport] = useState(mockOptions[0]);
  const changeHandler = updatedReport => {
    if (updatedReport !== null) {
      setSelectedReport(updatedReport);
    }
  };

  const dropdownButton = (
    <DropdownLabelButton selectedOption={selectedReport.label} label="Report" icon={faFileLines} active={active} setActive={setActive} />
  );

  const mockFunction = () => {};

  return (
    <>
      <DropdownContainer setActive={setActive} active={active} dropdownButton={dropdownButton}>
        <ComboSelectDropdown
          active={active}
          setDropdownActive={setActive}
          selectedOption={selectedReport}
          updateSelection={setSelectedReport}
          searchBarLabel="Search reports"
          options={mockOptions}
          setMouseOverDropdown={mockFunction}
        />
      </DropdownContainer>
    </>
  );
};

export default ReportFilter;
