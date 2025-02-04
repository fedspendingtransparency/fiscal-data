import React from 'react';
import Checkbox from './checkbox';
import { fireEvent, render, within } from '@testing-library/react';

describe('Checkbox component', () => {
  const mockCheckboxData = [
    { label: 'Mock Option 1', value: 'one', filterCount: 4 },
    { label: 'Mock Option 2', value: 'two', filterCount: 3 },
    { label: 'Mock Option 3', value: 'three', filterCount: 2 },
    { label: 'Mock Option 4', value: 'four', filterCount: 1 },
  ];

  it('contains a checkbox element with a label for each object in the array', () => {
    const { getAllByTestId } = render(<Checkbox checkboxData={mockCheckboxData} changeHandler={jest.fn()} />);
    const checkboxLabelElements = getAllByTestId('checkbox-label-element');
    checkboxLabelElements.forEach((checkbox, i) => {
      within(checkbox).getByText(mockCheckboxData[i].label);
    });
  });

  it('calls its handleClick function when a checkbox state changes, which sends an array of clicked objects to parent component', () => {
    const mockChangeHandler = jest.fn();
    const { getAllByTestId } = render(<Checkbox checkboxData={mockCheckboxData} changeHandler={mockChangeHandler} />);
    const checkboxLabelElements = getAllByTestId('checkbox-label-element');
    fireEvent.click(checkboxLabelElements[0]);
    expect(mockChangeHandler).toHaveBeenCalledWith([{ active: true, filterCount: 4, label: 'Mock Option 1', value: 'one' }]);
  });
});
