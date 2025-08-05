import React from 'react';
import DateRangeMonthPicker from './date-range-month-picker';
import { fireEvent, render } from '@testing-library/react';

describe('date range month picker', () => {
  it('renders the date range pickers', () => {
    const setDateRangeSpy = jest.fn();
    const setIsChartLoading = jest.fn();
    const { getByRole } = render(<DateRangeMonthPicker setDateRange={setDateRangeSpy} setIsChartLoading={setIsChartLoading} />);
    const fromMonthPicker = getByRole('button', { name: 'From:' });
    const toMonthPicker = getByRole('button', { name: 'To:' });

    expect(fromMonthPicker).toBeInTheDocument();
    expect(toMonthPicker).toBeInTheDocument();
  });

  it('updates the selected date range on to and from date selection', () => {
    const datasetDateRange = { from: '2020-01-01', to: '2025-01-01' };
    const setDateRangeSpy = jest.fn();
    const setIsChartLoading = jest.fn();
    const { getByRole } = render(
      <DateRangeMonthPicker datasetDateRange={datasetDateRange} setDateRange={setDateRangeSpy} setIsChartLoading={setIsChartLoading} />
    );
    const fromMonthPicker = getByRole('button', { name: 'From:' });
    const toMonthPicker = getByRole('button', { name: 'To:' });

    fireEvent.click(fromMonthPicker);
    fireEvent.click(getByRole('button', { name: 'April' }));
    fireEvent.click(getByRole('button', { name: '2020' }));

    fireEvent.click(toMonthPicker);
    fireEvent.click(getByRole('button', { name: 'April' }));
    fireEvent.click(getByRole('button', { name: '2021' }));

    expect(setDateRangeSpy).toHaveBeenCalled();
  });

  it('swaps the selected dates when from is after to', () => {
    const datasetDateRange = { from: '2020-01-01', to: '2025-01-01' };
    const setDateRangeSpy = jest.fn();
    const setIsChartLoading = jest.fn();
    const { getByRole } = render(
      <DateRangeMonthPicker datasetDateRange={datasetDateRange} setDateRange={setDateRangeSpy} setIsChartLoading={setIsChartLoading} />
    );
    let fromMonthPicker = getByRole('button', { name: 'From:' });
    let toMonthPicker = getByRole('button', { name: 'To:' });

    fireEvent.click(fromMonthPicker);
    fireEvent.click(getByRole('button', { name: 'April' }));
    fireEvent.click(getByRole('button', { name: '2021' }));

    fireEvent.click(toMonthPicker);
    fireEvent.click(getByRole('button', { name: 'April' }));
    fireEvent.click(getByRole('button', { name: '2020' }));

    fromMonthPicker = getByRole('button', { name: 'From: April 2020' });
    toMonthPicker = getByRole('button', { name: 'To: April 2021' });
    expect(fromMonthPicker).toBeInTheDocument();
    expect(toMonthPicker).toBeInTheDocument();
  });

  it('renders correctly if only one date is entered', () => {
    const datasetDateRange = { from: '2020-01-01', to: '2025-01-01' };
    const setDateRangeSpy = jest.fn();
    const setIsChartLoading = jest.fn();
    const { getByRole } = render(
      <DateRangeMonthPicker datasetDateRange={datasetDateRange} setDateRange={setDateRangeSpy} setIsChartLoading={setIsChartLoading} />
    );
    let fromMonthPicker = getByRole('button', { name: 'From:' });
    let toMonthPicker = getByRole('button', { name: 'To:' });

    fireEvent.click(toMonthPicker);
    fireEvent.click(getByRole('button', { name: 'April' }));
    fireEvent.click(getByRole('button', { name: '2020' }));

    fromMonthPicker = getByRole('button', { name: 'From:' });
    toMonthPicker = getByRole('button', { name: 'To: April 2020' });
    expect(fromMonthPicker).toBeInTheDocument();
    expect(toMonthPicker).toBeInTheDocument();
    expect(setDateRangeSpy).toHaveBeenCalled();
  });
});
