import React, { useState } from 'react';
import { buttonContainer, sectionContainer } from './reset-table-container.module.scss';
import ResetTableSection from '../reset-table-section/reset-table-section';
import DtgTable from '../../dtg-table/dtg-table';

const ResetTableContainer = ({ tableProps, perPage, setPerPage }) => {
  const [resetFilters, setResetFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  return (
    <div className={sectionContainer}>
      <div className={buttonContainer}>
        <ResetTableSection active={activeFilters?.length > 0} resetColumns={() => setResetFilters(true)} />
      </div>
      <DtgTable
        tableProps={tableProps}
        perPage={perPage}
        setPerPage={setPerPage}
        reactTable
        rawDataTable={false}
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
