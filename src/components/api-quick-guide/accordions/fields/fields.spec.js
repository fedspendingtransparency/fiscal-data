import React from 'react';
import FieldsAccordion from './fields';
import { render } from '@testing-library/react';

describe('Fields Accordion', () => {
  const titleText = 'Fields';
  const firstN = 'first,second,third,fourth,fifth,sixth,seventh';
  const mockEndpoint = 'mock/end/point';
  const longUrlForParam2 = 'https://api.fiscaldata.treasury.gov/services/api' + '/fiscal_service/mock/end/point?fields=first,second,third';
  const shortFieldsForParam2 = '?fields=first,second,third';
  const mockSelectedTable = {
    endpoint: mockEndpoint,
    fields: [
      { columnName: 'first', dummyProp: 'dummy' },
      { columnName: 'second', dummyProp: 'dummy' },
      { columnName: 'third', dummyProp: 'dummy' },
      { columnName: 'fourth', dummyProp: 'dummy' },
      { columnName: 'fifth', dummyProp: 'dummy' },
      { columnName: 'sixth', dummyProp: 'dummy' },
      { columnName: 'seventh', dummyProp: 'dummy' },
    ],
  };

  const mockParam2 = {
    endpoint: mockEndpoint,
    fields: [
      { columnName: 'first', dummyProp: 'dummy' },
      { columnName: 'second', dummyProp: 'dummy' },
      { columnName: 'third', dummyProp: 'dummy' },
    ],
  };

  it('expects the title to be rendered.', () => {
    const { getByTestId } = render(<FieldsAccordion selectedTable={mockSelectedTable} />);
    expect(getByTestId('heading')).toHaveTextContent(titleText);
  });

  it('expects the content to be rendered.', () => {
    const { getByTestId } = render(<FieldsAccordion selectedTable={mockSelectedTable} />);
    expect(getByTestId('content')).toBeInTheDocument();
  });

  it('expects the accordion to be open by default', () => {
    const { getByTestId } = render(<FieldsAccordion selectedTable={mockSelectedTable} />);
    expect(getByTestId('section')).toHaveClass('open');
  });

  it(`should show the first n fields from the selectedTable prop in both the short
  and long examples, and the long example should contain the dynamic endpoint`, () => {
    const { getByTestId } = render(<FieldsAccordion selectedTable={mockSelectedTable} numberOfFields={7} />);
    expect(getByTestId('fields-short')).toHaveTextContent(firstN);
    expect(getByTestId('fields-long')).toHaveTextContent(firstN);
    expect(getByTestId('fields-long')).toHaveTextContent(mockEndpoint);
  });

  it('does not break if there are fewer than five objects in the param array', () => {
    const { getByTestId } = render(<FieldsAccordion selectedTable={mockParam2} />);
    expect(getByTestId('fields-short').textContent).toStrictEqual(shortFieldsForParam2);
    expect(getByTestId('fields-long').textContent).toStrictEqual(longUrlForParam2);
  });
});
