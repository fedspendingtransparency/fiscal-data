import React, { FunctionComponent, useEffect, useState } from 'react';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from './../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import DataPreviewDropdownDialogContainer from '../data-preview-dropdown-dialog/data-preview-dropdown-dialog';
import DataPreviewPivotSelect from '../data-preview-pivot-select/data-preview-pivot-select';
import { ITableSelectDropdown } from '../../../models/data-preview/ITableSelectDropdown';
import { allTablesOption } from '../../datatable-select/datatable-select';
import DataPreviewDropdownDialogSearch from '../data-preview-dropdown-search/data-preview-dropdown-dialog-search';

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
}) => {
  const [active, setActive] = useState(false);
  const [tableToApply, setTableToApply] = useState(selectedTable);
  const [pivotToApply, setPivotToApply] = useState(selectedPivot);
  const [appliedTableView, setAppliedTableView] = useState('rawData');
  const [tableViewSelection, setTableViewSelection] = useState(appliedTableView);
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
      selectedOption={selectedTable?.tableName}
      active={active}
      setActive={setActive}
      dropdownWidth="30rem"
    />
  );

  const handleApply = () => {
    setAppliedTableView(tableViewSelection);
    if (tableToApply !== selectedTable) {
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
  };

  const handleCancel = () => setActive(false);

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
      setTableToApply(selectedTable);
    }
  }, [active]);

  useEffect(() => {
    if (selectedTable && !selectedTable.allDataTables && !selectedPivot) {
      const localPivotFields = getPivotFields(selectedTable);
      const pivot = {
        pivotView: selectedTable.dataDisplays ? selectedTable.dataDisplays[0] : null,
        pivotValue: localPivotFields && selectedTable.dataDisplays[0].dimensionField ? localPivotFields[0] : null,
      };
      setSelectedPivot(pivot);
    }
  }, [selectedTable]);

  return (
    <>
      {!hideDropdown && (
        <DropdownContainer dropdownButton={dropdownButton} setActive={setActive} active={active}>
          {active && (
            <DataPreviewDropdownDialogContainer
              searchComponent={
                <DataPreviewDropdownDialogSearch
                  options={options}
                  searchBarLabel="Search data tables"
                  selectedTable={tableToApply}
                  setSelectedTable={updateSelectedTable}
                />
              }
              filterComponent={
                <DataPreviewPivotSelect
                  table={tableToApply}
                  pivotToApply={pivotToApply}
                  setPivotToApply={setPivotToApply}
                  tableViewSelection={tableViewSelection}
                  setTableViewSelection={setTableViewSelection}
                />
              }
              handleApply={handleApply}
              handleCancel={handleCancel}
            />
          )}
        </DropdownContainer>
      )}
    </>
  );
};

export default DataPreviewTableSelectDropdown;
