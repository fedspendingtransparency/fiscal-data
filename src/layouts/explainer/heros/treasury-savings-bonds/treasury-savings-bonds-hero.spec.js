import React from 'react';
import { render } from '@testing-library/react';
import TreasurySavingsBondsHero from './treasury-savings-bonds-hero';

describe('Treasury Savings Bonds Hero', () => {
  it('renders hero section', () => {
    const { getByText } = render(<TreasurySavingsBondsHero />);
    expect(getByText('savings bonds this fiscal year', { exact: false })).toBeInTheDocument();
  });
});
