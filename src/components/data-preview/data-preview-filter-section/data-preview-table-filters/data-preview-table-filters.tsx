import React, { FunctionComponent, useEffect, useState } from 'react';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from '../../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../../dropdown-container/dropdown-container';
import DataPreviewDropdownDialogContainer from '../../data-preview-dropdown-dialog/data-preview-dropdown-dialog';
import ColumnFilterOptions from './column-filter-options/column-filter-options';
import { ITableFilters } from '../../../../models/data-preview/ITableFilters';
import DataPreviewMobileDialog from '../../data-preview-mobile-dialog/data-preview-mobile-dialog';
import { pxToNumber } from '../../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../data-preview.module.scss';

const DataPreviewTableFilters: FunctionComponent<ITableFilters> = ({
  selectedTable,
  config,
  setDateRange,
  allTablesSelected,
  handleDateRangeChange,
  setIsCustomDateRange,
  finalDatesNotFound,
  detailApi,
  detailViewState,
  apiData,
  width,
}) => {
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [active, setActive] = useState(false);
  // TODO update default value to first column in list
  const [selectedColumn, setSelectedColumn] = useState({ name: 'Record Date', type: 'Date', field: 'record_date' });
  const filterDropdownButton = (
    <DropdownLabelButton label="Filters" selectedOption={appliedFilters.length + ' applied'} icon={faFilter} active={active} setActive={setActive} />
  );

  const handleApply = () => {
    setActive(false);
  };
  const handleCancel = () => {
    setActive(false);
  };

  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [active]);

  return (
    <DropdownContainer dropdownButton={filterDropdownButton} setActive={setActive}>
      {active && width >= pxToNumber(breakpointLg) && (
        <DataPreviewDropdownDialogContainer
          searchComponent={<>search component placeholder</>}
          filterComponent={
            <ColumnFilterOptions
              setAppliedFilters={setAppliedFilters}
              selectedColumn={selectedColumn}
              selectedTable={selectedTable}
              config={config}
              setDateRange={setDateRange}
              allTablesSelected={allTablesSelected}
              handleDateRangeChange={handleDateRangeChange}
              setIsCustomDateRange={setIsCustomDateRange}
              finalDatesNotFound={finalDatesNotFound}
              detailApi={detailApi}
              detailViewState={detailViewState}
              apiData={apiData}
            />
          }
          handleApply={handleApply}
          handleCancel={handleCancel}
        />
      )}
      {active && width < pxToNumber(breakpointLg) && <DataPreviewMobileDialog onClose={handleCancel} />}
    </DropdownContainer>
  );
};
export default DataPreviewTableFilters;
