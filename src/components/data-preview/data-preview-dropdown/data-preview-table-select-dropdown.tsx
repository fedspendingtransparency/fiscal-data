import React, { FunctionComponent, useEffect, useState } from 'react';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from './../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import DataPreviewDropdownDialogContainer from '../data-preview-dropdown-dialog/data-preview-dropdown-dialog';
import DataPreviewPivotSelect from '../data-preview-pivot-select/data-preview-pivot-select';
import { ITableSelectDropdown } from '../../../models/data-preview/ITableSelectDropdown';
import DataPreviewDropdownDialogSearch from '../data-preview-dropdown-search/data-preview-dropdown-dialog-search';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../data-preview.module.scss';
import DataPreviewMobileDialog from '../data-preview-mobile-dialog/data-preview-mobile-dialog';
import DataPreviewMobileFilterList from '../data-preview-filter-section/data-preview-mobile-filter-list/data-preview-mobile-filter-list';

const DataPreviewTableSelectDropdown: FunctionComponent<ITableSelectDropdown> = ({
  apis,
  selectedTable,
  setSelectedTable,
  allTablesSelected,
  earliestDate,
  latestDate,
  disableAllTables,
  selectedPivot,
  setSelectedPivot,
  hideDropdown,
  width,
  pivotsUpdated,
}) => {
  const allTablesOption = {
    allDataTables: true,
    pathName: 'all-data-tables',
    tableName: 'All Data Tables (Download Only)',
    valueFieldOptions: null,
  };

  const initialSelectedTable = allTablesSelected ? allTablesOption : selectedTable;
  const [active, setActive] = useState(false);
  const [tableToApply, setTableToApply] = useState(initialSelectedTable);
  const [pivotToApply, setPivotToApply] = useState(selectedPivot);
  const [appliedTableView, setAppliedTableView] = useState('rawData');
  const [tableViewSelection, setTableViewSelection] = useState(appliedTableView);
  const [isDataTableSelected, setIsDataTableSelected] = useState(false);
  const [filter, setFilter] = useState('');

  // 54px comes from subtracting the padding and margins on both sides of the container
  const containerWdith = 'calc(100vw - 54px)';
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
      selectedOption={allTablesSelected ? allTablesOption.tableName : selectedTable?.tableName}
      active={active}
      setActive={setActive}
      dropdownWidth={width < pxToNumber(breakpointLg) ? '100%' : '30rem'}
    />
  );

  const handleApply = () => {
    setAppliedTableView(tableViewSelection);
    if (tableToApply !== selectedTable || (allTablesSelected && !tableToApply.allDataTables)) {
      setSelectedTable(tableToApply);
    }
    if (tableViewSelection === 'pivotData') {
      if (pivotToApply !== selectedPivot) {
        setSelectedPivot(pivotToApply);
      }
    } else {
      const localPivotFields = getPivotFields(selectedTable);
      const pivot = {
        pivotView: selectedTable.dataDisplays ? selectedTable.dataDisplays[0] : null,
        pivotValue: localPivotFields && selectedTable.dataDisplays[0].dimensionField ? localPivotFields[0] : null,
      };
      setSelectedPivot(pivot);
    }
    setActive(false);
    if (isDataTableSelected) {
      setIsDataTableSelected(false);
    }
  };

  const handleCancel = () => {
    setActive(false);
    if (isDataTableSelected) {
      setIsDataTableSelected(false);
    }
  };
  const handleBack = () => {
    if (isDataTableSelected) {
      setIsDataTableSelected(false);
    }
  };

  const updateSelectedTable = table => {
    if (table !== tableToApply) {
      setTableViewSelection('rawData');
      setTableToApply(table);
      setPivotToApply(null);
    }
  };

  const getPivotFields = table => {
    if (table && table.valueFieldOptions) {
      return table.fields.filter(field => table.valueFieldOptions.indexOf(field.columnName) !== -1);
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (!active) {
      setTableViewSelection(appliedTableView);
      if (!allTablesSelected) {
        setTableToApply(selectedTable);
      }
    }
  }, [active]);

  useEffect(() => {
    //initialize pivot options
    if (selectedTable && !selectedTable.allDataTables && !selectedPivot) {
      const localPivotFields = getPivotFields(selectedTable);
      const pivot = {
        pivotView: selectedTable.dataDisplays ? selectedTable.dataDisplays[0] : null,
        pivotValue: localPivotFields && selectedTable.dataDisplays[0].dimensionField ? localPivotFields[0] : null,
      };
      setSelectedPivot(pivot);
    }
  }, [selectedTable]);

  const mobileFilterComponent = isDataTableSelected ? (
    // Shows raw/pivot data options
    <DataPreviewMobileDialog
      onCancel={handleCancel}
      onBack={handleBack}
      onApply={handleApply}
      filterName={tableToApply.tableName}
      hasSearch={false}
      backButtonText="Data Tables"
      active={active}
      filterComponent={
        <DataPreviewPivotSelect
          table={tableToApply}
          pivotToApply={pivotToApply}
          setPivotToApply={setPivotToApply}
          tableViewSelection={tableViewSelection}
          setTableViewSelection={setTableViewSelection}
          pivotsUpdated={pivotsUpdated}
          containerWidth={containerWdith}
        />
      }
    />
  ) : (
    // Shows tables to select
    <DataPreviewMobileDialog
      onCancel={handleCancel}
      onBack={handleCancel}
      onApply={handleApply}
      filterName="Data Tables"
      searchText="Search data tables"
      filter={filter}
      setFilter={setFilter}
      active={active}
      filterComponent={
        <DataPreviewMobileFilterList
          filterOptions={options}
          optionLabelKey="tableName"
          selectedTable={allTablesSelected ? allTablesOption.tableName : selectedTable?.tableName}
          onTableSelected={updateSelectedTable}
          onDataTableSelected={() => {
            setIsDataTableSelected(true);
          }}
          filter={filter}
        />
      }
    />
  );

  return (
    <>
      {!hideDropdown && width >= pxToNumber(breakpointLg) && (
        <DropdownContainer dropdownButton={dropdownButton} setActive={setActive} active={active}>
          {active && (
            <DataPreviewDropdownDialogContainer
              searchComponent={
                <DataPreviewDropdownDialogSearch
                  options={options}
                  searchBarLabel="Search data tables"
                  selectedOption={tableToApply}
                  setSelectedOption={updateSelectedTable}
                  optionLabelKey="tableName"
                />
              }
              filterComponent={
                <DataPreviewPivotSelect
                  table={tableToApply}
                  pivotToApply={pivotToApply}
                  setPivotToApply={setPivotToApply}
                  tableViewSelection={tableViewSelection}
                  setTableViewSelection={setTableViewSelection}
                  pivotsUpdated={pivotsUpdated}
                />
              }
              header={tableToApply?.tableName}
              handleApply={handleApply}
              handleCancel={handleCancel}
            />
          )}
        </DropdownContainer>
      )}
      {!hideDropdown && width < pxToNumber(breakpointLg) && (
        <>
          {dropdownButton}
          {mobileFilterComponent}
        </>
      )}
    </>
  );
};

export default DataPreviewTableSelectDropdown;
