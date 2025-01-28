import React, { FunctionComponent, ReactElement } from 'react';
import FilterButtons from '../../data-preview-dropdown-dialog/filter-buttons/filter-buttons';
import { dropdownContent, multiselect, footer, search, mainContainer } from './column-filter-containter.module.scss';
import ColumnFilterMultiSelect from '../column-filter-multiselect/column-filter-multiselect';
import ColumnFilterSearch from '../../data-preview-dropdown-search/column-filter-search/column-filter-search';

interface iColumnFilterContainer {
  handleApply: () => void;
  handleCancel: () => void;
}

const ColumnFilterContainer: FunctionComponent<iColumnFilterContainer> = ({ handleApply, handleCancel }) => {
  return (
    <div className={dropdownContent}>
      <div className={mainContainer}>
        <div className={search}>
          <ColumnFilterSearch />
        </div>
        <div className={multiselect}>
          <ColumnFilterMultiSelect />
        </div>
      </div>
      <div className={footer}>
        <FilterButtons handleApply={handleApply} handleCancel={handleCancel} />
      </div>
    </div>
  );
};

export default ColumnFilterContainer;
