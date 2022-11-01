import {render} from "@testing-library/react";
import React from "react";
import TotalRevenueChart from "./total-revenue-chart";

describe('Total Revenue Chart', () => {

  it('renders the chart', () => {
    const { getByTestId } = render(<TotalRevenueChart />)
    expect(getByTestId('totalRevenueChartParent')).toBeInTheDocument();
  });

  it('renders the chart markers and data header labels', () => {
    const { getAllByText, getByText } = render(<TotalRevenueChart />)
     expect(getAllByText('Total Revenue')).toHaveLength(2);
     expect(getAllByText('GDP')).toHaveLength(2);
     expect(getByText('Fiscal Year')).toBeInTheDocument();
  })

  it("renders the CustomPoints layer", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getByTestId, getElementsByClassName } = render(
      <TotalRevenueChart />
    );
    //await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId("customPoints")).toBeInTheDocument();
    expect(await getByTestId("customPoints").querySelector('circle').length == 4 );
  });

  it("renders the CustomSlices layer", async () => {
    //const fetchSpy = jest.spyOn(global, "fetch");
    const { getByTestId, getElementsByClassName } = render(
      <TotalRevenueChart />
    );
    //await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId("customSlices")).toBeInTheDocument();
    expect(await getByTestId("customSlices").querySelector('rect').length == 8 );
  });
})
