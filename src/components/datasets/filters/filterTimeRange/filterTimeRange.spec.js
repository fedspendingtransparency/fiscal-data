import React from 'react';
import renderer from 'react-test-renderer';
import FilterTimeRange, { spanTimeRangeAnalyticsObject } from './filterTimeRange';
import InfoTip from '../../../info-tip/info-tip';
import Checkbox from '../../../checkbox/checkbox';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { dateRange } from '../test-helpers';
import { siteContext } from '../../../persist/persist';
import Analytics from '../../../../utils/analytics/analytics';
import { fireEvent, render, within } from '@testing-library/react';

jest.useFakeTimers();
describe('Time Range Filter', () => {
  // let component = renderer.create();
  // let instance;
  let dateRangeSpy = null;
  let datePickers;
  const setBeginDateSpy = jest.fn();
  const setEndDateSpy = jest.fn();
  const setExactRangeSpy = jest.fn();
  const analyticsSpy = jest.spyOn(Analytics, 'event');
  window.dataLayer = window.dataLayer || [];
  const datalayerSpy = jest.spyOn(window.dataLayer, 'push');

  // beforeEach(() => {
  //   // renderer.act(() => {
  //   // component = renderer.create(
  //   <siteContext.Provider
  //     value={{
  //       beginDate: contextBeginDate,
  //       setBeginDate: setBeginDateSpy,
  //       endDate: contextEndDate,
  //       setEndDate: setEndDateSpy,
  //       exactRange: false,
  //       setExactRange: setExactRangeSpy,
  //     }}
  //   >
  //     <FilterTimeRange dateRangeFilter={dateRangeFn} />
  //   </siteContext.Provider>;
  //   // );
  //   // });
  //   // instance = component.root;
  //   // dateRangeSpy = jest.spyOn(instance.props, 'dateRangeFilter');
  //   // datePickers = instance.findAllByType(KeyboardDatePicker);
  // });

  // afterEach(() => {
  //   dateRangeSpy.mockClear();
  //   analyticsSpy.mockClear();
  // });

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

  it('initializes any values established in its persistence context', () => {
    expect(dateRangeSpy).toHaveBeenCalledWith(
      {
        startDate: contextBeginDate,
        endDate: contextEndDate,
        exactRange: false,
        active: true,
      },
      undefined
    );
  });

  it('triggers the dateRangeFilter call and context setters when both dates are set properly', () => {
    // Suppress console warnings because we're passing invalid dates to date-fns.
    const consoleWarn = global.console.warn;
    global.console.warn = jest.fn();
    jest.runAllTimers();

    // clear away the spied calls from the initialization sequence
    dateRangeSpy.mockClear();

    renderer.act(() => {
      datePickers[0].props.onChange('2020-05-01');
      datePickers[1].props.onChange('2020-06-01');
    });
    jest.runAllTimers();

    expect(dateRangeSpy).not.toHaveBeenCalled();

    global.console.warn = consoleWarn;

    renderer.act(() => {
      datePickers[0].props.onChange(dateRange.startDate);
      datePickers[1].props.onChange(dateRange.endDate);
    });
    jest.runAllTimers();

    expect(dateRangeSpy).toHaveBeenCalledWith(
      {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        exactRange: false,
        active: true,
      },
      undefined
    );

    expect(setBeginDateSpy).toHaveBeenLastCalledWith(dateRange.startDate);
    expect(setEndDateSpy).toHaveBeenLastCalledWith(dateRange.endDate);
  });

  it('does not trigger the dateRangeFilter when either of the popups are open', () => {
    renderer.act(() => {
      datePickers[0].props.onOpen();
    });
    jest.runAllTimers();
    dateRangeSpy.mockClear();
    renderer.act(() => {
      datePickers[0].props.onChange(dateRange.startDate);
      datePickers[1].props.onChange(dateRange.endDate);
    });
    jest.runAllTimers();

    expect(dateRangeSpy).not.toHaveBeenCalled();

    renderer.act(() => {
      datePickers[0].props.onClose();
      datePickers[1].props.onOpen();
    });
    jest.runAllTimers();

    expect(dateRangeSpy).not.toHaveBeenCalled();

    renderer.act(() => {
      datePickers[1].props.onClose();
    });
    jest.runAllTimers();

    expect(dateRangeSpy).toHaveBeenCalled();
  });

  it('swaps the dates if the start/end dates are entered backwards', () => {
    renderer.act(() => {
      datePickers[0].props.onChange(dateRange.endDate);
      datePickers[1].props.onChange(dateRange.startDate);
    });
    jest.runAllTimers();

    expect(dateRangeSpy).toHaveBeenCalledWith(
      {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        exactRange: false,
        active: true,
      },
      undefined
    );
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

  it(`passes the exactRange value of true if the exact range checkbox is checked
    when both dates are set`, () => {
    const checkbox = instance.findByType(Checkbox);
    renderer.act(() => {
      checkbox.props.changeHandler();
      datePickers[0].props.onChange(dateRange.endDate);
      datePickers[1].props.onChange(dateRange.startDate);
    });
    jest.runAllTimers();

    expect(dateRangeSpy).toHaveBeenCalledWith(
      {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        exactRange: true,
        active: true,
      },
      undefined
    );

    expect(setExactRangeSpy).toHaveBeenLastCalledWith(true);
  });

  it('triggers a GA event when the checkbox is checked and the time range has valid dates', () => {
    const checkbox = instance.findByType(Checkbox);
    renderer.act(() => {
      checkbox.props.changeHandler();
    });
    jest.runAllTimers();

    expect(analyticsSpy).toHaveBeenCalledWith(spanTimeRangeAnalyticsObject);
  });

  it('triggers a datalayer push when the checkbox is checked and the time range has valid dates', () => {
    const checkbox = instance.findByType(Checkbox);
    renderer.act(() => {
      checkbox.props.changeHandler();
    });
    jest.runAllTimers();

    expect(datalayerSpy).toHaveBeenCalledWith({
      event: 'Time Range Click',
    });

    expect(datalayerSpy).toHaveBeenCalledWith({
      event: 'Time Range Entry',
      eventLabel: `${contextBeginDate} - ${contextEndDate}`,
    });
  });

  it('triggers GA4 datalayer push when info tip click button is pushed', () => {
    const { getByTestId } = render(
      <siteContext.Provider
        value={{
          beginDate: contextBeginDate,
          setBeginDate: setBeginDateSpy,
          endDate: contextEndDate,
          setEndDate: setEndDateSpy,
          exactRange: false,
          setExactRange: setExactRangeSpy,
        }}
      >
        <FilterTimeRange dateRangeFilter={dateRangeFn} />
      </siteContext.Provider>
    );

    const checkbox = getByTestId('checkbox');

    expect(checkbox).toBeInTheDocument();

    const infoTip = within(checkbox).getByTestId('infoTipButton');

    expect(infoTip).toBeDefined();

    fireEvent.click(infoTip);

    expect(datalayerSpy).toHaveBeenCalledWith({
      event: 'Info Button Click',
      eventLabel: 'Time Range',
    });
  });
});
