import React, { FunctionComponent } from 'react';
import FilterButtons from './filter-buttons/filter-buttons';
import { mainContainer, search, footer, dropdownContent } from './data-preview-dropdown-dialog.module.scss';


const DataPreviewDropdownDialogContainer: FunctionComponent = ({ searchComponent, filterComponent, handleApply, handleCancel }) => {
  return (
    <div className={dropdownContent}>
      <div className={mainContainer}>
        <div className={search}>{searchComponent}</div>
        <div>{filterComponent}</div>
      </div>
      <div className={footer}>
        <FilterButtons handleApply={handleApply} handleCancel={handleCancel} />
      </div>
    </div>
  );
};

export default DataPreviewDropdownDialogContainer;
