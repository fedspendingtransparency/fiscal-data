import React, { FunctionComponent, ReactElement } from 'react';
import FilterButtons from '../../data-preview-dropdown-dialog/filter-buttons/filter-buttons';
import { dropdownContent, filter, footer, multiSelect, search, mainContainer } from './column-filter-containter.module.scss';

interface iDropdownDialogContainer {
  searchComponent: ReactElement;
  filterComponent: ReactElement;
  multiSelectComponent: ReactElement;
  handleApply: () => void;
  handleCancel: () => void;
}

const ColumnFilterContainer: FunctionComponent<iDropdownDialogContainer> = ({
  searchComponent,
  filterComponent,
  multiSelectComponent,
  handleApply,
  handleCancel,
}) => {
  return (
    <div className={dropdownContent}>
      <div className={mainContainer}>
        <div className={multiSelect}>{multiSelectComponent}</div>
      </div>
      <div className={footer}>
        <FilterButtons handleApply={handleApply} handleCancel={handleCancel} />
      </div>
    </div>
  );
};

export default ColumnFilterContainer;
