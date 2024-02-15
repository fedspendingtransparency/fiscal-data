import React from 'react';
import { render } from '@testing-library/react';
import TreasurySavingsBondsHero from './treasury-savings-bonds-hero';
import fetchMock from 'fetch-mock';
import { mockSavingsBondCurrentFY, mockSavingsBondDataNoFilter, mockSavingsBondLastFiscalYearCurrentMonth } from '../../explainer-test-helper';

describe('Treasury Savings Bonds Hero', () => {
  beforeAll(() => {
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings%20Bond&sort=-record_date&page[size]=1`,
      mockSavingsBondDataNoFilter,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings%20Bond,record_fiscal_year:eq:2024`,
      mockSavingsBondCurrentFY,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings%20Bond,record_fiscal_year:eq:2023,record_calendar_month:eq:02`,
      mockSavingsBondLastFiscalYearCurrentMonth,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
  });

  it('renders hero section', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<TreasurySavingsBondsHero />);
    expect(fetchSpy).toBeCalled();
    expect(getByText('savings bonds this fiscal year', { exact: false })).toBeInTheDocument();
  });
});
