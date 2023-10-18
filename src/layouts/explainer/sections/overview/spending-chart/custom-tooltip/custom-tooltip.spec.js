import React from 'react';
import { render } from '@testing-library/react'; 
import CustomTooltip from './custom-tooltip';

describe('AFG Spending Tooltip', () => {
const mockPayload = [
  {
    payload: {
      tooltip: [{label: 'Oct', value: 12000000000000, name: 2021}]
    },
  },
];


it('renders the tooltip', () => {
  const { getByTestId, getByText } = render(<CustomTooltip payload={mockPayload} label={'Oct'} />);
  expect(getByTestId('CustomTooltip')).toBeInTheDocument();
  expect(getByText('October')).toBeInTheDocument();
});

it('does not render the tooltip when it is inactive', () => {
  const { queryByTestId } = render(<CustomTooltip />);
  expect(queryByTestId('CustomTooltip')).not.toBeInTheDocument();
});

});
