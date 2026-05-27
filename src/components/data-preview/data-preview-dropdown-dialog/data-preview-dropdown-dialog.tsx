import React, { FunctionComponent, ReactElement } from 'react';
import FilterButtons from './filter-buttons/filter-buttons';
import { dropdownContent, filter, footer, headerBox, mainContainer, search } from './data-preview-dropdown-dialog.module.scss';

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
  header,
}) => {
  return (
    <div className={dropdownContent}>
      <div className={mainContainer}>
        <div className={search}>{searchComponent}</div>
        <div className={filter}>
          <div className={headerBox}>{header}</div>
          {filterComponent}
        </div>
      </div>
      <div className={footer}>
        <FilterButtons handleApply={handleApply} handleCancel={handleCancel} />
      </div>
    </div>
  );
};

export default DataPreviewDropdownDialogContainer;
