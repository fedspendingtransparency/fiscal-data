import React from 'react';
import { render, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import { mockRevenueHeroData, mockRevenueHeroData_decrease } from '../../explainer-test-helper';
import GovernmentRevenueHero from './government-revenue-hero';
import { queryClient } from '../../../../../react-query-client';

describe('Government Revenue Hero', () => {
  beforeAll(() => {
    fetchMock.mockGlobal().route(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`, mockRevenueHeroData);
  });

  afterEach(() => {
    queryClient.clear();
  });

  afterAll(() => {
    fetchMock.hardReset();
  });

  it('Hero Image section loads with relevant data', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    const { getByText } = render(<GovernmentRevenueHero />);
    expect(fetchSpy).toHaveBeenCalled;

    await waitFor(() => getByText('$4.10 trillion', { exact: false }));
    expect(await getByText('in fiscal year 2022', { exact: false })).toBeInTheDocument();
    expect(await getByText('Fiscal Year-to-Date (since October 2021)', { exact: false })).toBeInTheDocument();
    expect(await getByText('Compared to the federal revenue of $3.32 trillion', { exact: false })).toBeInTheDocument();
    expect(await getByText('(Oct 2020 - Jun 2021)', { exact: false })).toBeInTheDocument();
    expect(await getByText('federal revenue has increased by $787 billion', { exact: false })).toBeInTheDocument();

    global.fetch.mockRestore();
  });
});

describe('Pill data section', () => {
  afterEach(() => {
    queryClient.clear();
    fetchMock.hardReset();
  });

  it('correctly renders the pill data, when revenue has increased', async () => {
    fetchMock.mockGlobal().route(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`, mockRevenueHeroData);
    const fetchSpy = jest.spyOn(global, 'fetch');

    const { getByText, getByRole, getAllByText } = render(<GovernmentRevenueHero />);
    expect(fetchSpy).toHaveBeenCalled;

    await waitFor(() => getAllByText('$787 B', { exact: false }));
    expect(await getByRole('img', { name: 'up arrow' })).toBeInTheDocument();
    expect(await getByText('24%', { exact: false })).toBeInTheDocument();

    global.fetch.mockRestore();
  });

  it('correctly renders the pill data, when revenue has decreased', async () => {
    fetchMock.mockGlobal().route(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`, mockRevenueHeroData_decrease);
    const fetchSpy = jest.spyOn(global, 'fetch');

    const { getByText, getByRole, getAllByText } = render(<GovernmentRevenueHero />);
    expect(fetchSpy).toHaveBeenCalled;

    await waitFor(() => getAllByText('$213 B', { exact: false }));
    expect(await getByRole('img', { name: 'down arrow' })).toBeInTheDocument();
    expect(await getByText('5%', { exact: false })).toBeInTheDocument();

    global.fetch.mockRestore();
  });
});
