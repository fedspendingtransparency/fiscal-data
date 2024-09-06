import React from 'react';
import { fireEvent, render, act, waitForElementToBeRemoved } from '@testing-library/react';
import ComboSelectDropdown from './combo-select-dropdown';
import { mockOptions, mockOptionsWithChildren } from '../../combo-select-test-helper';
import userEvent from '@testing-library/user-event';

describe('Combo Select Dropdown', () => {
  jest.useFakeTimers();
  const defaultSelection = mockOptions[1];

  it('renders the dropdown when active is true', () => {
    const { getByTestId } = render(<ComboSelectDropdown active={true} options={[]} />);

    expect(getByTestId('dropdown-container')).toBeInTheDocument();
  });

  it('does not render the dropdown when active is false', () => {
    const { queryByTestId } = render(<ComboSelectDropdown active={false} options={[]} />);

    expect(queryByTestId('dropdown-container')).not.toBeInTheDocument();
  });

  it('contains a search bar and scrollable list container', () => {
    const { getByTestId, getByRole } = render(<ComboSelectDropdown active={true} options={[]} />);

    expect(getByRole('textbox')).toBeInTheDocument();
    expect(getByTestId('scrollContainer')).toBeInTheDocument();
  });

  it('tracks when mouse or focus is over the dropdown', () => {
    const setMouseOverDropdownSpy = jest.fn();
    const onBlurHandlerSpy = jest.fn();
    const { getByTestId } = render(
      <ComboSelectDropdown
        active={true}
        options={mockOptions}
        selectedOption={defaultSelection}
        setMouseOverDropdown={setMouseOverDropdownSpy}
        dropdownOnBlurHandler={onBlurHandlerSpy}
      />
    );

    const dropdown = getByTestId('dropdown-container');
    fireEvent.mouseOver(dropdown);
    expect(setMouseOverDropdownSpy).toHaveBeenCalledWith(true);
    fireEvent.mouseLeave(dropdown);
    expect(setMouseOverDropdownSpy).toHaveBeenCalledWith(false);
    fireEvent.focus(dropdown);
    expect(setMouseOverDropdownSpy).toHaveBeenCalledWith(true);
    fireEvent.blur(dropdown);
    expect(setMouseOverDropdownSpy).toHaveBeenCalledWith(false);
  });

  it('update selection', () => {
    const updateSelectionSpy = jest.fn();
    const { getByRole } = render(
      <ComboSelectDropdown active={true} options={mockOptions} selectedOption={defaultSelection} updateSelection={updateSelectionSpy} />
    );

    const inputField = getByRole('textbox');

    const updatedSelection = {
      label: 'Abcd2-money',
      value: 'Abcd2-money',
    };

    act(() => {
      fireEvent.change(inputField, { target: { value: updatedSelection.value } });
    });

    expect(updateSelectionSpy).toHaveBeenCalledWith(updatedSelection, false);
  });

  it('search bar clear', () => {
    const updateSelectionSpy = jest.fn();
    const changeHandlerSpy = jest.fn();
    const { getByRole } = render(
      <ComboSelectDropdown
        active={true}
        options={mockOptions}
        selectedOption={defaultSelection}
        updateSelection={updateSelectionSpy}
        changeHandler={changeHandlerSpy}
        setDropdownActive={jest.fn()}
        setMouseOverDropdown={jest.fn()}
      />
    );

    const searchBar = getByRole('textbox');
    userEvent.click(searchBar);

    act(() => {
      fireEvent.change(searchBar, { target: { value: 'test' } });
    });

    const clearButton = getByRole('button', { name: 'Clear search bar' });
    userEvent.click(clearButton);

    expect(changeHandlerSpy).toHaveBeenCalledWith(null);
  });

  it('renders the list of filtered options', () => {
    const { getByRole, getAllByRole } = render(<ComboSelectDropdown active={true} options={mockOptions} selectedOption={defaultSelection} />);

    const filteredOptions = getAllByRole('button');
    expect(filteredOptions).toHaveLength(mockOptions.length);
    expect(getByRole('button', { name: defaultSelection.label }));
  });

  it('shows options in the dropdown list that match input characters', () => {
    const defaultSelection = mockOptions[1];
    const { getByRole, getAllByRole } = render(
      <ComboSelectDropdown
        active={true}
        options={mockOptions}
        selectedOption={defaultSelection}
        changeHandler={jest.fn()}
        setDropdownActive={jest.fn()}
        optionLabelKey={'label'}
      />
    );

    const inputField = getByRole('textbox');

    act(() => {
      fireEvent.change(inputField, { target: { value: 'Blue' } });
    });

    const filteredOptions = getAllByRole('button');
    expect(filteredOptions.length).toEqual(4);
  });

  it('resets scroll top when active is true', () => {
    const defaultSelection = mockOptions[1];
    const { getByTestId } = render(
      <ComboSelectDropdown
        active={true}
        options={mockOptions}
        selectedOption={defaultSelection}
        changeHandler={jest.fn()}
        setDropdownActive={jest.fn()}
        optionLabelKey="label"
      />
    );

    expect(getByTestId('topScrollGradient')).toHaveClass('scrollContainerTop');
    expect(getByTestId('topScrollGradient')).not.toHaveClass('scrollGradient');
  });
});

describe('combo select dropdown with child sections', () => {
  it('renders section headers and children as buttons', () => {
    const setMouseOverDropdownSpy = jest.fn();
    const onBlurHandlerSpy = jest.fn();
    const defaultSelection = mockOptionsWithChildren[0].children;

    const { getByText, getByRole } = render(
      <ComboSelectDropdown
        active={true}
        options={mockOptionsWithChildren}
        selectedOption={defaultSelection}
        setMouseOverDropdown={setMouseOverDropdownSpy}
        dropdownOnBlurHandler={onBlurHandlerSpy}
        hasChildren
      />
    );

    expect(getByText('Section 1')).toBeInTheDocument();
    expect(getByText('Section 2')).toBeInTheDocument();
    expect(getByRole('button', { name: 'A' })).toBeInTheDocument();
  });

  it('filters children on search', () => {
    const setMouseOverDropdownSpy = jest.fn();
    const onBlurHandlerSpy = jest.fn();
    const defaultSelection = mockOptionsWithChildren[0].children;
    const changeHandlerSpy = jest.fn();

    const { getByText, getByRole } = render(
      <ComboSelectDropdown
        active={true}
        options={mockOptionsWithChildren}
        selectedOption={defaultSelection}
        setMouseOverDropdown={setMouseOverDropdownSpy}
        dropdownOnBlurHandler={onBlurHandlerSpy}
        hasChildren
        changeHandler={changeHandlerSpy}
        setDropdownActive={jest.fn()}
      />
    );

    const searchBar = getByRole('textbox');
    userEvent.click(searchBar);
    userEvent.keyboard('A');

    const clearButton = getByRole('button', { name: 'Clear search bar' });
    userEvent.click(clearButton);

    expect(changeHandlerSpy).toHaveBeenCalledWith(null);
  });
});
