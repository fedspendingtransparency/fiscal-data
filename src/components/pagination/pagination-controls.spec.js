import React from 'react';
import PaginationControl from './pagination-controls';
import PagingOptionsMenu from './paging-options-menu';
import { PAGING_PROPS } from './pagination-test-helper';
import { fireEvent, render, screen } from '@testing-library/react';

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

  it('closes the menu when an option has been selected', () => {
    const { getByRole, getByText } = render(<PaginationControl pagingProps={PAGING_PROPS} />);
    const menuButton = getByRole('button', { name: 'rows-per-page-menu' });
    expect(menuButton).toBeInTheDocument();
    fireEvent.click(menuButton);
    const rowsPerPageButton = getByText('50');
    fireEvent.click(rowsPerPageButton);
    expect(PAGING_PROPS.handlePerPageChange).toHaveBeenCalledWith(50);
  });

  it('resets selected option to 1 when applicable', async () => {
    const initialProps = {
      selected: 5,
      label: 'Go to Page',
      options: [5, 10, 50],
      updateSelected: jest.fn(),
      disabled: false,
    };
    const { rerender, getByRole } = render(<PagingOptionsMenu menuProps={initialProps} />);

    const menuButton = getByRole('button', { name: 'rows-per-page-menu' });
    expect(menuButton).toHaveTextContent('5');
    const newProps = { ...initialProps, selected: 10 };
    rerender(<PagingOptionsMenu menuProps={newProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
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
