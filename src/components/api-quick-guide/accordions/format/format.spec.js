import React from 'react';
import FormatAccordion from './format';
import * as accordionStyles from '../../../accordion/accordion.module.scss';
import { fireEvent, render } from '@testing-library/react';

describe('Format Accordion', () => {
  const titleText = 'Format';
  const mockEndpoint = 'mock/endpoint/here';
  const mockSelectedTable = {
    endpoint: mockEndpoint,
  };

  it('expects the title to be rendered.', () => {
    const { getByText } = render(<FormatAccordion selectedTable={mockSelectedTable} />);
    expect(getByText(titleText)).toBeInTheDocument();
  });

  it('expects the content to be rendered.', () => {
    const { getByTestId } = render(<FormatAccordion selectedTable={mockSelectedTable} />);
    expect(getByTestId('content')).toBeInTheDocument();
  });

  it('expects the accordion to be open by default', () => {
    const { getByTestId } = render(<FormatAccordion selectedTable={mockSelectedTable} />);
    expect(getByTestId('section').outerHTML).toContain(accordionStyles.closed);
  });

  it('displays the endpoint of the current table in the full url', () => {
    const { getByTestId } = render(<FormatAccordion selectedTable={mockSelectedTable} />);
    fireEvent.click(getByTestId('button'));
    expect(getByTestId('fullUrl').innerHTML).toContain(mockEndpoint);
  });
});
