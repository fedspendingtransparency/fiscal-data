import React from 'react';
import { render, waitFor } from '@testing-library/react';
import TreasurySavingsBondsHero from './treasury-savings-bonds-hero';
import { mockSavingsBondFetchResponses } from '../../explainer-test-helper';

describe('Treasury Savings Bonds Hero', () => {
  beforeAll(() => mockSavingsBondFetchResponses());

  it('renders hero section', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<TreasurySavingsBondsHero />);
    // await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(getByText('savings bonds this fiscal year', { exact: false })).toBeInTheDocument();
  });

  it('renders hero section with correct data', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<TreasurySavingsBondsHero />);
    // await waitFor(() => expect(fetchSpy).toBeCalled());
    await waitFor(() => getByText('$89 million', { exact: false }));
    expect(getByText('has invested $89 million', { exact: false })).toBeInTheDocument();
    expect(getByText('(Oct 2022 - Feb 2023)', { exact: false })).toBeInTheDocument();
    expect(getByText('$1 B', { exact: false })).toBeInTheDocument();
    expect(getByText('-93%', { exact: false })).toBeInTheDocument();
    expect(getByText('have decreased', { exact: false })).toBeInTheDocument();
  });
});
