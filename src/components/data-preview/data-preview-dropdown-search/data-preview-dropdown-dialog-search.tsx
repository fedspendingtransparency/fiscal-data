import React, { FunctionComponent, useState } from 'react';
import { dataTableSearchContainer } from './data-preview-dropdown-dialog-search.spec';
import ComboSelectDropdown from '../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';
interface ButtonData {
  label: string;
  subtitle?: string;
  onClick: () => void;
  dataTableType: 'dataTable' | 'searchFilter';
}

interface Props {
  options: ButtonData[];
  searchBarLabel: string;
  selectedTable: any;
  setSelectedTable: any;
  active: boolean;
}

const DataPreviewDropdownDialogSearch: FunctionComponent<Props> = ({ selectedTable, setSelectedTable, options, searchBarLabel, active }) => {
  const [actives, setActive] = useState(active);
  const [searchBarActive, setSearchBarActive] = useState(false);
  const handleSearchChange = (option: ButtonData) => {
    setSelectedTable(option);
  };

  return (
    <div className={dataTableSearchContainer}>
      <ComboSelectDropdown
        active={actives}
        setDropdownActive={setActive}
        selectedOption={selectedTable}
        updateSelection={handleSearchChange}
        searchBarLabel={searchBarLabel}
        options={options}
        optionLabelKey="tableName"
        searchBarActive={searchBarActive}
        setSearchBarActive={setSearchBarActive}
      />
    </div>
  );
};

export default DataPreviewDropdownDialogSearch;
