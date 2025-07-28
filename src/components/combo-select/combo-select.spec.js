import React, { act } from 'react';
import { fireEvent, getAllByRole, getByTestId, render, waitFor, within } from '@testing-library/react';
import ComboSelect from './combo-select';
import { mockOptions } from './combo-select-test-helper';
import Analytics from '../../utils/analytics/analytics';
import userEvent from '@testing-library/user-event';

describe('The ComboSelect Component for Published Report year filtering', () => {
  const mockYearOptions = [];
  for (let i = 2020; i > 1995; i--) {
    mockYearOptions.push({ label: i, value: i });
  }

  const changeHandlerSpy = jest.fn();

  it('renders an input field that opens a dropdown list of all options on focus', () => {
    const { getByRole, queryAllByRole } = render(
      <ComboSelect
        changeHandler={changeHandlerSpy}
        optionLabelKey="label"
        options={mockYearOptions}
        selectedOption={null}
        yearFilter={true}
        required={true}
      />
    );
    const inputField = getByRole('spinbutton', { type: 'number' });

    // no option list rendered initially
    expect(queryAllByRole('button').length).toBe(0);

    // focus
    fireEvent.focus(inputField);
    const optionButtons = queryAllByRole('button');
    expect(optionButtons.length).toBe(25);

    expect(within(optionButtons[0]).getByText('2020')).toBeInTheDocument();
    expect(within(optionButtons[9]).getByText('2011')).toBeInTheDocument();
  });

  it('shows up to ten topmost options in the dropdown list that match input digits', () => {
    const { getByRole, getAllByRole } = render(
      <ComboSelect
        changeHandler={changeHandlerSpy}
        optionLabelKey="label"
        options={mockYearOptions}
        selectedOption={null}
        yearFilter={true}
        required={true}
      />
    );
    const inputField = getByRole('spinbutton', { type: 'number' });

    userEvent.type(inputField, '01');
    let optionButtons = getAllByRole('button');
    expect(optionButtons.length).toEqual(11);
    expect(within(optionButtons[0]).getByText('2019')).toBeInTheDocument();
    expect(within(optionButtons[9]).getByText('2010')).toBeInTheDocument();

    userEvent.type(inputField, '9');
    optionButtons = getAllByRole('button');
    expect(optionButtons.length).toEqual(1);
    expect(within(optionButtons[0]).getByText('2019')).toBeInTheDocument();
  });

  it('only allows numeric entries', () => {
    const charsRejected = ['a', 'Z', '-', ',', '.', '+', 'e'];
    const charsAccepted = ['1996', '2005', '2020'];

    const { getByRole, getByDisplayValue, queryByDisplayValue } = render(
      <ComboSelect
        changeHandler={changeHandlerSpy}
        optionLabelKey="label"
        options={mockYearOptions}
        selectedOption={null}
        yearFilter={true}
        required={true}
      />
    );
    const inputField = getByRole('spinbutton', { type: 'number' });

    charsAccepted.forEach(kp => {
      userEvent.type(inputField, kp);
      expect(getByDisplayValue(Number(kp))).toBeInTheDocument();
      userEvent.type(inputField, '{backspace}{backspace}{backspace}{backspace}');
    });
    charsRejected.forEach(kp => {
      userEvent.type(inputField, kp);
      expect(queryByDisplayValue(kp)).not.toBeInTheDocument();
      userEvent.type(inputField, '{backspace}');
    });
  });

  it('correctly cleans input when multiple characters are input (pasted in) by the user in a single event', () => {
    const { getByRole, getByDisplayValue } = render(
      <ComboSelect
        changeHandler={changeHandlerSpy}
        optionLabelKey="label"
        options={mockYearOptions}
        selectedOption={null}
        yearFilter={true}
        required={true}
      />
    );
    const inputField = getByRole('spinbutton', { type: 'number' });
    userEvent.type(inputField, '-1.5+e109');
    expect(getByDisplayValue('1510')).toBeInTheDocument();
  });

  it('calls the change handler when a year option is selected', () => {
    changeHandlerSpy.mockClear();

    const { getByRole, getAllByRole, queryAllByRole } = render(
      <ComboSelect
        changeHandler={changeHandlerSpy}
        optionLabelKey="label"
        options={mockYearOptions}
        selectedOption={null}
        yearFilter={true}
        required={true}
      />
    );
    const inputField = getByRole('spinbutton', { type: 'number' });
    // no option list rendered initially
    expect(queryAllByRole('button')).toEqual([]);

    fireEvent.focus(inputField);
    const optionButtons = getAllByRole('button');

    const button = optionButtons[5];
    expect(within(button).getByText('2015')).toBeInTheDocument();
    fireEvent.click(button);

    expect(changeHandlerSpy).toHaveBeenNthCalledWith(1, { label: 2015, value: 2015 });
  });
});

