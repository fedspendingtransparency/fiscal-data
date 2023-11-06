import { render } from '@testing-library/react';
import React from 'react';
import CustomTooltip from './custom-tooltip';
import { getShortForm } from '../../../../../../utils/rounding-utils';
describe('AFG Deficit Tooltip', () => {
  const mockPayload = [
    {
      payload: {
        year: 2021,
        tooltip: [{ title: 'Spending', color: 'red', value: 5678900000000 }],
      },
    },
  ];

  it('renders the tooltip', () => {
    const { getByTestId, getByText } = render(<CustomTooltip payload={mockPayload} label={2020} setFocused={jest.fn()} labelByYear={false} />);
    expect(getByTestId('CustomTooltip')).toBeInTheDocument();
    expect(getByText('2020')).toBeInTheDocument();
    expect(getByText(`$${getShortForm(mockPayload[0].payload.tooltip[0].value)}`)).toBeInTheDocument();
  });

  it('does not render the tooltip when it is inactive', () => {
    const { queryByTestId } = render(<CustomTooltip setFocused={jest.fn()} labelByYear={false} />);
    expect(queryByTestId('CustomTooltip')).not.toBeInTheDocument();
  });

  it('renders the year label', () => {
    const { getByTestId, getByText } = render(<CustomTooltip payload={mockPayload} setFocused={jest.fn()} labelByYear />);
    expect(getByTestId('CustomTooltip')).toBeInTheDocument();
    expect(getByText('2021')).toBeInTheDocument();
    expect(getByText(`$${getShortForm(mockPayload[0].payload.tooltip[0].value)}`)).toBeInTheDocument();
  });

  it('', () => {
    const { getByTestId, getByText } = render(<CustomTooltip payload={mockPayload} label="2021" setFocused={jest.fn()} curFY="2021" />);
    expect(getByTestId('CustomTooltip')).toBeInTheDocument();
    expect(getByText('FYTD 2021')).toBeInTheDocument();
  });
});
