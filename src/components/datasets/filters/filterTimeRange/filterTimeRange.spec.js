import React from 'react';
import { render, within, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterTimeRange, { spanTimeRangeAnalyticsObject } from './filterTimeRange';
import { siteContext } from '../../../persist/persist';
import Analytics from '../../../../utils/analytics/analytics';

jest.useFakeTimers();
describe('Time Range Filter', () => {
  const contextBeginDate = new Date(2020, 0, 1);
  const contextEndDate = new Date(2020, 5, 1);

  const dateRangeFilter = jest.fn();
  const setBeginDateSpy = jest.fn();
  const setEndDateSpy = jest.fn();
  const setExactRangeSpy = jest.fn();

  const analyticsSpy = jest.spyOn(Analytics, 'event');
  window.dataLayer = window.dataLayer || [];
  const datalayerSpy = jest.spyOn(window.dataLayer, 'push');

  const renderContext = (context = {}) =>
    render(
      <siteContext.Provider
        value={{
          beginDate: context.beginDate ?? contextBeginDate,
          endDate: context.endDate ?? contextEndDate,
          exactRange: context.exactRange ?? false,
          setBeginDate: setBeginDateSpy,
          setEndDate: setEndDateSpy,
          setExactRange: setExactRangeSpy,
        }}
      >
        <FilterTimeRange dateRangeFilter={dateRangeFilter} />
      </siteContext.Provider>
    );

  it('renders element', () => {
    const { getByTestId } = render(<FilterTimeRange />);
    const timeRangeFilter = getByTestId('time-range-filter');
    expect(timeRangeFilter).toBeInTheDocument();
  });

  it('contains the "From" and "To" date pickers', () => {
    const { getByRole } = render(<FilterTimeRange />);
    const fromPicker = getByRole('textbox', { name: 'From Date' });
    const toPicker = getByRole('textbox', { name: 'To Date' });
    expect(fromPicker).toBeInTheDocument();
    expect(toPicker).toBeInTheDocument();
  });

  it('contains checkbox limiting results of date range', () => {
    const { getByRole } = render(<FilterTimeRange />);
    const checkbox = getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('contains info tip for time range limited results', () => {
    const { getByRole } = render(<FilterTimeRange />);
    const infoTip = getByRole('button', { name: 'More information about Time Range.' });
    expect(infoTip).toBeInTheDocument();
  });

  it('initializes from persisted values', () => {
    renderContext();
    expect(dateRangeFilter).toHaveBeenCalledWith(
      {
        startDate: contextBeginDate,
        endDate: contextEndDate,
        exactRange: false,
        active: true,
      },
      undefined
    );
  });

  it('triggers the dateRangeFilter call and context setters when both dates are set properly', async () => {
    renderContext({ beginDate: null, endDate: null });
    dateRangeFilter.mockClear();

    const [from, to] = screen.getAllByRole('textbox');
    await userEvent.clear(from);
    await userEvent.type(from, '01/01/2020');
    await userEvent.clear(to);
    await userEvent.type(to, '06/01/2020');

    expect(dateRangeFilter).toHaveBeenCalledTimes(2);
    expect(setBeginDateSpy).toHaveBeenCalled();
    expect(setEndDateSpy).toHaveBeenCalled();
  });

  it('swaps the dates if the start/end dates are entered backwards', () => {
    const dateRangeFn = jest.fn();
    const contextBeginDate = new Date(2020, 9, 1);
    const contextEndDate = new Date(2020, 8, 1);
    const setBeginDateSpy = jest.fn();
    const setEndDateSpy = jest.fn();
    const { getByRole } = render(
      <siteContext.Provider
        value={{ beginDate: contextBeginDate, setBeginDate: setBeginDateSpy, endDate: contextEndDate, setEndDate: setEndDateSpy }}
      >
        <FilterTimeRange dateRangeFilter={dateRangeFn} />
      </siteContext.Provider>
    );
    expect(dateRangeFn).toHaveBeenCalledWith(
      {
        startDate: contextEndDate,
        endDate: contextBeginDate,
        exactRange: false,
        active: true,
      },
      undefined
    );
  });

  it(`passes the exactRange value of true if the exact range checkbox is checked when both dates are set`, async () => {
    renderContext();
    dateRangeFilter.mockClear();

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(dateRangeFilter).toHaveBeenCalledWith(expect.objectContaining({ exactRange: true }), true);
    expect(setExactRangeSpy).toHaveBeenCalledWith(true);
  });

  it('triggers a GA event when the checkbox is checked and the time range has valid dates', async () => {
    renderContext();
    analyticsSpy.mockClear();

    await userEvent.click(screen.getByRole('checkbox'));
    expect(analyticsSpy).toHaveBeenCalledWith(spanTimeRangeAnalyticsObject);
  });

  it('triggers a datalayer push when the checkbox is checked and the time range has valid dates', async () => {
    renderContext();
    analyticsSpy.mockClear();

    await userEvent.click(screen.getByRole('checkbox'));
    expect(analyticsSpy).toHaveBeenCalledWith(spanTimeRangeAnalyticsObject);
  });

  it('triggers a datalayer push when the checkbox is checked', async () => {
    renderContext();
    datalayerSpy.mockClear();

    await userEvent.click(screen.getByRole('checkbox'));

    expect(datalayerSpy).toHaveBeenCalledWith({ event: 'Time Range Click' });
  });

  it('triggers a datalayer push when the time range has valid dates', async () => {
    renderContext();

    expect(datalayerSpy).toHaveBeenCalledWith({
      event: 'Time Range Entry',
      eventLabel: `${contextBeginDate} - ${contextEndDate}`,
    });
  });

  it('triggers GA4 datalayer push when info tip click button is pushed', async () => {
    renderContext();
    datalayerSpy.mockClear();

    const infoBtn = within(screen.getByTestId('checkbox')).getByTestId('infoTipButton');
    await userEvent.click(infoBtn);

    expect(datalayerSpy).toHaveBeenCalledWith({
      event: 'Info Button Click',
      eventLabel: 'Time Range',
    });
  });
});
