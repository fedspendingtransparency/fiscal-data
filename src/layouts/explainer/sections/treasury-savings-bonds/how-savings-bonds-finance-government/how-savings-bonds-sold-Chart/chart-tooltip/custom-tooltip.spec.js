import React from 'react';
import { render, screen} from '@testing-library/react';
import CustomTooltip from './custom-tooltip';

describe('CustomTooltip', () => {
  const mockPayload = [{
    payload: {
      name: "Marketable Securities",
      percent: 65,
      color: "#4A0072",
      securityType: "Marketable"
    },
    color: "#4A0072"
  }];

  it('renders tooltip content correctly when active', () => {
    render(<CustomTooltip active={true} payload={mockPayload} />);

    expect(screen.getByText('Marketable Securities')).toBeInTheDocument();
    expect(screen.getByText('Marketable')).toBeInTheDocument();
    expect(screen.getByText('65% of National Debt')).toBeInTheDocument();

    const colorBox = screen.getByTestId('tooltip-box-color')
    expect(colorBox).toHaveStyle(`background-color: #4A0072`);
  });

  it('does not render when not active', () => {
    const { container } = render(<CustomTooltip active={false} payload={mockPayload} />);
    expect(container.firstChild).toBeNull();
  });
});
