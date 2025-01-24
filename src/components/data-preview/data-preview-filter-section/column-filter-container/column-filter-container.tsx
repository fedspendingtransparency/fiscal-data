import React, { FunctionComponent, ReactElement } from 'react';
import FilterButtons from '../../data-preview-dropdown-dialog/filter-buttons/filter-buttons';
import { dropdownContent, footer, multiSelect, search, mainContainer } from './column-filter-containter.module.scss';
import ColumnFilterMultiSelect from '../column-filter-multiselect/column-filter-multiselect';
import ColumnFilterSearch from '../../data-preview-dropdown-search/column-filter-search/column-filter-search';

interface iDropdownDialogContainer {
  searchComponent: ReactElement;
  filterComponent: ReactElement;
  multiSelectComponent: ReactElement;
  handleApply: () => void;
  handleCancel: () => void;
}

const ColumnFilterContainer: FunctionComponent<iDropdownDialogContainer> = ({ searchComponent, multiSelectComponent, handleApply, handleCancel }) => {
  return (
    <div className={dropdownContent}>
      <div className={mainContainer}>
        <div className={search}>
          <ColumnFilterSearch />
        </div>
        <div className={multiSelect}>
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
