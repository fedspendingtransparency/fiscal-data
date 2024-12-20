import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import GlossaryPopoverDefinition from './glossary-popover-definition';
import { GlossaryContext } from '../glossary-context/glossary-context';

describe('glossary term', () => {
  const testGlossary = [
    {
      id: 1,
      term: 'Hello',
      site_page: 'Test Page',
      definition: 'A greeting',
      url_display: '',
      url_path: '',
    },
    {
      id: 2,
      term: 'Hello',
      site_page: 'Another Test Page',
      definition: 'A different greeting',
      url_display: '',
      url_path: '',
    },
    {
      id: 3,
      term: 'Hello again',
      site_page: 'Test Page',
      definition: 'Test for term with link.',
      url_display: 'link',
      url_path: 'example.com',
    },
    {
      id: 4,
      term: 'Debt Held by the Public',
      site_page: 'Test Page',
      definition: 'Test for term with custom style for not.',
      url_display: '',
      url_path: '',
    },
  ];

  beforeEach(() => {
    Object.defineProperty(window, 'history', {
      value: {
        pathname: '',
      },
    });
  });

  it('renders a button for the glossary term', () => {
    const termText = 'Hello';
    const testPage = 'Test Page';

    const { getByRole } = render(
      <GlossaryPopoverDefinition term="hello" page={testPage}>
        {termText}
      </GlossaryPopoverDefinition>
    );
    const glossaryTermButton = getByRole('button', { name: termText });
    expect(glossaryTermButton).toBeInTheDocument();
  });

  it('renders the glossary popover with the matching term and definition on click', () => {
    const termText = 'Hello';
    const termDefinition = 'A greeting';
    const testPage = 'Test Page';

    const { getByRole, getByText } = render(
      <GlossaryContext.Provider value={{ glossaryClickEvent: false, setGlossaryClickEvent: jest.fn(), glossary: testGlossary }}>
        <GlossaryPopoverDefinition term={termText} page={testPage}>
          {termText}
        </GlossaryPopoverDefinition>
      </GlossaryContext.Provider>
    );
    const glossaryTermButton = getByRole('button', { name: termText });
    glossaryTermButton.click();

    const definition = getByText(termDefinition);

    expect(definition).toBeInTheDocument();
  });

  it('adds the link into the definition, if url_display is found within the definition text', () => {
    const glossaryDefinition = 'Test for term with link.';
    const termText = 'Hello again';
    const testPage = 'Test Page';

    const { getByRole, getByText } = render(
      <GlossaryContext.Provider value={{ glossaryClickEvent: false, setGlossaryClickEvent: jest.fn(), glossary: testGlossary }}>
        <GlossaryPopoverDefinition term={termText} page={testPage}>
          {termText}
        </GlossaryPopoverDefinition>
      </GlossaryContext.Provider>
    );
    const glossaryTermButton = getByRole('button', { name: termText });
    glossaryTermButton.click();

    const definitionText = getByText('Test for term', { exact: false });
    expect(getByRole('link', { name: 'link' })).toBeInTheDocument();
    expect(definitionText.textContent).toEqual(glossaryDefinition);
  });

  it('adds the custom style into the definition', () => {
    const termText = 'Debt Held by the Public';
    const testPage = 'Test Page';

    const { getByRole, getByText } = render(
      <GlossaryContext.Provider value={{ glossaryClickEvent: false, setGlossaryClickEvent: jest.fn(), glossary: testGlossary }}>
        <GlossaryPopoverDefinition term="Debt Held by the Public" page={testPage}>
          {termText}
        </GlossaryPopoverDefinition>
      </GlossaryContext.Provider>
    );
    const glossaryTermButton = getByRole('button', { name: termText });
    glossaryTermButton.click();

    const styledText = getByText('not');
    expect(styledText).toHaveStyle({ textDecoration: 'underline' });
  });

  it('correctly displays the definition for the term associated with the specified page', () => {
    const termText = 'Hello';
    const termDefinition = 'A different greeting';
    const differentPageTermDefinition = 'A greeting';
    const testPage = 'Another Test Page';

    const { getByRole, getByText, queryByText } = render(
      <GlossaryContext.Provider value={{ glossaryClickEvent: false, setGlossaryClickEvent: jest.fn(), glossary: testGlossary }}>
        <GlossaryPopoverDefinition term={termText} page={testPage}>
          {termText}
        </GlossaryPopoverDefinition>
      </GlossaryContext.Provider>
    );

    const glossaryTermButton = getByRole('button', { name: termText });
    glossaryTermButton.click();

    const definition = getByText(termDefinition);

    expect(definition).toBeInTheDocument();
    expect(queryByText(differentPageTermDefinition)).toBeNull();
  });

  it('Adds query to window.history when View in Glossary button is clicked ', () => {
    const termText = 'Hello';
    const testPage = 'Another Test Page';

    window.history.pushState = jest.fn();

    const { getByRole } = render(
      <GlossaryContext.Provider value={{ glossaryClickEvent: false, setGlossaryClickEvent: jest.fn(), glossary: testGlossary }}>
        <GlossaryPopoverDefinition term={termText} page={testPage}>
          {termText}
        </GlossaryPopoverDefinition>
      </GlossaryContext.Provider>
    );

    const glossaryTermButton = getByRole('button', { name: termText });
    glossaryTermButton.click();

    const viewInGlossaryButton = getByRole('button', { name: 'View in glossary' });
    viewInGlossaryButton.click();
    expect(window.history.pushState).toHaveBeenCalled();
  });

  it('closes the popover when the full glossary tab is opened', () => {
    const termText = 'Hello';
    const testPage = 'Another Test Page';

    window.history.pushState = jest.fn();

    const { getByRole, queryByRole } = render(
      <GlossaryContext.Provider value={{ glossaryClickEvent: false, setGlossaryClickEvent: jest.fn(), glossary: testGlossary }}>
        <GlossaryPopoverDefinition term={termText} page={testPage}>
          {termText}
        </GlossaryPopoverDefinition>
      </GlossaryContext.Provider>
    );

    const glossaryTermButton = getByRole('button', { name: termText });
    glossaryTermButton.click();

    const viewInGlossaryButton = getByRole('button', { name: 'View in glossary' });
    viewInGlossaryButton.click();

    expect(queryByRole('button', { name: 'View in glossary' })).not.toBeInTheDocument();
  });

  it('closes popover on scroll', () => {
    const termText = 'Hello';
    const testPage = 'Another Test Page';

    window.history.pushState = jest.fn();

    const { getByRole, queryByRole } = render(
      <GlossaryContext.Provider value={{ glossaryClickEvent: false, setGlossaryClickEvent: jest.fn(), glossary: testGlossary }}>
        <GlossaryPopoverDefinition term={termText} page={testPage}>
          {termText}
        </GlossaryPopoverDefinition>
      </GlossaryContext.Provider>
    );
    const glossaryTermButton = getByRole('button', { name: termText });
    glossaryTermButton.click();

    fireEvent.scroll(window, { target: { pageYOffset: 400 } });
    expect(queryByRole('button', { name: 'View in glossary' })).not.toBeInTheDocument();
  });
});
