import React from 'react';
import DateRangeMonthPicker from './date-range-month-picker';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { convertDate } from '../dataset-data/dataset-data-helper/dataset-data-helper';

describe('date range month picker', () => {
  it('renders the date range picker', () => {
    const { getByRole } = render(<DateRangeMonthPicker />);
    const dropdown = getByRole('button', { name: 'Start Date — End Date' });
    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);

    const fromMonthPicker = getByRole('button', { name: 'From:' });
    const toMonthPicker = getByRole('button', { name: 'To:' });

    expect(fromMonthPicker).toBeInTheDocument();
    expect(toMonthPicker).toBeInTheDocument();
  });

  it('updates the selected date range on to and from date selection', () => {
    const datasetDateRange = { from: '2020-01-01', to: '2025-01-01' };
    const setDateRangeSpy = jest.fn();
    const { getByRole } = render(<DateRangeMonthPicker datasetDateRange={datasetDateRange} setDateRange={setDateRangeSpy} />);
    const dropdown = getByRole('button', { name: 'Start Date — End Date' });
    userEvent.click(dropdown);
    const fromMonthPicker = getByRole('button', { name: 'From:' });
    const toMonthPicker = getByRole('button', { name: 'To:' });

    fireEvent.click(fromMonthPicker);
    fireEvent.click(getByRole('button', { name: 'April' }));
    fireEvent.click(getByRole('button', { name: 'Year' }));
    fireEvent.click(getByRole('button', { name: '2020' }));
    fireEvent.click(fromMonthPicker);

    fireEvent.click(toMonthPicker);
    fireEvent.click(getByRole('button', { name: 'April' }));
    fireEvent.click(getByRole('button', { name: 'Year' }));
    fireEvent.click(getByRole('button', { name: '2021' }));
    fireEvent.click(toMonthPicker);

    fireEvent.click(getByRole('button', { name: 'Apply' }));
    expect(setDateRangeSpy).toHaveBeenCalled();
  });

  it('swaps the selected dates when from is after to', () => {
    const datasetDateRange = { from: '2020-01-01', to: '2025-01-01' };
    const setDateRangeSpy = jest.fn();
    const { getByRole } = render(<DateRangeMonthPicker datasetDateRange={datasetDateRange} setDateRange={setDateRangeSpy} />);
    const dropdown = getByRole('button', { name: 'Start Date — End Date' });
    userEvent.click(dropdown);
    const fromMonthPicker = getByRole('button', { name: 'From:' });
    const toMonthPicker = getByRole('button', { name: 'To:' });

    fireEvent.click(fromMonthPicker);
    fireEvent.click(getByRole('button', { name: 'April' }));
    fireEvent.click(getByRole('button', { name: 'Year' }));
    fireEvent.click(getByRole('button', { name: '2021' }));
    fireEvent.click(fromMonthPicker);

    fireEvent.click(toMonthPicker);
    fireEvent.click(getByRole('button', { name: 'April' }));
    fireEvent.click(getByRole('button', { name: 'Year' }));
    fireEvent.click(getByRole('button', { name: '2020' }));
    fireEvent.click(toMonthPicker);

    fireEvent.click(getByRole('button', { name: 'Apply' }));
    fireEvent.click(getByRole('button', { name: 'April 2020 — April 2021' }));
  });

  it('resets incomplete range on apply click', () => {
    const datasetDateRange = { from: '2020-01-01', to: '2025-01-01' };
    const setDateRangeSpy = jest.fn();
    const { getByRole } = render(<DateRangeMonthPicker datasetDateRange={datasetDateRange} setDateRange={setDateRangeSpy} />);
    const dropdown = getByRole('button', { name: 'Start Date — End Date' });
    userEvent.click(dropdown);
    const fromMonthPicker = getByRole('button', { name: 'From:' });

    fireEvent.click(fromMonthPicker);
    fireEvent.click(getByRole('button', { name: 'April' }));
    fireEvent.click(getByRole('button', { name: 'Year' }));
    fireEvent.click(getByRole('button', { name: '2021' }));
    fireEvent.click(fromMonthPicker);
    fireEvent.click(getByRole('button', { name: 'Apply' }));

    expect(getByRole('button', { name: 'Start Date — End Date' })).toBeInTheDocument();
  });

  it('clears incomplete dates on cancel button click', () => {
    const datasetDateRange = { from: '2020-01-01', to: '2025-01-01' };
    const setDateRangeSpy = jest.fn();
    const { getByRole } = render(<DateRangeMonthPicker datasetDateRange={datasetDateRange} setDateRange={setDateRangeSpy} />);
    const dropdown = getByRole('button', { name: 'Start Date — End Date' });
    userEvent.click(dropdown);
    const fromMonthPicker = getByRole('button', { name: 'From:' });

    fireEvent.click(fromMonthPicker);
    fireEvent.click(getByRole('button', { name: 'April' }));
    fireEvent.click(getByRole('button', { name: 'Year' }));
    fireEvent.click(getByRole('button', { name: '2021' }));
    fireEvent.click(fromMonthPicker);
    fireEvent.click(getByRole('button', { name: 'Cancel' }));

    expect(getByRole('button', { name: 'Start Date — End Date' })).toBeInTheDocument();
  });

  it('resets to last selected on cancel button click', () => {
    const datasetDateRange = { from: '2020-01-01', to: '2025-01-01' };
    const currentDateRange = { from: convertDate('2023-01-01'), to: convertDate('2025-01-01') };
    const setDateRangeSpy = jest.fn();
    const { getByRole } = render(
      <DateRangeMonthPicker datasetDateRange={datasetDateRange} setDateRange={setDateRangeSpy} dateRange={currentDateRange} />
    );
    const dropdown = getByRole('button', { name: 'Start Date — End Date' });
    userEvent.click(dropdown);
    const fromMonthPicker = getByRole('button', { name: 'From:' });
    const toMonthPicker = getByRole('button', { name: 'To:' });

    fireEvent.click(fromMonthPicker);
    fireEvent.click(getByRole('button', { name: 'April' }));
    fireEvent.click(getByRole('button', { name: 'Year' }));
    fireEvent.click(getByRole('button', { name: '2020' }));
    fireEvent.click(fromMonthPicker);

    fireEvent.click(toMonthPicker);
    fireEvent.click(getByRole('button', { name: 'April' }));
    fireEvent.click(getByRole('button', { name: 'Year' }));
    fireEvent.click(getByRole('button', { name: '2021' }));
    fireEvent.click(toMonthPicker);

    fireEvent.click(getByRole('button', { name: 'Apply' }));

    fireEvent.click(getByRole('button', { name: 'April 2020 — April 2021' }));
    fireEvent.click(getByRole('button', { name: 'From: April 2020' }));
    fireEvent.click(getByRole('button', { name: 'August' }));
    fireEvent.click(getByRole('button', { name: '2020' }));
    fireEvent.click(getByRole('button', { name: '2021' }));
    fireEvent.click(fromMonthPicker);

    fireEvent.click(getByRole('button', { name: 'Cancel' }));

    //dates should remain unchanged
    expect(getByRole('button', { name: 'April 2020 — April 2021' })).toBeInTheDocument();
  });
});
