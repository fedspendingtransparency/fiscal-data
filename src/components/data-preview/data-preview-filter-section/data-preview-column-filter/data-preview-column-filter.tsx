import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from '../../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../../dropdown-container/dropdown-container';
import { DataTableContext } from '../../data-preview-context';
import { dropdownContent, noMatch, unmatchedTerm } from './data-preview-column-filter.module.scss';
import FilterButtons from '../../data-preview-dropdown-dialog/filter-buttons/filter-buttons';
import { pxToNumber } from '../../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../data-preview.module.scss';
import DataPreviewMobileDialog from '../../data-preview-mobile-dialog/data-preview-mobile-dialog';
import SearchContainer from '../../../search-container/search-container';
import ColumnSelectionList from './column-selection-list/column-selection-list';

interface iColumnFilter {
  allTablesSelected: boolean;
  dateField: string;
  isDisabled: boolean;
  width?: number;
  pivotView;
  dropdownWidth;
}

const DataPreviewColumnFilter: FunctionComponent<iColumnFilter> = ({ allTablesSelected, dateField, isDisabled, width, pivotView, dropdownWidth }) => {
  const { defaultColumns, additionalColumns, allColumns: fields, defaultSelectedColumns, tableState: table } = useContext(DataTableContext);

  const [dropdownActive, setDropdownActive] = useState(false);
  const pivotDisplay = pivotView?.title !== 'Complete Table' && pivotView?.dimensionField;
  const displayDefault = defaultSelectedColumns && defaultSelectedColumns.length > 0 && !pivotDisplay;
  const [filter, setFilter] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [pendingColumnSelection, setPendingColumnSelection] = useState([]);
  const [filteredColumns, setFilteredColumns] = useState();
  const searchLabel = 'Search columns';

  const handleApply = () => {
    pendingColumnSelection.forEach(col => {
      const { toggleVisibility } = col;
      toggleVisibility();
    });
    setPendingColumnSelection([]);
    setDropdownActive(false);
  };

  const handleCancel = () => {
    setDropdownActive(false);
    setPendingColumnSelection([]);
  };

  const filterDropdownButton = (
    <DropdownLabelButton
      label="Columns"
      selectedOption={!!table && !allTablesSelected ? table?.getVisibleFlatColumns().length + '/' + fields?.length : ''}
      icon={faTable}
      active={dropdownActive}
      setActive={setDropdownActive}
      disabled={allTablesSelected || isDisabled}
      dropdownWidth={dropdownWidth}
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
          table={table}
          disabledFields={pivotDisplay ? [dateField, 'Time Period'] : []}
        />
      </div>
    </>
  );

  useEffect(() => {
    //initialize filteredColumns after table is initialized
    setFilteredColumns(table?.getAllLeafColumns());
  }, [fields, table]);

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
          {dropdownActive && table && (
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
