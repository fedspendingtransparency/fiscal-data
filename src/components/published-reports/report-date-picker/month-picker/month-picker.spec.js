import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import MonthPicker from './month-picker';

describe('Month Picker', () => {
  const mockDropdownOptions = ['March', 'April', 'May'];
  const mockYearDropdownOptions = ['2020', '2019', 2018];

  it('Renders provided month options as buttons', () => {
    const { getByRole } = render(
      <MonthPicker
        monthDropdownOptions={mockDropdownOptions}
        yearDropdownOptions={mockYearDropdownOptions}
        setSelectedDate={jest.fn()}
        handleClose={jest.fn()}
        selectedDate={new Date('4/8/2018')}
      />
    );
    const marchButton = getByRole('button', { name: mockDropdownOptions[0] });
    act(() => {
      fireEvent.click(marchButton);
    });
    expect(marchButton).toBeInTheDocument();
    expect(getByRole('button', { name: mockDropdownOptions[1] })).toBeInTheDocument();
    expect(getByRole('button', { name: mockDropdownOptions[2] })).toBeInTheDocument();
  });

  it('Renders year button', () => {
    const { getByRole, queryByRole } = render(
      <MonthPicker
        monthDropdownOptions={mockDropdownOptions}
        yearDropdownOptions={mockYearDropdownOptions}
        setSelectedDate={jest.fn()}
        handleClose={jest.fn()}
        selectedDate={new Date('4/8/2018')}
      />
    );
    const yearButton = getByRole('button', { name: 'Toggle Year Dropdown' });
    expect(yearButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(yearButton);
    });
    // The months dropdown is hidden / replaced by the years dropdown
    expect(queryByRole('button', { name: mockDropdownOptions[0] })).not.toBeInTheDocument();
    const yearButton2020 = getByRole('button', { name: mockYearDropdownOptions[0] });
    act(() => {
      fireEvent.click(yearButton2020);
    });
    // Switches back to the months dropdown
    expect(getByRole('button', { name: mockDropdownOptions[0] })).toBeInTheDocument();
  });

  it('renders Apply button', () => {
    const mockHandleCloseFn = jest.fn();
    const mockSetSelectedDateFn = jest.fn();

    const { getByRole } = render(
      <MonthPicker
        monthDropdownOptions={mockDropdownOptions}
        yearDropdownOptions={mockYearDropdownOptions}
        handleClose={mockHandleCloseFn}
        setSelectedDate={mockSetSelectedDateFn}
        selectedDate={new Date()}
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
      <MonthPicker
        monthDropdownOptions={mockDropdownOptions}
        yearDropdownOptions={mockYearDropdownOptions}
        handleClose={mockHandleCloseFn}
        setSelectedDate={mockSetSelectedDateFn}
        selectedDate={new Date()}
      />
    );
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Cancel' }));
    });
    expect(mockHandleCloseFn).toHaveBeenCalled();
    expect(mockSetSelectedDateFn).not.toHaveBeenCalled();
  });
});
