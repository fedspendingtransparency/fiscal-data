import { render } from '@testing-library/react';
import { testGlossaryData } from '../test-helper';
import GlossaryDefinition from './glossary-definition';
import React from 'react';

describe('Glossary Definition', () => {

  it('Displays the glossary term name and definition', () => {
    const { getByText } = render(<GlossaryDefinition  glossaryTerm={testGlossaryData[0]} />);

    const {term, definition} = testGlossaryData[0];

    expect(getByText(term)).toBeInTheDocument();
    expect(getByText(definition)).toBeInTheDocument();
  })

})
