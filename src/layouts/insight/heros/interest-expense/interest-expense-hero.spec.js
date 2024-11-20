import fetchMock from 'fetch-mock';

import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { InterestExpenseHero } from './interest-expense-hero';
import { mockInterestExpenseHeroCurrentResponse, mockInterestExpenseHeroOlderResponse } from '../../insight-test-helper';

describe('Interest Expense Hero', () => {
  beforeEach(() => {
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v2/accounting/od/interest_expense?sort=record_date&page[size]=1`,
      mockInterestExpenseHeroOlderResponse,
      { overwriteRoutes: false, repeat: 1 }
    );
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v2/accounting/od/interest_expense?sort=-record_date&page[size]=1`,
      mockInterestExpenseHeroCurrentResponse,
      { overwriteRoutes: false, repeat: 1 }
    );
  });
  afterEach(() => {
    fetchMock.restore();
  });

  it('Hero Image section loads with relevant data', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    const { getByText } = render(<InterestExpenseHero />);
    expect(fetchSpy).toBeCalled();

    await waitFor(() => getByText('2012', { exact: false }));
    expect(await getByText('Interest Expense and Average Interest Rates on the National Debt FY 2012 – 2025', { exact: false })).toBeInTheDocument();
  });
});
