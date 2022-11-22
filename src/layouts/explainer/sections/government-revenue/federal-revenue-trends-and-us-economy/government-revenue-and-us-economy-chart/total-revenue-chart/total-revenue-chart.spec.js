import { render, waitFor } from "@testing-library/react";
import React from 'react';
import TotalRevenueChart from './total-revenue-chart';
import fetchMock from "fetch-mock";
import { determineBEAFetchResponse } from "../../../../../../../utils/mock-utils";
import {mockBeaGDPData, mockCpiDataset, mockRevenueData, mockCallOutData} from "../../../../../explainer-test-helper"

describe('Total Revenue Chart', () => {  
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
  }

  it("renders the calloutText", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getByText } = render(
      <TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction}/>
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    //If this is set, that means all 3 API calls were sucessful.
    expect(await getByText("Since 2015, the Revenue-to-GDP ratio has increased from 18% to 20%.", { exact: false })).toBeInTheDocument();
  });

  it("renders the chart", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getByTestId } = render(
      <TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction}/>
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId("totalRevenueChartParent")).toBeInTheDocument();
  });

  it("renders the chart markers and data header labels", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getAllByText, getByText } = render(
      <TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction}/>
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getAllByText("Total Revenue")).toHaveLength(3);
    expect(await getAllByText("GDP")).toHaveLength(2);
    expect(await getByText("Fiscal Year")).toBeInTheDocument();
  });

  it('renders the CustomPoints layer', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByTestId } = render(
      <TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction}/>
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId('customPoints')).toBeInTheDocument();
    expect(
      (await getByTestId('customPoints').querySelector('circle').length) == 4
    );
  });

  it('renders the CustomSlices layer', async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getByTestId,  } = render(
      <TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction}/>
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId('customSlices')).toBeInTheDocument();
    expect(
      (await getByTestId('customSlices')?.querySelector('rect')?.length) == 8
    );
  });

  it("renders the chart headers", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getByText } = render(
      <TotalRevenueChart cpiDataByYear={mockCpiDataset} beaGDPData={mockBeaGDPData} copyPageData={mockPageFunction}/>
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByText("Federal Revenue and the U.S. Economy (GDP), FY 2015 – 2022", { exact: false })).toBeInTheDocument();
    expect(await getByText("Inflation Adjusted - 2022 Dollars", { exact: false })).toBeInTheDocument();
  });
});
