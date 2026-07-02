import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import DatePicker from '../date-picker';

describe('Month List Picker', () => {
  const allDates = ['September 2022', 'September 2024', 'September 2023'];
  const mockSetSelectedDate = jest.fn();
  const mockScrollIntoView = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

  const renderPicker = () =>
    render(
      <DatePicker
        isYearly={true}
        latestDate={new Date('9/1/2024')}
        earliestDate={new Date('9/1/2022')}
        allDates={allDates}
        allYears={['2024', '2023', '2022']}
        selectedDate={new Date('9/1/2024')}
        setSelectedDate={mockSetSelectedDate}
      />
    );

  it('renders a flat list of report dates, newest first, with no apply step', () => {
    const { getByRole, getAllByRole, queryByRole } = renderPicker();
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Select Published Date' }));
    });
    const listedDates = getAllByRole('button')
      .map(button => button.textContent)
      .filter(text => /^September \d{4}$/.test(text));
    expect(listedDates).toEqual(['September 2024', 'September 2023', 'September 2022']);
    expect(queryByRole('button', { name: 'Apply Selected Date' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: 'Toggle Year Dropdown' })).not.toBeInTheDocument();
  });

  it('selects a date and closes the dropdown on a single click', () => {
    jest.useFakeTimers();
    const { getByRole, getAllByRole } = renderPicker();
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Select Published Date' }));
    });
    act(() => {
      fireEvent.click(getByRole('button', { name: 'September 2023' }));
    });
    expect(mockSetSelectedDate).toHaveBeenCalledWith(new Date('September 1, 2023'));
    act(() => {
      jest.runAllTimers();
    });
    expect(getAllByRole('button').length).toBe(1);
    jest.useRealTimers();
  });
});
