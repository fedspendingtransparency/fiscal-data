import React from 'react';
import {render} from '@testing-library/react';
import GlossaryPopoverDefinition from "./glossary-popover-definition";


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

  beforeEach(() => {
    Object.defineProperty(window, 'history', {
      value: {
        pathname: '',
      }
    })
  });

  it('renders a button for the glossary term', () => {
    const termText = 'Hello';
    const testPage = 'Test Page';

    const { getByRole } = render(
      <GlossaryPopoverDefinition term="hello" page={testPage} glossary={testGlossary}>
        {termText}
      </GlossaryPopoverDefinition>
    );
    const glossaryTermButton = getByRole('button', {name: termText});
    expect(glossaryTermButton).toBeInTheDocument();
  });

  it('renders the glossary popover with the matching term and definition on click', () => {
    const termText = 'Hello';
    const termDefinition = 'A greeting';
    const testPage = 'Test Page';

    const { getByRole, getByText } = render(
      <GlossaryPopoverDefinition term={termText} page={testPage} glossary={testGlossary}>
        {termText}
      </GlossaryPopoverDefinition>
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
      <GlossaryPopoverDefinition term={termText} page={testPage} glossary={testGlossary}>
        {termText}
      </GlossaryPopoverDefinition>
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
      <GlossaryPopoverDefinition term={termText} page={testPage} glossary={testGlossary}>
        {termText}
      </GlossaryPopoverDefinition>
    );

    const glossaryTermButton = getByRole('button', {name: termText});
    glossaryTermButton.click();

    const definition = getByText(termDefinition);

    expect(definition).toBeInTheDocument();
    expect(queryByText(differentPageTermDefinition)).toBeNull();
  })

  it('Adds query to window.history when View in Glossary button is clicked ', () => {
    const termText = 'Hello';
    const testPage = 'Another Test Page';

    window.history.pushState = jest.fn();
    const clickHandler = jest.fn();

    const { getByRole } = render(
      <GlossaryPopoverDefinition term={termText} page={testPage} glossary={testGlossary} glossaryClickHandler={clickHandler}>
        {termText}
      </GlossaryPopoverDefinition>
    );

    const glossaryTermButton = getByRole('button', { name: termText });
    glossaryTermButton.click();

    const viewInGlossaryButton = getByRole('button', { name: 'View in glossary' })
    viewInGlossaryButton.click();
    expect(window.history.pushState).toHaveBeenCalled();
  })

  it('closes the popover when the full glossary tab is opened', () => {
    const termText = 'Hello';
    const testPage = 'Another Test Page';

    window.history.pushState = jest.fn();
    const clickHandler = jest.fn();

    const { getByRole, queryByRole } = render(
      <GlossaryPopoverDefinition term={termText} page={testPage} glossary={testGlossary} glossaryClickHandler={clickHandler}>
        {termText}
      </GlossaryPopoverDefinition>
    );

    const glossaryTermButton = getByRole('button', { name: termText });
    glossaryTermButton.click();

    const viewInGlossaryButton = getByRole('button', { name: 'View in glossary' })
    viewInGlossaryButton.click();

    expect(queryByRole('button', { name: 'View in glossary' })).not.toBeInTheDocument();
  })

});
