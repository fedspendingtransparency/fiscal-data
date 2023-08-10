import React from 'react';
import { render, waitFor, fireEvent, act } from '@testing-library/react';
import {setGlobalFetchResponse} from "../../../../../../utils/mock-utils";
import { mockDeficitTrendsData } from '../../../../explainer-test-helper';
import {DeficitTrendsBarChart} from "./deficit-trends-bar-chart";
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';


describe('Deficit Trends Bar Chart', () => {
  beforeEach(() => {
    setGlobalFetchResponse(jest, mockDeficitTrendsData);
  });

  it('renders the trends chart', () => {
    const {getByTestId} = render(<DeficitTrendsBarChart />);
    expect(getByTestId('deficitTrendsChartParent')).toBeInTheDocument();
  });

  it('renders the data', async() => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const {getByText} = render(<DeficitTrendsBarChart />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByText('Federal Deficit Trends Over Time, FY 2001-2022')).toBeInTheDocument();
    expect(await getByText('$1.38 T')).toBeInTheDocument();
    expect(await getByText('Last Updated: September 30, 2022')).toBeInTheDocument();
  });


  it('Updates header values while the chart animates when it is scrolled into view', async () => {
    jest.useFakeTimers();

    // make sure data is loaded (from mock) and chart layers are rendered
    const fetchSpy = jest.spyOn(global, 'fetch');
    const {getAllByTestId, getByTestId} = render(<DeficitTrendsBarChart />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getAllByTestId('customBar')[0]).toBeInTheDocument();

    // explicitly declare that the chart is not scrolled into view
    mockAllIsIntersecting(false);

    let yearHeader = await getByTestId('deficitFiscalYearHeader');
    let deficitAmountHeader = await getByTestId('deficitTotalHeader');


    // advance the time and confirm that the header values have not changed
    await act(async () => {
      jest.advanceTimersByTime(1000);
      yearHeader = await getByTestId('deficitFiscalYearHeader');
      deficitAmountHeader = await getByTestId('deficitTotalHeader');
      expect(yearHeader.textContent).toContain('2022');
      expect(deficitAmountHeader.textContent).toContain('$1.38 T');
    });

    // explicitly declare that the chart IS NOW scrolled into view and confirm animation is underway
    await act(async () => {
      mockAllIsIntersecting(true);
      jest.advanceTimersByTime(1850);
      yearHeader = await getByTestId('deficitFiscalYearHeader');
      deficitAmountHeader = await getByTestId('deficitTotalHeader');
      expect(yearHeader.textContent).toContain('2001');
      expect(deficitAmountHeader.textContent).toContain('$-0.13 T');
    });

    // confirm that the header values eventually returns to initial values
    await act(async () => {
      mockAllIsIntersecting(true);
      jest.advanceTimersByTime(20000);
      yearHeader = await getByTestId('deficitFiscalYearHeader');
      deficitAmountHeader = await getByTestId('deficitTotalHeader');
      expect(yearHeader.textContent).toContain('2022');
      expect(deficitAmountHeader.textContent).toContain('$1.38 T');
    });
  })

  it('Updates header values when mousing over a bar', async () => {
    jest.useFakeTimers();

    // make sure data is loaded (from mock) and chart layers are rendered
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getAllByTestId, getByTestId } = render(<DeficitTrendsBarChart />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getAllByTestId('customBar')[0]).toBeInTheDocument();

    // explicitly declare that the chart is not scrolled into view
    mockAllIsIntersecting(false);

    let yearHeader = await getByTestId('deficitFiscalYearHeader');
    let deficitAmountHeader = await getByTestId('deficitTotalHeader');
    let customBars = getAllByTestId('customBar');

    await act(async () => {
      mockAllIsIntersecting(true);
      jest.advanceTimersByTime(20000);
      const firstBar = customBars[1];

      fireEvent.mouseOver(firstBar);
      yearHeader = await getByTestId('deficitFiscalYearHeader');
      deficitAmountHeader = await getByTestId('deficitTotalHeader');
      expect(yearHeader.textContent).toContain('2001');
      expect(deficitAmountHeader.textContent).toContain('$-0.13 T');

      fireEvent.mouseLeave(firstBar);
      yearHeader = await getByTestId('deficitFiscalYearHeader');
      deficitAmountHeader = await getByTestId('deficitTotalHeader');
      expect(yearHeader.textContent).toContain('2022');
      expect(deficitAmountHeader.textContent).toContain('$1.38 T');
    })

  });
});
