import React, { FunctionComponent, useEffect, useState } from 'react';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from '../../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../../dropdown-container/dropdown-container';
import DataPreviewDropdownDialogContainer from '../../data-preview-dropdown-dialog/data-preview-dropdown-dialog';
import ColumnFilterOptions from './column-filter-options/column-filter-options';
import { ITableFilters } from '../../../../models/data-preview/ITableFilters';
import DataPreviewMobileDialog from '../../data-preview-mobile-dialog/data-preview-mobile-dialog';
import { pxToNumber } from '../../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../data-preview.module.scss';
import DataPreviewMobileFilterList from '../data-preview-mobile-filter-list/data-preview-mobile-filter-list';
import { boldedSearchText, noFilterMatchContainer } from '../data-preview-filter-section.module.scss';

const DataPreviewTableFilters: FunctionComponent<ITableFilters> = ({
  selectedTable,
  config,
  setDateRange,
  allTablesSelected,
  handleDateRangeChange,
  setIsCustomDateRange,
  finalDatesNotFound,
  detailApi,
  detailViewState,
  apiData,
  width,
}) => {
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [active, setActive] = useState(false);
  // TODO update default value to first column in list
  // const [selectedColumn, setSelectedColumn] = useState({ name: 'Record Date', type: 'Not a date', field: 'record_date' });
  const [selectedColumn, setSelectedColumn] = useState('');
  const [isFilterSelected, setIsFilterSelected] = useState(false);
  const [filter, setFilter] = useState('');
  const [visibleOptions, setVisibleOptions] = useState(selectedTable.fields);
  const [noResults, setNoResults] = useState(false);

  const filterDropdownButton = (
    <DropdownLabelButton label="Filters" selectedOption={appliedFilters.length + ' applied'} icon={faFilter} active={active} setActive={setActive} />
  );

  const handleApply = () => {
    setActive(false);
    if (isFilterSelected) {
      setIsFilterSelected(false);
    }
  };
  const handleCancel = () => {
    setActive(false);
    if (isFilterSelected) {
      setIsFilterSelected(false);
    }
  };

  const handleBack = () => {
    if (isFilterSelected) {
      setIsFilterSelected(false);
    }
  };

  // Need to find a way to prevent background scrolling for mobile users
  // useEffect(() => {
  //   if (active) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = '';
  //   }
  // }, [active]);

  useEffect(() => {
    const search = filter.toLowerCase();

    if (!search) {
      setVisibleOptions(selectedTable.fields);
      setNoResults(false);
      return;
    }

    const matches = selectedTable.fields.filter(option => {
      const name = option.prettyName.toLowerCase();
      const secondary = (option.secondary ?? '').toLowerCase();
      return name.includes(search) || secondary.includes(search);
    });

    setVisibleOptions(matches);
    setNoResults(matches.length === 0);
  }, [filter, selectedTable.fields]);

  const filterSelectList = (
    <>
      {noResults ? (
        <div className={noFilterMatchContainer}>
          No match for <span className={boldedSearchText}>'{filter}'</span>. Please revise your search and try again.
        </div>
      ) : (
        <DataPreviewMobileFilterList
          filterOptions={visibleOptions}
          filter={filter}
          getName={option => option.prettyName}
          getSecondary={option => option.secondary}
          onIsFilterSelected={filter => {
            setIsFilterSelected(true);
          }}
          onWhichFilterSelected={filter => {
            setSelectedColumn(filter);
          }}
        />
      )}
    </>
  );

  const mobileFilterComponent = isFilterSelected ? (
    // Shows the selected filter and its options
    <DataPreviewMobileDialog
      onCancel={handleCancel}
      onBack={handleBack}
      filterName={selectedColumn.prettyName}
      hasSearch={false}
      backButtonText={'Filters'}
      searchText="Search filters"
      filterComponent={
        <ColumnFilterOptions
          setAppliedFilters={setAppliedFilters}
          selectedColumn={selectedColumn}
          selectedTable={selectedTable}
          config={config}
          setDateRange={setDateRange}
          allTablesSelected={allTablesSelected}
          handleDateRangeChange={handleDateRangeChange}
          setIsCustomDateRange={setIsCustomDateRange}
          finalDatesNotFound={finalDatesNotFound}
          detailApi={detailApi}
          detailViewState={detailViewState}
          apiData={apiData}
        />
      }
    />
  ) : (
    // Shows the different filters to select
    <DataPreviewMobileDialog
      onCancel={handleCancel}
      onBack={handleCancel}
      filterName="Filters"
      searchText="Search filters"
      filter={filter}
      setFilter={setFilter}
      setNoSearchResults={setNoResults}
      filterComponent={filterSelectList}
    />
  );

  return (
    <>
      {width >= pxToNumber(breakpointLg) && (
        <DropdownContainer dropdownButton={filterDropdownButton} setActive={setActive}>
          {active && (
            <DataPreviewDropdownDialogContainer
              searchComponent={<>search component placeholder</>}
              filterComponent={
                <ColumnFilterOptions
                  setAppliedFilters={setAppliedFilters}
                  selectedColumn={selectedColumn}
                  selectedTable={selectedTable}
                  config={config}
                  setDateRange={setDateRange}
                  allTablesSelected={allTablesSelected}
                  handleDateRangeChange={handleDateRangeChange}
                  setIsCustomDateRange={setIsCustomDateRange}
                  finalDatesNotFound={finalDatesNotFound}
                  detailApi={detailApi}
                  detailViewState={detailViewState}
                  apiData={apiData}
                />
              }
              handleApply={handleApply}
              handleCancel={handleCancel}
            />
          )}
        </DropdownContainer>
      )}
      {width < pxToNumber(breakpointLg) && (
        <>
          {filterDropdownButton}
          {active && mobileFilterComponent}
        </>
      )}
    </>
  );
};
export default DataPreviewTableFilters;
