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
})
