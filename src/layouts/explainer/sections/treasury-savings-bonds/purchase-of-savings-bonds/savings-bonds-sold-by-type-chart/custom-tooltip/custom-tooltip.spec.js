import { render } from '@testing-library/react';
import React from 'react';
import CustomTooltip from './custom-tooltip';
import { getShortForm } from '../../../../../../../utils/rounding-utils';
describe('Savings Bonds Sold By Type Tooltip', () => {
  const mockPayload = [
    {
      payload: {
        year: 2021,
        AD: 1000000000,
        E: 2000000000,
        F: 3000000000,
      },
    },
  ];
  const mockPayload_undefined = [
    {
      payload: {
        year: 2021,
        AD: 0,
        E: 2000000000,
        F: null,
      },
    },
  ];

  it('renders the tooltip', () => {
    const { getByTestId, getByText } = render(<CustomTooltip payload={mockPayload} label={2020} hiddenFields={[]} />);
    expect(getByTestId('CustomTooltip')).toBeInTheDocument();
    expect(getByText('2020')).toBeInTheDocument();
    expect(getByText(`$${getShortForm(mockPayload[0].payload.AD)}`)).toBeInTheDocument();
  });

  it('does not render the tooltip when it is inactive', () => {
    const { queryByTestId } = render(<CustomTooltip hiddenFields={[]} />);
    expect(queryByTestId('CustomTooltip')).not.toBeInTheDocument();
  });

  it('does not render tooltip values when it is undefined', () => {
    const { getByTestId, queryByText } = render(<CustomTooltip payload={mockPayload_undefined} hiddenFields={[]} />);
    expect(getByTestId('CustomTooltip')).toBeInTheDocument();
    expect(queryByText(`$${getShortForm(mockPayload[0].payload.E)}`)).toBeInTheDocument();
    expect(queryByText(`$${mockPayload[0].payload.F}`)).not.toBeInTheDocument();
  });
});
