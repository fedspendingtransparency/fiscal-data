import React from 'react';
import {fireEvent, waitFor, render, within} from "@testing-library/react";
import ComboSelectDropdown from './combo-select-dropdown';
import { mockOptions } from '../../combo-select-test-helper';
import { act } from 'react-test-renderer';
import ComboSelect from '../../combo-select';

describe('Combo Select Dropdown', () => {
  jest.useFakeTimers();
  const changeHandlerSpy = jest.fn();
  const defaultSelection = mockOptions[1];


  it('renders the dropdown when active is true', () => {
    const { getByTestId } = render(<ComboSelectDropdown active={true} options={[]} />);

    expect(getByTestId('dropdown-container')).toBeInTheDocument();
  });

  it('renders the dropdown when active is true', () => {
    const { queryByTestId } = render(<ComboSelectDropdown active={false} options={[]} />);

    expect(queryByTestId('dropdown-container')).not.toBeInTheDocument();
  });

  it('contains a search bar and scrollable list container', () => {
    const { getByTestId, getByRole } = render(<ComboSelectDropdown active={true} options={[]} />);

    expect(getByRole('textbox')).toBeInTheDocument();
    expect(getByTestId('scrollContainer')).toBeInTheDocument();
  });

  it('on blur', () => {

  });

  it('on mouseover and mouse leave', () => {

  });

  it('on focus', () => {

  });

  it('on blur for list', () => {

  });

  it('renders the list of filtered options', () => {
    const { getByRole, getAllByRole } = render(
      <ComboSelectDropdown
        active={true}
        options={mockOptions}
        selectedOption={defaultSelection}
      />);

    const filteredOptions = getAllByRole('button');
    expect(filteredOptions).toHaveLength(mockOptions.length);
    expect(getByRole('button', {name: defaultSelection.label}));
  });

  it('shows options in the dropdown list that match input characters', () => {
    // changeHandlerSpy.mockClear();
    const defaultSelection = mockOptions[1];
    const { getByRole, getAllByRole } = render(
      <ComboSelectDropdown
        active={true}
        options={mockOptions}
        selectedOption={defaultSelection}
        changeHandler={jest.fn()}
        setDropdownActive={jest.fn()}
        optionLabelKey={'label'}
      />);

    const inputField = getByRole('textbox');

    act(() => {
      fireEvent.change(inputField, {target: {value: 'Blue'}});
    })

    const filteredOptions = getAllByRole('button');
    expect(filteredOptions.length).toEqual(3);
  });
})
