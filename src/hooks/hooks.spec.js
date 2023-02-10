import { renderHook, act } from '@testing-library/react-hooks';
import { StaticQuery, useStaticQuery } from 'gatsby'
import useBEAGDP from './useBeaGDP';
import {mockBEAGDPData} from "./hookDataMocks/mockBEAGDPData";


const mockBEAData = {
  allBeaGdp: {
    nodes: mockBEAGDPData
  }
};

describe('useBEAGDP', () => {

  beforeEach(() => {
    StaticQuery.mockImplementation(({ render }) => render({ mockBEAData }));
    useStaticQuery.mockImplementation(() => {
      return {
        ...mockBEAData
      };
    });
  });


  const mockCpiDataset = {
    "1952": "10",
    "1984": "5",
  };

  test('First and last entry of finalGDPData after data render will match mocked values given', () => {
    const { result } = renderHook(() => useBEAGDP(mockCpiDataset, true));
    expect(result.current.finalGDPData[0].fiscalYear).toBe('1948');
    expect(result.current.finalGDPData[result.current.finalGDPData.length - 1].fiscalYear).toBe('1984');
  });

  test('1952 and 1984 data is adjusted according to mocks', () => {
    const { result } = renderHook(() => useBEAGDP(mockCpiDataset, true));
    expect(result.current.finalGDPData.find((entry) => { return entry.fiscalYear === '1952' }).actual).toBe(178551625000);
    expect(result.current.finalGDPData.find((entry) => { return entry.fiscalYear === '1984' }).actual).toBe(3949152750000);
  });

  test('Hook completes', () => {
    const { result } = renderHook(() => useBEAGDP(mockCpiDataset, true));
    expect(result.current.isGDPLoading).toBe(false);
  });

});
