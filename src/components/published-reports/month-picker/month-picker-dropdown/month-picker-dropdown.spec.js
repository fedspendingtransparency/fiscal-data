import React from 'react';
import { render } from '@testing-library/react';
import MonthPickerDropdown from './month-picker-dropdown';

describe('Month Picker', () => {
  const mockDropdownOptions = [{ display: 'Option 1' }, { display: 'Option 2' }, { display: 'Option 3' }];
  it('Default button', () => {
    const { getByRole } = render(<MonthPickerDropdown dropdownOptions={mockDropdownOptions} />);
    expect(getByRole('button', { name: mockDropdownOptions[0].display })).toBeInTheDocument();
    expect(getByRole('button', { name: mockDropdownOptions[1].display })).toBeInTheDocument();
    expect(getByRole('button', { name: mockDropdownOptions[2].display })).toBeInTheDocument();
  });

  it('year dropdown', () => {
    // expect caret dropdown to flip
  });
});
