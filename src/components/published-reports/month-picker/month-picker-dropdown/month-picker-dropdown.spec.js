import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import MonthPickerDropdown from './month-picker-dropdown';

describe('Month Picker', () => {
  const mockDropdownOptions = ['March', 'April', 'May'];
  const mockYearDropdownOptions = ['2020', '2019', 2018];
  it('Renders provided month options as buttons', () => {
    const { getByRole } = render(<MonthPickerDropdown monthDropdownOptions={mockDropdownOptions} yearDropdownOptions={mockYearDropdownOptions} />);
    expect(getByRole('button', { name: mockDropdownOptions[0] })).toBeInTheDocument();
    expect(getByRole('button', { name: mockDropdownOptions[1] })).toBeInTheDocument();
    expect(getByRole('button', { name: mockDropdownOptions[2] })).toBeInTheDocument();
  });

  it('Renders year button', () => {
    const { getByRole, queryByRole } = render(
      <MonthPickerDropdown monthDropdownOptions={mockDropdownOptions} yearDropdownOptions={mockYearDropdownOptions} />
    );
    const yearButton = getByRole('button', { name: 'Open Year Dropdown' });
    expect(yearButton).toBeInTheDocument();
    act(() => {
      yearButton.click();
    });
    expect(queryByRole('button', { name: mockDropdownOptions[0] })).not.toBeInTheDocument();
  });

  it('renders Apply button', () => {
    const mockHandleCloseFn = jest.fn();
    const mockSetSelectedDateFn = jest.fn();

    const { getByRole } = render(
      <MonthPickerDropdown
        monthDropdownOptions={mockDropdownOptions}
        yearDropdownOptions={mockYearDropdownOptions}
        handleClose={mockHandleCloseFn}
        setSelectedDate={mockSetSelectedDateFn}
      />
    );
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Apply Selected Date' }));
    });
    expect(mockHandleCloseFn).toHaveBeenCalled();
    expect(mockSetSelectedDateFn).toHaveBeenCalled();
  });

  it('renders Cancel button', () => {
    const mockHandleCloseFn = jest.fn();
    const mockSetSelectedDateFn = jest.fn();

    const { getByRole } = render(
      <MonthPickerDropdown
        monthDropdownOptions={mockDropdownOptions}
        yearDropdownOptions={mockYearDropdownOptions}
        handleClose={mockHandleCloseFn}
        setSelectedDate={mockSetSelectedDateFn}
      />
    );
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Cancel' }));
    });
    expect(mockHandleCloseFn).toHaveBeenCalled();
    expect(mockSetSelectedDateFn).not.toHaveBeenCalled();
  });
});
