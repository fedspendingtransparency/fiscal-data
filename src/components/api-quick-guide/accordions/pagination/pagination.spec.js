import React from 'react';
import PaginationAccordion from './pagination';
import { fireEvent, render, within } from '@testing-library/react';

describe('Pagination Accordion', () => {
  const titleText = 'Pagination';
  const mockEndpoint = 'mock/end/point';
  const mockSelectedTable = {
    endpoint: mockEndpoint,
  };

  it('expects the title to be rendered.', () => {
    const { getByText } = render(<PaginationAccordion selectedTable={mockSelectedTable} />);
    expect(getByText(titleText)).toBeInTheDocument();
  });

  it('expects the content to be rendered.', () => {
    const { getByTestId } = render(<PaginationAccordion selectedTable={mockSelectedTable} />);
    fireEvent.click(getByTestId('button'));
    expect(getByTestId('content').children[0]).toBeDefined();
  });

  it('expects the accordion to be open by default', () => {
    const { getByTestId } = render(<PaginationAccordion selectedTable={mockSelectedTable} />);
    expect(getByTestId('section').classList).toContain('closed');
  });

  it('displays the dynamic endpoint in the example shown', () => {
    const { getByTestId } = render(<PaginationAccordion selectedTable={mockSelectedTable} />);
    fireEvent.click(getByTestId('button'));
    expect(within(getByTestId('fullUrl')).getByText(mockEndpoint, { exact: false })).toBeInTheDocument();
  });
});
