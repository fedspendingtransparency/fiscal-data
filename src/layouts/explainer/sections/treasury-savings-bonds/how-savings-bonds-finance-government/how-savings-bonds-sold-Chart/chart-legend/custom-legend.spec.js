import React from 'react';
import { render, fireEvent, screen} from '@testing-library/react';
import CustomLegend from './custom-legend';

describe('CustomLegend', () => {
  const primaryColor = '#4A0072';
  const secondaryColor = '#B04ABD';
  const mockOnLegendEnter = jest.fn();
  const mockOnChartLeave = jest.fn();

  beforeEach(() => {
    render(
      <CustomLegend
        onLegendEnter={mockOnLegendEnter}
        onChartLeave={mockOnChartLeave}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />
    );
  });

  it('renders correctly', () => {
    expect(screen.getByText('Marketable Security')).toBeInTheDocument();
    expect(screen.getByText('Non-Marketable Security')).toBeInTheDocument();
  });

  it('calls onLegendEnter with true when Marketable Security is hovered', () => {
    fireEvent.mouseEnter(screen.getByText('Marketable Security'));
    expect(mockOnLegendEnter).toHaveBeenCalledWith(true);
  });

  it('calls onLegendEnter with false when Non-Marketable Security is hovered', () => {
    fireEvent.mouseEnter(screen.getByText('Non-Marketable Security'));
    expect(mockOnLegendEnter).toHaveBeenCalledWith(false);
  });

  it('calls onChartLeave when mouse leaves either legend item', () => {
    fireEvent.mouseLeave(screen.getByText('Marketable Security'));
    expect(mockOnChartLeave).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(screen.getByText('Non-Marketable Security'));
    expect(mockOnChartLeave).toHaveBeenCalledTimes(2); 
  });

});
