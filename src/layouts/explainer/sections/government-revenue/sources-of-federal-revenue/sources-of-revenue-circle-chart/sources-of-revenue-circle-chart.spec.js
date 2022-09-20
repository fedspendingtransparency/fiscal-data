import {render} from "@testing-library/react";
import React from "react";
import SourcesOfRevenueCircleChart from "./sources-of-revenue-circle-chart";
import  userEvent from '@testing-library/user-event'


describe('Circle chart', () => {
  it('renders the chart category labels', () => {
    const { getAllByText, getByText } = render(<SourcesOfRevenueCircleChart />)
    expect(getAllByText( "Individual Income Taxes")).toHaveLength(2);
    expect(getByText("Corporate")).toBeInTheDocument();
    expect(getByText("Income Taxes")).toBeInTheDocument();
    expect(getByText("Social Security")).toBeInTheDocument();
    expect(getByText("and Medicare Taxes")).toBeInTheDocument();
    expect(getByText("Miscellaneous")).toBeInTheDocument();
    expect(getByText("Income")).toBeInTheDocument();
    expect(getByText("Customs Duties")).toBeInTheDocument();
    expect(getByText("Excise Taxes")).toBeInTheDocument();
    expect(getByText("Estate & Gift Taxes")).toBeInTheDocument();
  })

  it('renders the chart copy', () => {
    const { getByText } = render(<SourcesOfRevenueCircleChart />)
    expect(getByText("Revenue Amount")).toBeInTheDocument();
    expect(getByText("% of Total Revenue")).toBeInTheDocument();
  })

  it('renders the data pill', () => {
    const { getByText } = render(<SourcesOfRevenueCircleChart />)
    expect(getByText("Total Revenue:", {exact: false})).toBeInTheDocument();
  })

  it('defaults data header to Individual Income Taxes', () => {
    const { getAllByText } = render(<SourcesOfRevenueCircleChart />)
    expect(getAllByText( "Individual Income Taxes")).toHaveLength(2);
  })

  it('updates data header when a new bubble is hovered over', () => {
    const { getAllByText, getByText } = render(<SourcesOfRevenueCircleChart />)
    const corporateIncomeTaxesLabel = getByText('Excise Taxes');
    userEvent.hover(corporateIncomeTaxesLabel);
    expect(getAllByText('Excise Taxes')).toHaveLength(2);
  })
})
