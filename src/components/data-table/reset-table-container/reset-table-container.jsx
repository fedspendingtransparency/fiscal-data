import React, { useState } from 'react';
import { buttonContainer, sectionContainer } from './reset-table-container.module.scss';
import ResetTableSection from '../reset-table-section/reset-table-section';
import DtgTable from '../../dtg-table/dtg-table';
const ResetTableContainer = ({ tableProps, rowsPerPage }) => {
  const [resetFilters, setResetFilters] = useState(false);
  const [filtersActive, setFiltersActive] = useState(false);

  return (
    <div className={sectionContainer}>
      <div className={buttonContainer}>
        <ResetTableSection active={filtersActive} resetColumns={() => setResetFilters(true)} sideBorder={false} />
      </div>
      <DtgTable
        tableProps={tableProps}
        perPage={rowsPerPage}
        reactTable
        resetFilters={resetFilters}
        setResetFilters={setResetFilters}
        setFiltersActive={setFiltersActive}
        allowColumnWrap={['definition']}
      />
    </div>
  );
};

export default ResetTableContainer;
