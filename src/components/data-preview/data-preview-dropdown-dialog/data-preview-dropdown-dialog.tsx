import React, { FunctionComponent, ReactElement } from 'react';
import FilterButtons from './filter-buttons/filter-buttons';
import { mainContainer, search, footer, dropdownContent, filter } from './data-preview-dropdown-dialog.module.scss';

interface iDropdownDialogContainer {
  searchComponent: ReactElement;
  filterComponent: ReactElement;
  handleApply: () => void;
  handleCancel: () => void;
}

const DataPreviewDropdownDialogContainer: FunctionComponent<iDropdownDialogContainer> = ({
  searchComponent,
  filterComponent,
  handleApply,
  handleCancel,
}) => {
  return (
    <div className={dropdownContent}>
      <div className={mainContainer}>
        <div className={search}>{searchComponent}</div>
        <div className={filter}>{filterComponent}</div>
      </div>
      <div className={footer}>
        <FilterButtons handleApply={handleApply} handleCancel={handleCancel} />
      </div>
    </div>
  );
};

export default DataPreviewDropdownDialogContainer;
