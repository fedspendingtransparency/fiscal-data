import React, { FunctionComponent, useState } from 'react';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import { dataPreview, dataPreviewHeader, dataPreviewTitle } from './data-preview-dropdown.module.scss';
import DropdownLabelButton from './../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../dropdown-container/dropdown-container';

type DataPreviewProp = {
  tableName: string;
};

const DataPreviewDropdown: FunctionComponent<DataPreviewProp> = ({ tableName }) => {
  const [active, setActive] = useState(false);

  const dropdownButton = (
    <DropdownLabelButton label={'Data Table'} icon={faDatabase} selectedOption={tableName} active={active} setActive={setActive} />
  );

  return (
    <DropdownContainer dropdownButton={dropdownButton} setActive={setActive} active={active}>
      {/* DROP DOWN CONTAINER GOES HERE*/}
    </DropdownContainer>
  );
};

export default DataPreviewDropdown;
