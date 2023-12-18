import React from 'react';
import SortingAccordion from './sorting';
import { selectedTable } from '../../test-helpers/test-helpers';
import { fireEvent, render } from '@testing-library/react';

describe('Sorting Accordion', () => {
  const titleText = 'Sorting';

  it('expects the title to be rendered.', () => {
    const { getByTestId } = render(<SortingAccordion selectedTable={selectedTable} />);
    expect(getByTestId('heading').innerHTML).toContain(titleText);
  });

  it('expects the content to be rendered.', () => {
    const { getByTestId } = render(<SortingAccordion selectedTable={selectedTable} />);
    expect(getByTestId('content')).toBeInTheDocument();
  });

  it('expects the accordion to be open by default', () => {
    const { getByTestId } = render(<SortingAccordion selectedTable={selectedTable} />);
    expect(getByTestId('section').className).toContain('closed');
  });

  it('writes a sorting example drafted from the provided selectedTable prop', () => {
    const { getByTestId } = render(<SortingAccordion selectedTable={selectedTable} />);
    fireEvent.click(getByTestId('button'));
    expect(getByTestId('sortingAccordionQuery').innerHTML).toBe(`?sort=-${selectedTable.dateField}`);
  });
});
