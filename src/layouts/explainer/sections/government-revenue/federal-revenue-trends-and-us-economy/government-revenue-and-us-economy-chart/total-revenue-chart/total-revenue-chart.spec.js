import { fireEvent, render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import TotalRevenueChart from './total-revenue-chart';
import fetchMock from 'fetch-mock';
import { determineBEAFetchResponse } from '../../../../../../../utils/mock-utils';
import {
  mockBeaGDPData,
  mockBeaGDPDataForRevenueChart,
  mockCallOutData,
  mockCpiDataset,
  mockRevenueData,
  mockRevenueData_decreased,
  mockRevenueData_NoChange,
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
    const { findAllByText, getByText, findByTestId, findAllByTestId } = render(
      <TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPDataForRevenueChart} copyPageData={mockPageFunction} />
    );
    await waitForElementToBeRemoved(() => getByText('Loading...'));
    const totalRevenue = await findAllByText('Total Revenue');
    expect(totalRevenue.length).toBe(3);
    const customSlices = await findByTestId('customSlices');
    expect(customSlices).toBeInTheDocument();

    userEvent.tab();
    userEvent.tab();
    userEvent.keyboard('{Enter}');
    const allSlices = await findAllByTestId('customSlice');
    userEvent.tab();
    expect(allSlices[0]).toHaveFocus();
    // 2015 is in the header after slice was focused
    const year = await findAllByText('2015');
    expect(year.length).toBe(2);
  });

  it('chart fires on mouse over leave - for total revenue', async () => {
    const { findAllByText, getByText, findByTestId, findAllByTestId } = render(
      <TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPDataForRevenueChart} copyPageData={mockPageFunction} />
    );
    await waitForElementToBeRemoved(() => getByText('Loading...'));
    const totalRevenue = await findAllByText('Total Revenue');
    expect(totalRevenue.length).toBe(3);
    expect(await findByTestId('customSlices')).toBeInTheDocument();
    const allSlices = await findAllByTestId('customSlice');
    userEvent.tab();
    userEvent.tab();
    userEvent.tab();
    expect(allSlices[0]).toHaveFocus();
    // 2015 is in the header after slice was focused
    const year = await findAllByText('2015');
    expect(year.length).toBe(2);
  });

  it('chart fires ga4 event on mouse over', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByRole } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    const chart = await findByRole('presentation');
    expect(chart).toBeInTheDocument();
    fireEvent.mouseOver(chart);
    jest.runAllTimers();
    expect(datalayerSpy).toHaveBeenCalledWith({
      event: 'chart-hover-total-revenue',
    });
    fireEvent.mouseLeave(chart);
  });

  it('calls the appropriate analytics event when selecting ChartToggle', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const spy = jest.spyOn(Analytics, 'event');
    const { findByTestId } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await findByTestId('totalRevenueChartParent')).toBeInTheDocument();
    expect(await findByTestId('leftChartToggle')).toBeInTheDocument();
    fireEvent.click(await findByTestId('leftChartToggle'));
    expect(spy).toHaveBeenCalledWith({
      action: 'Chart Toggle',
      category: 'Explainers',
      label: 'Revenue - Total Revenue / Revenue Percentage of GDP',
    });
    spy.mockClear();
  });

  it('renders the calloutText', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByText } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    //If this is set, that means all 3 API calls were sucessful.
    expect(await findByText('Since 2015, the Revenue-to-GDP ratio has increased from 18% to 20%.', { exact: false })).toBeInTheDocument();
  });

  it('renders the chart', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByTestId } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await findByTestId('totalRevenueChartParent')).toBeInTheDocument();
  });

  it('renders the chart markers and data header labels', async () => {
    const { findAllByText, getByText, findByText } = render(
      <TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />
    );
    await waitForElementToBeRemoved(() => getByText('Loading...'));
    expect(await findAllByText('Total Revenue')).toHaveLength(3);
    expect(await findAllByText('GDP')).toHaveLength(2);
    expect(await findByText('Fiscal Year')).toBeInTheDocument();
  });

  it('renders the CustomPoints layer', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByTestId } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    const customPoints = await findByTestId('customPoints');
    expect(customPoints).toBeInTheDocument();
    expect(customPoints.querySelector('circle')?.length === 4);
  });

  it('renders the CustomSlices layer', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByTestId } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    const customSlices = await findByTestId('customSlices');
    expect(customSlices).toBeInTheDocument();
    expect(customSlices?.querySelector('rect')?.length === 8);
  });

  it('renders the chart headers', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByText } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());

    expect(await findByText('Federal Revenue and the U.S. Economy (GDP), FY 2015 – 2022', { exact: false })).toBeInTheDocument();
    expect(await findByText('Inflation Adjusted - 2022 Dollars', { exact: false })).toBeInTheDocument();
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
    const { findByText } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    //If this is set, that means all 3 API calls were sucessful.
    expect(await findByText('Since 2015, the Revenue-to-GDP ratio has decreased from 25% to 13%.', { exact: false })).toBeInTheDocument();
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
    const { findByText } = render(<TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    //If this is set, that means all 3 API calls were sucessful.
    expect(await findByText('Since 2015, the Revenue-to-GDP ratio has not changed, remaining at 20%.', { exact: false })).toBeInTheDocument();
  });
});
