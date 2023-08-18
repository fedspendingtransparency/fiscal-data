import React from 'react';


const PaginationButtons = ({table}) => {
  // console.log(table);
  // console.log(table.getState());
  // console.log(table.getPaginationRowModel());
  // console.log(table.getPageCount());
  // console.log(table.getPageOptions());
  // console.log(table.getRowModel());
  // console.log(table.getRowModel().rowsById);
  return (
    <>
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {1}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {table.getPageCount()}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
      </div>
    </>
  )
}

export default PaginationButtons;
