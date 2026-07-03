import React from 'react';
import { act, fireEvent, render, within } from '@testing-library/react';
import DatePicker from '../date-picker';

describe('Month List Picker', () => {
  const allDates = ['September 2022', 'September 2024', 'September 2023'];
  const mockSetSelectedDate = jest.fn();
  const mockScrollIntoView = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

  beforeEach(() => {
    mockSetSelectedDate.mockClear();
  });

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

  it('renders a flat list of report dates, newest first, with no month/year navigation', () => {
    const { getByRole, getAllByRole, queryByRole } = renderPicker();
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Select Published Date' }));
    });
    const listedDates = getAllByRole('button')
      .map(button => button.textContent)
      .filter(text => /^September \d{4}$/.test(text));
    expect(listedDates).toEqual(['September 2024', 'September 2023', 'September 2022']);
    expect(queryByRole('button', { name: 'Toggle Year Dropdown' })).not.toBeInTheDocument();
  });

  it('renders the date search bar with its label and the apply and cancel buttons', () => {
    const { getByRole, getByText } = renderPicker();
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Select Published Date' }));
    });
    expect(getByText('Published Date (Example: September 2024 or 2024)')).toBeInTheDocument();
    expect(getByRole('textbox', { name: 'Enter date' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Apply Selected Date' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('applies a clicked date on apply and closes the dropdown', () => {
    jest.useFakeTimers();
    const { getByRole, getAllByRole } = renderPicker();
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Select Published Date' }));
    });
    act(() => {
      fireEvent.click(getByRole('button', { name: 'September 2023' }));
    });
    // date selection is staged until apply is clicked
    expect(mockSetSelectedDate).not.toHaveBeenCalled();
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Apply Selected Date' }));
    });
    expect(mockSetSelectedDate).toHaveBeenCalledWith(new Date('September 01, 2023'));
    act(() => {
      jest.runAllTimers();
    });
    expect(getAllByRole('button').length).toBe(1);
    jest.useRealTimers();
  });

  it('does not apply a clicked date on cancel', () => {
    jest.useFakeTimers();
    const { getByRole } = renderPicker();
    const dropdownButton = getByRole('button', { name: 'Select Published Date' });
    act(() => {
      fireEvent.click(dropdownButton);
    });
    act(() => {
      fireEvent.click(getByRole('button', { name: 'September 2022' }));
    });
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Cancel' }));
    });
    act(() => {
      jest.runAllTimers();
    });
    expect(mockSetSelectedDate).not.toHaveBeenCalled();
    expect(within(dropdownButton).getByText('September 2024')).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('stages a date typed into the search bar', () => {
    const { getByRole } = renderPicker();
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Select Published Date' }));
    });
    const searchBar = getByRole('textbox', { name: 'Enter date' });
    act(() => {
      fireEvent.change(searchBar, { target: { value: 'September 2022' } });
      fireEvent.keyDown(searchBar, { key: 'Enter' });
    });
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Apply Selected Date' }));
    });
    expect(mockSetSelectedDate).toHaveBeenCalledWith(new Date('September 01, 2022'));
  });

  it('stages a date from a year typed into the search bar', () => {
    const { getByRole } = renderPicker();
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Select Published Date' }));
    });
    const searchBar = getByRole('textbox', { name: 'Enter date' });
    act(() => {
      fireEvent.change(searchBar, { target: { value: '2023' } });
      fireEvent.keyDown(searchBar, { key: 'Enter' });
    });
    expect(searchBar.value).toBe('September 2023');
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Apply Selected Date' }));
    });
    expect(mockSetSelectedDate).toHaveBeenCalledWith(new Date('September 01, 2023'));
  });

  it('shows the no reports message for a year with no reports', () => {
    const { getByRole, getByText } = renderPicker();
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Select Published Date' }));
    });
    const searchBar = getByRole('textbox', { name: 'Enter date' });
    act(() => {
      fireEvent.focus(searchBar);
      fireEvent.change(searchBar, { target: { value: '2019' } });
      fireEvent.keyDown(searchBar, { key: 'Enter' });
    });
    expect(getByText('No reports or files available for this date.')).toBeInTheDocument();
    expect(mockSetSelectedDate).not.toHaveBeenCalled();
  });
});
