import ReportDateDropdown from './report-date-dropdown';
import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';

describe('Report Date Dropdown', () => {
  it('renders Cancel button', () => {
    const mockHandleCloseFn = jest.fn();

    const { getByRole } = render(
      <ReportDateDropdown handleClose={mockHandleCloseFn} handleApply={jest.fn()} displayDate="August 2024">
        <div>children</div>
      </ReportDateDropdown>
    );
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Cancel' }));
    });
    expect(mockHandleCloseFn).toHaveBeenCalled();
  });

  it('renders Apply button', () => {
    const mockHandleApplyFn = jest.fn();

    const { getByRole } = render(
      <ReportDateDropdown handleClose={jest.fn()} handleApply={mockHandleApplyFn} displayDate="August 2024">
        <div>children</div>
      </ReportDateDropdown>
    );
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Apply Selected Date' }));
    });
    expect(mockHandleApplyFn).toHaveBeenCalled();
  });

  it('renders the published date display', () => {
    const { getByText } = render(
      <ReportDateDropdown handleClose={jest.fn()} handleApply={jest.fn()} displayDate="August 2024">
        <div>children</div>
      </ReportDateDropdown>
    );
    expect(getByText('August 2024')).toBeInTheDocument();
  });
});
