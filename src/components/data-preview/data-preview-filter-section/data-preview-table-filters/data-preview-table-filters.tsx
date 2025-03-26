import React, { FunctionComponent, useState } from 'react';
import { faCaretRight, faCheck, faFilter } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from '../../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../../dropdown-container/dropdown-container';
import DataPreviewDropdownDialogContainer from '../../data-preview-dropdown-dialog/data-preview-dropdown-dialog';
import ColumnFilterOptions from './column-filter-options/column-filter-options';
import { ITableFilters } from '../../../../models/data-preview/ITableFilters';
import DataPreviewMobileDialog from '../../data-preview-mobile-dialog/data-preview-mobile-dialog';
import { pxToNumber } from '../../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../data-preview.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  filterContainer,
  filterName,
  isApplied,
  left,
  leftSelected,
  right,
} from '../../../data-preview/data-preview-mobile-dialog/data-preview-mobile-dialog.module.scss';

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
  const placeholderFilters = [
    { filterName: 'Record Date', filterApplied: 'Last 5 years' },
    { filterName: 'Parent ID', filterApplied: 'No filter applied' },
    { filterName: 'Classification ID', filterApplied: 'No filter applied' },
    { filterName: 'Classification Description', filterApplied: 'No filter applied' },
    { filterName: 'Record Type Code', filterApplied: 'No filter applied' },
    { filterName: 'Current Month Budget Amount', filterApplied: 'No filter applied' },
  ];

  const previewFiller = (
    <>
      {placeholderFilters.map((filter, index) => (
        <div key={index} className={filterContainer}>
          <div className={filter.filterApplied !== 'No filter applied' ? leftSelected : left}>
            <p className={filterName}>{filter.filterName}</p>
            <p className={isApplied}>{filter.filterApplied}</p>
          </div>
          <div className={right}>
            <FontAwesomeIcon icon={faCaretRight} />
          </div>
        </div>
      ))}
    </>
  );
  // Need to find a way to prevent background scrolling for mobile users
  // useEffect(() => {
  //   if (active) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = '';
  //   }
  // }, [active]);

  return (
    <>
      {width >= pxToNumber(breakpointLg) && (
        <DropdownContainer dropdownButton={filterDropdownButton} setActive={setActive}>
          {active && (
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
        </DropdownContainer>
      )}
      {width < pxToNumber(breakpointLg) && (
        <>
          {filterDropdownButton}
          {active && (
            <DataPreviewMobileDialog
              onClose={handleCancel}
              tableList={previewFiller}
              backButtonTitle="Data Preview"
              headerName="Filters"
              bottomButton="Apply"
              bottomButtonIcon={faCheck}
              hasSearch={true}
            />
          )}
        </>
      )}
    </>
  );
};
export default DataPreviewTableFilters;
