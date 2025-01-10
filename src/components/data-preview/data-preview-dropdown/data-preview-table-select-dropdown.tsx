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
  setTableView,
  pivotToApply,
  setPivotToApply,
}) => {
  const [active, setActive] = useState(false);
  const [tableToApply, setTableToApply] = useState(selectedTable);
  const [pivotsUpdated, setPivotsUpdated] = useState(false);
  // const [pivotToApply, setPivotToApply] = useState(selectedPivot);
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
    if (tableViewSelection === 'pivotData') {
    } else {
      // setAppliedTableView('rawData');
      // setSelectedPivot({ pivotView: { title: 'Complete Table' }, pivotValue: null });
    }
    setAppliedTableView(tableViewSelection);
    // setSelectedPivot(pivotToApply);
    // setTableView({ table: tableToApply, pivot: pivotToApply });
    if (tableToApply !== selectedTable) {
      setSelectedTable(tableToApply);
    }
    if (pivotToApply !== selectedPivot) {
      setSelectedPivot(pivotToApply);
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

  useEffect(() => {
    console.log('pivotToApply', pivotToApply);
  }, [pivotToApply]);
  return (
    <DropdownContainer dropdownButton={dropdownButton} setActive={setActive} active={active}>
      {active &&
        ((
          <DataPreviewDropdownDialogContainer
            searchComponent={
              (
                <DataPreviewDropdownDialogSearch
                  options={options}
                  searchBarLabel={searchBarLabel}
                  selectedTable={tableToApply}
                  setSelectedTable={updateSelectedTable}
                />
              ) as React.ReactElement<any, string | React.JSXElementConstructor<any>>
            }
            filterComponent={
              (
                <DataPreviewPivotSelect
                  table={tableToApply}
                  pivotToApply={pivotToApply}
                  setPivotToApply={setPivotToApply}
                  tableViewSelection={tableViewSelection}
                  setTableViewSelection={setTableViewSelection}
                />
              ) as React.ReactElement<any, string | React.JSXElementConstructor<any>>
            }
            handleApply={handleApply}
            handleCancel={handleCancel}
          />
        ) as React.ReactElement<any, string | React.JSXElementConstructor<any>>)}
    </DropdownContainer>
  );
};

export default DataPreviewTableSelectDropdown;
