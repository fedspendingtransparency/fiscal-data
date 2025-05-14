import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from '../../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../../dropdown-container/dropdown-container';
import { DataTableContext } from '../../data-preview-context';
import { dropdownContent, noMatch, unmatchedTerm } from './data-preview-column-filter.module.scss';
import FilterButtons from '../../data-preview-dropdown-dialog/filter-buttons/filter-buttons';
import ColumnSelectionList from './column-selection-list/column-selection-list';
import { pxToNumber } from '../../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../data-preview.module.scss';
import DataPreviewMobileDialog from '../../data-preview-mobile-dialog/data-preview-mobile-dialog';
import SearchContainer from '../../../search-container/search-container';

interface iColumnFilter {
  allTablesSelected: boolean;
  isDisabled: boolean;
  width?: number;
}

const DataPreviewColumnFilter: FunctionComponent<iColumnFilter> = ({ allTablesSelected, isDisabled, width }) => {
  const { defaultColumns, additionalColumns, allColumns: fields, defaultSelectedColumns, tableState: table } = useContext(DataTableContext);
  const [dropdownActive, setDropdownActive] = useState(false);
  const displayDefault = defaultSelectedColumns && defaultSelectedColumns.length > 0;
  const [filter, setFilter] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [filteredColumns, setFilteredColumns] = useState(table?.getAllLeafColumns());
  const [selectedColumns, setSelectedColumns] = useState(table?.getVisibleFlatColumns());
  const [pendingColumnSelection, setPendingColumnSelection] = useState([]);

  const searchLabel = 'Search columns';

  const handleApply = () => {
    const updatedSelection = selectedColumns;
    pendingColumnSelection.forEach(col => {
      const { toggleVisibility } = col;
      toggleVisibility();
    });
    setPendingColumnSelection([]);
    setDropdownActive(false);
    setSelectedColumns(updatedSelection);
  };

  const handleCancel = () => {
    setDropdownActive(false);
    setPendingColumnSelection([]);
  };

  useEffect(() => {
    //initialize selectedColumns after table is initialized
    setSelectedColumns(table?.getVisibleFlatColumns());
  }, [defaultColumns, table?.getVisibleFlatColumns()]);

  const filterDropdownButton = (
    <DropdownLabelButton
      label="Columns"
      selectedOption={!!table ? table.getVisibleFlatColumns().length + '/' + fields?.length : ''}
      icon={faTable}
      active={dropdownActive}
      setActive={setDropdownActive}
      disabled={allTablesSelected || isDisabled}
    />
  );

  const columnSelectList = (
    <>
      <div className={noMatch} hidden={!noResults}>
        No match for <span className={unmatchedTerm}>'{filter}'</span>. Please revise your search and try again.
      </div>
      <div hidden={noResults}>
        <ColumnSelectionList
          defaultColumns={defaultColumns}
          additionalColumns={additionalColumns}
          displayDefault={displayDefault}
          filter={filter}
          filteredColumns={filteredColumns}
          setPendingColumnSelection={setPendingColumnSelection}
          pendingColumnSelection={pendingColumnSelection}
          selectedColumns={selectedColumns}
          table={table}
        />
      </div>
    </>
  );

  useEffect(() => {
    if (table) {
      const filteredList = table.getAllLeafColumns().filter(col => col.columnDef.header.toUpperCase().includes(filter.toUpperCase()));
      setFilteredColumns(filteredList);
      setNoResults(filteredList.length === 0);
    }
  }, [filter]);

  return (
    <>
      {width >= pxToNumber(breakpointLg) && (
        <DropdownContainer dropdownButton={filterDropdownButton} setActive={handleCancel}>
          {dropdownActive && (
            <div className={dropdownContent}>
              <SearchContainer filter={filter} setFilter={setFilter} searchLabel={searchLabel} setNoResults={setNoResults}>
                {columnSelectList}
              </SearchContainer>
              <FilterButtons handleApply={handleApply} handleCancel={handleCancel} />
            </div>
          )}
        </DropdownContainer>
      )}
      {width < pxToNumber(breakpointLg) && (
        <>
          {filterDropdownButton}
          {dropdownActive && (
            <DataPreviewMobileDialog
              onCancel={handleCancel}
              onApply={handleApply}
              onBack={handleCancel}
              setNoSearchResults={setNoResults}
              filterName="Columns"
              searchText={searchLabel}
              filter={filter}
              setFilter={setFilter}
              filterComponent={columnSelectList}
            />
          )}
        </>
      )}
    </>
  );
};

export default DataPreviewColumnFilter;
