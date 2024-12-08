import React, { FunctionComponent, useState } from 'react';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from './../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import DataPreviewDropdownDialogContainer from '../data-preview-dropdown-dialog/data-preview-dropdown-dialog';
import DataPreviewDropdownDialogSearch from '../data-preview-dropdown-dialog/dialog-search/dialog-search';
import { allTablesOption } from '../../datatable-select/datatable-select';
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
  const options = disableAllTables
  ? apis
  : [
      {
        ...allTablesOption,
        earliestDate,
        latestDate,
      },
    ].concat(apis);

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
  const buttons = options.map((options) => ({
    label: options.tableName,
    onClick: () => setSelectedTable(options),
    type: 'dataTable',
  }));
  const searchBarLabel = "Search Data table"
  const dataTableSearch = <DataPreviewDropdownDialogSearch buttons={buttons} searchBarLabel={searchBarLabel} />;
  console.log('setSelectedTable ',apis);
  const dataTableFilters = <>Placeholder for data table filters</>;

  const handleApply = () => setActive(false);

  const handleCancel = () => setActive(true);

  return (
    <DropdownContainer dropdownButton={dropdownButton} setActive={setActive} active={active}>
      {active && (
        <DataPreviewDropdownDialogContainer
          searchComponent={dataTableSearch}
          filterComponent={dataTableFilters}
          handleApply={handleApply}
          handleCancel={handleCancel}
        />
      )}
    </DropdownContainer>
  );
};

export default DataPreviewTableSelectDropdown;
