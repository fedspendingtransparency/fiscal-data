import React, { FunctionComponent, useState } from 'react';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from './../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../dropdown-container/dropdown-container';

//TODO: add type def
type DataPreviewProp = { apis; selectedTable; setSelectedTable; allTablesSelected; earliestDate; latestDate; disableAllTables };

const DataPreviewTableSelectDropdown: FunctionComponent<DataPreviewProp> = ({
  apis,
  selectedTable,
  setSelectedTable,
  allTablesSelected,
  earliestDate,
  latestDate,
  disableAllTables,
}) => {
  const [active, setActive] = useState(false);

  const dropdownButton = (
    <DropdownLabelButton
      label="Data Table"
      icon={faDatabase}
      selectedOption={selectedTable?.tableName}
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
