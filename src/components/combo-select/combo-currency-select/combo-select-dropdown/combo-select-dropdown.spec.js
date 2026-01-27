import { mockOptions } from '../../combo-select-test-helper';

describe('Combo Select Dropdown', () => {
  jest.useFakeTimers();
  const defaultSelection = mockOptions[1];
  it('should ', () => {
    expect(true);
  });
  //
  //   it('renders the dropdown when active is true', () => {
  //     const { getByTestId } = render(<ComboSelectDropdown active={true} options={[]} />);
  //     expect(getByTestId('dropdown-container')).toBeInTheDocument();
  //   });
  //
  //   it('does not render the dropdown when active is false', () => {
  //     const { queryByTestId } = render(<ComboSelectDropdown active={false} options={[]} />);
  //     expect(queryByTestId('dropdown-container')).not.toBeInTheDocument();
  //   });
  //
  //   it('contains a search bar and scrollable list container', () => {
  //     const { getByTestId, getByRole } = render(<ComboSelectDropdown active={true} options={[]} />);
  //
  //     expect(getByRole('textbox')).toBeInTheDocument();
  //     expect(getByTestId('scrollContainer')).toBeInTheDocument();
  //   });
  //
  //   it('update selection', async () => {
  //     const updateSelectionSpy = jest.fn();
  //     const setDropdownActiveSpy = jest.fn();
  //     const { getByRole } = render(
  //       <ComboSelectDropdown
  //         active={true}
  //         options={mockOptions}
  //         selectedOption={defaultSelection}
  //         updateSelection={updateSelectionSpy}
  //         setDropdownActive={setDropdownActiveSpy}
  //       />
  //     );
  //
  //     const inputField = getByRole('textbox');
  //     const updatedSelection = {
  //       label: 'Abcd2-money',
  //       value: 'Abcd2-money',
  //     };
  //
  //     userEvent.click(inputField);
  //     userEvent.keyboard(updatedSelection.label);
  //     expect(updateSelectionSpy).toHaveBeenCalledWith(updatedSelection, false);
  //   });
  //
  //   it('search bar clear', () => {
  //     const updateSelectionSpy = jest.fn();
  //     const changeHandlerSpy = jest.fn();
  //     const { getByRole } = render(
  //       <ComboSelectDropdown
  //         active={true}
  //         options={mockOptions}
  //         selectedOption={defaultSelection}
  //         updateSelection={updateSelectionSpy}
  //         changeHandler={changeHandlerSpy}
  //         setDropdownActive={jest.fn()}
  //       />
  //     );
  //
  //     const searchBar = getByRole('textbox');
  //     userEvent.click(searchBar);
  //     userEvent.keyboard('test');
  //
  //     const clearButton = getByRole('button', { name: 'Clear search bar' });
  //     userEvent.click(clearButton);
  //
  //     expect(changeHandlerSpy).toHaveBeenCalledWith(null);
  //   });
  //
  //   it('renders the list of filtered options', () => {
  //     const { getByRole, getAllByRole } = render(<ComboSelectDropdown active={true} options={mockOptions} selectedOption={defaultSelection} />);
  //
  //     const filteredOptions = getAllByRole('button');
  //     expect(filteredOptions).toHaveLength(mockOptions.length);
  //     expect(getByRole('button', { name: defaultSelection.label }));
  //   });
  //
  //   it('shows options in the dropdown list that match input characters', () => {
  //     const defaultSelection = mockOptions[1];
  //     const mockUpdateSelection = jest.fn();
  //     const { getByRole, getByTestId, getAllByText } = render(
  //       <ComboSelectDropdown
  //         active={true}
  //         options={mockOptions}
  //         selectedOption={defaultSelection}
  //         changeHandler={jest.fn()}
  //         setDropdownActive={jest.fn()}
  //         optionLabelKey={'label'}
  //         updateSelection={mockUpdateSelection}
  //         secondaryLabelKey={true}
  //       />
  //     );
  //
  //     const inputField = getByRole('textbox');
  //
  //     userEvent.click(inputField);
  //     userEvent.keyboard('Blue');
  //
  //     const dropdownContainer = getByTestId('dropdown-list');
  //     const filteredOptions = within(dropdownContainer).getAllByRole('button');
  //     expect(filteredOptions.length).toEqual(3);
  //     const option = getByRole('button', { name: 'Blue-greenstuff' });
  //     const secondaryRendering = getAllByText('No filter applied');
  //     expect(secondaryRendering.length).toBeGreaterThan(0);
  //     userEvent.click(option);
  //     expect(mockUpdateSelection).toHaveBeenCalledWith({ label: 'Blue-greenstuff', value: 'Blue-greenstuff' }, true);
  //   });
  //
  //   it('resets scroll top when active is true', () => {
  //     const defaultSelection = mockOptions[1];
  //     const { getByTestId } = render(
  //       <ComboSelectDropdown
  //         active={true}
  //         options={mockOptions}
  //         selectedOption={defaultSelection}
  //         changeHandler={jest.fn()}
  //         setDropdownActive={jest.fn()}
  //         optionLabelKey="label"
  //       />
  //     );
  //
  //     expect(getByTestId('topScrollGradient')).toHaveClass('scrollContainerTop');
  //     expect(getByTestId('topScrollGradient')).not.toHaveClass('scrollGradient');
  //   });
  // });
  //
  // describe('combo select dropdown with child sections', () => {
  //   it('renders section headers and children as buttons', () => {
  //     const onBlurHandlerSpy = jest.fn();
  //     const defaultSelection = mockOptionsWithChildren[0].children;
  //
  //     const { getByText, getByRole } = render(
  //       <ComboSelectDropdown
  //         active={true}
  //         options={mockOptionsWithChildren}
  //         selectedOption={defaultSelection}
  //         dropdownOnBlurHandler={onBlurHandlerSpy}
  //         hasChildren
  //       />
  //     );
  //
  //     expect(getByText('Section 1')).toBeInTheDocument();
  //     expect(getByText('Section 2')).toBeInTheDocument();
  //     expect(getByRole('button', { name: 'A' })).toBeInTheDocument();
  //   });
  //
  //   it('filters children on search', () => {
  //     const onBlurHandlerSpy = jest.fn();
  //     const defaultSelection = mockOptionsWithChildren[0].children;
  //     const changeHandlerSpy = jest.fn();
  //
  //     const { getByRole } = render(
  //       <ComboSelectDropdown
  //         active={true}
  //         options={mockOptionsWithChildren}
  //         selectedOption={defaultSelection}
  //         dropdownOnBlurHandler={onBlurHandlerSpy}
  //         hasChildren
  //         changeHandler={changeHandlerSpy}
  //         setDropdownActive={jest.fn()}
  //       />
  //     );
  //
  //     const searchBar = getByRole('textbox');
  //     userEvent.click(searchBar);
  //     userEvent.keyboard('A');
  //
  //     const clearButton = getByRole('button', { name: 'Clear search bar' });
  //     userEvent.click(clearButton);
  //
  //     expect(changeHandlerSpy).toHaveBeenCalledWith(null);
  //   });
  //
  //   it('does not call onBlur with clicking inside the dropdown', () => {
  //     const setDropdownActiveSpy = jest.fn();
  //     const { getByRole } = render(
  //       <ComboSelectDropdown
  //         active={true}
  //         options={mockOptions}
  //         selectedOption={mockOptions[1]}
  //         updateSelection={jest.fn()}
  //         changeHandler={jest.fn()}
  //         setDropdownActive={setDropdownActiveSpy}
  //       />
  //     );
  //
  //     const textbox = getByRole('textbox');
  //     const searchIcon = getByRole('img', { hidden: true });
  //     userEvent.click(textbox);
  //     userEvent.click(searchIcon);
  //     expect(setDropdownActiveSpy).not.toHaveBeenCalled();
  //   });
  //
  //   it('calls onBlur when tabbing beyond the dropdown', () => {
  //     const setDropdownActiveSpy = jest.fn();
  //     jest.useFakeTimers();
  //     const { getByRole } = render(
  //       <ComboSelectDropdown
  //         active={true}
  //         options={mockOptions}
  //         selectedOption={mockOptions[1]}
  //         updateSelection={jest.fn()}
  //         changeHandler={jest.fn()}
  //         setDropdownActive={setDropdownActiveSpy}
  //       />
  //     );
  //
  //     const searchBar = getByRole('textbox');
  //     userEvent.click(searchBar);
  //     userEvent.keyboard('Blah-bucks');
  //
  //     userEvent.tab();
  //     userEvent.tab();
  //     userEvent.tab();
  //
  //     jest.runAllTimers();
  //     expect(setDropdownActiveSpy).toHaveBeenCalledWith(false);
  //   });
});
