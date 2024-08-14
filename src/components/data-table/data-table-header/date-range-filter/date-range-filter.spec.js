import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DateRangeFilter from './date-range-filter';
import { RecoilRoot } from 'recoil';
import moment from 'moment';

const renderComponent = (props = {}) => {
  return render(
    <RecoilRoot>
      <DateRangeFilter {...props} />
    </RecoilRoot>
  );
};

describe('DateRangeFilter', () => {
  const mockColumn = {
    id: 'date',
    setFilterValue: jest.fn(),
  };

  const defaultProps = {
    column: mockColumn,
    resetFilters: false,
    allActiveFilters: [],
    setAllActiveFilters: jest.fn(),
    isLastColumn: false,
  };

  it('should render the component', () => {
    renderComponent(defaultProps);
    expect(screen.getByPlaceholderText('Start')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('End')).toBeInTheDocument();
  });

  it('should open the date picker when the input is clicked', () => {
    renderComponent(defaultProps);
    fireEvent.focus(screen.getByPlaceholderText('Start'));
    expect(screen.getByTestId('Date Picker Dropdown')).toBeVisible();
  });

  it('should set the start date and focus on end date input', () => {
    renderComponent(defaultProps);
    const startInput = screen.getByPlaceholderText('Start');
    fireEvent.change(startInput, { target: { value: '2023-08-12' } });
    expect(startInput.value).toBe('2023-08-12');
    expect(screen.getByPlaceholderText('End')).toHaveFocus();
  });

  it('should set the end date and close the dropdown', () => {
    renderComponent(defaultProps);
    const startInput = screen.getByPlaceholderText('Start');
    const endInput = screen.getByPlaceholderText('End');

    fireEvent.change(startInput, { target: { value: '2023-08-12' } });
    fireEvent.change(endInput, { target: { value: '2023-08-15' } });

    expect(endInput.value).toBe('2023-08-15');
  });

  it('should clear the selected dates when the Clear button is clicked', () => {
    renderComponent(defaultProps);
    const startInput = screen.getByTestId('Start-Button');

    fireEvent.change(startInput, { target: { value: '2023-08-12' } });

    fireEvent.click(screen.getByLabelText('Clear'));

    expect(startInput.value).toBe('');
  });

  it('should select today’s date when the Today button is clicked', () => {
    renderComponent(defaultProps);
    fireEvent.focus(screen.getByTestId('Start-Button'));
    fireEvent.click(screen.getByLabelText('Today'));

    const today = moment().format('YYYY-MM-DD');
    const startInput = screen.getByPlaceholderText('Start');
    const endInput = screen.getByPlaceholderText('End');

    expect(startInput.value).toBe(today);
    expect(endInput.value).toBe(today);
  });

  it('should toggle the dropdown visibility when the calendar icon is clicked', () => {
    renderComponent(defaultProps);
    const calendarIcon = screen.getByTestId('Start-Button').nextSibling;
    fireEvent.click(calendarIcon);
    expect(screen.getByTestId('Date Picker Dropdown')).toBeVisible();
  });

  it('should close the dropdown when clicking outside of the component', () => {
    renderComponent(defaultProps);
    fireEvent.focus(screen.getByTestId('Start-Button'));
    expect(screen.getByTestId('Date Picker Dropdown')).toBeVisible();
    fireEvent.click(document.body);
    expect(screen.queryByTestId('Date Picker Dropdown')).not.toBeInTheDocument();
  });

  it('should apply correct dates when selecting a range in the DayPicker', () => {
    renderComponent(defaultProps);
    fireEvent.focus(screen.getByPlaceholderText('Start'));

    const dayPickerStart = screen.getByText('1');
    const dayPickerEnd = screen.getByText('10');

    fireEvent.click(dayPickerStart);
    fireEvent.click(dayPickerEnd);

    const startInput = screen.getByPlaceholderText('Start');
    const endInput = screen.getByPlaceholderText('End');

    expect(startInput.value).toBe(
      moment()
        .date(1)
        .format('YYYY-MM-DD')
    );
    expect(endInput.value).toBe(
      moment()
        .date(10)
        .format('YYYY-MM-DD')
    );
  });

  it('should reset state when resetFilters changes', () => {
    const { rerender } = renderComponent({ ...defaultProps, resetFilters: false });

    fireEvent.change(screen.getByPlaceholderText('Start'), { target: { value: '2023-08-12' } });
    fireEvent.change(screen.getByPlaceholderText('End'), { target: { value: '2023-08-15' } });

    rerender(<DateRangeFilter {...defaultProps} resetFilters={true} />);

    expect(screen.getByPlaceholderText('Start').value).toBe('');
    expect(screen.getByPlaceholderText('End').value).toBe('');
  });
});
