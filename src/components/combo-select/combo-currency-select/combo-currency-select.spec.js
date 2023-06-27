
import renderer from 'react-test-renderer';
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


});
