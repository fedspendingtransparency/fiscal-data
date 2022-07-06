import React from 'react';
import {render} from '@testing-library/react';
import GlossaryTerm from "./glossary-term";


describe('glossary term',() => {
  const testGlossary = [
    {
      id: 1,
      term: 'Hello',
      site_page: 'Test Page',
      definition: 'A greeting',
      url_display: '',
      url_path: ''
    },
    {
      id: 2,
      term: 'Hello',
      site_page: 'Another Test Page',
      definition: 'A different greeting',
      url_display: '',
      url_path: ''
    },
    {
      id: 3,
      term: 'Hello again',
      site_page: 'Test Page',
      definition: 'Test for term with link.',
      url_display: 'link',
      url_path: 'example.com'
    }
  ]

  it('renders a button for the glossary term', () => {
    const termText = 'Hello';
    const testPage = 'Test Page';

    const { getByRole } = render(
      <GlossaryTerm term="hello" page={testPage} glossary={testGlossary}>
        {termText}
      </GlossaryTerm>
    );
    const glossaryTermButton = getByRole('button', {name: termText});
    expect(glossaryTermButton).toBeInTheDocument();
  });

  it('renders the glossary popover with the matching term and definition on click', () => {
    const termText = 'Hello';
    const termDefinition = 'A greeting';
    const testPage = 'Test Page';

    const { getByRole, getByText } = render(
      <GlossaryTerm term={termText} page={testPage} glossary={testGlossary}>
        {termText}
      </GlossaryTerm>
    );
    const glossaryTermButton = getByRole('button', {name: termText});
    glossaryTermButton.click();

    const definition = getByText(termDefinition);

    expect(definition).toBeInTheDocument();
  });

  it('adds the link into the definition, if url_display is found within the definition text', () => {
    const glossaryDefinition = 'Test for term with link.';
    const termText = 'Hello again';
    const testPage = 'Test Page';

    const { getByRole, getByText } = render(
      <GlossaryTerm term={termText} page={testPage} glossary={testGlossary}>
        {termText}
      </GlossaryTerm>
    );
    const glossaryTermButton = getByRole('button', {name: termText});
    glossaryTermButton.click();

    const definitionSplit = getByText('Test for term', {exact:false});

    expect(definitionSplit.textContent).toEqual(glossaryDefinition);
  });

  it('correctly displays the definition for the term associated with the specified page', () => {
    const termText = 'Hello';
    const termDefinition = 'A different greeting';
    const differentPageTermDefinition = 'A greeting';
    const testPage = 'Another Test Page';

    const { getByRole, getByText, queryByText } = render(
      <GlossaryTerm term={termText} page={testPage} glossary={testGlossary}>
        {termText}
      </GlossaryTerm>
    );

    const glossaryTermButton = getByRole('button', {name: termText});
    glossaryTermButton.click();

    const definition = getByText(termDefinition);

    expect(definition).toBeInTheDocument();
    expect(queryByText(differentPageTermDefinition)).toBeNull();
  })
});
