import React from 'react';
import renderer from 'react-test-renderer';
import Accordions from './accordions';
import FieldsAccordion from './fields/fields';
import FiltersAccordion from './filters/filters';
import SortingAccordion from './sorting/sorting';
import FormatAccordion from './format/format';
import PaginationAccordion from './pagination/pagination';

import { selectedTable } from '../test-helpers/test-helpers';
import { render } from '@testing-library/react';

describe('Accordions section', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<Accordions selectedTable={selectedTable} />);
  });

  const instance = component.root;

  it('has a defined title', () => {
    const { getByText } = render(<Accordions selectedTable={selectedTable} />);
    expect(getByText('Parameters')).toBeInTheDocument();
  });

  it('has FieldsAccordion placed forevermore within its layout', () => {
    // this statement causes test to fail there's not exactly one <FieldsAccordion /> in layout
    expect(instance.findByType(FieldsAccordion)).toBeDefined();
  });

  it('passes the selectedTable prop to the filters accordion', () => {
    const curSelectedTable = instance.findByType(FiltersAccordion).props.selectedTable;
    expect(curSelectedTable).toBe(selectedTable);
  });

  it('passes the selectedTable prop to the sorting accordion', () => {
    const curSelectedTable = instance.findByType(SortingAccordion).props.selectedTable;
    expect(curSelectedTable).toBe(selectedTable);
  });

  it('has a FormatAccordion component placed forevermore within its layout', () => {
    // this statement causes test to fail there's not exactly one <FormatAccordion /> in layout
    expect(instance.findByType(FormatAccordion)).toBeDefined();
  });

  it('has a PaginationAccordion component placed forevermore within its layout', () => {
    // this statement causes test to fail there's not exactly one <PaginationAccordion /> in layout
    expect(instance.findByType(PaginationAccordion)).toBeDefined();
  });
});
