import React, { FunctionComponent, useState } from 'react';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from './../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import DataPreviewDropdownDialogContainer from '../data-preview-dropdown-dialog/data-preview-dropdown-dialog';
import DataPreviewDataTableSelectFilters from '../data-preview-data-table-select-filters/data-preview-data-table-select-filters';

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

  const dataTableSearch = <>Placeholder for data table search</>;

  const handleApply = () => setActive(false);

  const handleCancel = () => setActive(false);

  return (
    <DropdownContainer dropdownButton={dropdownButton} setActive={setActive} active={active}>
      {active && (
        <DataPreviewDropdownDialogContainer
          searchComponent={dataTableSearch}
          filterComponent={<DataPreviewDataTableSelectFilters />}
          handleApply={handleApply}
          handleCancel={handleCancel}
        />
      )}
    </DropdownContainer>
  );
};

export default DataPreviewTableSelectDropdown;
