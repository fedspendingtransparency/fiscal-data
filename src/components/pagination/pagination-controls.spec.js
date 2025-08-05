import React from 'react';
import PaginationControl from './pagination-controls';
import { PAGING_PROPS } from './pagination-test-helper';
import { render } from '@testing-library/react';

jest.useFakeTimers();
describe('Pagination Controls with page buttons', () => {
  it('includes the pagination menu', () => {
    const { getAllByTestId } = render(<PaginationControl pagingProps={PAGING_PROPS} />);
    expect(getAllByTestId('paginationMenu').length).toBe(1);
  });

  it('includes the page buttons if rows of data exceeds rows per page', () => {
    const { getByRole } = render(<PaginationControl pagingProps={PAGING_PROPS} />);

    expect(getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Next page' })).toBeInTheDocument();
  });
});

describe('Pagination Controls without page buttons', () => {
  const modifiedPagingProps = { ...PAGING_PROPS };
  modifiedPagingProps.maxRows = 50;
  modifiedPagingProps.itemsPerPage = 50;

  it('does not include the page buttons if rows of data is less than or equal to rows per page', () => {
    const { queryAllByTestId } = render(<PaginationControl pagingProps={modifiedPagingProps} />);
    expect(queryAllByTestId('page-next-button').length).toBe(0);
  });
});
