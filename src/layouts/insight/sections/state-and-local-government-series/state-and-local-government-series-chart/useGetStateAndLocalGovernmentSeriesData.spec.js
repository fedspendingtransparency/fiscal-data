import { renderHook } from '@testing-library/react-hooks';
import { useGetStateAndLocalGovernmentSeriesData } from '../useGetStateAndLocalGovernmentSeriesData';
import { convertDate } from '../../../../../components/dataset-data/dataset-data-helper/dataset-data-helper';

describe('useGetStateAndLocalGovernmentSeriesData hook', () => {
  it('', () => {
    const { result } = renderHook(() => useGetStateAndLocalGovernmentSeriesData({ from: convertDate('2020-01-01'), to: convertDate('2024-01-01') }));
    expect(result.current.datasetDateRange).toEqual('Debt - What is the national debt');
  });
});
