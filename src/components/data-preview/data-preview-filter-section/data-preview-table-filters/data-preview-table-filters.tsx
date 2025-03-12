import React, { FunctionComponent, useState } from 'react';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from '../../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../../dropdown-container/dropdown-container';
import DataPreviewDropdownDialogContainer from '../../data-preview-dropdown-dialog/data-preview-dropdown-dialog';
import ColumnFilterOptions from './column-filter-options/column-filter-options';

const DataPreviewTableFilters: FunctionComponent = () => {
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [active, setActive] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState({ name: 'Record Date', type: 'Date' });
  const filterDropdownButton = (
    <DropdownLabelButton label="Filters" selectedOption={appliedFilters.length + ' applied'} icon={faFilter} active={active} setActive={setActive} />
  );

  const handleApply = () => {
    // placeholder function
  };
  const handleCancel = () => {
    // placeholder function
  };

  return (
    <DropdownContainer dropdownButton={filterDropdownButton} setActive={setActive}>
      {active && (
        <DataPreviewDropdownDialogContainer
          searchComponent={<>search component placeholder</>}
          filterComponent={<ColumnFilterOptions setAppliedFilters={setAppliedFilters} selectedColumn={selectedColumn} />}
          handleApply={handleApply}
          handleCancel={handleCancel}
        />
      )}
    </DropdownContainer>
  );
};
export default DataPreviewTableFilters;
