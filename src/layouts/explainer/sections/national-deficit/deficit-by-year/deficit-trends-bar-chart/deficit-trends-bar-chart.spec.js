import React from 'react';
import {render, waitFor} from '@testing-library/react';
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
    expect(await getByText('Federal Deficit Trends Over Time, FY 2001-2016')).toBeInTheDocument();
    expect(await getByText('$0.59 T')).toBeInTheDocument();
    expect(await getByText('Last Updated: September 30, 2016')).toBeInTheDocument();
  });
});
