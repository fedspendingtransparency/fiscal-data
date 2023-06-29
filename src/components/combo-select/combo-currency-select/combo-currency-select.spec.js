
import React from 'react';
import {fireEvent, waitFor, render, within} from "@testing-library/react";
import ComboSelect from '../combo-select';
import {mockOptions} from "../combo-select-test-helper";
import Analytics from "../../../utils/analytics/analytics";
import userEvent from '@testing-library/user-event'
import ComboCurrencySelect from './combo-currency-select';


describe('The ComboSelect Component for general text use', () => {
  jest.useFakeTimers();

  const mockDefaultSelection = {
    label: 'Mock Label',
    value: 'Mock Value'
  }

  const changeHandlerSpy = jest.fn();


  it('renders the default state, displaying the default selected option label and a down arrow icon', () => {
    const { getByRole, getByTestId } = render(
      <ComboCurrencySelect
        changeHandler={changeHandlerSpy}
        optionLabelKey={'label'}
        options={mockOptions}
        selectedOption={mockDefaultSelection}
      />
    )

    expect(getByRole('button', {name: 'Mock Label'})).toBeInTheDocument();
    expect(getByTestId('expand-dropdown')).toBeInTheDocument();
  });

  it('renders the active state and dropdown panel on click', () => {
    const { getByRole, getByTestId, queryByTestId } = render(
      <ComboCurrencySelect
        changeHandler={changeHandlerSpy}
        optionLabelKey={'label'}
        options={mockOptions}
        selectedOption={mockDefaultSelection}
      />
    )
    const dropdownBox = getByRole('button', {name: 'Mock Label'});
    expect(queryByTestId('dropdown-container')).not.toBeInTheDocument();
    fireEvent.click(dropdownBox);
    expect(getByRole('button', {name: 'Mock Label'})).toBeInTheDocument();
    expect(getByTestId('collapse-dropdown')).toBeInTheDocument();
    expect(getByTestId('dropdown-container')).toBeInTheDocument();
  });

  // it('collapses dropdown when not focused', async () => {
  //   const defaultSelection = mockOptions[1];
  //   const {getByTestId, queryByTestId, getByRole} = render(
  //     <ComboSelectDropdown
  //       active={true}
  //       options={mockOptions}
  //       selectedOption={defaultSelection}
  //       changeHandler={jest.fn()}
  //       setDropdownActive={jest.fn()}
  //       optionLabelKey={'label'}
  //     />);
  //
  //   const inputField = getByRole('textbox');
  //   console.log(inputField.innerHTML)
  //   expect(getByRole('img', {hidden: true})).toHaveClass('fa-magnifying-glass');
  //
  //   // const dropdownButton = getByTestId('down-arrow');
  //   expect(queryByTestId('selectorList')).not.toBeInTheDocument();
  //
  //   fireEvent.click(dropdownButton);
  //   const list = getByTestId('selectorList');
  //   list.focus();
  //   expect(getByTestId('selectorList')).toBeInTheDocument();
  //
  //   fireEvent.blur(list);
  //
  //   await waitFor(() => {
  //     expect(queryByTestId('selectorList')).not.toBeInTheDocument();
  //   });
  // });

  it('dropdown remains open when clicked on',  () => {
    const {getByTestId} = render(
      <ComboSelectDropdown
        active={true}
        options={mockOptions}
        selectedOption={defaultSelection}
        changeHandler={jest.fn()}
        setDropdownActive={jest.fn()}
        optionLabelKey={'label'}
      />);
    const dropdownContainer = getByTestId('dropdown-container')
    expect(getByTestId('dropdown-list')).toBeInTheDocument();

    fireEvent.click(dropdownContainer);
    const list = getByTestId('dropdown-list');
    fireEvent.mouseDown(list);

    expect(getByTestId('dropdown-list')).toBeInTheDocument();
  });

  it('closes dropdown after mouse leave and focus is removed',  async () => {
    const setMouseOverDropdownSpy = jest.fn();
    const blurHandlerSpy = jest.fn();
    const {getByTestId, queryByTestId} = render(
      <ComboSelectDropdown
        active={true}
        options={mockOptions}
        selectedOption={defaultSelection}
        changeHandler={jest.fn()}
        setDropdownActive={jest.fn()}
        optionLabelKey={'label'}
        setMouseOverDropdown={setMouseOverDropdownSpy}
        onBlurHandler={blurHandlerSpy}
      />);
    const dropdownContainer = queryByTestId('dropdown-container')
    expect(queryByTestId('dropdown-list')).toBeInTheDocument();

    const list = getByTestId('dropdown-list');

    fireEvent.mouseLeave(list);
    fireEvent.blur(list);
    await waitFor(() => {
      expect(queryByTestId('dropdown-list')).not.toBeInTheDocument();
    });
  });

  it('collapses dropdown when an item is selected', async () => {
    const {getByTestId, queryByTestId} = render(
      <ComboSelectDropdown
        active={true}
        options={mockOptions}
        selectedOption={defaultSelection}
        changeHandler={jest.fn()}
        setDropdownActive={jest.fn()}
        optionLabelKey={'label'}
      />);
    const dropdownButton = getByTestId('down-arrow');
    expect(queryByTestId('selectorList')).not.toBeInTheDocument();

    fireEvent.click(dropdownButton);
    const list = getByTestId('selectorList');
    expect(getByTestId('selectorList')).toBeInTheDocument();

    const button = within(list).getAllByRole('button')[0];
    fireEvent.click(button);

    await waitFor(() => {
      expect(queryByTestId('selectorList')).not.toBeInTheDocument();
    });
  });


});
