import React, { FunctionComponent, useState } from 'react';
import {
  dataTableSearchContainer,
  comboSlecetDropdownWrapper
} from './dialog-search.module.scss';
import ComboSelectDropdown from '../../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';

interface ButtonData {
  label: string;
  subtitle?: string;
  onClick: () => void;
  type: 'dataTable' | 'searchFilter';
}

interface Props {
  options: ButtonData[];
  searchBarLabel: string;
  selectedTable: any;
  setSelectedTable: any;
}

const DataPreviewDropdownDialogSearch: FunctionComponent<Props> = ({  
  selectedTable,
  setSelectedTable,  
  options, 
  searchBarLabel }) => {
  const [selectedTable2, setSelectedTable2]  = useState()
  const [active, setActive] = useState(false);
  const [searchBarActive, setSearchBarActive] = useState(false);

  const handleSearchChange = (option: ButtonData) => {
    setSelectedTable(option);
    
  };
  console.log('e,target',selectedTable);
  return (
    <div className={dataTableSearchContainer}>
      <div className={comboSlecetDropdownWrapper}>
        
      </div>
      <ComboSelectDropdown
          active={true}
          setDropdownActive={setActive}
          selectedOption={selectedTable}
          updateSelection={handleSearchChange}
          searchBarLabel={searchBarLabel}
          options={options}
          searchBarActive={searchBarActive}
          setSearchBarActive={setSearchBarActive}
        />
      {/* <div className={dataTableSearchBar}>
        <SearchBar
          label={searchBarLabel}
          onChange={handleSearchChange}
          filter={searchFilter}
          handleClear={() => setSearchFilter('')}
          active={active}
          setActive={setActive}
        />
      </div>

      <div className={buttonList}>
        {filteredButtons.length > 0 ? (
          filteredButtons.map((button, index) => (
            <button key={index} onClick={button.onClick} className={buttonItem}>
              <span>{button.label}</span>
              {button.subtitle && <small>{button.subtitle}</small>}
            </button>
          ))
        ) : (
          <div className={noMatch}>
            No match for <span className={unmatchedTerm}>'{searchFilter}'</span>. Please revise your search and try again.
          </div>
        )}
      </div> */}
    </div>
  );
};

export default DataPreviewDropdownDialogSearch;
