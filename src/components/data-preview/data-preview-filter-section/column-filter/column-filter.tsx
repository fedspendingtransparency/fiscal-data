import React, { FunctionComponent, useState } from 'react';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from '../../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../../dropdown-container/dropdown-container';

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

  return <DropdownContainer dropdownButton={filterDropdownButton} setActive={setActive}></DropdownContainer>;
};

export default ColumnFilter;
