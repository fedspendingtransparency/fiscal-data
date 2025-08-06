import { useGetStateAndLocalGovernmentSeriesData } from './useGetStateAndLocalGovernmentSeriesData';
import { convertDate } from '../../../../components/dataset-data/dataset-data-helper/dataset-data-helper';
import { act, renderHook, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import { releaseCalendarUrl } from './slgs-helper';
import {
  chartData,
  chartDataRes,
  chartDates,
  chartDatesLargeRange,
  chartDatesLargeRangeRes,
  chartDatesRes,
  fromDateRange,
  toDateRange,
} from './slgs-test-helper';

describe('useGetStateAndLocalGovernmentSeriesData hook', () => {
  beforeEach(() => {
    fetchMock.get(`begin:${releaseCalendarUrl}`, [{ datasetId: '015-BFS-2014Q3-yy', released: true, date: '2024-11-01' }]);
    fetchMock.get(`end:${toDateRange}`, { data: [{ record_date: '2024-11-01' }] });
    fetchMock.get(`end:${fromDateRange}`, { data: [{ record_date: '2022-08-01' }] });
    fetchMock.get(`end:${chartDates}`, chartDatesRes);
    fetchMock.get(`end:${chartDatesLargeRange}`, chartDatesLargeRangeRes);
    fetchMock.get(`end:${chartData}`, chartDataRes);
    act(() => {
      jest.useFakeTimers().setSystemTime(convertDate('2024-11-01'));
    });
  });
  afterEach(() => {
    fetchMock.restore();
  });

  it('sets chart values for a date range less than two years', async () => {
    const dateRange = { from: convertDate('2024-08-01'), to: convertDate('2024-11-01') };
    const { result } = renderHook(() => useGetStateAndLocalGovernmentSeriesData(dateRange));
    await waitFor(() => expect(result.current.datasetDateRange).toEqual({ from: '2022-08-01', to: '2024-11-01' }));
    await waitFor(() => expect(result.current.totalMonths).toEqual(4));
    await waitFor(() => expect(result.current.lineChartXAxisValues).toEqual(['2024-11-01', '2024-09-01']));
  });

  it('sets chart values for a date range greater than two years', async () => {
    const dateRange = { from: convertDate('2022-08-01'), to: convertDate('2024-11-01') };
    const { result } = renderHook(() => useGetStateAndLocalGovernmentSeriesData(dateRange));
    await waitFor(() => expect(result.current.datasetDateRange).toEqual({ from: '2022-08-01', to: '2024-11-01' }));
    await waitFor(() => expect(result.current.totalMonths).toEqual(28));
    await waitFor(() => expect(result.current.lineChartXAxisValues).toEqual(['2024-01-01', '2023-01-01']));
  });
});
