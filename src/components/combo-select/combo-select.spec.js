import renderer from 'react-test-renderer';
import React from 'react';
import {fireEvent, waitFor, render, within} from "@testing-library/react";
import ComboSelect from './combo-select';
import {mockOptions} from "./combo-select-test-helper";
import Analytics from "../../utils/analytics/analytics";
import userEvent from '@testing-library/user-event'
import ComboCurrencySelect from "./combo-currency-select/combo-currency-select";

describe('The ComboSelect Component for Published Report year filtering', () => {
  let component = renderer.create();
  let instance;
  const mockYearOptions = [];
  for (let i = 2020; i > 1995; i--) {
    mockYearOptions.push({label: i, value: i});
  }

  const changeHandlerSpy = jest.fn();

  beforeEach(() => {
    component = renderer.create(
      <ComboSelect changeHandler={changeHandlerSpy}
                   optionLabelKey={'label'}
                   options={mockYearOptions}
                   selectedOption={null}
                   yearFilter={true}
                   required={true}
      />
    );
    instance = component.root;
  });


  it('renders an input field that opens a dropdown list of all options on focus', () => {
    const inputField = instance.findByType('input');

    expect(inputField.props.type).toEqual('number');

    // no option list rendered initially
    expect(instance.findAllByType('button')).toEqual([]);

    // focus
    renderer.act(() => {
      inputField.props.onFocus();
    });
    const optionButtons = instance.findByType('ul').findAllByType('button');
    expect(optionButtons.length).toEqual(25);
    expect(optionButtons[0].children).toEqual(['2020']);
    expect(optionButtons[9].children).toEqual(['2011']);
  });

  it('shows up to ten topmost options in the dropdown list that match input digits', () => {
    const inputField = instance.findByType('input');

    renderer.act(() => {
      inputField.props.onChange({target: {value: '01'}});
    });
    let optionButtons = instance.findByType('ul').findAllByType('button');
    expect(optionButtons.length).toEqual(11);
    expect(optionButtons[0].children).toEqual(['2019']);
    expect(optionButtons[9].children).toEqual(['2010']);
    renderer.act(() => {
      inputField.props.onChange({target: {value: '019'}});
    });
    optionButtons = instance.findByType('ul').findAllByType('button');
    expect(optionButtons.length).toEqual(1);
    expect(optionButtons[0].children).toEqual(['2019']);
  });

  it('only allows numeric entries', () => {
    const mockKeyPresses = ['a','Z','-','1',',','.','2','+','e','3','0'];
    let charsRejected = '';
    let charsAccepted = '';

    const mockUpKeyPressEvent = (press, currenValue) =>{
      return {
        target:
          {
            value: currenValue
          },
        key: press,
        preventDefault: () => { charsRejected += press; }
      }
    };

    const inputField = instance.findByType('input');
    renderer.act(() => {
      mockKeyPresses.forEach((kp) => {
        const rejectedSoFar = charsRejected;
        inputField.props.onKeyPress(mockUpKeyPressEvent(kp, charsAccepted));
        if (rejectedSoFar === charsRejected) {
          charsAccepted += kp;
        }
      });
    });
    expect(charsAccepted).toEqual('1230');
    expect(charsRejected).toEqual('aZ-,.+e');
  });

  it('correctly cleans input when multiple characters are input (pasted in) by the user in a single event', () => {
    const inputField = instance.findByType('input');

    // no option list rendered initially
    const mockInputEvent = {target: {value: '-1.5+e109'}};

    // cleans up numeric entry that is pasted in
    renderer.act(() => {
      inputField.props.onInput(mockInputEvent);
    });

    expect(mockInputEvent.target.value).toEqual('1510');
  });

  it('calls the change handler when a year option is selected', () => {
    const inputField = instance.findByType('input');

    // no option list rendered initially
    expect(instance.findAllByType('button')).toEqual([]);

    // focus
    renderer.act(() => {
      inputField.props.onFocus();
    });
    const optionButtons = instance.findByType('ul').findAllByType('button');
    expect(optionButtons[5].children).toEqual(['2015']);

    renderer.act(() => {
      optionButtons[5].props.onClick();
    });

    expect(changeHandlerSpy).toHaveBeenNthCalledWith(1, {label: 2015, value: 2015});
  });
});

