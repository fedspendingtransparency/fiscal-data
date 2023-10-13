import React from 'react';
import FiltersAccordion from './filters';
import * as accordionStyles from '../../../accordion/accordion.module.scss';
import { fireEvent, render } from '@testing-library/react';

import { selectedTable, selectedTableWithDateException } from '../../test-helpers/test-helpers';

describe('Filters Accordion', () => {
  const titleText = 'Filters';

  it('expects the title to be rendered.', () => {
    const { getByTestId } = render(<FiltersAccordion selectedTable={selectedTable} />);
    expect(getByTestId('heading').innerHTML).toContain(titleText);
  });

  it('expects the content to be rendered.', () => {
    const { getByTestId } = render(<FiltersAccordion selectedTable={selectedTable} />);
    expect(getByTestId('content')).toBeInTheDocument();
  });

  it('expects the accordion to be open by default', () => {
    const { getByTestId } = render(<FiltersAccordion selectedTable={selectedTable} />);
    expect(getByTestId('section').className).toContain(accordionStyles.closed);
  });

  it('writes a filter example drafted from the provided selectedTable prop', () => {
    const { getByTestId } = render(<FiltersAccordion selectedTable={selectedTable} />);
    fireEvent.click(getByTestId('button'));
    expect(getByTestId('filtersAccordionQuery').innerHTML).toEqual(`?filter=${selectedTable.dateField}:eq:${selectedTable.latestDateFormatted}`);
  });

  it('writes a fullUrl example based on the selectedTable, which includes the filter query', () => {
    const { getByTestId } = render(<FiltersAccordion selectedTable={selectedTable} />);
    fireEvent.click(getByTestId('button'));
    const fullUrlDiv = getByTestId('fullUrl');
    expect(fullUrlDiv.innerHTML).toContain(selectedTable.endpoint);
    expect(fullUrlDiv.innerHTML).toContain(selectedTable.dateField);
    expect(fullUrlDiv.innerHTML).toContain(selectedTable.latestDateFormatted);
  });

  it(`cuts off the "-DD" portion of the date string only if the apiID is has a
  year-month-date-only date exception and displays that in both sections of the examples`, () => {
    const { getByTestId } = render(<FiltersAccordion selectedTable={selectedTableWithDateException} />);
    fireEvent.click(getByTestId('button'));
    const expectedDateString = '2050-12';
    expect(getByTestId('filtersAccordionQuery').innerHTML).toContain(expectedDateString);
    expect(getByTestId('fullUrl').innerHTML).toContain(expectedDateString);
  });
});
