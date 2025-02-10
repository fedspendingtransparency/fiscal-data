import React from 'react';
import ChartLegend from './chartLegend';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockFieldConfig = [
  {
    field: 'a',
    displayName: 'A',
  },
  {
    field: 'b',
    displayName: 'B',
  },
  {
    field: 'c',
    displayName: 'C',
  },
];

describe('Chart Legend', () => {
  it('passes options to the checkbox', () => {
    const { getAllByTestId } = render(<ChartLegend fields={mockFieldConfig} onHover={jest.fn()} onLabelChange={jest.fn()} />);
    const checkboxes = getAllByTestId('checkbox-input-element');
    expect(checkboxes.length).toBe(mockFieldConfig.length);
  });

  it('passes change handler to the checkbox', () => {
    const changeHandlerSpy = jest.fn();
    const { getAllByTestId } = render(<ChartLegend fields={mockFieldConfig} onHover={jest.fn()} onLabelChange={changeHandlerSpy} />);
    const checkboxes = getAllByTestId('checkbox-input-element');
    userEvent.click(checkboxes[0]);
    expect(changeHandlerSpy).toHaveBeenCalled();
  });

  it('passes hover handler to the checkbox', () => {
    const onHoverSpy = jest.fn();
    const { getAllByTestId } = render(<ChartLegend fields={mockFieldConfig} onHover={onHoverSpy} onLabelChange={jest.fn()} />);
    const checkboxes = getAllByTestId('checkbox-input-element');
    userEvent.hover(checkboxes[0]);
    expect(onHoverSpy).toHaveBeenCalled();
  });

  it('places a heading with the total count of labels', () => {
    const { getByRole } = render(<ChartLegend fields={mockFieldConfig} onHover={jest.fn()} onLabelChange={jest.fn()} />);
    const heading = getByRole('heading', { level: 1 });
    within(heading).getByText('Legend (3)');
  });
});
