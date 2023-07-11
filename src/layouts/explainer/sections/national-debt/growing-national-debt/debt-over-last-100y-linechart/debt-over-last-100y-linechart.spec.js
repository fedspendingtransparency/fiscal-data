import { act, render, waitFor } from '@testing-library/react';
import React from 'react';
import DebtOverLast100y from './debt-over-last-100y-linechart';
import fetchMock from 'fetch-mock';
import { determineBEAFetchResponse } from '../../../../../../utils/mock-utils';
import {
  mockTotalDebt100YData,
  mockCpiDataset,
} from '../../../../explainer-test-helper';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

describe('National Debt Over the Last 100 Years Chart', () => {
  beforeAll(() => {
    fetchMock.get(
      `v2/accounting/od/debt_outstanding?sort=-record_date&page[size]=101`,
      mockTotalDebt100YData,
      { overwriteRoutes: true, repeat: 0 }
    );
    determineBEAFetchResponse(jest, mockTotalDebt100YData);
  });

  it('renders the calloutText', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(
      <DebtOverLast100y cpiDataByYear={mockCpiDataset} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    //If this is set, that means all API calls were successful.
    expect(
      await getByText(
        'Over the past 100 years, the U.S. federal debt has increased from $410 B in 1922 to $30.93 T in 2022.',
        { exact: false }
      )
    ).toBeInTheDocument();
  });

  it('renders the chart', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByTestId } = render(
      <DebtOverLast100y cpiDataByYear={mockCpiDataset} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId('totalDebtChartParent')).toBeInTheDocument();
  });

  it('renders the chart markers and data header labels', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(
      <DebtOverLast100y cpiDataByYear={mockCpiDataset} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByText('Total Debt')).toBeInTheDocument();
    expect(await getByText('Fiscal Year')).toBeInTheDocument();
  });

  it('renders the CustomPoints layer', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByTestId } = render(
      <DebtOverLast100y cpiDataByYear={mockCpiDataset} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId('customPoints')).toBeInTheDocument();
    expect(
      (await getByTestId('customPoints').querySelector('circle')?.length) === 2
    );
  });

  it('renders the CustomSlices layer', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByTestId } = render(
      <DebtOverLast100y cpiDataByYear={mockCpiDataset} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId('customSlices')).toBeInTheDocument();
    expect(
      (await getByTestId('customSlices')?.querySelector('rect')?.length) === 100
    );
  });

  it('renders the chart headers', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(
      <DebtOverLast100y cpiDataByYear={mockCpiDataset} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(
      await getByText('U.S. National Debt Over the Last 100 Years', {
        exact: false,
      })
    ).toBeInTheDocument();
    expect(
      await getByText('Inflation Adjusted - 2022 Dollars', { exact: false })
    ).toBeInTheDocument();
  });

  it('animates the chart updating header values when it is scrolled into view', async () => {

    jest.useFakeTimers();

    // make sure data is loaded (from mock) and chart layers are rendered
    const fetchSpy = jest.spyOn(global, 'fetch');
    const {getByTestId} = render(
      <DebtOverLast100y cpiDataByYear={mockCpiDataset} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId('customSlices')).toBeInTheDocument();

    // explicitly declare that the chart is not scrolled into view
    mockAllIsIntersecting(false);

    // find an element corresponding to the selected point
    let points = await getByTestId('customPoints');
    let yearHeader = await getByTestId('dynamic-year-header');
    let debtAmountHeader = await getByTestId('dynamic-value-header');
    const circleElem = await points.querySelector('circle:first-child');
    let updatedCircleElem;
    let updatedPointPosition;
    const initialPointPosition = {x: circleElem.getAttribute('cx'), y: circleElem.getAttribute('cy')};

    // advance the time and confirm that the position of the point hasn't changed
    await act(async () => {
      jest.advanceTimersByTime(1000);
      points = await getByTestId('customPoints');
      updatedCircleElem = points.querySelector('circle:first-child');
      updatedPointPosition = {x: updatedCircleElem.getAttribute('cx'), y: updatedCircleElem.getAttribute('cy')};
      expect(initialPointPosition).toStrictEqual(updatedPointPosition);
      yearHeader = await getByTestId('dynamic-year-header');
      debtAmountHeader = await getByTestId('dynamic-value-header');
      expect(yearHeader.textContent).toContain('2022');
      expect(debtAmountHeader.textContent).toContain('$30.93 T');
    });

    // explicitly declare that the chart IS NOW scrolled into view and confirm animation is underway
    await act(async () => {
      mockAllIsIntersecting(true);
      jest.advanceTimersByTime(1000);
      updatedCircleElem = points.querySelector('circle:first-child');
      updatedPointPosition = {x: updatedCircleElem.getAttribute('cx'), y: updatedCircleElem.getAttribute('cy')};
      expect(initialPointPosition.x - updatedPointPosition.x).toBeGreaterThan(0);
      yearHeader = await getByTestId('dynamic-year-header');
      debtAmountHeader = await getByTestId('dynamic-value-header');
      expect(yearHeader.textContent).toContain('1931');
      expect(debtAmountHeader.textContent).toContain('$19.6');
    });

    // confirm that point eventually returns to home position
    await act(async () => {
      mockAllIsIntersecting(true);
      jest.advanceTimersByTime(5000);
      updatedCircleElem = points.querySelector('circle:first-child');
      updatedPointPosition = {x: updatedCircleElem.getAttribute('cx'), y: updatedCircleElem.getAttribute('cy')};
      expect(initialPointPosition).toStrictEqual(updatedPointPosition);
      yearHeader = await getByTestId('dynamic-year-header');
      debtAmountHeader = await getByTestId('dynamic-value-header');
      expect(yearHeader.textContent).toContain('2022');
      expect(debtAmountHeader.textContent).toContain('$30.93 T');
    });
  });
});
