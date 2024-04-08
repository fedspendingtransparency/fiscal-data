import React from 'react';
import { render, waitFor } from '@testing-library/react';
import WhatInfluencesPurchaseOfSavingsBonds from './what-influences-purchase-of-savings-bonds';
import mockSavingsBondFetchResponses from './../../../explainer-test-helper';
import { useStaticQuery } from 'gatsby';

global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

const mockUseStaticQueryData = {
  allSavingsBondsByTypeHistoricalCsv: {
    savingsBondsByTypeHistoricalCsv: {
      nodes: [{ year: '2021', bond_type: 'Series I', sales: 153000000000 }],
    },
  },
};

describe('WhatInfluencesPurchaseOfSavingsBonds Component - Comprehensive Test', () => {
  beforeAll(() => {
    mockSavingsBondFetchResponses;

    useStaticQuery.mockReturnValue(mockUseStaticQueryData);
  });

  it('What influences Purchase OF saving bounds', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<WhatInfluencesPurchaseOfSavingsBonds />);
    await waitFor(() => expect(fetchSpy).toBeCalledTimes(2));
    expect(getByText('The chart below shows savings bond sales over time for all savings bond types', { exact: false })).toBeInTheDocument();
  });
});
jest.mock('gatsby', () => ({
  ...jest.requireActual('gatsby'),
  graphql: jest.fn(),
  useStaticQuery: jest.fn(),
}));
