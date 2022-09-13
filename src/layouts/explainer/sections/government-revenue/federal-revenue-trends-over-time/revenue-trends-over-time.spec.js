import React from 'react';
import {render} from '@testing-library/react';
import FederalRevenueTrendsOverTime from "./federal-revenue-trends-over-time";

describe('revenue trends over time section', () => {
  it('renders the revenue trends line chart', () => {
    const {getByTestId} = render(<FederalRevenueTrendsOverTime />);
    expect(getByTestId('revenueTrendsLineChart')).toBeInTheDocument();
  })
})
