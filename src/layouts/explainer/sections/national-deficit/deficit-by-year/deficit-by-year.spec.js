import React from 'react';
import {render} from '@testing-library/react';
import DeficitByYear from "./deficit-by-year";
import {setGlobalFetchResponse} from "../../../../../utils/mock-utils";
import {mockDeficitTrendsData} from "../../../explainer-test-helper";


describe('Deficit by year section', () => {
  beforeEach(() => {
    setGlobalFetchResponse(jest, mockDeficitTrendsData);
  });
  it('renders the text content', () => {
    const {getByTestId, getAllByRole} = render(<DeficitByYear />);
    expect(getByTestId('textContent')).toBeInTheDocument();
    expect(getAllByRole('link').length).toEqual(4);
  });
  it('renders the trends chart', () => {
    const {getByTestId} = render(<DeficitByYear />);
    expect(getByTestId('deficitTrendsChartParent')).toBeInTheDocument();
  });
});
