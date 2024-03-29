import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import TotalSpendingChart from './total-spending-chart';
import fetchMock from 'fetch-mock';
import { determineBEAFetchResponse } from '../../../../../../utils/mock-utils';
import { mockBeaGDPData } from '../../../../explainer-test-helper';
import {
  mockSpendingData,
  mockCallOutData,
  mockCpiDataset,
  mockSpendingData_decreased,
  mockSpendingData_NoChange,
} from '../../../../explainer-helpers/federal-spending/federal-spending-test-helper';
import Analytics from '../../../../../../utils/analytics/analytics';

describe('Total Spending Chart', () => {
  const mockPageFunction = () => {
    return null;
  };

  beforeAll(() => {
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_date&page[size]=1`,
      mockCallOutData,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_datet`,
      mockSpendingData,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
    determineBEAFetchResponse(jest, mockSpendingData);
  });

  it('renders the calloutText', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    //If this is set, that means all 3 API calls were successful.
    expect(await getByText('Since 2015, the Spending to GDP ratio has increased from 20% to 25%', { exact: false })).toBeInTheDocument();
  });

  it('renders the chart', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByTestId } = render(<TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId('chartParent')).toBeInTheDocument();
  });

  it('renders the chart markers and data header labels', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getAllByText, getByText } = render(
      <TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(getAllByText('Total Spending')).toHaveLength(3);
    expect(getAllByText('GDP')).toHaveLength(2);
    expect(await getByText('Fiscal Year')).toBeInTheDocument();
  });

  it('renders the CustomPoints layer', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByTestId } = render(<TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId('customPoints')).toBeInTheDocument();
    expect(getByTestId('customPoints').querySelector('circle').length === 4);
  });

  it('renders the CustomSlices layer', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByTestId } = render(<TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId('customSlices')).toBeInTheDocument();
    expect((await getByTestId('customSlices')?.querySelector('rect')?.length) === 8);
  });

  it('renders the chart headers', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByText('Government Spending and the U.S. Economy (GDP), FY 2015 – 2022', { exact: false })).toBeInTheDocument();
    expect(await getByText('Inflation Adjusted - 2022 Dollars', { exact: false })).toBeInTheDocument();
  });

  it('calls ga events', async () => {
    jest.useFakeTimers();
    window.dataLayer = window.dataLayer || [];
    const gaSpy = jest.spyOn(Analytics, 'event');
    const ga4Spy = jest.spyOn(window.dataLayer, 'push');
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByTestId } = render(<TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    const chart = getByTestId('chartParent');
    fireEvent.mouseEnter(chart);

    jest.runAllTimers();
    expect(gaSpy).toHaveBeenCalled();
    expect(ga4Spy).toHaveBeenCalledWith({ event: 'chart-hover-total-spending' });
    jest.useRealTimers();
  });

  it('fires the mouse events for Total Spending view', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByTestId, getByRole } = render(
      <TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    const slices = await getByTestId('customSlices');
    const spendingButton = getByRole('button', { name: 'Total Spending' });
    fireEvent.click(spendingButton);
    expect(slices).toBeInTheDocument();
    const slice = slices?.querySelector('rect');
    fireEvent.mouseOver(slice);
    fireEvent.mouseMove(slice);
  });

  it('fires the mouse events for GDP view', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByTestId, getByRole } = render(
      <TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    const gdpButton = getByRole('button', { name: 'Percentage of GDP' });
    fireEvent.click(gdpButton);
    const slices = await getByTestId('customSlices');
    expect(slices).toBeInTheDocument();
    const slice = slices?.querySelector('rect');
    fireEvent.mouseOver(slice);
    fireEvent.mouseMove(slice);
  });
});

describe('Total Spending Chart Spending to GDP Ratio Decreased', () => {
  const mockPageFunction = () => {
    return null;
  };

  beforeAll(() => {
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_datet`,
      mockSpendingData_decreased,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
    determineBEAFetchResponse(jest, mockSpendingData_decreased);
  });

  it('renders the calloutText', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    //If this is set, that means all 3 API calls were successful.
    expect(await getByText('Since 2015, the Spending to GDP ratio has decreased from 35% to 13%', { exact: false })).toBeInTheDocument();
  });
});

describe('Total Spending Chart Spending to GDP Ratio No Change', () => {
  const mockPageFunction = () => {
    return null;
  };

  beforeAll(() => {
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_datet`,
      mockSpendingData_NoChange,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
    determineBEAFetchResponse(jest, mockSpendingData_NoChange);
  });

  it('renders the calloutText', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<TotalSpendingChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    //If this is set, that means all 3 API calls were successful.
    expect(await getByText('Since 2015, the Spending to GDP ratio has not changed, remaining at 25%', { exact: false })).toBeInTheDocument();
  });
});
