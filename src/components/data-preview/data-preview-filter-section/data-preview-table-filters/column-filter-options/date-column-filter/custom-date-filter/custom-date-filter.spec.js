import { fireEvent, render, within } from '@testing-library/react';
import React from 'react';
import CustomDateFilter from './custom-date-filter';

describe('Date column filter', () => {
  const mockPickerDateRange1 = { from: new Date('3/17/2024'), to: new Date('3/17/2025'), latestDate: '3-17-2020', earliestDate: '3-17-2025' };
  const mockPickerDateRange2 = { from: new Date('3/17/2025'), to: new Date('3/16/2025'), latestDate: '3-17-2025', earliestDate: '3-17-2020' };
  const mockColumnConfig1 = { defaultEndDate: new Date('3/17/2025'), defaultStartDate: new Date('3/17/2024') };
  const mockColumnConfig2 = { defaultEndDate: new Date('3/26/2025'), defaultStartDate: new Date('3/16/2025') };
  const mockColumnConfig3 = { defaultEndDate: new Date('3/16/2025'), defaultStartDate: new Date('3/26/2025') };

  it('renders start and end date pickers', () => {
    const { getByRole } = render(<CustomDateFilter pickerDateRange={mockPickerDateRange1} />);
    const startDatePicker = getByRole('button', { name: 'Select Start Date' });
    const endDatePicker = getByRole('button', { name: 'Select End Date' });
    expect(startDatePicker).toBeInTheDocument();
    expect(endDatePicker).toBeInTheDocument();
  });

  it('defaults date pickers to pickerDateRange value', () => {
    const { getByRole } = render(<CustomDateFilter pickerDateRange={mockPickerDateRange1} columnConfig={mockColumnConfig1} />);
    const startDatePicker = getByRole('button', { name: 'Select Start Date' });
    const endDatePicker = getByRole('button', { name: 'Select End Date' });
    expect(within(startDatePicker).getByText('March 17, 2024')).toBeInTheDocument();
    expect(within(endDatePicker).getByText('March 17, 2025')).toBeInTheDocument();
  });

  it('disables both date pickers with disabled is true', () => {
    const { getByRole } = render(<CustomDateFilter pickerDateRange={mockPickerDateRange1} disabled />);
    const startDatePicker = getByRole('button', { name: 'Select Start Date' });
    const endDatePicker = getByRole('button', { name: 'Select End Date' });
    expect(startDatePicker).toBeDisabled();
    expect(endDatePicker).toBeDisabled();
  });

  it('swaps the dates if the From date is greater than the To date', () => {
    const { getByRole } = render(<CustomDateFilter pickerDateRange={mockPickerDateRange2} columnConfig={mockColumnConfig3} />);
    const startDateButton = getByRole('button', { name: 'Select Start Date' });
    const endDateButton = getByRole('button', { name: 'Select End Date' });
    within(startDateButton).getByText('March 16, 2025');
    within(endDateButton).getByText('March 26, 2025');
  });

  it('correctly updates the start date', async () => {
    const { getByRole } = render(<CustomDateFilter pickerDateRange={mockPickerDateRange2} columnConfig={mockColumnConfig2} />);
    const startDateButton = getByRole('button', { name: 'Select Start Date' });
    fireEvent.click(startDateButton);
    const newDateBox = getByRole('gridcell', { name: 12 });
    fireEvent.click(newDateBox);
    const applyButton = getByRole('button', { name: 'Apply Selected Date' });
    fireEvent.click(applyButton);
    within(startDateButton).getByText('March 12, 2025');
  });
});
