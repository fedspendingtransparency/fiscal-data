import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import FederalRevenueTrendsOverTime from './federal-revenue-trends-over-time';
import fetchMock from 'fetch-mock';
import { mockCpiDataset, mockData, mockDataChart, mockLastData } from './test-helper';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

jest.useFakeTimers();
describe('revenue trends over time section', () => {
  window.ResizeObserver = ResizeObserver;
  window.dataLayer = window.dataLayer || [];
  const datalayerSpy = jest.spyOn(window.dataLayer, 'push');

  beforeAll(() => {
    const highestTotalEndpoint = `v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=record_date`;

    fetchMock
      .mockGlobal()
      .route(
        `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=record_date&page[size]=1`,
        mockData
      )
      .route(
        `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG,record_calendar_month:eq:09&page[size]=1000&sort=-record_date`,
        mockDataChart
      )
      .route(
        `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=-record_date&page[size]=1`,
        mockLastData
      )

      .route(`https://www.transparency.treasury.gov/services/api/fiscal_service/${highestTotalEndpoint}`, mockLastData);
  });
  afterAll(() => {
    fetchMock.hardReset();
  });

  it('renders the revenue trends line chart', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByTestId } = render(<FederalRevenueTrendsOverTime cpiDataByYear={mockCpiDataset} />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await findByTestId('revenueTrendsLineChart')).toBeInTheDocument();
  });

  it('chart fires ga4 event on mouse over', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByTestId } = render(<FederalRevenueTrendsOverTime cpiDataByYear={mockCpiDataset} />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await findByTestId('revenueTrendsLineChart')).toBeInTheDocument();
    fireEvent.mouseOver(await findByTestId('chartParentTrends'));
    act(() => {
      jest.runAllTimers();
    });
    expect(datalayerSpy).toHaveBeenCalledWith({
      event: 'chart-hover-federal-rev-trends',
    });
    fireEvent.mouseLeave(await findByTestId('chartParentTrends'));
  });

  it('custom slices mouse interactions', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findAllByTestId } = render(<FederalRevenueTrendsOverTime cpiDataByYear={mockCpiDataset} />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    const slices = await findAllByTestId('slice');
    expect(slices).toBeDefined();
    fireEvent.mouseEnter(slices[0]);
    fireEvent.mouseMove(slices[0]);
    fireEvent.mouseLeave(slices[0]);
    slices[0].focus();
    fireEvent.focusOut(slices[0]);
  });

  it('renders data for section', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByText } = render(<FederalRevenueTrendsOverTime cpiDataByYear={mockCpiDataset} />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await findByText('since 2015', { exact: false })).toBeInTheDocument();
    expect(await findByText('- 2021 dollars', { exact: false })).toBeInTheDocument();
  });
});