describe('The ComboSelect Component for general text use', () => {
  jest.useFakeTimers();
  const changeHandlerSpy = jest.fn();

  it('renders an input field that opens a dropdown list of all options on focus', () => {
    const { getByRole, getAllByRole, queryAllByTestId } = render(
      <ComboSelect changeHandler={changeHandlerSpy} optionLabelKey="label" options={mockOptions} selectedOption={null} />
    );
    const inputField = getByRole('textbox');

    // the option list is initially not in view
    expect(queryAllByTestId('selectorList').length).toStrictEqual(0);

    fireEvent.focus(inputField);

    const optionButtons = getAllByRole('listitem');
    expect(optionButtons.length).toEqual(16);
    // spot check options/ordering
    expect(within(optionButtons[0]).getByText('(None selected)')).toBeInTheDocument();
    expect(within(optionButtons[15]).getByText('Nice3-lettuce')).toBeInTheDocument();
  });

  it('changes from a chevron icon to a circleX icon when en entry is made', () => {
    const { getByRole, queryAllByTestId, getByTestId } = render(
      <ComboSelect changeHandler={changeHandlerSpy} optionLabelKey="label" options={mockOptions} selectedOption={null} />
    );
    const inputField = getByRole('textbox');
    fireEvent.focus(inputField);

    // with no entry value, there should be no circle-X (clear-entry) icon
    expect(queryAllByTestId('clear-button').length).toStrictEqual(0);

    // and there should be a chevron icon
    expect(getByTestId('dropdown-button')).toBeInTheDocument();

    userEvent.type(inputField, 'guess');

    // with an entry value present, there should be no chevron icon (clear-entry) icon
    expect(queryAllByTestId('dropdown-button').length).toStrictEqual(0);

    // and there should be a circle-X (clear-entry) icon
    expect(getByTestId('clear-button')).toBeInTheDocument();
  });

  it('clears any existing entry when the clear-entry/circle-x icon is clicked', () => {
    const { getByRole, getByTestId } = render(
      <ComboSelect changeHandler={changeHandlerSpy} optionLabelKey="label" options={mockOptions} selectedOption={null} />
    );
    const inputField = getByRole('textbox');
    userEvent.type(inputField, 'guess');

    expect(inputField).toHaveValue('guess');

    const button = getByTestId('clear-button');
    userEvent.click(button);

    expect(inputField).toHaveValue('');
  });

  it('toggles the dropdown when the chevron icon is clicked', () => {
    const { getAllByRole, queryAllByRole, getByRole } = render(
      <ComboSelect changeHandler={changeHandlerSpy} optionLabelKey="label" options={mockOptions} selectedOption={null} />
    );

    // the option list is initially not in view
    expect(queryAllByRole('listitem').length).toStrictEqual(0);

    // click the chevron dropdown button
    const dropdownButton = getByRole('button', { name: 'Show options' });
    userEvent.click(dropdownButton);

    // the list should be visible/dropped down
    expect(getAllByRole('listitem').length).toBeGreaterThan(0);

    // again click the chevron dropdown button
    act(() => {
      userEvent.click(dropdownButton);
      jest.runAllTimers();
    });

    // now the list should be gone
    expect(queryAllByRole('listitem').length).toStrictEqual(0);
  });

  it('shows options in the dropdown list that match input characters', () => {
    changeHandlerSpy.mockClear();
    const { getByRole, getAllByRole, getByTestId } = render(
      <ComboSelect changeHandler={changeHandlerSpy} optionLabelKey="label" options={mockOptions} selectedOption={null} />
    );
    const inputField = getByRole('textbox');

    userEvent.type(inputField, 'Blue');

    let optionButtons = getAllByRole('listitem');
    expect(optionButtons.length).toEqual(3);
    expect(within(optionButtons[0]).getByText('Blue-greenstuff')).toBeInTheDocument();
    expect(within(optionButtons[2]).getByText('Blue3-greenstuff')).toBeInTheDocument();

    userEvent.click(getByTestId('clear-button'));
    userEvent.type(inputField, '2-');

    optionButtons = getAllByRole('listitem');
    expect(optionButtons.length).toEqual(5);
    expect(within(optionButtons[0]).getByText('Abcd2-money')).toBeInTheDocument();
    expect(within(optionButtons[4]).getByText('Nice2-lettuce')).toBeInTheDocument();

    // not case-sensitive, and can limit to a single matching result
    userEvent.click(getByTestId('clear-button'));
    userEvent.type(inputField, 'nice2-Let');
    optionButtons = getAllByRole('listitem');
    expect(optionButtons.length).toEqual(1);
    expect(within(optionButtons[0]).getByText('Nice2-lettuce')).toBeInTheDocument();
  });

  it('collapses dropdown when not focused', async () => {
    const { getByTestId, queryByTestId } = render(
      <ComboSelect changeHandler={changeHandlerSpy} optionLabelKey={'label'} options={mockOptions} selectedOption={null} />
    );
    const dropdownButton = getByTestId('down-arrow');
    expect(queryByTestId('selectorList')).not.toBeInTheDocument();

    fireEvent.click(dropdownButton);
    const list = getByTestId('selectorList');
    list.focus();
    expect(getByTestId('selectorList')).toBeInTheDocument();

    fireEvent.blur(list);

    await waitFor(() => {
      expect(queryByTestId('selectorList')).not.toBeInTheDocument();
    });
  });

  it('dropdown remains open when clicked on', () => {
    const { getByTestId, queryByTestId } = render(
      <ComboSelect changeHandler={changeHandlerSpy} optionLabelKey={'label'} options={mockOptions} selectedOption={null} />
    );
    const dropdownButton = getByTestId('down-arrow');
    expect(queryByTestId('selectorList')).not.toBeInTheDocument();

    fireEvent.click(dropdownButton);
    const list = getByTestId('selectorList');
    fireEvent.mouseDown(list);

    expect(getByTestId('selectorList')).toBeInTheDocument();
  });

  it('closes dropdown after mouse leave and focus is removed', async () => {
    const { getByTestId, queryByTestId } = render(
      <ComboSelect changeHandler={changeHandlerSpy} optionLabelKey={'label'} options={mockOptions} selectedOption={null} />
    );
    const dropdownButton = getByTestId('down-arrow');
    expect(queryByTestId('selectorList')).not.toBeInTheDocument();

    fireEvent.click(dropdownButton);
    const list = getByTestId('selectorList');
    fireEvent.mouseLeave(list);
    fireEvent.blur(list);
    await waitFor(() => {
      expect(queryByTestId('selectorList')).not.toBeInTheDocument();
    });
  });

  it('collapses dropdown when an item is selected', async () => {
    const { getByTestId, queryByTestId } = render(
      <ComboSelect changeHandler={changeHandlerSpy} optionLabelKey={'label'} options={mockOptions} selectedOption={null} />
    );
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

  it('calls the appropriate analytics event when combo box input is updated within XR tool', async () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByTestId } = render(
      <ComboSelect changeHandler={changeHandlerSpy} optionLabelKey={'label'} options={mockOptions} selectedOption={null} isExchangeTool={true} />
    );

    const comboBox = getByTestId('combo-box');

    fireEvent.change(comboBox, { target: { value: 'Abcd' } });
    fireEvent.focusOut(comboBox);

    expect(spy).toHaveBeenCalledWith({
      category: 'Exchange Rates Converter',
      action: `Foreign Country-Currency Search`,
      label: 'Abcd',
    });
  });

  it('calls the appropriate GA4 datalayer push when combo box input is updated within XR tool', async () => {
    const { getByTestId } = render(
      <ComboSelect changeHandler={changeHandlerSpy} optionLabelKey={'label'} options={mockOptions} selectedOption={null} isExchangeTool={true} />
    );

    window.dataLayer = window.dataLayer || [];
    const spy = jest.spyOn(window.dataLayer, 'push');

    const comboBox = getByTestId('combo-box');

    fireEvent.change(comboBox, { target: { value: 'Abcd' } });
    fireEvent.focusOut(comboBox);

    expect(spy).toHaveBeenCalledWith({
      event: `Foreign Country-Currency Search`,
      eventLabel: 'Abcd',
    });
  });

  it('does not call analytic event when combo box is initially clicked then cleared with x icon', async () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByTestId } = render(
      <ComboSelect
        changeHandler={changeHandlerSpy}
        optionLabelKey={'label'}
        options={mockOptions}
        selectedOption={mockOptions[1]}
        isExchangeTool={true}
      />
    );

    const comboBox = getByTestId('combo-box');
    await userEvent.click(comboBox);

    const clearButton = getByTestId('clear-button');
    await userEvent.click(clearButton);

    expect(spy).not.toHaveBeenCalledWith({
      category: 'Exchange Rates Converter',
      action: `Foreign Country-Currency Search`,
      label: 'Abcd-money',
    });

    expect(spy).not.toHaveBeenCalledWith({
      category: 'Exchange Rates Converter',
      action: `Foreign Country-Currency Selected`,
      label: 'Abcd-money',
    });
  });

  it('does not call analytic event when combo box input is empty', async () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByTestId } = render(
      <ComboSelect changeHandler={changeHandlerSpy} optionLabelKey={'label'} options={mockOptions} selectedOption={null} isExchangeTool={true} />
    );

    const comboBox = getByTestId('combo-box');

    fireEvent.change(comboBox, { target: { value: '' } });
    fireEvent.focusOut(comboBox);

    expect(spy).not.toHaveBeenCalledWith({
      category: 'Exchange Rates Converter',
      action: `Foreign Country-Currency Search`,
      label: '',
    });

    expect(spy).not.toHaveBeenCalledWith({
      category: 'Exchange Rates Converter',
      action: `Foreign Country-Currency Selected`,
      label: '',
    });
  });

  it('calls the appropriate analytics event when country is selected from drop down', async () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByTestId } = render(
      <ComboSelect changeHandler={changeHandlerSpy} optionLabelKey={'label'} options={mockOptions} selectedOption={null} isExchangeTool={true} />
    );

    const comboBox = getByTestId('combo-box');
    fireEvent.change(comboBox, { target: { value: 'A' } });

    const optionList = getByTestId('selectorList');
    const option = within(optionList).getByText('Abcd-money');

    fireEvent.click(option);

    expect(spy).toHaveBeenCalledWith({
      category: 'Exchange Rates Converter',
      action: `Foreign Country-Currency Selected`,
      label: 'Abcd-money',
    });
  });
});
