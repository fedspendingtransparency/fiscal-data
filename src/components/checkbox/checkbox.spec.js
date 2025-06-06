import React from 'react';
import Checkbox from './checkbox';
import { fireEvent, render } from '@testing-library/react';

describe('Checkbox component', () => {
  const mockCheckboxData = [
    { label: 'Mock Option 1', value: 'one', filterCount: 4 },
    { label: 'Mock Option 2', value: 'two', filterCount: 3 },
    { label: 'Mock Option 3', value: 'three', filterCount: 2 },
    { label: 'Mock Option 4', value: 'four', filterCount: 1 },
  ];

  it('contains a checkbox element with a label for each object in the array', () => {
    const { getAllByRole } = render(<Checkbox checkboxData={mockCheckboxData} changeHandler={jest.fn()} />);
    const checkboxLabelElements = getAllByRole('checkbox');
    checkboxLabelElements.forEach((checkbox, i) => {
      expect(checkbox.name).toBe(mockCheckboxData[i].label);
    });
  });

  it('calls its handleClick function when a checkbox state changes, which sends an array of clicked objects to parent component', () => {
    const mockChangeHandler = jest.fn();
    const { getAllByRole } = render(<Checkbox checkboxData={mockCheckboxData} changeHandler={mockChangeHandler} />);
    const checkboxLabelElements = getAllByRole('checkbox');
    fireEvent.click(checkboxLabelElements[0]);
    expect(mockChangeHandler).toHaveBeenCalledWith([{ active: true, filterCount: 4, label: 'Mock Option 1', value: 'one' }]);
  });
});
