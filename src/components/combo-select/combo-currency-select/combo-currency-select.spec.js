import React from 'react';
import { fireEvent, waitFor, render, within } from '@testing-library/react';
import { mockOptions, mockSiblingOneOptions, mockSiblingTwoOptions } from '../combo-select-test-helper';
import ComboCurrencySelect from './combo-currency-select';
import userEvent from '@testing-library/user-event';

describe('The ComboSelect Component for general text use', () => {
  jest.useFakeTimers();

  const mockDefaultSelection = {
    label: 'Mock Label',
    value: 'Mock Value',
  };

  const changeHandlerSpy = jest.fn();
  const setCloseSiblingMock = jest.fn();

  it('Pushes analytics event to datalayer for GA4 for combo-currency-select', async () => {
    const { getByRole, getByTestId } = render(
      <ComboCurrencySelect
        changeHandler={changeHandlerSpy}
        optionLabelKey={'label'}
        options={mockOptions}
        selectedOption={mockDefaultSelection}
        isExchangeTool={true}
      />
    );
    window.dataLayer = window.dataLayer || [];
    const spy = jest.spyOn(window.dataLayer, 'push');

    const comboBox = getByRole('button', { name: 'Mock Label' });
    fireEvent.click(comboBox);

    const list = getByTestId('dropdown-list');
    expect(getByTestId('dropdown-list')).toBeInTheDocument();

    const button = within(list).getAllByRole('button')[0];
    fireEvent.click(button);

    fireEvent.click(button);
    expect(spy).toHaveBeenCalledWith({
      event: 'Foreign Country-Currency Selected',
      eventLabel: '(None selected)',
    });
    spy.mockClear();
  });

  it('renders the default state, displaying the default selected option label and a down arrow icon', () => {
    const { getByRole, getByTestId } = render(
      <ComboCurrencySelect changeHandler={changeHandlerSpy} optionLabelKey={'label'} options={mockOptions} selectedOption={mockDefaultSelection} />
    );

    expect(getByRole('button', { name: 'Mock Label' })).toBeInTheDocument();
    expect(getByTestId('expand-dropdown')).toBeInTheDocument();
  });

  it('renders the active state and dropdown panel on click', () => {
    const { getByRole, getByTestId, queryByTestId } = render(
      <ComboCurrencySelect changeHandler={changeHandlerSpy} optionLabelKey={'label'} options={mockOptions} selectedOption={mockDefaultSelection} />
    );
    const dropdownBox = getByRole('button', { name: 'Mock Label' });
    expect(queryByTestId('dropdown-container')).not.toBeInTheDocument();
    fireEvent.click(dropdownBox);
    expect(getByRole('button', { name: 'Mock Label' })).toBeInTheDocument();
    expect(getByTestId('collapse-dropdown')).toBeInTheDocument();
    expect(getByTestId('dropdown-container')).toBeInTheDocument();
  });

  it('collapses dropdown when not focused', async () => {
    const { getByTestId, queryByTestId, getByRole } = render(
      <ComboCurrencySelect changeHandler={changeHandlerSpy} optionLabelKey={'label'} options={mockOptions} selectedOption={mockDefaultSelection} />
    );

    const comboBox = getByRole('button', { name: 'Mock Label' });
    fireEvent.click(comboBox);

    const list = getByTestId('dropdown-container');
    list.focus();
    expect(list).toBeInTheDocument();
    fireEvent.blur(list);

    await waitFor(() => {
      expect(queryByTestId('dropdown-container')).not.toBeInTheDocument();
    });
  });

  it('sets search bar to active on click and updates the container class', () => {
    const { getByTestId, getByRole } = render(
      <ComboCurrencySelect changeHandler={changeHandlerSpy} optionLabelKey={'label'} options={mockOptions} selectedOption={mockDefaultSelection} />
    );

    const comboBox = getByRole('button', { name: 'Mock Label' });
    fireEvent.click(comboBox);

    const searchBar = getByRole('textbox');
    fireEvent.click(searchBar);

    const buttonContainer = getByTestId('dropdown-button-container');
    expect(buttonContainer).toHaveClass('activeSearchBar');
  });

  it('dropdown remains open when clicked on', () => {
    const { getByTestId, getByRole } = render(
      <ComboCurrencySelect changeHandler={changeHandlerSpy} optionLabelKey={'label'} options={mockOptions} selectedOption={mockDefaultSelection} />
    );

    const comboBox = getByRole('button', { name: 'Mock Label' });
    fireEvent.click(comboBox);

    const dropdownContainer = getByTestId('dropdown-container');
    expect(getByTestId('dropdown-list')).toBeInTheDocument();

    fireEvent.click(dropdownContainer);
    const list = getByTestId('dropdown-list');
    fireEvent.mouseDown(list);

    expect(getByTestId('dropdown-list')).toBeInTheDocument();
  });

  it('sibling dropdown is closed other sibling dropdown has opened', async () => {
    const { getByRole, getAllByTestId, queryByTestId } = render(
      <div>
        <ComboCurrencySelect
          label={'Year'}
          changeHandler={changeHandlerSpy}
          optionLabelKey={'label'}
          options={mockSiblingOneOptions}
          selectedOption={mockDefaultSelection}
          closeDropdown={false}
          setCloseSiblingDropdown={setCloseSiblingMock}
        />
        <ComboCurrencySelect
          label={'Month'}
          changeHandler={changeHandlerSpy}
          optionLabelKey={'label'}
          options={mockSiblingTwoOptions}
          selectedOption={mockDefaultSelection}
          closeDropdown={true}
          setCloseSiblingDropdown={setCloseSiblingMock}
        />
      </div>
    );
    const comboBoxYear = getByRole('button', { name: 'Year' });
    userEvent.click(comboBoxYear);

    expect(getAllByTestId('dropdown-list').length).toBe(1);

    // Close then reopen dropdown
    userEvent.click(comboBoxYear);
    await waitFor(() => {
      expect(setCloseSiblingMock).toHaveBeenCalled();
    });
    userEvent.click(comboBoxYear);

    expect(getAllByTestId('dropdown-list').length).toBe(1);

    const list = getAllByTestId('dropdown-list')[0];
    const yearOption = within(list).getAllByRole('button')[0];
    expect(yearOption).toBeInTheDocument();

    const comboBoxMonth = getByRole('button', { name: 'Month' });

    // Clicking other combo box closes open sibling
    userEvent.click(comboBoxMonth);

    await waitFor(() => {
      expect(setCloseSiblingMock).toHaveBeenCalledTimes(4);
    });

    expect(queryByTestId('dropdown-list')).not.toBeInTheDocument();
  });

  it('closes dropdown after mouse leave and focus is removed', async () => {
    const { getByTestId, queryByTestId, getByRole } = render(
      <ComboCurrencySelect changeHandler={changeHandlerSpy} optionLabelKey={'label'} options={mockOptions} selectedOption={mockDefaultSelection} />
    );

    const comboBox = getByRole('button', { name: 'Mock Label' });
    fireEvent.click(comboBox);

    expect(queryByTestId('dropdown-list')).toBeInTheDocument();

    const list = getByTestId('dropdown-list');

    fireEvent.mouseLeave(list);
    fireEvent.blur(list);
    await waitFor(() => {
      expect(queryByTestId('dropdown-list')).not.toBeInTheDocument();
    });
  });

  it('collapses dropdown when an item is selected', async () => {
    const { getByTestId, queryByTestId, getByRole } = render(
      <ComboCurrencySelect changeHandler={changeHandlerSpy} optionLabelKey={'label'} options={mockOptions} selectedOption={mockDefaultSelection} />
    );

    const comboBox = getByRole('button', { name: 'Mock Label' });

    fireEvent.click(comboBox);

    const list = getByTestId('dropdown-list');
    expect(getByTestId('dropdown-list')).toBeInTheDocument();

    const button = within(list).getAllByRole('button')[0];
    fireEvent.click(button);

    await waitFor(() => {
      expect(queryByTestId('dropdown-list')).not.toBeInTheDocument();
    });
  });
});
