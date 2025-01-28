import React, { FunctionComponent, useEffect, useState } from 'react';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from '../../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../../dropdown-container/dropdown-container';
import ColumnFilterContainer from '../column-filter-container/column-filter-container';

const ColumnFilter: FunctionComponent = () => {
  const [visibleColumns, setVisibleColumns] = useState([]);
  const totalColumns = 17;
  const [active, setActive] = useState(false);
  const filterDropdownButton = (
    <DropdownLabelButton
      label="Filters"
      selectedOption={visibleColumns.length + '/' + totalColumns}
      icon={faTable}
      active={active}
      setActive={setActive}
    />
  );

  useEffect(() => {
    if (!active) {
      setActive(false);
    }
  }, [active]);

  return (
    <>
      <DropdownContainer dropdownButton={filterDropdownButton} setActive={setActive}>
        {active && <ColumnFilterContainer />}
      </DropdownContainer>
    </>
  );
};

export default ColumnFilter;
