import React, { useEffect } from 'react';

import PageButtons from './page-buttons';
import PagingOptionsMenu from './paging-options-menu';

import { paginationControls } from './pagination-controls.module.scss';

export const defaultPerPageOptions = [5, 10, 20, 50, 100];

const PaginationControls = ({ pagingProps }) => {
  const { itemsPerPage, handlePerPageChange, handleJump, maxPage, tableName, currentPage, maxRows, disablePerPage, showWhenEmpty } = pagingProps;
  const perPageOptions = defaultPerPageOptions.slice();
  if (itemsPerPage && !perPageOptions.includes(itemsPerPage)) {
    perPageOptions.push(itemsPerPage);
    perPageOptions.sort(function(a, b) {
      return a - b;
    });
  }

  const pagesArray = () => {
    const pagesArray = [];
    for (var i = 1; i <= maxPage; i++) {
      pagesArray.push(i);
    }
    return pagesArray.sort(function(a, b) {
      return a - b;
    });
  };

  const rowsPerProps = {
    options: perPageOptions,
    selected: itemsPerPage,
    updateSelected: handlePerPageChange,
    label: 'Rows Per Page',
    hideOnSm: false,
    disabled: disablePerPage,
  };

  const pageButtonProps = {
    maxPage,
    tableName,
    currentPage,
    pagesArray: pagesArray(),
    handleJump,
  };

  // TODO: Rows Per Page should not show if maxRows < least rowsPerPage option
  return (
    <div className={paginationControls}>
      <PagingOptionsMenu menuProps={rowsPerProps} />
      {(maxRows > itemsPerPage || showWhenEmpty) && <PageButtons pageButtonProps={pageButtonProps} />}
    </div>
  );
};

export default PaginationControls;
