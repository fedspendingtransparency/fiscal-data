import React, { FunctionComponent, useState } from 'react';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from './../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../dropdown-container/dropdown-container';

type DataPreviewProp = {
  tableName: string;
};

const DataPreviewTableSelectDropdown: FunctionComponent<DataPreviewProp> = ({ tableName }) => {
  const [active, setActive] = useState(false);

  const dropdownButton = (
    <DropdownLabelButton
      label="Data Table"
      icon={faDatabase}
      selectedOption={tableName}
      active={active}
      setActive={setActive}
      dropdownWidth="30rem"
    />
  );

  return (
    <DropdownContainer dropdownButton={dropdownButton} setActive={setActive} active={active}>
      {/* DROP DOWN CONTAINER GOES HERE*/}
    </DropdownContainer>
  );
};

export default DataPreviewTableSelectDropdown;
