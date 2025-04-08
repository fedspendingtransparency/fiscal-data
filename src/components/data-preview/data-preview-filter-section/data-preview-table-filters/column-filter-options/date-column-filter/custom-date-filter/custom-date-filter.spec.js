import { render, within } from '@testing-library/react';
import React from 'react';
import CustomDateFilter from './custom-date-filter';

describe('Date column filter', () => {
  const mockPickerDateRange = { from: new Date('3/17/2024'), to: new Date('3/17/2025'), latestDate: '3-17-2020', earliestDate: '3-17-2025' };
  it('renders start and end date pickers', () => {
    const { getByRole } = render(<CustomDateFilter pickerDateRange={mockPickerDateRange} />);
    const startDatePicker = getByRole('button', { name: 'Select Start Date' });
    const endDatePicker = getByRole('button', { name: 'Select End Date' });
    expect(startDatePicker).toBeInTheDocument();
    expect(endDatePicker).toBeInTheDocument();
  });

  it('defaults date pickers to pickerDateRange value', () => {
    const { getByRole } = render(<CustomDateFilter pickerDateRange={mockPickerDateRange} />);
    const startDatePicker = getByRole('button', { name: 'Select Start Date' });
    const endDatePicker = getByRole('button', { name: 'Select End Date' });
    expect(within(startDatePicker).getByText('March 17, 2024')).toBeInTheDocument();
    expect(within(endDatePicker).getByText('March 17, 2025')).toBeInTheDocument();
  });

  it('disables both date pickers with disabled is true', () => {
    const { getByRole } = render(<CustomDateFilter pickerDateRange={mockPickerDateRange} disabled />);
    const startDatePicker = getByRole('button', { name: 'Select Start Date' });
    const endDatePicker = getByRole('button', { name: 'Select End Date' });
    expect(startDatePicker).toBeDisabled();
    expect(endDatePicker).toBeDisabled();
  });
});
