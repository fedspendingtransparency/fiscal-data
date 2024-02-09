import { render } from '@testing-library/react';
import React from 'react';
import CustomTooltip from './custom-tooltip';
import { getShortForm } from '../../../../../../../utils/rounding-utils';
describe('AFG Deficit Tooltip', () => {
  const mockPayload = [
    {
      payload: {
        year: 2021,
        ad: 1000000000,
        e: 2000000000,
        f: 3000000000,
      },
    },
  ];
  const mockPayload_undefined = [
    {
      payload: {
        year: 2021,
        ad: 0,
        e: 2000000000,
        f: null,
      },
    },
  ];

  it('renders the tooltip', () => {
    const { getByTestId, getByText } = render(<CustomTooltip payload={mockPayload} label={2020} />);
    expect(getByTestId('CustomTooltip')).toBeInTheDocument();
    expect(getByText('2020')).toBeInTheDocument();
    expect(getByText(`$${getShortForm(mockPayload[0].payload.ad)}`)).toBeInTheDocument();
  });

  it('does not render the tooltip when it is inactive', () => {
    const { queryByTestId } = render(<CustomTooltip />);
    expect(queryByTestId('CustomTooltip')).not.toBeInTheDocument();
  });

  it('does not render tooltip values when it is 0 or undefined', () => {
    const { getByTestId, queryByText } = render(<CustomTooltip payload={mockPayload_undefined} />);
    expect(getByTestId('CustomTooltip')).toBeInTheDocument();
    expect(queryByText(`$${mockPayload[0].payload.ad}`)).not.toBeInTheDocument();
    expect(queryByText(`$${getShortForm(mockPayload[0].payload.e)}`)).toBeInTheDocument();
    expect(queryByText(`$${mockPayload[0].payload.f}`)).not.toBeInTheDocument();
  });
});
