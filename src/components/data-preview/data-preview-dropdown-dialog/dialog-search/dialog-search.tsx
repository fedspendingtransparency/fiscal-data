import React, { FunctionComponent, useState } from 'react';
import {
  dataTableSearchContainer,
  buttonList,
  buttonItem,
  dataTableSearchBar,
  noMatch,
  unmatchedTerm,
} from './dialog-search.module.scss';
import SearchBar from '../../../search-bar/search-bar';
import ComboSelectDropdown from '../../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';
import { selectedTable } from '../../../api-quick-guide/test-helpers/test-helpers';

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
//  const [selectedTable, setSelectedTable]  = useState()
  const [active, setActive] = useState(false);
  const [searchBarActive, setSearchBarActive] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSelectedTable(e.target);
    
  };
  console.log('e,target',selectedTable);
  return (
    <div className={dataTableSearchContainer}>
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
