import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HowSavingsBondsFinanceGovernment from './how-savings-bonds-finance-government';
import { RecoilRoot } from 'recoil';
import { useStaticQuery } from 'gatsby';
import fetchMock from 'fetch-mock';
import { mockSavingsBondTypesData } from '../../../explainer-test-helper';

const mockUseStaticQueryData = {
  allSavingsBondsByTypeHistoricalCsv: {
    savingsBondsByTypeHistoricalCsv: [{ year: '2021', bond_type: 'Series I', sales: 153000000000 }],
  },
};

const mockMSPDData = {
  data: [
    {
      record_date: '2001-01-31',
      security_type_desc: 'Marketable',
      security_class_desc: 'Bills',
      debt_held_public_mil_amt: '656148.477',
      intragov_hold_mil_amt: '0',
      total_mil_amt: '656148.477',
      src_line_nbr: '1',
      record_fiscal_year: '2001',
      record_fiscal_quarter: '2',
      record_calendar_year: '2001',
      record_calendar_quarter: '1',
      record_calendar_month: '01',
      record_calendar_day: '31',
    },
  ],
  meta: {
    'total-pages': 30,
  },
};

const mockMSPDData2 = {
  data: [
    {
      record_date: '2024-02-29',
      security_type_desc: 'Marketable',
      security_class_desc: 'Bills',
      debt_held_public_mil_amt: '6010137.1045',
      intragov_hold_mil_amt: '1099.273',
      total_mil_amt: '6011236.3775',
      src_line_nbr: '1',
      record_fiscal_year: '2024',
      record_fiscal_quarter: '2',
      record_calendar_year: '2024',
      record_calendar_quarter: '1',
      record_calendar_month: '02',
      record_calendar_day: '29',
    },
  ],
};

describe('How Savings Bonds Finance The Government Section', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  beforeAll(() => {
    useStaticQuery.mockReturnValue(mockUseStaticQueryData);
    fetchMock.get(
      'begin:https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings%20Bond',
      mockSavingsBondTypesData
    );
    fetchMock.get(
      'https://www.transparency.treasury.gov/services/api/fiscal_service/v1/debt/mspd/mspd_table_1?filter=record_date:eq&page[size]=1',
      mockMSPDData
    );
    fetchMock.get(
      'https://www.transparency.treasury.gov/services/api/fiscal_service/v1/debt/mspd/mspd_table_1?sort=-record_date&page[size]=1',
      mockMSPDData2
    );
    fetchMock.get(
      'https://www.transparency.treasury.gov/services/api/fiscal_service/v1/debt/mspd/mspd_table_1?filter=record_date:eq&page[size]=30',
      mockMSPDData2
    );
  });

  it('renders the section', () => {
    render(
      <RecoilRoot>
        <HowSavingsBondsFinanceGovernment />
      </RecoilRoot>
    );
    expect(screen.getByText('Different types of securities earn interest in different ways.', { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Savings bonds are the most well-known type of non-marketable security and the only type available for purchase by individuals.',
        { exact: false }
      )
    ).toBeInTheDocument();
    expect(screen.getByAltText('A paper Series E Savings Bond')).toBeInTheDocument();
  });
});
