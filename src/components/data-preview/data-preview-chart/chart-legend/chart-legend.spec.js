import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ChartLegend from './chart-legend';
import { mockFields, mockFields2, mockFields6, mockLegendColors } from '../chart-test-helper';

describe('Footer Chart Legend', () => {
  it('should render a checkbox for each field', () => {
    const { getByRole } = render(<ChartLegend fields={mockFields} onHover={jest.fn()} onLabelChange={jest.fn()} legendColors={mockLegendColors} />);
    expect(getByRole('checkbox', { name: 'A' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'B' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'C' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'D' })).toBeInTheDocument();
  });

  it('should call onLabelChange on key press', () => {
    const mockOnLabelChange = jest.fn();
    const { getByRole } = render(
      <ChartLegend fields={mockFields} onHover={jest.fn()} onLabelChange={mockOnLabelChange} legendColors={mockLegendColors} />
    );
    const checkbox = getByRole('checkbox', { name: 'A' });
    fireEvent.keyDown(checkbox, { key: 'Enter' });
    expect(mockOnLabelChange).toHaveBeenCalled();
  });

  it('should call onLabelChange on click', () => {
    const mockOnLabelChange = jest.fn();
    const { getByRole } = render(
      <ChartLegend fields={mockFields} onHover={jest.fn()} onLabelChange={mockOnLabelChange} legendColors={mockLegendColors} />
    );
    const checkbox = getByRole('checkbox', { name: 'A' });
    fireEvent.click(checkbox);
    expect(mockOnLabelChange).toHaveBeenCalled();
  });

  it('should set proper width for less then 4 fields', () => {
    const { getAllByTestId } = render(
      <ChartLegend fields={mockFields2} onHover={jest.fn()} onLabelChange={jest.fn()} legendColors={mockLegendColors} />
    );
    const checkboxContainer = getAllByTestId('legendField')[0];
    expect(checkboxContainer).toHaveStyle({ width: '50%' });
  });

  it('should set proper width for 6 fields', () => {
    const { getAllByTestId } = render(
      <ChartLegend fields={mockFields6} onHover={jest.fn()} onLabelChange={jest.fn()} legendColors={mockLegendColors} />
    );
    const checkboxContainer = getAllByTestId('legendField')[0];
    expect(checkboxContainer).toHaveStyle({ width: '33%' });
  });

  it('should apply specified colors to each checkbox', () => {
    const { getAllByTestId } = render(
      <ChartLegend fields={mockFields} onHover={jest.fn()} onLabelChange={jest.fn()} legendColors={mockLegendColors} />
    );
    const checkboxContainers = getAllByTestId('checkboxLabelContainer');
    checkboxContainers.forEach((box, i) => expect(box).toHaveStyle({ backgroundColor: mockLegendColors[i] }));
  });
});
