import React from 'react';
import { render, act } from '@testing-library/react';
import MonthPickerDropdown from './month-picker-dropdown';

describe('Month Picker', () => {
  const mockDropdownOptions = ['March', 'April', 'May'];
  const mockYearDropdownOptions = ['2020', '2019', 2018];
  it('Renders provided month options as buttons', () => {
    const { getByRole } = render(<MonthPickerDropdown monthDropdownOptions={mockDropdownOptions} />);
    expect(getByRole('button', { name: mockDropdownOptions[0].display })).toBeInTheDocument();
    expect(getByRole('button', { name: mockDropdownOptions[1].display })).toBeInTheDocument();
    expect(getByRole('button', { name: mockDropdownOptions[2].display })).toBeInTheDocument();
  });

  it('Renders year button', () => {
    const { getByRole, queryByRole } = render(<MonthPickerDropdown monthDropdownOptions={mockDropdownOptions} />);
    const yearButton = getByRole('button', { name: 'Select Year' });
    expect(yearButton).toBeInTheDocument();
    act(() => {
      yearButton.click();
    });
    expect(queryByRole('button', { name: mockDropdownOptions[0].display })).not.toBeInTheDocument();
  });
});
