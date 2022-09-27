import {render, waitFor} from "@testing-library/react";
import React from "react";
import SourcesOfRevenueCircleChart from "./sources-of-revenue-circle-chart";
import  userEvent from '@testing-library/user-event'
import {sourcesOfRevenueCircleChartMatcher} from
    "../../../../explainer-helpers/government-revenue/government-revenue-test-helper";
import {setGlobalFetchMatchingResponse} from "../../../../../../utils/mock-utils";


describe('Circle chart', () => {
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, sourcesOfRevenueCircleChartMatcher);
  });
  afterAll(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });


  it('renders the chart category labels', async () => {
    const { getAllByText, getByText } = render(<SourcesOfRevenueCircleChart />)
    await waitFor(() => expect(getByText("Corporate")).toBeInTheDocument());
    expect(await getAllByText( "Individual Income Taxes")).toHaveLength(2);
    expect(await getByText("Income Taxes")).toBeInTheDocument();
    expect(await getByText("Social Security")).toBeInTheDocument();
    expect(await getByText("and Medicare Taxes")).toBeInTheDocument();
    expect(await getByText("Miscellaneous")).toBeInTheDocument();
    expect(await getByText("Income")).toBeInTheDocument();
    expect(await getByText("Customs Duties")).toBeInTheDocument();
    expect(await getByText("Excise Taxes")).toBeInTheDocument();
    expect(await getByText("Estate & Gift Taxes")).toBeInTheDocument();
  })

  it('renders the chart copy', () => {
    const { getByText } = render(<SourcesOfRevenueCircleChart />)
    expect(getByText("Revenue Amount")).toBeInTheDocument();
    expect(getByText("% of Total Revenue")).toBeInTheDocument();
  })

  it('renders the data pill', async () => {
    const { getByText } = render(<SourcesOfRevenueCircleChart />)
    await waitFor(() =>expect(getByText("Total Revenue: $22.38 T", {exact: false}))
      .toBeInTheDocument());
  })

  it('defaults data header to Individual Income Taxes', async () => {
    const { getAllByText, getByText } = render(<SourcesOfRevenueCircleChart />)
    await waitFor(() => expect(getAllByText( "Individual Income Taxes")).toHaveLength(2));
    expect(await getByText('$2.40 T')).toBeInTheDocument();
    expect(await getByText('65%')).toBeInTheDocument();
  })

  it('updates data header when a new bubble is hovered over', async () => {
    const { getAllByText, getByText } = render(<SourcesOfRevenueCircleChart />)
    await waitFor(() => expect(getByText("Excise Taxes")).toBeInTheDocument());
    const corporateIncomeTaxesLabel = getByText("Excise Taxes");
    userEvent.hover(corporateIncomeTaxesLabel);
    expect(await getAllByText('Excise Taxes')).toHaveLength(2);
    expect(await getByText('$242 B')).toBeInTheDocument();
    expect(await getByText('7%')).toBeInTheDocument();
  })

  it('renders the callout text', async () => {
    const { getByText } = render(<SourcesOfRevenueCircleChart />)
    await waitFor(() => expect(getByText("In FY 2015", {exact: false})).toBeInTheDocument());
    expect(await getByText('corporate income taxes is $2.43 T', {exact: false}))
      .toBeInTheDocument();
    expect(await getByText('making up 11%', {exact: false})).toBeInTheDocument();

  });
})
