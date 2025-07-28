import React from 'react';
import renderer from 'react-test-renderer';
import PaginationControl from './pagination-controls';
import PagingOptionsMenu from './paging-options-menu';
import { PAGING_PROPS } from './pagination-test-helper';
import PageButtons from './page-buttons';

jest.useFakeTimers();
describe('Pagination Controls with page buttons', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<PaginationControl pagingProps={PAGING_PROPS} />);
  });
  const instance = component.root;

  it('includes the pagination menu', () => {
    expect(instance.findAllByType(PagingOptionsMenu).length).toBe(1);
  });

  it('includes the page buttons if rows of data exceeds rows per page', () => {
    expect(instance.findAllByType(PageButtons).length).toBe(1);
  });
});

describe('Pagination Controls without page buttons', () => {
  const modifiedPagingProps = Object.assign(PAGING_PROPS);
  modifiedPagingProps.maxRows = 50;
  modifiedPagingProps.itemsPerPage = 50;
  let component = renderer.create();

  renderer.act(() => {
    component = renderer.create(<PaginationControl pagingProps={modifiedPagingProps} />);
  });
  const instance = component.root;
  it('does not include the page buttons if rows of data is less than or equal to rows per page', () => {
    expect(instance.findAllByType(PageButtons).length).toBe(0);
  });
});
