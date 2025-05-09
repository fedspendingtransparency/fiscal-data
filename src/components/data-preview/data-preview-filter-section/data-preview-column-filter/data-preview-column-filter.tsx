import React, { FunctionComponent, useContext, useState } from 'react';
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
  const [active, setActive] = useState(false);
  const displayDefault = defaultSelectedColumns && defaultSelectedColumns.length > 0;
  const [filter, setFilter] = useState('');
  const [noResults, setNoResults] = useState(false);

  const handleApply = () => {
    setActive(false);
  };

  const handleCancel = () => {
    setActive(false);
  };

  const filterDropdownButton = (
    <DropdownLabelButton
      label="Columns"
      selectedOption={!!table ? table.getVisibleFlatColumns().length + '/' + fields?.length : ''}
      icon={faTable}
      active={active}
      setActive={setActive}
      disabled={allTablesSelected || isDisabled}
    />
  );

  const columnSelectList = (
    <>
      {noResults ? (
        <div className={noMatch}>
          No match for <span className={unmatchedTerm}>'{filter}'</span>. Please revise your search and try again.
        </div>
      ) : (
        <ColumnSelectionList
          table={table}
          defaultSelectedColumns={defaultSelectedColumns}
          defaultColumns={defaultColumns}
          additionalColumns={additionalColumns}
          displayDefault={displayDefault}
          filter={filter}
          setNoResults={setNoResults}
        />
      )}
    </>
  );

  return (
    <>
      {width >= pxToNumber(breakpointLg) && (
        <DropdownContainer dropdownButton={filterDropdownButton} setActive={setActive}>
          {active && (
            <div className={dropdownContent}>
              <SearchContainer filter={filter} setFilter={setFilter} searchLabel="Search columns" setNoResults={setNoResults}>
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
          {active && (
            <DataPreviewMobileDialog
              onCancel={handleCancel}
              onBack={handleCancel}
              filterName="Columns"
              searchText="Search columns"
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
