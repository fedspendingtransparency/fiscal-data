import React from 'react';
import AggregationNotice, { dataAggregationNotice } from './aggregation-notice';
import { render, screen } from '@testing-library/react';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';

describe('AggregationNotice Component', () => {
  beforeEach(() => {
    render(<AggregationNotice />);
  });

  it('displays an info icon', () => {
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toHaveAttribute('data-prefix', faInfoCircle.prefix);
    expect(icon).toHaveAttribute('data-icon', faInfoCircle.iconName);
  });

  it('displays the expected message', () => {
    expect(screen.getByTestId('message-text').textContent).toEqual(dataAggregationNotice);
  });
});
