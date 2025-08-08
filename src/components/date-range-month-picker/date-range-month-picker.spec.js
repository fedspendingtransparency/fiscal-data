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
    fireEvent.click(fromMonthPicker);

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
    fireEvent.click(fromMonthPicker);

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

  it('disables years that do not have the selected month available', () => {
    const datasetDateRange = { from: '2020-04-01', to: '2021-02-01' };
    const setDateRangeSpy = jest.fn();
    const setIsChartLoading = jest.fn();

    const { getByRole } = render(
      <DateRangeMonthPicker datasetDateRange={datasetDateRange} setDateRange={setDateRangeSpy} setIsChartLoading={setIsChartLoading} />
    );

    const fromButton = getByRole('button', { name: 'From:' });
    fireEvent.click(fromButton);
    fireEvent.click(getByRole('button', { name: 'January' }));
    fireEvent.click(getByRole('button', { name: 'Year' }));
    const year2020 = getByRole('button', { name: '2020' });
    expect(year2020).toBeDisabled();

    const year2021 = getByRole('button', { name: '2021' });
    expect(year2021).not.toBeDisabled();
  });

  it('does not apply selection when clicking a disabled option', () => {
    const datasetDateRange = { from: '2020-04-01', to: '2021-02-01' };
    const setDateRangeSpy = jest.fn();
    const setIsChartLoading = jest.fn();

    const { getByRole } = render(
      <DateRangeMonthPicker datasetDateRange={datasetDateRange} setDateRange={setDateRangeSpy} setIsChartLoading={setIsChartLoading} />
    );

    const fromButton = getByRole('button', { name: 'From:' });
    fireEvent.click(fromButton);
    fireEvent.click(getByRole('button', { name: 'Year' }));
    fireEvent.click(getByRole('button', { name: '2020' }));
    fireEvent.click(getByRole('button', { name: 'Month' }));

    const callsBefore = setDateRangeSpy.mock.calls.length;

    const marchBtn = getByRole('button', { name: 'March' });
    expect(marchBtn).toBeDisabled();
    fireEvent.click(marchBtn);

    const callsAfter = setDateRangeSpy.mock.calls.length;
    expect(callsAfter).toBe(callsBefore);
  });

  it('first choice remains unrestricted (no greying until second choice)', () => {
    const datasetDateRange = { from: '2020-04-01', to: '2021-02-01' };
    const setDateRangeSpy = jest.fn();
    const setIsChartLoading = jest.fn();

    const { getByRole } = render(
      <DateRangeMonthPicker datasetDateRange={datasetDateRange} setDateRange={setDateRangeSpy} setIsChartLoading={setIsChartLoading} />
    );

    const fromButton = getByRole('button', { name: 'From:' });
    fireEvent.click(fromButton);

    const janButton = getByRole('button', { name: 'January' });
    const febButton = getByRole('button', { name: 'February' });
    expect(janButton).not.toBeDisabled();
    expect(febButton).not.toBeDisabled();

    fireEvent.click(janButton);
    fireEvent.click(getByRole('button', { name: 'Year' }));
    const year2020 = getByRole('button', { name: '2020' });
    expect(year2020).toBeDisabled();
  });

  it('calls setIsChartLoading when a date selection is made', () => {
    const datasetDateRange = { from: '2020-01-01', to: '2020-12-01' };
    const setDateRangeSpy = jest.fn();
    const setIsChartLoading = jest.fn();

    const { getByRole } = render(
      <DateRangeMonthPicker datasetDateRange={datasetDateRange} setDateRange={setDateRangeSpy} setIsChartLoading={setIsChartLoading} />
    );

    const fromButton = getByRole('button', { name: 'From:' });
    fireEvent.click(fromButton);
    fireEvent.click(getByRole('button', { name: 'June' }));
    fireEvent.click(getByRole('button', { name: '2020' }));

    expect(setIsChartLoading).toHaveBeenCalled();
  });


});
