import { renderHook } from '@testing-library/react-hooks';
import { StaticQuery, useStaticQuery } from 'gatsby';
import useBEAGDP from './useBeaGDP';
import { mockBEAGDPData, mockNoQ3BEAGDPData } from './hookDataMocks/mockBEAGDPData';
import {
  mockAFGHomePageGACSV,
  mockDebtExplainerGACSV,
  mockDeficitExplainerGACSV,
  mockRevenueExplainerGACSV,
  mockSpendingExplainerGACSV,
} from './hookDataMocks/mockGAEventTrackingData';
import useGAEventTracking from './useGAEventTracking';

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

const mockGAEventCSVs = {
  allDeficitExplainerEventTrackingCsv: {
    deficitExplainerEventTrackingCsv: mockDeficitExplainerGACSV,
  },
  allDebtExplainerEventTrackingCsv: {
    debtExplainerEventTrackingCsv: mockDebtExplainerGACSV,
  },
  allSpendingExplainerEventTrackingCsv: {
    spendingExplainerEventTrackingCsv: mockSpendingExplainerGACSV,
  },
  allRevenueExplainerEventTrackingCsv: {
    revenueExplainerEventTrackingCsv: mockRevenueExplainerGACSV,
  },
  allAfgOverviewEventTrackingCsv: {
    AFGOverviewEventTrackingCsv: mockAFGHomePageGACSV,
  },
};

jest.mock('../helpers/hook-helpers/use-verify-additional-chart-data', () => {
  return {
    useVerifyAdditionalChartData: () => ({
      getDebtOutstanding: jest.fn,
      getMTS4: jest.fn,
      getMTS5: jest.fn(() => false),
    }),
  };
});

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
  // Mock current date October 1, 1985
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(1985, 9, 1));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const mockCpiDataset = {};

  test('GDP calc uses average of Q4-Q2 of current year if no Q3 when other data is in for the current year', async () => {
    StaticQuery.mockImplementation(({ render }) => render({ mockNoQ3BEAData }));
    useStaticQuery.mockImplementation(() => {
      return {
        ...mockNoQ3BEAData,
      };
    });

    const { result, waitForNextUpdate } = renderHook(() => useBEAGDP(mockCpiDataset, false, 'mts4'));
    await waitForNextUpdate();
    const gdpData = result.current.finalGDPData;
    const finalYear = gdpData[gdpData.length - 1];
    expect(finalYear.fiscalYear).toBe('1985');
    // expect average based off of Q4-Q2
    expect(
      result.current.finalGDPData.find(entry => {
        return entry.fiscalYear === '1985';
      }).actual
    ).toBe(4209517000000);
  });

  test('GDP calc does not use current year if no Q3 when other data is not in for the current year', async () => {
    StaticQuery.mockImplementation(({ render }) => render({ mockNoQ3BEAData }));
    useStaticQuery.mockImplementation(() => {
      return {
        ...mockNoQ3BEAData,
      };
    });
    const { result, waitForNextUpdate } = renderHook(() => useBEAGDP(mockCpiDataset, false, 'mts5'));
    await waitForNextUpdate();
    expect(result.current.finalGDPData[result.current.finalGDPData.length - 1].fiscalYear).toBe('1984');
    // expect previous year only
    expect(
      result.current.finalGDPData.find(entry => {
        return entry.fiscalYear === '1984';
      }).actual
    ).toBe(3949152750000);
  });

  test('GDP calc uses current year if there is current year Q3', () => {
    StaticQuery.mockImplementation(({ render }) => render({ mockBEAData }));
    useStaticQuery.mockImplementation(() => {
      return {
        ...mockBEAData,
      };
    });
    const { result } = renderHook(() => useBEAGDP(mockCpiDataset, false, 'mts4'));
    expect(result.current.finalGDPData[result.current.finalGDPData.length - 1].fiscalYear).toBe('1984');
    expect(
      result.current.finalGDPData.find(entry => {
        return entry.fiscalYear === '1984';
      }).actual
    ).toBe(3949152750000);
  });

  test('GDP calc does not use current year when no Q3 and otherDataPresent is not flagged', () => {
    StaticQuery.mockImplementation(({ render }) => render({ mockNoQ3BEAData }));
    useStaticQuery.mockImplementation(() => {
      return {
        ...mockNoQ3BEAData,
      };
    });
    const { result } = renderHook(() => useBEAGDP(mockCpiDataset, false));
    expect(result.current.finalGDPData[result.current.finalGDPData.length - 1].fiscalYear).toBe('1984');
    expect(
      result.current.finalGDPData.find(entry => {
        return entry.fiscalYear === '1984';
      }).actual
    ).toBe(3949152750000);
  });
});

describe('useGAEventTracking', () => {
  test('Gets proper GA Event Info based on csv and event number', () => {
    StaticQuery.mockImplementation(({ render }) => render({ mockGAEventCSVs }));
    useStaticQuery.mockImplementation(() => {
      return {
        ...mockGAEventCSVs,
      };
    });
    const { result } = renderHook(() => useGAEventTracking(null, 'DebtExplainer'));
    expect(result.current.getGAEvent(2).eventLabel).toEqual('Debt - What is the national debt');
    expect(result.current.getGAEvent(1).eventCategory).toEqual('Fiscal Data - Sitewide Navigation');
  });

  test('getGAEvent returns null if no event number given', () => {
    StaticQuery.mockImplementation(({ render }) => render({ mockGAEventCSVs }));
    useStaticQuery.mockImplementation(() => {
      return {
        ...mockGAEventCSVs,
      };
    });
    const { result } = renderHook(() => useGAEventTracking(null, 'DebtExplainer'));
    expect(result.current.getGAEvent(null)).toEqual(null);
  });

  test('Gets proper GA Event Info based on csv and event number with a dynamic value', () => {
    StaticQuery.mockImplementation(({ render }) => render({ mockGAEventCSVs }));
    useStaticQuery.mockImplementation(() => {
      return {
        ...mockGAEventCSVs,
      };
    });
    const { result } = renderHook(() => useGAEventTracking(1, 'DebtExplainer', 'debt link click'));
    expect(result.current.getGAEvent(1)).toBeDefined();
  });
});
