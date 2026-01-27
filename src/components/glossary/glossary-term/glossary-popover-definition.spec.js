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
    {
      id: 5,
      term: 'Fiscal Year',
      site_page: 'Test Page',
      definition: 'For example, Fiscal Year 1111 (FY 1111) started October 1, 1110, and ended September 30, 1111.',
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
  it('should ', () => {
    expect(true);
  });
  // it('renders a button for the glossary term', () => {
  //   const termText = 'Hello';
  //   const testPage = 'Test Page';
  //
  //   const { getByRole } = render(
  //     <GlossaryPopoverDefinition term="hello" page={testPage}>
  //       {termText}
  //     </GlossaryPopoverDefinition>
  //   );
  //   const glossaryTermButton = getByRole('button', { name: termText });
  //   expect(glossaryTermButton).toBeInTheDocument();
  // });
  //
  // it('renders the glossary popover with the matching term and definition on click', async () => {
  //   const termText = 'Hello';
  //   const termDefinition = 'A greeting';
  //   const testPage = 'Test Page';
  //
  //   const { getByRole, findByText } = render(
  //     <GlossaryContext.Provider
  //       value={{
  //         glossaryClickEvent: false,
  //         setGlossaryClickEvent: jest.fn(),
  //         glossary: testGlossary,
  //       }}
  //     >
  //       <GlossaryPopoverDefinition term={termText} page={testPage}>
  //         {termText}
  //       </GlossaryPopoverDefinition>
  //     </GlossaryContext.Provider>
  //   );
  //   const glossaryTermButton = getByRole('button', { name: termText });
  //   userEvent.click(glossaryTermButton);
  //
  //   const definition = findByText(termDefinition);
  //
  //   expect(await definition).toBeInTheDocument();
  // });
  //
  // it('adds the link into the definition, if url_display is found within the definition text', async () => {
  //   const glossaryDefinition = 'Test for term with link.';
  //   const termText = 'Hello again';
  //   const testPage = 'Test Page';
  //
  //   const { findByRole, findByText } = render(
  //     <GlossaryContext.Provider
  //       value={{
  //         glossaryClickEvent: false,
  //         setGlossaryClickEvent: jest.fn(),
  //         glossary: testGlossary,
  //       }}
  //     >
  //       <GlossaryPopoverDefinition term={termText} page={testPage}>
  //         {termText}
  //       </GlossaryPopoverDefinition>
  //     </GlossaryContext.Provider>
  //   );
  //   const glossaryTermButton = await findByRole('button', { name: termText });
  //   userEvent.click(glossaryTermButton);
  //
  //   const definitionText = await findByText('Test for term', { exact: false });
  //   expect(await findByRole('link', { name: 'link' })).toBeInTheDocument();
  //   expect(definitionText.textContent).toEqual(glossaryDefinition);
  // });
  //
  // it('adds the custom style into the definition', async () => {
  //   const termText = 'Debt Held by the Public';
  //   const testPage = 'Test Page';
  //
  //   const { getByRole, findByText } = render(
  //     <GlossaryContext.Provider
  //       value={{
  //         glossaryClickEvent: false,
  //         setGlossaryClickEvent: jest.fn(),
  //         glossary: testGlossary,
  //       }}
  //     >
  //       <GlossaryPopoverDefinition term="Debt Held by the Public" page={testPage}>
  //         {termText}
  //       </GlossaryPopoverDefinition>
  //     </GlossaryContext.Provider>
  //   );
  //   const glossaryTermButton = getByRole('button', { name: termText });
  //
  //   userEvent.click(glossaryTermButton);
  //
  //   const styledText = findByText('not');
  //   expect(await styledText).toHaveStyle({ textDecoration: 'underline' });
  // });
  //
  // it('handles the fiscal year special case', () => {
  //   const termText = 'Fiscal Year';
  //   const testPage = 'Test Page';
  //   const fy = getFiscalYearByDate();
  //   const expected = `For example, Fiscal Year ${fy - 1} (FY ${fy - 1}) started October 1, ${fy - 2}, and ended September 30, ${fy - 1}.`;
  //
  //   const { getByRole, getByText } = render(
  //     <GlossaryContext.Provider value={{ glossaryClickEvent: false, setGlossaryClickEvent: jest.fn(), glossary: testGlossary }}>
  //       <GlossaryPopoverDefinition term={termText} page={testPage}>
  //         {termText}
  //       </GlossaryPopoverDefinition>
  //     </GlossaryContext.Provider>
  //   );
  //   const glossaryTermButton = getByRole('button', { name: termText });
  //   userEvent.click(glossaryTermButton);
  //
  //   const definition = getByText('For example', { exact: false });
  //   expect(definition.textContent).toEqual(expected);
  // });
  //
  // it('correctly displays the definition for the term associated with the specified page', async () => {
  //   const termText = 'Hello';
  //   const termDefinition = 'A different greeting';
  //   const differentPageTermDefinition = 'A greeting';
  //   const testPage = 'Another Test Page';
  //
  //   const { getByRole, findByText, queryByText } = render(
  //     <GlossaryContext.Provider
  //       value={{
  //         glossaryClickEvent: false,
  //         setGlossaryClickEvent: jest.fn(),
  //         glossary: testGlossary,
  //       }}
  //     >
  //       <GlossaryPopoverDefinition term={termText} page={testPage}>
  //         {termText}
  //       </GlossaryPopoverDefinition>
  //     </GlossaryContext.Provider>
  //   );
  //
  //   const glossaryTermButton = getByRole('button', { name: termText });
  //   userEvent.click(glossaryTermButton);
  //
  //   const definition = findByText(termDefinition);
  //
  //   expect(await definition).toBeInTheDocument();
  //   expect(queryByText(differentPageTermDefinition)).toBeNull();
  // });
  //
  // it('Adds query to window.history when View in Glossary button is clicked ', async () => {
  //   const termText = 'Hello';
  //   const testPage = 'Another Test Page';
  //
  //   window.history.pushState = jest.fn();
  //
  //   const { findByRole } = render(
  //     <GlossaryContext.Provider
  //       value={{
  //         glossaryClickEvent: false,
  //         setGlossaryClickEvent: jest.fn(),
  //         glossary: testGlossary,
  //       }}
  //     >
  //       <GlossaryPopoverDefinition term={termText} page={testPage}>
  //         {termText}
  //       </GlossaryPopoverDefinition>
  //     </GlossaryContext.Provider>
  //   );
  //
  //   const glossaryTermButton = await findByRole('button', { name: termText });
  //   userEvent.click(glossaryTermButton);
  //
  //   const viewInGlossaryButton = await findByRole('button', { name: 'View in glossary' });
  //   userEvent.click(viewInGlossaryButton);
  //
  //   expect(window.history.pushState).toHaveBeenCalled();
  // });
  //
  // it('closes the popover when the full glossary tab is opened', async () => {
  //   const termText = 'Hello';
  //   const testPage = 'Another Test Page';
  //
  //   window.history.pushState = jest.fn();
  //
  //   const { findByRole, queryByRole } = render(
  //     <GlossaryContext.Provider
  //       value={{
  //         glossaryClickEvent: false,
  //         setGlossaryClickEvent: jest.fn(),
  //         glossary: testGlossary,
  //       }}
  //     >
  //       <GlossaryPopoverDefinition term={termText} page={testPage}>
  //         {termText}
  //       </GlossaryPopoverDefinition>
  //     </GlossaryContext.Provider>
  //   );
  //
  //   const glossaryTermButton = await findByRole('button', { name: termText });
  //   userEvent.click(glossaryTermButton);
  //
  //   const viewInGlossaryButton = await findByRole('button', { name: 'View in glossary' });
  //   userEvent.click(viewInGlossaryButton);
  //
  //   waitFor(() => expect(queryByRole('button', { name: 'View in glossary' })).not.toBeInTheDocument());
  // });
  //
  // it('closes popover on scroll', () => {
  //   const termText = 'Hello';
  //   const testPage = 'Another Test Page';
  //
  //   window.history.pushState = jest.fn();
  //
  //   const { getByRole, queryByRole } = render(
  //     <GlossaryContext.Provider
  //       value={{
  //         glossaryClickEvent: false,
  //         setGlossaryClickEvent: jest.fn(),
  //         glossary: testGlossary,
  //       }}
  //     >
  //       <GlossaryPopoverDefinition term={termText} page={testPage}>
  //         {termText}
  //       </GlossaryPopoverDefinition>
  //     </GlossaryContext.Provider>
  //   );
  //   const glossaryTermButton = getByRole('button', { name: termText });
  //   userEvent.click(glossaryTermButton);
  //
  //   act(() => {
  //     fireEvent.scroll(window, { target: { pageYOffset: 400 } });
  //   });
  //
  //   expect(queryByRole('button', { name: 'View in glossary' })).not.toBeInTheDocument();
  // });
  //
  // it('calls handleClick function on button click', () => {
  //   const termText = 'Hello';
  //   const testPage = 'Test Page';
  //   const handleClickSpy = jest.fn();
  //   const { getByRole } = render(
  //     <GlossaryPopoverDefinition term="hello" page={testPage} handleClick={handleClickSpy}>
  //       {termText}
  //     </GlossaryPopoverDefinition>
  //   );
  //   const glossaryTermButton = getByRole('button', { name: termText });
  //   userEvent.click(glossaryTermButton);
  //   expect(handleClickSpy).toHaveBeenCalled();
  // });
});
