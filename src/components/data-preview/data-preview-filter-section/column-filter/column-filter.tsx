import React, {FunctionComponent, useState} from 'react';
import {faTable} from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from '../../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../../dropdown-container/dropdown-container';
import ColumnFilterContainer from '../column-filter-container/column-filter-container';

interface iColumnFilter {
  allTablesSelected: boolean;
}

const ColumnFilter: FunctionComponent<iColumnFilter> = ({ allTablesSelected, isDisabled }) => {
  const [visibleColumns, setVisibleColumns] = useState([]);
  const totalColumns = 17;
  const [active, setActive] = useState(false);

  const filterDropdownButton = (
    <DropdownLabelButton
      label="Columns"
      selectedOption={visibleColumns.length + '/' + totalColumns}
      icon={faTable}
      active={active}
      setActive={setActive}
      disabled={allTablesSelected || isDisabled}
    />
  );

  return (
    <>
      <DropdownContainer dropdownButton={filterDropdownButton} setActive={setActive}>
        {active && <ColumnFilterContainer />}
      </DropdownContainer>
    </>
  );
};

export default ColumnFilter;
