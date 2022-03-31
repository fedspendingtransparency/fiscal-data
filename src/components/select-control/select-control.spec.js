import React from 'react';
import { render } from '@testing-library/react';
import SelectControl, { ariaLabeler } from "./select-control";
import { waitFor } from '@testing-library/dom';

describe('DropdownOptions', () => {
  let rendered;

  const mockOptions = [
    {
      label: 'Alphabetical (A to Z)',
      by: 'name',
      asc: false
    },
    {
      label: 'Alphabetical (Z to A)',
      by: 'name',
      asc: true
    }
  ];

  beforeEach(() => {
    rendered = render(
      <SelectControl
        options={mockOptions}
        selectedOption={mockOptions[1]}
        changeHandler={() => null}
      />);
  });

  it('does not initially render the option list to the dom tree', () => {
    const list = rendered.queryByRole('list');
    expect(list).toBeNull();
  });

  it('opens a list of options when the control is clicked', () => {
    const toggleBtn = rendered.getByRole('button',
      { 'name': ariaLabeler(mockOptions[1].label) });
    let optionButtons = rendered.queryByTestId('selector-option');

    // confirm that until the toggle button is clicked, there are no option buttons
    expect(optionButtons).toBeNull();
    toggleBtn.click();

    // and after click, there are option buttons
    optionButtons = rendered.getAllByTestId('selector-option');
    expect(optionButtons.length).toEqual(2);
  });

  it('removes the option list from the dom tree when the toggle button is clicked a second time'
     , async () => {
    const toggleBtn = rendered.getByRole('button',
       { 'name': ariaLabeler(mockOptions[1].label) });

    // click to toggle in the buttons
      toggleBtn.click();

    let optionButtons ;
    await waitFor(async () => optionButtons = rendered.getAllByTestId('selector-option'));
    expect(optionButtons && optionButtons.length).toBe(2);

    // click to toggle away the buttons
    toggleBtn.click();

    optionButtons = rendered.queryAllByTestId('selector-option')

    // will assign an empty array if not found
    expect(optionButtons.length).toBe(0);
  });
});
