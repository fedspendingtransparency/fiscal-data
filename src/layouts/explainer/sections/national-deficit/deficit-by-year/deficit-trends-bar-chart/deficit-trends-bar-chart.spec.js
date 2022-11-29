import React from 'react';
import {render, waitFor, fireEvent} from '@testing-library/react';
import {setGlobalFetchResponse} from "../../../../../../utils/mock-utils";
import {mockDeficitTrendsData} from "../../../../explainer-test-helper";
import {DeficitTrendsBarChart} from "./deficit-trends-bar-chart";


describe('Deficit Trends Bar Chart', () => {
  beforeEach(() => {
    setGlobalFetchResponse(jest, mockDeficitTrendsData);
  });
  it('renders the trends chart', () => {
    const {getByTestId} = render(<DeficitTrendsBarChart />);
    expect(getByTestId('deficitTrendsBarChart')).toBeInTheDocument();
  });
  it('renders the data', async() => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const {getByText} = render(<DeficitTrendsBarChart />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByText('Federal Deficit Trends Over Time, FY 2001-2022')).toBeInTheDocument();
    expect(await getByText('$1.38 T')).toBeInTheDocument();
    expect(await getByText('Last Updated: September 30, 2022')).toBeInTheDocument();
  });

  it('renders correct color on single bar on mouse hover', async() => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const {getByTestId, toHaveStyle} = render(<DeficitTrendsBarChart />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    const firstRealBar = await getByTestId('deficitTrendsBarChart').querySelector('div > div > svg > g > g:nth-child(6) > rect');
    const firstDecoyBar = await getByTestId('deficitTrendsBarChart').querySelector('div > div > svg > g > g:nth-child(28) > rect');
    const lastRealBar = await getByTestId('deficitTrendsBarChart').querySelector('div > div > svg > g > g:nth-child(27) > rect');
    const lastDecoyBar = await getByTestId('deficitTrendsBarChart').querySelector('div > div > svg > g > g:nth-child(49) > rect');

    fireEvent.mouseOver(lastDecoyBar);
    expect(lastRealBar).toHaveStyle(`fill: #555555`);

    fireEvent.mouseOver(lastRealBar);
    expect(lastRealBar).toHaveStyle(`fill: #555555`);

    fireEvent.mouseOver(firstDecoyBar);
    expect(firstRealBar).toHaveStyle(`fill: #555555`);
    expect(getByTestId('deficitFiscalYearHeader')).toHaveTextContent('2001');
    expect(getByTestId('deficitTotalHeader')).toHaveTextContent('$-0.13 T');

    fireEvent.mouseLeave(firstDecoyBar);
    expect(firstRealBar).toHaveStyle(`fill: deficitExplainerPrimary`);
  
    fireEvent.mouseOver(firstRealBar);
    expect(firstRealBar).toHaveStyle(`fill: #555555`);

    fireEvent.mouseLeave(firstRealBar);
    expect(firstRealBar).toHaveStyle(`fill: deficitExplainerPrimary`);
  });

  
});
