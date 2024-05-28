import { render, waitFor } from '@testing-library/react';
import React from 'react';
import DeficitKeyTakeaways from './deficit-key-takeaways';
import * as apiUtils from '../../../../../utils/api-utils';

jest.mock('../../../../../utils/api-utils', () => ({
  ...jest.requireActual('../../../../../utils/api-utils'),
  basicFetch: jest.fn(),
}));

describe('Spending Key Takeaways evergreen values', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    apiUtils.basicFetch.mockResolvedValue({ data: [] });
  });

  it('renders the link correctly in takeaway 3', async () => {
    const { getByRole } = render(<DeficitKeyTakeaways />);
    await waitFor(() => {
      expect(getByRole('link')).toHaveAttribute('href', '/americas-finance-guide/national-debt/');
    });
  });

  it('correctly fetches surplus count and updates state', async () => {
    const mockData = {
      data: [
        { current_fytd_net_outly_amt: '100', record_date: '2022-09-30' },
        { current_fytd_net_outly_amt: '-200', record_date: '2021-09-30' },
      ],
    };
    apiUtils.basicFetch.mockResolvedValue(mockData);

    const { findByText } = render(<DeficitKeyTakeaways />);
    await waitFor(() => {
      expect(apiUtils.basicFetch).toHaveBeenCalled();
    });

    // Since the start amount is 4 we should expect 5 even though there is only one that is test
    expect(await findByText(/surplus 5 times/)).toBeInTheDocument();
  });
});
