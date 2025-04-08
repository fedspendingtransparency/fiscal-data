import React from 'react';
import Accordions from './accordions';
import { selectedTable } from '../test-helpers/test-helpers';
import { render } from '@testing-library/react';

describe('Accordions section', () => {
  it('has a defined title', () => {
    const { getByText } = render(<Accordions selectedTable={selectedTable} />);
    expect(getByText('Parameters')).toBeInTheDocument();
  });

  it('has FieldsAccordion placed forevermore within its layout', () => {
    const { getByRole } = render(<Accordions selectedTable={selectedTable} />);
    const accordion = getByRole('button', { name: 'Fields toggle contents' });
    expect(accordion).toBeInTheDocument();
  });

  it('passes the selectedTable prop to the filters accordion', () => {
    const { getByRole } = render(<Accordions selectedTable={selectedTable} />);
    const accordion = getByRole('button', { name: 'Filters toggle contents' });
    expect(accordion).toBeInTheDocument();
  });

  it('has a SortingAccordion component placed forevermore within its layout', () => {
    const { getByRole } = render(<Accordions selectedTable={selectedTable} />);
    const accordion = getByRole('button', { name: 'Sorting toggle contents' });
    expect(accordion).toBeInTheDocument();
  });

  it('has a PaginationAccordion component placed forevermore within its layout', () => {
    const { getByRole } = render(<Accordions selectedTable={selectedTable} />);
    const accordion = getByRole('button', { name: 'Pagination toggle contents' });
    expect(accordion).toBeInTheDocument();
  });
});
