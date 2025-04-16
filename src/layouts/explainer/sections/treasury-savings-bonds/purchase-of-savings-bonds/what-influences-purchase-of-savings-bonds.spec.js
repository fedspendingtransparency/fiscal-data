import React from 'react';
import { render, waitFor } from '@testing-library/react';
import WhatInfluencesPurchaseOfSavingsBonds from './what-influences-purchase-of-savings-bonds';
import { cpi12MonthPercentChange, mockSavingsBondFetchResponses } from './../../../explainer-test-helper';
import { useStaticQuery } from 'gatsby';
import Analytics from '../../../../../utils/analytics/analytics';
import userEvent from '@testing-library/user-event';

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
    savingsBondsByTypeHistoricalCsv: [{ year: '2021', bond_type: 'Series I', sales: 153000000000 }],
  },
};

describe('WhatInfluencesPurchaseOfSavingsBonds Component - Comprehensive Test', () => {
  beforeAll(() => {
    mockSavingsBondFetchResponses();
    useStaticQuery.mockReturnValue(mockUseStaticQueryData);
  });
  const cpiDataByYear = {
    '2011': '10',
    '2012': '5',
    '2013': '5',
    '2023': '15',
    '2024': '15',
  };

  it('What influences Purchase OF saving bounds', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(
      <WhatInfluencesPurchaseOfSavingsBonds cpiDataByYear={cpiDataByYear} cpi12MonthPercentChange={cpi12MonthPercentChange} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalledTimes(2));
    expect(getByText('The chart below shows savings bond sales over time for all savings bond types', { exact: false })).toBeInTheDocument();
  });

  it('calls footnote click ga events', () => {
    const analyticsSpy = jest.spyOn(Analytics, 'event');
    const { getByRole } = render(
      <WhatInfluencesPurchaseOfSavingsBonds cpiDataByYear={cpiDataByYear} cpi12MonthPercentChange={cpi12MonthPercentChange} />
    );
    const accordion = getByRole('link', { name: '2' });
    userEvent.click(accordion);
    expect(analyticsSpy).toHaveBeenCalledWith({
      action: 'Footnote Click',
      category: 'Explainers',
      label: 'Savings Bonds - Footnote Click',
    });
  });
});
jest.mock('gatsby', () => ({
  ...jest.requireActual('gatsby'),
  graphql: jest.fn(),
  useStaticQuery: jest.fn(),
}));
