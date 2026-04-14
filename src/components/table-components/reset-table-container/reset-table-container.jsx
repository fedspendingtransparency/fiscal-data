import React, { useState } from 'react';
import { buttonContainer, sectionContainer } from './reset-table-container.module.scss';
import ResetTableSection from '../reset-table-section/reset-table-section';
import FilteredTable from '../filtered-table/filtered-table';

const ResetTableContainer = ({ tableProps, perPage }) => {
  const [resetFilters, setResetFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  return (
    <div className={sectionContainer}>
      <div className={buttonContainer}>
        <ResetTableSection active={activeFilters?.length > 0} resetColumns={() => setResetFilters(true)} />
      </div>
      <FilteredTable
        tableProps={tableProps}
        perPage={perPage}
        resetFilters={resetFilters}
        setResetFilters={setResetFilters}
        allActiveFilters={activeFilters}
        setAllActiveFilters={setActiveFilters}
        allowColumnWrap={['definition']}
        sorting={sorting}
        setSorting={setSorting}
      />
    </div>
  );
};

export default ResetTableContainer;
