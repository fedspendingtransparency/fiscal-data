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
  pivotsUpdated,
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
      const localPivotFields = getPivotFields(selectedTable);
      // setPivotFields(localPivotFields);
      const pivot = {
        pivotView: selectedTable.dataDisplays ? selectedTable.dataDisplays[0] : null,
        pivotValue: localPivotFields && selectedTable.dataDisplays[0].dimensionField ? localPivotFields[0] : null,
      };
      console.log(pivot);
      setSelectedPivot(pivot);
      // const localPivotFields = getPivotFields(selectedTable);
      // setSelectedPivot({ pivotView: null, pivotValue: null });
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

  const getPivotFields = table => {
    if (table && table.valueFieldOptions) {
      return table.fields.filter(field => table.valueFieldOptions.indexOf(field.columnName) !== -1);
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (selectedTable && !selectedTable.allDataTables && !selectedPivot) {
      const localPivotFields = getPivotFields(selectedTable);
      // setPivotFields(localPivotFields);
      const pivot = {
        pivotView: selectedTable.dataDisplays ? selectedTable.dataDisplays[0] : null,
        pivotValue: localPivotFields && selectedTable.dataDisplays[0].dimensionField ? localPivotFields[0] : null,
      };
      // console.log('setting pivot', pivot);
      setSelectedPivot(pivot);
      // setPivotOptions(pivot.pivotView.dimensionField ? localPivotFields : [{ prettyName: '— N / A —' }]);
    }
  }, [selectedTable, pivotsUpdated]);

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
