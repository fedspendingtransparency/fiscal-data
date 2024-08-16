import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import ReportDayPicker from './report-day-picker';

describe('Report Day Picker', () => {
  const allDates = [
    new Date('8/8/2024').toDateString(),
    new Date('8/7/2024').toDateString(),
    new Date('8/8/2023').toDateString(),
    new Date('8/8/2022').toDateString(),
  ];

  it('Updates selected date on calendar button click', () => {
    const { getByRole, getByText } = render(
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
    act(() => {
      fireEvent.click(dayButton);
    });
    expect(getByText('August 7, 2024')).toBeInTheDocument();
  });
  it('renders disabled buttons for unavailable report dates', () => {
    const { getByRole, getByText } = render(
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
      fireEvent.click(getByRole('button', { name: 'Apply Selected Date' }));
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
      fireEvent.click(getByRole('button', { name: 'Cancel' }));
    });
    expect(mockHandleCloseFn).toHaveBeenCalled();
    expect(mockSetSelectedDateFn).not.toHaveBeenCalled();
  });
});
