import fetchMock from 'fetch-mock';

import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { InterestExpenseHero } from './interest-expense-hero';
import { currentUrl, mockInterestExpenseHeroCurrentResponse, mockInterestExpenseHeroOlderResponse, olderUrl } from '../../insight-test-helper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('Interest Expense Hero', () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

  beforeEach(() => {
    fetchMock
      .mockGlobal()
      .route(currentUrl, mockInterestExpenseHeroCurrentResponse)
      .route(olderUrl, mockInterestExpenseHeroOlderResponse);
  });
  afterEach(() => {
    fetchMock.hardReset();
  });

  it('Hero Image section loads with relevant data', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    const { getByText } = render(<InterestExpenseHero />, { wrapper });
    expect(fetchSpy).toHaveBeenCalled;

    await waitFor(() => getByText('2012', { exact: false }));
    expect(
      await getByText('Interest Expense and Average Interest Rates on the National Debt FY 2012 – FYTD 2025', { exact: false })
    ).toBeInTheDocument();
  });
});
