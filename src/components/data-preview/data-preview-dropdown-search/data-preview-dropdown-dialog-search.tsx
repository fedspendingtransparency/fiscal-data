import React, {FunctionComponent, useState} from 'react';
import {dataTableSearchContainer} from './data-preview-dropdown-dialog-search.module.scss';
import ComboSelectDropdown from '../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';

interface ButtonData {
  label: string;
  subtitle?: string;
  onClick: () => void;
  dataTableType: 'dataTable' | 'searchFilter';
}

interface DialogSearchProps {
  options: ButtonData[];
  searchBarLabel: string;
  selectedTable: any;
  setSelectedTable: any;
  selectedFilter: any;
  setSelectedFilter: any;
  optionLabelKey: string;
}

const DataPreviewDropdownDialogSearch: FunctionComponent<DialogSearchProps> = ({
  selectedTable,
  setSelectedTable,
  selectedFilter,
  setSelectedFilter,
  options,
  searchBarLabel,
  optionLabelKey,
  active,
}) => {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const handleSearchChange = (option: ButtonData) => {
    if (setSelectedTable) {
      setSelectedTable(option);
    }
    if (setSelectedFilter) {
      setSelectedFilter(option);
    }
  };

  return (
    <div className={dataTableSearchContainer}>
      <ComboSelectDropdown
        active={true}
        selectedOption={selectedTable || selectedFilter}
        updateSelection={handleSearchChange}
        searchBarLabel={searchBarLabel}
        options={options}
        optionLabelKey={optionLabelKey}
        searchBarActive={searchBarActive}
        setSearchBarActive={setSearchBarActive}
      />
    </div>
  );
};

export default DataPreviewDropdownDialogSearch;
