import { act, render } from '@testing-library/react';
import React from 'react';
import ReportDayPicker from './report-day-picker';
import userEvent from '@testing-library/user-event';

describe('Report Day Picker', () => {
  const allDates = ['August 8, 2024', 'August 7, 2024', 'August 8, 2023', 'August 8, 2022'];

  it('Updates selected date on calendar button click', () => {
    const { getByRole } = render(
      <ReportDayPicker
        handleClose={jest.fn()}
        selectedDate={new Date('8/8/2024')}
        setSelectedDate={jest.fn()}
        latestReportDate={new Date('8/8/2024')}
        earliestReportDate={new Date('8/8/2022')}
        allReportDates={allDates}
        active={true}
      />
    );
    const dayButton = getByRole('gridcell', { name: '7' });
    const input = getByRole('textbox', { name: 'Enter report date' });
    act(() => {
      userEvent.click(dayButton);
    });
    expect(input).toHaveValue('August 7, 2024');
  });

  it('renders disabled buttons for unavailable report dates', () => {
    const { getByRole } = render(
      <ReportDayPicker
        handleClose={jest.fn()}
        selectedDate={new Date('8/8/2024')}
        setSelectedDate={jest.fn()}
        latestReportDate={new Date('8/8/2024')}
        earliestReportDate={new Date('8/8/2022')}
        allReportDates={allDates}
        active={true}
      />
    );
    const dayButton = getByRole('gridcell', { name: '10' });
    expect(dayButton).toBeDisabled();
  });

  it('renders Apply button', () => {
    const mockHandleCloseFn = jest.fn();
    const mockSetSelectedDateFn = jest.fn();

    const { getByRole } = render(
      <ReportDayPicker
        handleClose={mockHandleCloseFn}
        selectedDate={new Date('8/8/2024')}
        setSelectedDate={mockSetSelectedDateFn}
        latestReportDate={new Date('8/8/2024')}
        earliestReportDate={new Date('8/8/2022')}
        allReportDates={allDates}
        active={true}
      />
    );
    act(() => {
      userEvent.click(getByRole('button', { name: 'Apply Selected Date' }));
    });
    expect(mockHandleCloseFn).toHaveBeenCalled();
    expect(mockSetSelectedDateFn).toHaveBeenCalled();
  });

  it('renders Cancel button', () => {
    const mockHandleCloseFn = jest.fn();
    const mockSetSelectedDateFn = jest.fn();

    const { getByRole } = render(
      <ReportDayPicker
        handleClose={mockHandleCloseFn}
        selectedDate={new Date('8/8/2024')}
        setSelectedDate={mockSetSelectedDateFn}
        latestReportDate={new Date('8/8/2024')}
        earliestReportDate={new Date('8/8/2022')}
        allReportDates={allDates}
        active={true}
      />
    );
    act(() => {
      userEvent.click(getByRole('button', { name: 'Cancel' }));
    });
    expect(mockHandleCloseFn).toHaveBeenCalled();
    expect(mockSetSelectedDateFn).not.toHaveBeenCalled();
  });
});
