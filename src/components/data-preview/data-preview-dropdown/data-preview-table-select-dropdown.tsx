import React, { FunctionComponent, useEffect, useState } from 'react';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from './../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import DataPreviewDropdownDialogContainer from '../data-preview-dropdown-dialog/data-preview-dropdown-dialog';
import DataPreviewPivotSelect from '../data-preview-pivot-select/data-preview-pivot-select';
import { ITableSelectDropdown } from '../../../models/data-preview/ITableSelectDropdown';

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
  const [pivotsUpdated, setPivotsUpdated] = useState(false);
  const [pivotToApply, setPivotToApply] = useState(selectedPivot);
  const [appliedTableView, setAppliedTableView] = useState('rawData');
  const [tableViewSelection, setTableViewSelection] = useState(appliedTableView);

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

  const dataTableSearch = <>Placeholder for data table search</>;

  const handleApply = () => {
    if (tableViewSelection === 'pivotData') {
      setSelectedPivot(pivotToApply);
      setAppliedTableView('pivotData');
    } else {
      setAppliedTableView('rawData');
      setSelectedPivot({ pivotView: { title: 'Complete Table' }, pivotValue: null });
    }
    setActive(false);
  };

  const handleCancel = () => setActive(false);

  useEffect(() => {
    if (!active) {
      setTableViewSelection(appliedTableView);
    }
  }, [active]);

  return (
    <DropdownContainer dropdownButton={dropdownButton} setActive={setActive} active={active}>
      {active && (
        <DataPreviewDropdownDialogContainer
          searchComponent={dataTableSearch}
          filterComponent={
            <DataPreviewPivotSelect
              table={selectedTable}
              pivotSelection={selectedPivot}
              setSelectedPivot={setSelectedPivot}
              pivotsUpdated={pivotsUpdated}
              pivotToApply={pivotToApply}
              setPivotToApply={setPivotToApply}
              appliedTableView={appliedTableView}
              setAppliedTableView={setAppliedTableView}
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
