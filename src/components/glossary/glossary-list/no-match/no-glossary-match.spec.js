import { render } from '@testing-library/react';
import React from 'react';
import NoGlossaryMatch from './no-glossary-match';


describe('No Glossary Match', () => {

  it('displays the no match found message with the provided filter', () => {
    const { getByText } = render(
      <NoGlossaryMatch filter={'orange'} />
    );

    expect(getByText('No match found for')).toBeInTheDocument();
    expect(getByText('\'orange.\'')).toBeInTheDocument();
  });
})
