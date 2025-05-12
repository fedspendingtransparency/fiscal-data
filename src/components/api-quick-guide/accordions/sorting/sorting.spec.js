import React from 'react';
import SortingAccordion from './sorting';
import { selectedTable } from '../../test-helpers/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import GLOBALS from '../../../../helpers/constants';

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
    const baseApiUrl = GLOBALS.PROD_API_BASE_URL;
    const fullUrl = `${baseApiUrl}/${selectedTable.endpoint}`;
    const exampleSortingQuery = `?sort=-${selectedTable.dateField}`;

    const { getByTestId, getByText } = render(<SortingAccordion selectedTable={selectedTable} />);
    fireEvent.click(getByTestId('button'));
    expect(getByText(fullUrl, { exact: false })).toBeInTheDocument();
    expect(getByText(exampleSortingQuery)).toBeInTheDocument();
  });
});
