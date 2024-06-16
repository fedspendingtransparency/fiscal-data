import { fireEvent, getByTestId, render, waitFor } from '@testing-library/react';
import React from 'react';
import TotalRevenueChart from './total-revenue-chart';
import fetchMock from 'fetch-mock';
import { determineBEAFetchResponse } from '../../../../../../../utils/mock-utils';
import {
  mockBeaGDPData,
  mockCpiDataset,
  mockRevenueData,
  mockCallOutData,
  mockRevenueData_decreased,
  mockRevenueData_NoChange,
  mockBeaGDPDataForRevenueChart,
} from '../../../../../explainer-test-helper';
import Analytics from '../../../../../../../utils/analytics/analytics';
import userEvent from '@testing-library/user-event';

class ResizeObserver {
  observe() {}
  unobserve() {}
}

jest.useFakeTimers();
describe('Total Revenue Chart', () => {
  window.ResizeObserver = ResizeObserver;
  window.dataLayer = window.dataLayer || [];
  const datalayerSpy = jest.spyOn(window.dataLayer, 'push');

  beforeAll(() => {
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_date&page[size]=1`,
      mockCallOutData,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_datet`,
      mockRevenueData,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
    determineBEAFetchResponse(jest, mockRevenueData);
  });

  const mockPageFunction = () => {
    return null;
  };

  it('chart fires on mouse over leave - for percentage of GDP', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByRole, getAllByText, getByTestId, getAllByTestId } = render(
      <TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPDataForRevenueChart} copyPageData={mockPageFunction} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalledTimes(2));
    expect(await getAllByText('Total Revenue').length).toBe(3);
    expect(await getByTestId('customSlices')).toBeInTheDocument();

    userEvent.tab();
    userEvent.tab();
    userEvent.keyboard('{Enter}');
    const slice = getAllByTestId('customSlice')[0];
    userEvent.tab();
    expect(slice).toHaveFocus();
    // 2015 is in the header after slice was focused
    expect(await getAllByText('2015').length).toBe(2);
  });

  it('chart fires on mouse over leave - for total revenue', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByRole, getAllByText, getByTestId, getAllByTestId } = render(
      <TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPDataForRevenueChart} copyPageData={mockPageFunction} />
    );
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await getAllByText('Total Revenue').length).toBe(3);
    expect(await getByTestId('customSlices')).toBeInTheDocument();
    const slice = getAllByTestId('customSlice')[0];

    userEvent.tab();
    userEvent.tab();
    userEvent.tab();
    expect(slice).toHaveFocus();
    // 2015 is in the header after slice was focused
    expect(await getAllByText('2015').length).toBe(2);
  });

  it('chart fires ga4 event on mouse over', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByRole } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByRole('presentation')).toBeInTheDocument();
    fireEvent.mouseOver(getByRole('presentation'));
    jest.runAllTimers();
    expect(datalayerSpy).toHaveBeenCalledWith({
      event: 'dap_event',
      event_category: 'Fiscal Data - Explainers',
      event_label: 'Revenue - Federal Revenue Trends and the U.S. Economy',
    });
    fireEvent.mouseLeave(getByRole('presentation'));
  });

  it('calls the appropriate analytics event when selecting ChartToggle', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const spy = jest.spyOn(Analytics, 'event');
    const { getByTestId } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId('totalRevenueChartParent')).toBeInTheDocument();
    expect(await getByTestId('leftChartToggle')).toBeInTheDocument();
    getByTestId('leftChartToggle').click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: 'Chart Click',
      label: 'Revenue - Federal Revenue Trends and the U.S. Economy',
    });
    spy.mockClear();
  });

  it('renders the calloutText', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    //If this is set, that means all 3 API calls were sucessful.
    expect(await getByText('Since 2015, the Revenue-to-GDP ratio has increased from 18% to 20%.', { exact: false })).toBeInTheDocument();
  });

  it('renders the chart', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByTestId } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId('totalRevenueChartParent')).toBeInTheDocument();
  });

  it('renders the chart markers and data header labels', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getAllByText, getByText } = render(
      <TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(getAllByText('Total Revenue')).toHaveLength(3);
    expect(getAllByText('GDP')).toHaveLength(2);
    expect(await getByText('Fiscal Year')).toBeInTheDocument();
  });

  it('renders the CustomPoints layer', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByTestId } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId('customPoints')).toBeInTheDocument();
    expect((await getByTestId('customPoints').querySelector('circle')?.length) === 4);
  });

  it('renders the CustomSlices layer', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByTestId } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId('customSlices')).toBeInTheDocument();
    expect((await getByTestId('customSlices')?.querySelector('rect')?.length) === 8);
  });

  it('renders the chart headers', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByText('Federal Revenue and the U.S. Economy (GDP), FY 2015 – 2022', { exact: false })).toBeInTheDocument();
    expect(await getByText('Inflation Adjusted - 2022 Dollars', { exact: false })).toBeInTheDocument();
  });
});

describe('Total Revenue Chart Revenue-to-GDP Ratio Decreased', () => {
  beforeAll(() => {
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_date`,
      mockRevenueData_decreased,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
    determineBEAFetchResponse(jest, mockRevenueData_decreased);
  });

  const mockPageFunction = () => {
    return null;
  };

  it('renders the calloutText', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    //If this is set, that means all 3 API calls were sucessful.
    expect(await getByText('Since 2015, the Revenue-to-GDP ratio has decreased from 25% to 13%.', { exact: false })).toBeInTheDocument();
  });
});

describe('Total Revenue Chart Revenue-to-GDP Ratio No Change', () => {
  beforeAll(() => {
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_date`,
      mockRevenueData_NoChange,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
    determineBEAFetchResponse(jest, mockRevenueData_NoChange);
  });

  const mockPageFunction = () => {
    return null;
  };

  it('renders the calloutText', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    //If this is set, that means all 3 API calls were sucessful.
    expect(await getByText('Since 2015, the Revenue-to-GDP ratio has not changed, remaining at 20%.', { exact: false })).toBeInTheDocument();
  });
});
