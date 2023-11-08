import { render } from '@testing-library/react';
import React from 'react';
import CustomTooltip from './custom-tooltip';
describe('AFG Deficit Tooltip', () => {
  const mockPayload = [
    {
      name: '2021 FYTD',
      color: 'red',
      value: 2.12345678,
      payload: {
        currentFY: 2021,
        currentFYValue: 2.12345678,
      },
    },
  ];

  it('renders the tooltip', () => {
    const { getByTestId, getByText } = render(<CustomTooltip payload={mockPayload} label={'Oct'} />);
    expect(getByTestId('CustomTooltip')).toBeInTheDocument();
    expect(getByText('2021 FYTD')).toBeInTheDocument();
    expect(getByText('October')).toBeInTheDocument();
    expect(getByText(`$2.12T`)).toBeInTheDocument();
  });

  it('does not render the tooltip when it is inactive', () => {
    const { queryByTestId } = render(<CustomTooltip />);
    expect(queryByTestId('CustomTooltip')).not.toBeInTheDocument();
  });
});
