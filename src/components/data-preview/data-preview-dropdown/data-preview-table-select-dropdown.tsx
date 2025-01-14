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
  const searchBarLabel = 'Search data tables';

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
      setSelectedPivot(null);
    }
    setActive(false);
  };

  const handleCancel = () => setActive(false);

  useEffect(() => {
    if (!active) {
      setTableViewSelection(appliedTableView);
    }
  }, [active]);

  const updateSelectedTable = table => {
    setTableViewSelection('rawData');
    setTableToApply(table);
    setPivotToApply(null);
  };

  return (
    <DropdownContainer dropdownButton={dropdownButton} setActive={setActive} active={active}>
      {active && (
        <DataPreviewDropdownDialogContainer
          searchComponent={
            <DataPreviewDropdownDialogSearch
              options={options}
              searchBarLabel={searchBarLabel}
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
  );
};

export default DataPreviewTableSelectDropdown;
