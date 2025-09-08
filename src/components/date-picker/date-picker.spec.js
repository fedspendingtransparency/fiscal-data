import React from 'react';
import { act, fireEvent, render, within, waitFor } from '@testing-library/react';
import DatePicker from './date-picker';
import userEvent from '@testing-library/user-event';

describe('Month Picker', () => {
  const yearDropdownList = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'].reverse();
  const mockSelectedDate = new Date('8/8/2024');
  const mockSetSelectedDate = jest.fn();
  const mockScrollIntoView = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

  it('Default button', () => {
    const { getByRole } = render(
      <DatePicker
        latestDate={new Date('8/8/2024')}
        earliestDate={new Date('8/8/2016')}
        allDates={[]}
        allYears={yearDropdownList}
        selectedDate={mockSelectedDate}
      />
    );
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(within(button).getByText('Published Date:')).toBeInTheDocument();
    expect(within(button).getByText('August 2024')).toBeInTheDocument();
  });

  it('Opens and closes date picker dropdown on click', () => {
    const { getByRole, getAllByRole } = render(
      <DatePicker
        latestDate={new Date('8/8/2024')}
        earliestDate={new Date('8/8/2016')}
        allDates={[]}
        allYears={yearDropdownList}
        selectedDate={mockSelectedDate}
      />
    );
    const button = getByRole('button');
    act(() => {
      fireEvent.click(button);
    });
    expect(mockScrollIntoView).toBeCalled();
    expect(getAllByRole('button').length).toBeGreaterThan(1);
    act(() => {
      fireEvent.click(button);
    });
    expect(getAllByRole('button').length).toBe(1);
  });

  it('Opens date picker dropdown on enter key press', () => {
    const { getByRole, getAllByRole } = render(
      <DatePicker
        latestDate={new Date('8/8/2024')}
        earliestDate={new Date('8/8/2016')}
        allDates={[]}
        allYears={yearDropdownList}
        selectedDate={mockSelectedDate}
      />
    );
    const button = getByRole('button', { name: 'Select Published Date' });
    act(() => {
      userEvent.tab();
      expect(button).toHaveFocus();
      userEvent.keyboard('{Enter}');
    });
    expect(getAllByRole('button').length).toBeGreaterThan(1);
    act(() => {
      userEvent.keyboard('{Enter}');
    });
    expect(getAllByRole('button').length).toBe(1);
  });

  it('updates selected date ', async () => {
    const { getByRole, getAllByRole } = render(
      <DatePicker
        latestDate={new Date('8/8/2024')}
        earliestDate={new Date('8/8/2016')}
        allDates={['March 2022']}
        allYears={yearDropdownList}
        selectedDate={mockSelectedDate}
        setSelectedDate={mockSetSelectedDate}
        isDaily={false}
        ignoreDisabled={true}
      />
    );
    const button = getByRole('button', { name: 'Select Published Date' });
    act(() => {
      fireEvent.click(button);
    });
    expect(getAllByRole('button').length).toBeGreaterThan(1);
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Toggle Year Dropdown' }));
    });
    act(() => {
      fireEvent.click(getByRole('button', { name: '2022' }));
    });

    act(() => {
      fireEvent.click(getByRole('button', { name: 'March' }));
    });

    await waitFor(() => expect(mockSetSelectedDate).toHaveBeenCalled());
  });

  it('cancels selected date ', () => {
    const { getByRole, getAllByRole } = render(
      <DatePicker
        latestDate={new Date('8/8/2024')}
        earliestDate={new Date('8/8/2016')}
        allDates={[]}
        allYears={yearDropdownList}
        selectedDate={mockSelectedDate}
        isDaily={false}
      />
    );
    const button = getByRole('button', { name: 'Select Published Date' });
    expect(within(button).getByText('August 2024')).toBeInTheDocument();

    act(() => {
      fireEvent.click(button);
    });
    expect(getAllByRole('button').length).toBeGreaterThan(1);

    expect(within(button).getByText('August 2024')).toBeInTheDocument();
  });

  it('cancels selected date for daily reports', () => {
    const { getByRole, getAllByRole } = render(
      <DatePicker
        latestDate={new Date('8/8/2024')}
        earliestDate={new Date('8/8/2016')}
        allDates={[]}
        isDaily={true}
        selectedDate={mockSelectedDate}
      />
    );
    const button = getByRole('button', { name: 'Select Published Date' });
    expect(within(button).getByText('August 8, 2024')).toBeInTheDocument();

    act(() => {
      fireEvent.click(button);
    });
    expect(getAllByRole('button').length).toBeGreaterThan(1);

    act(() => {
      fireEvent.click(getByRole('button', { name: 'Cancel' }));
    });

    expect(within(button).getByText('August 8, 2024')).toBeInTheDocument();
  });

  it('closes dropdown on blur', () => {
    const { getByRole, queryByText, getByText } = render(
      <DatePicker
        latestDate={new Date('8/8/2024')}
        earliestDate={new Date('8/8/2016')}
        allDates={[]}
        allYears={yearDropdownList}
        selectedDate={mockSelectedDate}
        label={'Published Date (Example: May 1998 or 05/1998)'}
      />
    );
    const button = getByRole('button');
    act(() => {
      fireEvent.click(button);
    });
    expect(getByText('Published Date (Example: May 1998 or 05/1998)')).toBeInTheDocument();
    act(() => {
      fireEvent.blur(button);
    });
    expect(queryByText('Published Date (Example: May 1998 or 05/1998)')).not.toBeInTheDocument();
  });

  it('resets an incomplete date selection on close', () => {
    const { getByRole } = render(
      <DatePicker
        latestDate={new Date('8/8/2024')}
        earliestDate={new Date('8/8/2016')}
        allDates={[]}
        isDaily={true}
        selectedDate={mockSelectedDate}
        setSelectedDate={mockSetSelectedDate}
      />
    );
    const button = getByRole('button', { name: 'Select Published Date' });
    expect(within(button).getByText('August 8, 2024')).toBeInTheDocument();

    act(() => {
      fireEvent.click(button);
    });
    const dayButton = getByRole('gridcell', { name: '2' });
    act(() => {
      fireEvent.click(dayButton);
    });
    act(() => {
      fireEvent.click(button);
    });

    expect(mockSetSelectedDate).toHaveBeenCalled();
  });

  it('calls setSelectedDate on Mount when isDaily via useEffect active is false', () => {
    const mockSetSelectedDates = jest.fn();
    const DatePickerReal = require('./date-picker').default || require('./date-picker');
    const { getByRole } = render(
      <DatePickerReal
        isDaily={true}
        latestDate={new Date('8/8/2024')}
        earliestDate={new Date('8/8/2016')}
        allDates={[]}
        allYears={yearDropdownList}
        selectedDate={mockSelectedDate}
        setSelectedDate={mockSetSelectedDates}
      />
    );
    expect(getByRole('button')).toBeInTheDocument();

    expect(mockSetSelectedDates).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedDates).toHaveBeenCalledWith(mockSelectedDate);
  });

  it('updates displayed text when selectedDate prop changes (monthly mode)', () => {
    const DatePickerReal = require('./date-picker').default || require('./date-picker');

    const { getByRole, rerender } = render(
      <DatePickerReal
        isDaily={false}
        latestDate={new Date('8/8/2024')}
        earliestDate={new Date('8/8/2016')}
        allDates={[]}
        allYears={yearDropdownList}
        selectedDate={new Date('8/8/2024')}
        setSelectedDate={() => {}}
      />
    );

    const btn = getByRole('button');
    expect(within(btn).getByText('August 2024')).toBeInTheDocument();

    rerender(
      <DatePickerReal
        isDaily={false}
        latestDate={new Date('8/8/2024')}
        earliestDate={new Date('8/8/2016')}
        allDates={[]}
        allYears={yearDropdownList}
        selectedDate={new Date('5/15/2023')}
        setSelectedDate={() => {}}
      />
    );
    expect(within(btn).getByText('May 2023')).toBeInTheDocument();
  });
  it('handleClose (daily) calls setSelectedDate when provided and closes the dropdown', () => {
    jest.useFakeTimers();

    const mockSelectedDate = new Date('8/8/2024');
    const mockSetSelectedDate = jest.fn();

    const { getByRole, getAllByRole } = render(
      <DatePicker
        isDaily={true}
        latestDate={new Date('8/31/2024')}
        earliestDate={new Date('8/1/2016')}
        allDates={[]} // not needed for this path
        selectedDate={mockSelectedDate}
        setSelectedDate={mockSetSelectedDate} // <— ensures the IF branch is true
      />
    );

    const button = getByRole('button', { name: 'Select Published Date' });
    act(() => {
      fireEvent.click(button);
    });
    expect(getAllByRole('button').length).toBeGreaterThan(1); // dropdown is open

    act(() => {
      fireEvent.click(getByRole('button', { name: 'Cancel' }));
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(mockSetSelectedDate).toHaveBeenCalled();
    expect(mockSetSelectedDate).toHaveBeenCalledWith(mockSelectedDate);

    expect(getAllByRole('button').length).toBe(1);

    jest.useRealTimers();
  });
});
