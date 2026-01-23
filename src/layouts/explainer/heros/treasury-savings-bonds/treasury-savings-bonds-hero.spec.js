import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import TreasurySavingsBondsHero from './treasury-savings-bonds-hero';
import { mockSavingsBondFetchResponses } from '../../explainer-test-helper';
import Analytics from '../../../../utils/analytics/analytics';

describe('Treasury Savings Bonds Hero', () => {
  beforeAll(() => mockSavingsBondFetchResponses());

  it('renders hero section', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const instance = render(<TreasurySavingsBondsHero />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(instance).toBeDefined();
  });

  it('renders hero section with correct data', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText, getAllByText } = render(<TreasurySavingsBondsHero />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    await waitFor(() => getByText('$89 million', { exact: false }));
    expect(getByText('invested $89 million', { exact: false })).toBeInTheDocument();
    expect(getByText('(Oct 2022 - Feb 2023)', { exact: false })).toBeInTheDocument();
    expect(getAllByText('$1 B', { exact: false })[0]).toBeInTheDocument();
    expect(getByText('-93%', { exact: false })).toBeInTheDocument();
    expect(getByText('have decreased', { exact: false })).toBeInTheDocument();
  });

  it('calls a ga event when the custom link is clicked ', async () => {
    const analyticsSpy = jest.spyOn(Analytics, 'event');
    const { getByRole } = render(<TreasurySavingsBondsHero />);
    const estLink = getByRole('link', { name: 'Electronic Securities Transactions' });
    fireEvent.click(estLink);
    expect(analyticsSpy).toHaveBeenCalledWith({
      action: 'Savings Bonds Citation Click',
      category: 'Explainers',
      label: 'Electronic Securities Transactions',
    });
  });
});
