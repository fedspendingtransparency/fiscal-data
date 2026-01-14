import { SpendingCategories } from './spending-categories';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { fireEvent } from '@testing-library/react';
import fetchMock from 'fetch-mock';

describe('Federal Spending Overview', () => {
  afterEach(() => {
    fetchMock.restore();
  });
  it('renders the subcategory header', () => {
    const { getByRole } = render(<SpendingCategories />);
    expect(getByRole('heading', { name: 'What does the government buy?' })).toBeInTheDocument();
  });

  it('renders the accordion', () => {
    const { getByText } = render(<SpendingCategories />);
    const accordion = getByText('What does the future of Social Security and Medicare look like?');
    expect(accordion).toBeInTheDocument();
    fireEvent.click(accordion);
    expect(getByText('Each year, the Social Security', { exact: false })).toBeInTheDocument();
  });

  it('loads the evergreen data', async () => {
    const mockData = {
      data: [
        {
          current_fytd_net_outly_amt: '4515067070149.23',
          prior_fytd_net_outly_amt: '2237949464925.20',
          record_calendar_month: '06',
          record_calendar_year: '2022',
          record_date: '2022-06-30',
          record_fiscal_year: '2022',
        },
      ],
    };

    fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/v1/`, mockData);

    // const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<SpendingCategories />);

    // expect(fetchMock.called()).toBe(true);
    await waitFor(() => getByText('federal spending in FY 2022', { exact: false }));
  });
});
