import React, { FunctionComponent, useState } from 'react';
import { dataTableSearchContainer, hideDropdownBorder } from './data-preview-dropdown-dialog-search.module.scss';
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
  selectedOption;
  setSelectedOption;
  optionLabelKey: string;
  secondaryLabelKey?: string;
}

const DataPreviewDropdownDialogSearch: FunctionComponent<DialogSearchProps> = ({
  selectedOption,
  setSelectedOption,
  options,
  searchBarLabel,
  optionLabelKey,
  secondaryLabelKey,
  isFilter,
  noBorder = true,
}) => {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const handleSearchChange = (option: ButtonData) => {
    if (setSelectedOption) {
      setSelectedOption(option);
    }
  };

  return (
    <div className={`${dataTableSearchContainer} ${noBorder ? hideDropdownBorder : ''}`}>
      <ComboSelectDropdown
        active={true}
        selectedOption={selectedOption}
        updateSelection={handleSearchChange}
        searchBarLabel={searchBarLabel}
        options={options}
        optionLabelKey={optionLabelKey}
        searchBarActive={searchBarActive}
        setSearchBarActive={setSearchBarActive}
        secondaryLabelKey={secondaryLabelKey}
        isFilter={isFilter}
      />
    </div>
  );
};

export default DataPreviewDropdownDialogSearch;
