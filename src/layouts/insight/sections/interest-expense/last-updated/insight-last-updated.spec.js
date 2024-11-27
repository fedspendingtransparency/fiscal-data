import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { InsightLastUpdated } from './insight-last-updated';
import { basicFetch } from '../../../../../utils/api-utils';

jest.mock('../../../../../utils/api-utils', () => ({
  basicFetch: jest.fn(),
}));

describe('InsightLastUpdated', () => {
  it('should display the correct last updated date', async () => {

    const mockApiResponse = {
      data: [{ record_date: '2024-11-21T00:00:00Z' }],
    };

    basicFetch.mockResolvedValue(mockApiResponse);

    render(<InsightLastUpdated endpoint="/mock-endpoint" />);

    await waitFor(() => {
      expect(screen.getByText('Last Updated: November 21, 2024')).toBeInTheDocument();
    });
  });
});
