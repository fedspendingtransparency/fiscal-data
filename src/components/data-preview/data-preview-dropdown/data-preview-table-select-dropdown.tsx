import React, { FunctionComponent, useEffect, useState } from 'react';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from './../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import DataPreviewDropdownDialogContainer from '../data-preview-dropdown-dialog/data-preview-dropdown-dialog';
import DataPreviewPivotSelect from '../data-preview-pivot-select/data-preview-pivot-select';

//TODO: add type def
type DataPreviewProp = { apis; selectedTable; setSelectedTable; allTablesSelected; earliestDate; latestDate; disableAllTables };

const DataPreviewTableSelectDropdown: FunctionComponent<DataPreviewProp> = ({
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

  console.log(apis, selectedTable);
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
      // setTableViewSelection('pivotData');
    } else {
      // setSelectedPivot({ pivotView: { title: 'Complete Table' }, pivotValue: { prettyName: '— N / A —' } });
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
