import React from 'react';
import { render, within, act, fireEvent } from '@testing-library/react';
import ReportDatePicker from './report-date-picker';
import userEvent from '@testing-library/user-event';

describe('Month Picker', () => {
  const monthDropdownList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];
  const yearDropdownList = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'].reverse();

  it('Default button', () => {
    const { getByRole } = render(<ReportDatePicker monthDropdownOptions={monthDropdownList} yearDropdownOptions={yearDropdownList} />);
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(within(button).getByText('Published Date:')).toBeInTheDocument();
    expect(within(button).getByText('August 2024')).toBeInTheDocument();
  });

  it('Opens and closes date picker dropdown on click', () => {
    const { getByRole, getAllByRole } = render(<ReportDatePicker monthDropdownOptions={monthDropdownList} yearDropdownOptions={yearDropdownList} />);
    const button = getByRole('button');
    act(() => {
      fireEvent.click(button);
    });
    expect(getAllByRole('button').length).toBeGreaterThan(1);
    act(() => {
      fireEvent.click(button);
    });
    expect(getAllByRole('button').length).toBe(1);
  });

  it('Opens date picker dropdown on enter key press', () => {
    const { getByRole, getAllByRole } = render(<ReportDatePicker monthDropdownOptions={monthDropdownList} yearDropdownOptions={yearDropdownList} />);
    const button = getByRole('button', { name: 'Select Published Report Date' });
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

  it('updates selected date ', () => {
    const { getByRole, getAllByRole } = render(<ReportDatePicker monthDropdownOptions={monthDropdownList} yearDropdownOptions={yearDropdownList} />);
    const button = getByRole('button', { name: 'Select Published Report Date' });
    act(() => {
      fireEvent.click(button);
    });
    expect(getAllByRole('button').length).toBeGreaterThan(1);
    act(() => {
      fireEvent.click(getByRole('button', { name: 'March' }));
      fireEvent.click(getByRole('button', { name: 'Open Year Dropdown' }));
    });
    act(() => {
      fireEvent.click(getByRole('button', { name: '2022' }));
    });
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Apply Selected Date' }));
    });

    expect(within(button).getByText('March 2022')).toBeInTheDocument();
  });

  it('cancels selected date ', () => {
    const { getByRole, getAllByRole } = render(<ReportDatePicker monthDropdownOptions={monthDropdownList} yearDropdownOptions={yearDropdownList} />);
    const button = getByRole('button', { name: 'Select Published Report Date' });
    expect(within(button).getByText('August 2024')).toBeInTheDocument();

    act(() => {
      fireEvent.click(button);
    });
    expect(getAllByRole('button').length).toBeGreaterThan(1);
    act(() => {
      fireEvent.click(getByRole('button', { name: 'March' }));
    });
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Cancel' }));
    });

    expect(within(button).getByText('August 2024')).toBeInTheDocument();
  });
});
