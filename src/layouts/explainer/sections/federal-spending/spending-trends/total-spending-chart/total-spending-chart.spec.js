import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import TotalSpendingChart from './total-spending-chart';
import fetchMock from 'fetch-mock';
import { determineBEAFetchResponse } from '../../../../../../utils/mock-utils';
import { mockBeaGDPData } from '../../../../explainer-test-helper';
import {
  mockCallOutData,
  mockCpiDataset,
  mockSpendingData,
  mockSpendingData_decreased,
  mockSpendingData_NoChange,
} from '../../../../explainer-helpers/federal-spending/federal-spending-test-helper';
import Analytics from '../../../../../../utils/analytics/analytics';
import { ErrorBoundary } from 'react-error-boundary';
import { useInView } from 'react-intersection-observer';

jest.mock('react-intersection-observer', () => ({
  useInView: jest.fn().mockReturnValue({ ref: jest.fn(), inView: false }),
}));

jest.mock('recharts', () => {
  const RechartsModule = jest.requireActual('recharts');
  return {
    ...RechartsModule,
    ResponsiveContainer: ({ children }) => (
      <RechartsModule.ResponsiveContainer width={100} height={100}>
        {children}
      </RechartsModule.ResponsiveContainer>
    ),
  };
});

describe('Total Spending Chart', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  const mockPageFunction = () => {
    return null;
  };

  beforeAll(() => {
    fetchMock
      .mockGlobal()
      .route(
        `begin:v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_date&page[size]=1`,
        mockCallOutData
      )
      .route(
        `begin:v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_date`,
        mockSpendingData
      );
    determineBEAFetchResponse(jest, mockSpendingData);
  });

  afterAll(() => {
    fetchMock.hardReset();
  });

  it('renders the calloutText', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByText } = render(
      <ErrorBoundary>
        <TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />
      </ErrorBoundary>
    );
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled);
    //If this is set, that means all 3 API calls were successful.
    expect(await findByText('Since 2015, the Spending to GDP ratio has increased from 20% to 25%', { exact: false })).toBeInTheDocument();
  });

  it('renders the chart', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByTestId } = render(
      <ErrorBoundary>
        <TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />
      </ErrorBoundary>
    );
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled);
    const chart = await findByTestId('chartParent');
    expect(chart).toBeInTheDocument();
  });

  it('renders the chart markers and data header labels', async () => {
    useInView.mockReturnValue({ ref: jest.fn(), inView: true });
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getAllByText, getByText, findByTestId } = render(
      <ErrorBoundary>
        <TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />
      </ErrorBoundary>
    );
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled);
    const chart = await findByTestId('chartParent');
    expect(chart).toBeInTheDocument();
    expect(getAllByText('Total Spending')).toHaveLength(3);
    expect(getAllByText('GDP')).toHaveLength(2);
    expect(await getByText('Fiscal Year')).toBeInTheDocument();
  });

  it('renders the chart headers', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(
      <ErrorBoundary>
        <TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />
      </ErrorBoundary>
    );
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled);
    expect(await getByText('Government Spending and the U.S. Economy (GDP), FY 2015 – 2022', { exact: false })).toBeInTheDocument();
    expect(await getByText('Inflation Adjusted - 2022 Dollars', { exact: false })).toBeInTheDocument();
  });

  it('calls ga events', async () => {
    jest.useFakeTimers();
    window.dataLayer = window.dataLayer || [];
    const gaSpy = jest.spyOn(Analytics, 'event');
    const ga4Spy = jest.spyOn(window.dataLayer, 'push');
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByTestId } = render(
      <ErrorBoundary>
        <TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />
      </ErrorBoundary>
    );
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled);
    const chart = await findByTestId('chartParent');
    fireEvent.mouseEnter(chart);

    jest.runAllTimers();
    expect(gaSpy).toHaveBeenCalled();
    expect(ga4Spy).toHaveBeenCalledWith({ event: 'chart-hover-total-spending' });
    jest.useRealTimers();
  });

  it('fires the mouse events for Total Spending view', async () => {
    useInView.mockReturnValue({ ref: jest.fn(), inView: true });
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByRole, findByTestId, getByText } = render(
      <ErrorBoundary>
        <TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />
      </ErrorBoundary>
    );
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled);

    const spendingButton = getByRole('button', { name: 'Total Spending' });
    const chart = await findByTestId('chartParent');
    fireEvent.click(spendingButton);
    fireEvent.mouseOver(chart);
    fireEvent.mouseLeave(chart);
    expect(getByText('2022')).toBeInTheDocument();
  });

  it('fires the mouse events for GDP view', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByTestId, findByRole, getByText } = render(
      <ErrorBoundary>
        <TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />
      </ErrorBoundary>
    );
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled);
    const gdpButton = await findByRole('button', { name: 'Percentage of GDP' });
    const chart = await findByTestId('chartParent');
    fireEvent.click(gdpButton);
    fireEvent.mouseOver(chart);
    fireEvent.mouseLeave(chart);
    expect(getByText('2022')).toBeInTheDocument();
  });

  it('enables spending hover after timer ends', async () => {
    jest.useFakeTimers();
    useInView.mockReturnValue({ ref: jest.fn(), inView: true });

    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByTestId } = render(
      <ErrorBoundary>
        <TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />
      </ErrorBoundary>
    );
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled);
    await findByTestId('chartParent');
    const spendingLineChart = await findByTestId('spendingLineChart');

    expect(spendingLineChart).toHaveStyle('pointer-events: none');
    jest.runAllTimers();
    await waitFor(() => expect(spendingLineChart).toHaveStyle('pointer-events: auto'));
  });
});

describe('Total Spending Chart Spending to GDP Ratio Decreased', () => {
  const mockPageFunction = () => {
    return null;
  };

  beforeAll(() => {
    fetchMock
      .mockGlobal()
      .route(
        `begin:v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_datet`,
        mockSpendingData_decreased
      );
    determineBEAFetchResponse(jest, mockSpendingData_decreased);
  });

  afterAll(() => {
    fetchMock.hardReset();
  });

  it('renders the calloutText', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByText } = render(
      <ErrorBoundary>
        <TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />
      </ErrorBoundary>
    );
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled);
    //If this is set, that means all 3 API calls were successful.
    expect(await findByText('Since 2015, the Spending to GDP ratio has decreased from 35% to 13%', { exact: false })).toBeInTheDocument();
  });
});

describe('Total Spending Chart Spending to GDP Ratio No Change', () => {
  const mockPageFunction = () => {
    return null;
  };

  beforeAll(() => {
    fetchMock
      .mockGlobal()
      .route(
        `begin:v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_datet`,
        mockSpendingData_NoChange
      );
    determineBEAFetchResponse(jest, mockSpendingData_NoChange);
  });

  afterAll(() => {
    fetchMock.hardReset();
  });

  it('renders the calloutText', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByText, getByText, findByTestId } = render(
      <ErrorBoundary>
        <TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />
      </ErrorBoundary>
    );
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled);
    await findByTestId('chartParent');
    //If this is set, that means all 3 API calls were successful.
    expect(await findByText('Since 2015, the Spending to GDP ratio has not changed, remaining at 25%', { exact: false })).toBeInTheDocument();
  });
});
