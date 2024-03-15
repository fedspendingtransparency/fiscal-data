import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HowSavingsBondsFinanceGovernment from './how-savings-bonds-finance-government';
import { RecoilRoot } from 'recoil';
import { useStaticQuery } from 'gatsby';
import fetchMock from 'fetch-mock';

const mockUseStaticQueryData = {
  allSavingsBondsByTypeHistoricalCsv: {
    savingsBondsByTypeHistoricalCsv: [{ year: '2021', bond_type: 'Series I', sales: 153000000000 }],
  },
};

const mockSavingsBondTypesData = {
  data: [
    {
      record_date: '2001-10-31',
      security_type_desc: 'Savings Bond',
      security_class_desc: 'I',
      securities_sold_cnt: '16',
      gross_sales_amt: '498.61',
      returned_sales_amt: '0.00',
      net_sales_amt: '498.61',
      trans_month: '200110',
      src_line_nbr: '1',
      record_fiscal_year: '2002',
      record_fiscal_quarter: '1',
      record_calendar_year: '2001',
      record_calendar_quarter: '4',
      record_calendar_month: '10',
      record_calendar_day: '31',
    },
    {
      record_date: '2001-11-30',
      security_type_desc: 'Savings Bond',
      security_class_desc: 'I',
      securities_sold_cnt: '22',
      gross_sales_amt: '1083.40',
      returned_sales_amt: '0.00',
      net_sales_amt: '1083.40',
      trans_month: '200111',
      src_line_nbr: '1',
      record_fiscal_year: '2002',
      record_fiscal_quarter: '1',
      record_calendar_year: '2001',
      record_calendar_quarter: '4',
      record_calendar_month: '11',
      record_calendar_day: '30',
    },
  ],
  meta: {
    count: 1,
    labels: {
      record_date: 'Record Date',
      security_type_desc: 'Security Type Description',
      security_class_desc: 'Security Class Description',
      securities_sold_cnt: 'Securities Sold Count',
      gross_sales_amt: 'Gross Sales Amount',
      returned_sales_amt: 'Returned Sales Amount',
      net_sales_amt: 'Net Sales Amount',
      trans_month: 'Transactions Month',
      src_line_nbr: 'Source Line Number',
      record_fiscal_year: 'Fiscal Year',
      record_fiscal_quarter: 'Fiscal Quarter Number',
      record_calendar_year: 'Calendar Year',
      record_calendar_quarter: 'Calendar Quarter Number',
      record_calendar_month: 'Calendar Month Number',
      record_calendar_day: 'Calendar Day Number',
    },
    dataTypes: {
      record_date: 'DATE',
      security_type_desc: 'STRING',
      security_class_desc: 'STRING',
      securities_sold_cnt: 'NUMBER',
      gross_sales_amt: 'CURRENCY',
      returned_sales_amt: 'CURRENCY',
      net_sales_amt: 'CURRENCY',
      trans_month: 'STRING',
      src_line_nbr: 'INTEGER',
      record_fiscal_year: 'YEAR',
      record_fiscal_quarter: 'QUARTER',
      record_calendar_year: 'YEAR',
      record_calendar_quarter: 'QUARTER',
      record_calendar_month: 'MONTH',
      record_calendar_day: 'DAY',
    },
    dataFormats: {
      record_date: 'YYYY-MM-DD',
      security_type_desc: 'String',
      security_class_desc: 'String',
      securities_sold_cnt: '10.2',
      gross_sales_amt: '$10.20',
      returned_sales_amt: '$10.20',
      net_sales_amt: '$10.20',
      trans_month: 'String',
      src_line_nbr: '10',
      record_fiscal_year: 'YYYY',
      record_fiscal_quarter: 'Q',
      record_calendar_year: 'YYYY',
      record_calendar_quarter: 'Q',
      record_calendar_month: 'MM',
      record_calendar_day: 'DD',
    },
    'total-count': 521,
    'total-pages': 521,
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