describe('The ComboSelect Component for general text use', () => {
  jest.useFakeTimers();
  let component = renderer.create();
  let instance;

  const changeHandlerSpy = jest.fn();

  beforeEach(() => {
    component = renderer.create(
      <ComboSelect changeHandler={changeHandlerSpy}
                   optionLabelKey={'label'}
                   options={mockOptions}
                   selectedOption={null}
      />
    );
    instance = component.root;
  });

  it('renders an input field that opens a dropdown list of all options on focus', () => {
    const inputField = instance.findByType('input');
    expect(inputField.props.type).toEqual('text');

    // the option list is initially not in view
    expect(instance.findAllByProps({ 'data-testid': 'selectorList' }).length).toStrictEqual(0);

    // focus
    renderer.act(() => {
      inputField.props.onFocus();
    });
    const optionButtons = instance.findByType('ul').findAllByType('button');
    expect(optionButtons.length).toEqual(16);
    // spot check options/ordering
    expect(optionButtons[0].children).toEqual(['(None selected)']);
    expect(optionButtons[15].children).toEqual(['Nice3-lettuce']);
  });

  it('changes from a chevron icon to a circleX icon when en entry is made', () => {
    const inputField = instance.findByType('input');

    renderer.act(() => {
      inputField.props.onChange({target: {value: ''}});
    });

    // with no entry value, there should be no circle-X (clear-entry) icon
    expect(instance.findAllByProps({ 'data-testid': 'clear-button' }).length).toStrictEqual(0);

    // and there should be a chevron icon
    expect(instance.findByProps({ 'data-testid': 'dropdown-button' })).toBeDefined();

    renderer.act(() => {
      inputField.props.onChange({target: {value: 'guess'}});
    });

    // with an entry value present, there should be no chevron icon (clear-entry) icon
    expect(instance.findAllByProps({ 'data-testid': 'dropdown-button' }).length).toStrictEqual(0);

    // and there should be a circle-X (clear-entry) icon
    expect(instance.findByProps({ 'data-testid': 'clear-button' })).toBeDefined();

  });

  it('clears any existing entry when the clear-entry/circle-x icon is clicked', () => {
    const inputField = instance.findByType('input');
    renderer.act(() => {
      inputField.props.onChange({target: {value: 'guess'}});
    });
    expect(inputField.props.value).toStrictEqual('guess');

    const button = instance.findByProps({ 'data-testid': 'clear-button' });
    renderer.act(() => {
      button.props.onClick();
    });

    expect(inputField.props.value).toStrictEqual('');
  });

  it('toggles the dropdown when the chevron icon is clicked', () => {

    // the option list is initially not in view
    expect(instance.findAllByProps({ 'data-testid': 'selectorList' }).length).toStrictEqual(0);

    // click the chevron dropdown button
    const dropDownButton = instance.findByProps({ 'data-testid': 'dropdown-button' });
    renderer.act(() => {
      dropDownButton.props.onClick();
    });

    // the list should be visible/dropped down
    const optionList = instance.findByProps({ 'data-testid': 'selectorList' });
    expect(optionList).toBeDefined();

    // again click the chevron dropdown button
    renderer.act(() => {
      dropDownButton.props.onClick();
      jest.runAllTimers();
    });

    // now the list should be gone
    expect(instance.findAllByProps({ 'data-testid': 'selectorList' }).length).toStrictEqual(0);
  });

  it('shows options in the dropdown list that match input characters', () => {
    changeHandlerSpy.mockClear();
    const inputField = instance.findByType('input');

    renderer.act(() => {
      inputField.props.onChange({target: {value: 'Blue'}});
    });
    let optionButtons = instance.findByType('ul').findAllByType('button');
    expect(optionButtons.length).toEqual(3);
    expect(optionButtons[0].children).toEqual(['Blue-greenstuff']);
    expect(optionButtons[2].children).toEqual(['Blue3-greenstuff']);
    renderer.act(() => {
      inputField.props.onChange({target: {value: '2-'}});
    });
    optionButtons = instance.findByType('ul').findAllByType('button');
    expect(optionButtons.length).toEqual(5);
    expect(optionButtons[0].children).toEqual(['Abcd2-money']);
    expect(optionButtons[4].children).toEqual(['Nice2-lettuce']);

    // not case-sensitive, and can limit to a single matching result
    renderer.act(() => {
      inputField.props.onChange({target: {value: 'nice2-Let'}});
    });
    optionButtons = instance.findByType('ul').findAllByType('button');
    expect(optionButtons.length).toEqual(1);
    expect(optionButtons[0].children).toEqual(['Nice2-lettuce']);
  });

  it('collapses dropdown when not focused', async () => {
    const {getByTestId, queryByTestId} = render(
      <ComboSelect changeHandler={changeHandlerSpy}
                   optionLabelKey={'label'}
                   options={mockOptions}
                   selectedOption={null}
      />);
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

  it('dropdown remains open when clicked on',  () => {
    const {getByTestId, queryByTestId} = render(
      <ComboSelect changeHandler={changeHandlerSpy}
                   optionLabelKey={'label'}
                   options={mockOptions}
                   selectedOption={null}
      />);
    const dropdownButton = getByTestId('down-arrow');
    expect(queryByTestId('selectorList')).not.toBeInTheDocument();

    fireEvent.click(dropdownButton);
    const list = getByTestId('selectorList');
    fireEvent.mouseDown(list);

    expect(getByTestId('selectorList')).toBeInTheDocument();
  });

  it('closes dropdown after mouse leave and focus is removed',  async () => {
    const {getByTestId, queryByTestId} = render(
      <ComboSelect changeHandler={changeHandlerSpy}
                   optionLabelKey={'label'}
                   options={mockOptions}
                   selectedOption={null}
      />);
    const dropdownButton = getByTestId('down-arrow');
    expect(queryByTestId('selectorList')).not.toBeInTheDocument();

    fireEvent.click(dropdownButton);
    const list = getByTestId('selectorList');
    // fireEvent.click(list);
    fireEvent.mouseLeave(list);
    fireEvent.blur(list);
    await waitFor(() => {
      expect(queryByTestId('selectorList')).not.toBeInTheDocument();
    });
  });

  it('collapses dropdown when an item is selected', async () => {
    const {getByTestId, queryByTestId} = render(
      <ComboSelect changeHandler={changeHandlerSpy}
                   optionLabelKey={'label'}
                   options={mockOptions}
                   selectedOption={null}
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

  it('calls the appropriate analytics event when combo box input is updated within XR tool', async() => {
    const spy = jest.spyOn(Analytics, 'event');
    const {getByTestId} = render(
      <ComboSelect changeHandler={changeHandlerSpy}
                   optionLabelKey={'label'}
                   options={mockOptions}
                   selectedOption={null}
                   isExchangeTool={true}
      />);

    const comboBox = getByTestId('combo-box');

    fireEvent.change(comboBox, {target: { value:'Abcd'}});
    fireEvent.focusOut(comboBox);

    expect(spy).toHaveBeenCalledWith({
      category: 'Exchange Rates Converter',
      action: `Foreign Country-Currency Search`,
      label: 'Abcd'
    });
  });

  it('calls the appropriate GA4 datalayer push when combo box input is updated within XR tool', async() => {
    const {getByTestId} = render(
      <ComboSelect changeHandler={changeHandlerSpy}
                   optionLabelKey={'label'}
                   options={mockOptions}
                   selectedOption={null}
                   isExchangeTool={true}
      />);

    window.dataLayer = window.dataLayer || [];
    const spy = jest.spyOn(window.dataLayer, 'push');

    const comboBox = getByTestId('combo-box');

    fireEvent.change(comboBox, {target: { value:'Abcd'}});
    fireEvent.focusOut(comboBox);

    expect(spy).toHaveBeenCalledWith({
      event: `Foreign Country-Currency Search`,
      eventLabel: 'Abcd'
    });
  });

  it('does not call analytic event when combo box is initially clicked then cleared with x icon', async() => {
    const spy = jest.spyOn(Analytics, 'event');
    const {getByTestId} = render(
      <ComboSelect changeHandler={changeHandlerSpy}
                   optionLabelKey={'label'}
                   options={mockOptions}
                   selectedOption={mockOptions[1]}
                   isExchangeTool={true}
      />);

    const comboBox = getByTestId('combo-box');
    await userEvent.click(comboBox);

    const clearButton = getByTestId('clear-button');
    await userEvent.click(clearButton);

    expect(spy).not.toHaveBeenCalledWith({
      category: 'Exchange Rates Converter',
      action: `Foreign Country-Currency Search`,
      label: 'Abcd-money'
    });

    expect(spy).not.toHaveBeenCalledWith({
      category: 'Exchange Rates Converter',
      action: `Foreign Country-Currency Selected`,
      label: 'Abcd-money'
    });
  });

  it('does not call analytic event when combo box input is empty', async() => {
    const spy = jest.spyOn(Analytics, 'event');
    const {getByTestId} = render(
      <ComboSelect changeHandler={changeHandlerSpy}
                   optionLabelKey={'label'}
                   options={mockOptions}
                   selectedOption={null}
                   isExchangeTool={true}
      />);

    const comboBox = getByTestId('combo-box');

    fireEvent.change(comboBox, {target: { value:''}});
    fireEvent.focusOut(comboBox);

    expect(spy).not.toHaveBeenCalledWith({
      category: 'Exchange Rates Converter',
      action: `Foreign Country-Currency Search`,
      label: ''
    });

    expect(spy).not.toHaveBeenCalledWith({
      category: 'Exchange Rates Converter',
      action: `Foreign Country-Currency Selected`,
      label: ''
    });
  });

  it('calls the appropriate analytics event when country is selected from drop down', async() => {
    const spy = jest.spyOn(Analytics, 'event');
    const {getByTestId} = render(
      <ComboSelect changeHandler={changeHandlerSpy}
                   optionLabelKey={'label'}
                   options={mockOptions}
                   selectedOption={null}
                   isExchangeTool={true}
      />);

    const comboBox = getByTestId('combo-box');
    fireEvent.change(comboBox, {target: { value:'A'}});

    const optionList = getByTestId('selectorList');
    const option = within(optionList).getByText('Abcd-money');

    fireEvent.click(option);

    expect(spy).toHaveBeenCalledWith({
      category: 'Exchange Rates Converter',
      action: `Foreign Country-Currency Selected`,
      label: 'Abcd-money'
    });
  });
});
