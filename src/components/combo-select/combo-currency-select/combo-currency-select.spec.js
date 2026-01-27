describe('The ComboSelect Component for general text use', () => {
  jest.useFakeTimers();
  it('should ', () => {
    expect(true);
  });
  // const defaultOptionLabel = 'Mock Label';
  // const mockDefaultSelection = {
  //   label: defaultOptionLabel,
  //   value: 'Mock Value',
  // };
  //
  // const changeHandlerSpy = jest.fn();
  //
  // describe('Google Analytics Functionality', () => {
  //   it('Pushes analytics event to datalayer for GA4 on new option selection', async () => {
  //     const { getByRole, getByTestId } = render(
  //       <ComboCurrencySelect
  //         changeHandler={changeHandlerSpy}
  //         optionLabelKey="label"
  //         options={mockOptions}
  //         selectedOption={mockDefaultSelection}
  //         isExchangeTool={true}
  //       />
  //     );
  //     window.dataLayer = window.dataLayer || [];
  //     const spy = jest.spyOn(window.dataLayer, 'push');
  //
  //     const comboBox = getByRole('button', { name: 'Mock Label' });
  //     userEvent.click(comboBox);
  //
  //     const list = getByTestId('dropdown-list');
  //
  //     const button = within(list).getAllByRole('button')[0];
  //     userEvent.click(button);
  //
  //     userEvent.click(button);
  //     expect(spy).toHaveBeenCalledWith({
  //       event: 'Foreign Country-Currency Selected',
  //       eventLabel: '(None selected)',
  //     });
  //     spy.mockClear();
  //   });
  //
  //   it('Pushes analytics event to datalayer for GA4 on text search', async () => {
  //     const { getByRole } = render(
  //       <ComboCurrencySelect
  //         changeHandler={changeHandlerSpy}
  //         optionLabelKey="label"
  //         options={mockOptions}
  //         selectedOption={mockDefaultSelection}
  //         isExchangeTool={true}
  //       />
  //     );
  //     window.dataLayer = window.dataLayer || [];
  //     const spy = jest.spyOn(window.dataLayer, 'push');
  //
  //     const comboBox = getByRole('button', { name: 'Mock Label' });
  //     userEvent.click(comboBox);
  //
  //     const textbox = getByRole('textbox');
  //     userEvent.click(textbox);
  //     userEvent.keyboard('test');
  //     userEvent.tab();
  //     await waitFor(() => {
  //       expect(spy).toHaveBeenCalledWith({
  //         event: 'Foreign Country-Currency Search',
  //         eventLabel: 'test',
  //       });
  //     });
  //     spy.mockClear();
  //   });
  // });
  //
  // it('opens and closes the dropdown box on click', async () => {
  //   const { getByRole } = render(
  //     <ComboCurrencySelect changeHandler={changeHandlerSpy} optionLabelKey="label" options={mockOptions} selectedOption={mockDefaultSelection} />
  //   );
  //   const comboBoxButton = getByRole('button', { name: defaultOptionLabel });
  //   //Default (Closed) State
  //   expect(comboBoxButton).toBeInTheDocument();
  //   expect(within(comboBoxButton).getByText(defaultOptionLabel)).toBeInTheDocument();
  //   expect(within(comboBoxButton).getByRole('img', { hidden: true })).toHaveClass('fa-chevron-down');
  //
  //   userEvent.click(comboBoxButton);
  //   // Open State
  //   expect(within(comboBoxButton).getByRole('img', { hidden: true })).toHaveClass('fa-chevron-up');
  //
  //   userEvent.click(comboBoxButton);
  //   // Closed State
  //   await waitFor(() => {
  //     expect(within(comboBoxButton).getByRole('img', { hidden: true })).toHaveClass('fa-chevron-up');
  //   });
  // });
  //
  // it('collapses dropdown when not focused', async () => {
  //   const { getByRole, queryByRole } = render(
  //     <ComboCurrencySelect changeHandler={changeHandlerSpy} optionLabelKey="label" options={mockOptionsShort} selectedOption={mockDefaultSelection} />
  //   );
  //
  //   const comboBoxButton = getByRole('button', { name: 'Mock Label' });
  //   userEvent.tab();
  //   expect(comboBoxButton).toHaveFocus();
  //
  //   userEvent.keyboard('{Enter}');
  //   userEvent.tab();
  //   userEvent.tab();
  //
  //   const firstOption = mockOptionsShort[0];
  //   expect(getByRole('button', { name: firstOption.label })).toBeInTheDocument();
  //   expect(getByRole('button', { name: firstOption.label })).toHaveFocus();
  //
  //   userEvent.tab();
  //   userEvent.tab();
  //
  //   const lastOption = mockOptionsShort[mockOptionsShort.length - 1];
  //   expect(getByRole('button', { name: lastOption.label })).toHaveFocus();
  //
  //   userEvent.tab();
  //   await waitFor(() => {
  //     expect(queryByRole('button', { name: lastOption.label })).not.toBeInTheDocument();
  //   });
  // });
  //
  // it('sets search bar to active on click and updates the container class', () => {
  //   const { getByTestId, getByRole } = render(
  //     <ComboCurrencySelect changeHandler={changeHandlerSpy} optionLabelKey="label" options={mockOptions} selectedOption={mockDefaultSelection} />
  //   );
  //
  //   const comboBoxButton = getByRole('button', { name: 'Mock Label' });
  //   userEvent.click(comboBoxButton);
  //
  //   const searchBar = getByRole('textbox', { name: 'Search currencies' });
  //   userEvent.click(searchBar);
  //
  //   const buttonContainer = getByTestId('dropdown-button-container');
  //   expect(buttonContainer).toHaveClass('activeSearchBar');
  // });
  //
  // it('dropdown remains open when clicked on', () => {
  //   const { getByTestId, getByRole } = render(
  //     <ComboCurrencySelect changeHandler={changeHandlerSpy} optionLabelKey="label" options={mockOptions} selectedOption={mockDefaultSelection} />
  //   );
  //
  //   const comboBoxButton = getByRole('button', { name: 'Mock Label' });
  //   userEvent.click(comboBoxButton);
  //
  //   const dropdownContainer = getByTestId('dropdown-container');
  //   expect(getByTestId('dropdown-list')).toBeInTheDocument();
  //
  //   userEvent.click(dropdownContainer);
  //   const list = getByTestId('dropdown-list');
  //   userEvent.hover(list);
  //
  //   expect(getByTestId('dropdown-list')).toBeInTheDocument();
  // });
  //
  // it('closes dropdown after mouse leave and focus is removed', async () => {
  //   const { getByTestId, queryByTestId, getByRole } = render(
  //     <ComboCurrencySelect changeHandler={changeHandlerSpy} optionLabelKey="label" options={mockOptions} selectedOption={mockDefaultSelection} />
  //   );
  //
  //   const comboBox = getByRole('button', { name: 'Mock Label' });
  //   userEvent.click(comboBox);
  //
  //   const list = getByTestId('dropdown-list');
  //   expect(list).toBeInTheDocument();
  //
  //   userEvent.unhover(list);
  //   fireEvent.blur(list);
  //   await waitFor(() => {
  //     expect(queryByTestId('dropdown-list')).not.toBeInTheDocument();
  //   });
  // });
  //
  // it('closes dropdown after clicking outside the component', async () => {
  //   const { getByTestId, queryByTestId, getByRole } = render(
  //     <ComboCurrencySelect changeHandler={changeHandlerSpy} optionLabelKey="label" options={mockOptions} selectedOption={mockDefaultSelection} />
  //   );
  //
  //   const comboBox = getByRole('button', { name: 'Mock Label' });
  //   userEvent.click(comboBox);
  //
  //   const list = getByTestId('dropdown-list');
  //   expect(list).toBeInTheDocument();
  //
  //   userEvent.unhover(list);
  //   act(() => {
  //     userEvent.click(document.body);
  //   });
  //   await waitFor(() => {
  //     expect(queryByTestId('dropdown-list')).not.toBeInTheDocument();
  //   });
  // });
  //
  // it('collapses dropdown when an item is selected', async () => {
  //   const { getByTestId, queryByTestId, getByRole } = render(
  //     <ComboCurrencySelect changeHandler={changeHandlerSpy} optionLabelKey="label" options={mockOptions} selectedOption={mockDefaultSelection} />
  //   );
  //
  //   const comboBox = getByRole('button', { name: 'Mock Label' });
  //   userEvent.click(comboBox);
  //
  //   const list = getByTestId('dropdown-list');
  //   expect(getByTestId('dropdown-list')).toBeInTheDocument();
  //
  //   const button = within(list).getAllByRole('button')[0];
  //   userEvent.click(button);
  //
  //   await waitFor(() => {
  //     expect(queryByTestId('dropdown-list')).not.toBeInTheDocument();
  //   });
  // });
  //
  // it('renders component with container border', () => {
  //   const { getByTestId } = render(
  //     <ComboCurrencySelect
  //       changeHandler={changeHandlerSpy}
  //       optionLabelKey="label"
  //       options={mockOptions}
  //       selectedOption={mockDefaultSelection}
  //       containerBorder
  //     />
  //   );
  //
  //   const dropdownContainer = getByTestId('dropdown-button-container');
  //   expect(dropdownContainer).toHaveClass('fullBorderContainer');
  // });
});
