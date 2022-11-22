import { render, waitFor } from '@testing-library/react';
import React from 'react';
import DebtOverLast100y from './debt-over-last-100y-linechart';
import fetchMock from 'fetch-mock';
import { determineBEAFetchResponse } from '../../../../../utils/mock-utils';
import {
  mockTotalDebt100YData,
  mockCpiDataset,
} from '../../../explainer-test-helper';

describe('National Debt Over the Last 100 Years Chart', () => {
  beforeAll(() => {
    fetchMock.get(
      `v2/accounting/od/debt_outstanding?sort=-record_date&page[size]=101`,
      mockTotalDebt100YData,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
    determineBEAFetchResponse(jest, mockTotalDebt100YData);
  });

  it('renders the calloutText', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(
      <DebtOverLast100y cpiDataByYear={mockCpiDataset} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    //If this is set, that means all API calls were sucessful.
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
    const { getAllByText, getByText } = render(
      <DebtOverLast100y cpiDataByYear={mockCpiDataset} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByText('Total Debt')).toBeInTheDocument();
    expect(await getByText('Fiscal Year')).toBeInTheDocument();
  });

  it('renders the CustomPoints layer', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByTestId, getElementsByClassName } = render(
      <DebtOverLast100y cpiDataByYear={mockCpiDataset} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId('customPoints')).toBeInTheDocument();
    expect(
      (await getByTestId('customPoints').querySelector('circle').length) == 2
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
      (await getByTestId('customSlices')?.querySelector('rect')?.length) == 100
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
});
