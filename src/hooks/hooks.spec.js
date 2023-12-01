import { renderHook, act } from '@testing-library/react-hooks';
import { StaticQuery, useStaticQuery } from 'gatsby';
import useBEAGDP from './useBeaGDP';
import { mockBEAGDPData, mockNoQ3BEAGDPData } from './hookDataMocks/mockBEAGDPData';

const mockBEAData = {
  allBeaGdp: {
    nodes: mockBEAGDPData,
  },
};

const mockNoQ3BEAData = {
  allBeaGdp: {
    nodes: mockNoQ3BEAGDPData,
  },
};

describe('useBEAGDP', () => {
  beforeEach(() => {
    StaticQuery.mockImplementation(({ render }) => render({ mockBEAData }));
    useStaticQuery.mockImplementation(() => {
      return {
        ...mockBEAData,
      };
    });
  });

  const mockCpiDataset = {
    '1952': '10',
    '1984': '5',
  };

  test('First and last entry of finalGDPData after data render will match mocked values given', () => {
    const { result } = renderHook(() => useBEAGDP(mockCpiDataset, true));
    expect(result.current.finalGDPData[0].fiscalYear).toBe('1948');
    expect(result.current.finalGDPData[result.current.finalGDPData.length - 1].fiscalYear).toBe('1984');
  });

  test('1952 and 1984 data is adjusted according to mocks', () => {
    const { result } = renderHook(() => useBEAGDP(mockCpiDataset, true));
    expect(
      result.current.finalGDPData.find(entry => {
        return entry.fiscalYear === '1952';
      }).actual
    ).toBe(178551625000);
    expect(
      result.current.finalGDPData.find(entry => {
        return entry.fiscalYear === '1984';
      }).actual
    ).toBe(3949152750000);
  });

  test('Hook completes', () => {
    const { result } = renderHook(() => useBEAGDP(mockCpiDataset, true));
    expect(result.current.isGDPLoading).toBe(false);
  });
});

describe('useBEAGDP Q3 senario', () => {
  const mockCpiDataset = {};

  test('GDP calc uses average of Q4-Q2 of current year if no Q3 when otherDataPresent is flagged', () => {
    StaticQuery.mockImplementation(({ render }) => render({ mockNoQ3BEAData }));
    useStaticQuery.mockImplementation(() => {
      return {
        ...mockNoQ3BEAData,
      };
    });
    const { result } = renderHook(() => useBEAGDP(mockCpiDataset, false, true));
    expect(result.current.finalGDPData[result.current.finalGDPData.length - 1].fiscalYear).toBe('1985');
    // expect average based off of Q4-Q2
    expect(
      result.current.finalGDPData.find(entry => {
        return entry.fiscalYear === '1985';
      }).actual
    ).toBe(4209517000000);
  });

  test('GDP calc uses regular calc if there is current year Q3 even when otherDataPresent is flagged', () => {
    StaticQuery.mockImplementation(({ render }) => render({ mockBEAData }));
    useStaticQuery.mockImplementation(() => {
      return {
        ...mockBEAData,
      };
    });
    const { result } = renderHook(() => useBEAGDP(mockCpiDataset, false, true));

    expect(result.current.finalGDPData[result.current.finalGDPData.length - 1].fiscalYear).toBe('1984');
    expect(
      result.current.finalGDPData.find(entry => {
        return entry.fiscalYear === '1984';
      }).actual
    ).toBe(3949152750000);
  });

  test('GDP calc uses regular calc when no Q3 and otherDataPresent is not flagged', () => {
    StaticQuery.mockImplementation(({ render }) => render({ mockNoQ3BEAData }));
    useStaticQuery.mockImplementation(() => {
      return {
        ...mockNoQ3BEAData,
      };
    });
    const { result } = renderHook(() => useBEAGDP(mockCpiDataset, false, false));

    expect(result.current.finalGDPData[result.current.finalGDPData.length - 1].fiscalYear).toBe('1984');
    expect(
      result.current.finalGDPData.find(entry => {
        return entry.fiscalYear === '1984';
      }).actual
    ).toBe(3949152750000);
  });

  test('GDP calc uses regular calc when Q3 present and otherDataPresent is not flagged', () => {
    StaticQuery.mockImplementation(({ render }) => render({ mockBEAData }));
    useStaticQuery.mockImplementation(() => {
      return {
        ...mockBEAData,
      };
    });
    const { result } = renderHook(() => useBEAGDP(mockCpiDataset, false, false));

    expect(result.current.finalGDPData[result.current.finalGDPData.length - 1].fiscalYear).toBe('1984');
    expect(
      result.current.finalGDPData.find(entry => {
        return entry.fiscalYear === '1984';
      }).actual
    ).toBe(3949152750000);
  });
});
