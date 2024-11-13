import React, { FunctionComponent, useState } from 'react';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from '../../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../../dropdown-container/dropdown-container';

const DataPreviewTableFilters: FunctionComponent = () => {
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [active, setActive] = useState(false);
  const filterDropdownButton = (
    <DropdownLabelButton label="Filters" selectedOption={appliedFilters.length + ' applied'} icon={faFilter} active={active} setActive={setActive} />
  );

  return (
    <DropdownContainer dropdownButton={filterDropdownButton} setActive={setActive}>
      Table Filter!
    </DropdownContainer>
  );
};

export default DataPreviewTableFilters;
