import ReportDateDropdown from './report-date-dropdown';
import { act, render } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('Report Date Dropdown', () => {
  it('renders Cancel button', () => {
    const mockHandleCloseFn = jest.fn();

    const { getByRole } = render(
      <ReportDateDropdown handleClose={mockHandleCloseFn} handleApply={jest.fn()}>
        <div>children</div>
      </ReportDateDropdown>
    );
    act(() => {
      userEvent.click(getByRole('button', { name: 'Cancel' }));
    });
    expect(mockHandleCloseFn).toHaveBeenCalled();
  });

  it('renders Apply button', () => {
    const mockHandleApplyFn = jest.fn();

    const { getByRole } = render(
      <ReportDateDropdown handleClose={jest.fn()} handleApply={mockHandleApplyFn}>
        <div>children</div>
      </ReportDateDropdown>
    );
    act(() => {
      userEvent.click(getByRole('button', { name: 'Apply Selected Date' }));
    });
    expect(mockHandleApplyFn).toHaveBeenCalled();
  });

  it('initializes the text box with the currently selected date', () => {
    const { getByRole } = render(
      <ReportDateDropdown handleClose={jest.fn()} handleApply={jest.fn()} selectedDate="August 2024">
        <div>children</div>
      </ReportDateDropdown>
    );
    expect(getByRole('textbox')).toHaveValue('August 2024');
  });

  it('disables apply button when input is in focus', () => {
    const { getByRole } = render(
      <ReportDateDropdown handleClose={jest.fn()} handleApply={jest.fn()} displayDate="August 2024">
        <div>children</div>
      </ReportDateDropdown>
    );

    const input = getByRole('textbox');
    const apply = getByRole('button', { name: 'Apply Selected Date' });
    userEvent.tab();
    expect(input).toHaveFocus();
    expect(apply).toBeDisabled();
  });

  it('renders help text for monthly date picker', () => {
    const { getByText } = render(
      <ReportDateDropdown handleClose={jest.fn()} handleApply={jest.fn()} selectedDate="August 2024">
        <div>children</div>
      </ReportDateDropdown>
    );
    expect(getByText('Published Date (Example: May 1998 or 05/1998)')).toBeInTheDocument();
  });

  it('renders help text for daily date picker', () => {
    const { getByText } = render(
      <ReportDateDropdown handleClose={jest.fn()} handleApply={jest.fn()} selectedDate="August 1, 2024" daily={true}>
        <div>children</div>
      </ReportDateDropdown>
    );
    expect(getByText('Published Date (Example: May 1, 1998 or 05/01/1998)')).toBeInTheDocument();
  });
});
