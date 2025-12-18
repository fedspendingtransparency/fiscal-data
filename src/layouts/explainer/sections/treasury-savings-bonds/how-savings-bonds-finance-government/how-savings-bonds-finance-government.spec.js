import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HowSavingsBondsFinanceGovernment, { higherOrLowerOrSameAs } from './how-savings-bonds-finance-government';
import { RecoilRoot } from 'recoil';
import { useStaticQuery } from 'gatsby';
import fetchMock from 'fetch-mock';
import { mockSavingsBondTypesData } from '../../../explainer-test-helper';
import { analyticsEventHandler } from '../../../explainer-helpers/explainer-helpers';
import { glossaryGAEvent } from '../treasury-savings-bonds';

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

jest.mock('../../../explainer-helpers/explainer-helpers');
jest.mock('../treasury-savings-bonds');

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

  it('fires an event when the user clicks on any of the four links', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <HowSavingsBondsFinanceGovernment />
      </RecoilRoot>
    );
    fireEvent.click(getByRole('link', { name: 'revenue' }));
    expect(analyticsEventHandler).toHaveBeenCalledWith('Government Revenue', 'Savings Bonds Citation Click');
    fireEvent.click(getByRole('link', { name: 'spends' }));
    expect(analyticsEventHandler).toHaveBeenCalledWith('Federal Spending', 'Savings Bonds Citation Click');
    fireEvent.click(getByRole('link', { name: 'deficit' }));
    expect(analyticsEventHandler).toHaveBeenCalledWith('National Deficit', 'Savings Bonds Citation Click');
    fireEvent.click(getByRole('link', { name: 'debt' }));
    expect(analyticsEventHandler).toHaveBeenCalledWith('National Debt', 'Savings Bonds Citation Click');
  });

  it('fires an event when the user clicks on any of glossary terms', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <HowSavingsBondsFinanceGovernment />
      </RecoilRoot>
    );
    fireEvent.click(getByRole('button', { name: 'marketable' }));
    expect(glossaryGAEvent).toHaveBeenCalledWith('Marketable Securities');
    fireEvent.keyDown(getByRole('button', { name: 'View in glossary' }), { key: 'Escape', code: 'Escape', charCode: 27 });
    fireEvent.click(getByRole('button', { name: 'non-marketable' }));
    expect(glossaryGAEvent).toHaveBeenCalledWith('Non-Marketable Securities');
    fireEvent.keyDown(getByRole('button', { name: 'View in glossary' }), { key: 'Escape', code: 'Escape', charCode: 27 });
    fireEvent.click(getByRole('button', { name: 'Government Account Series' }));
    expect(glossaryGAEvent).toHaveBeenCalledWith('Government Account Series');
    fireEvent.keyDown(getByRole('button', { name: 'View in glossary' }), { key: 'Escape', code: 'Escape', charCode: 27 });
    fireEvent.click(getByRole('button', { name: 'State and Local Government Series' }));
    expect(glossaryGAEvent).toHaveBeenCalledWith('State and Local Government Series');
    fireEvent.keyDown(getByRole('button', { name: 'View in glossary' }), { key: 'Escape', code: 'Escape', charCode: 27 });
    fireEvent.click(getByRole('button', { name: 'debt held by the public' }));
    expect(glossaryGAEvent).toHaveBeenCalledWith('Debt Held by the Public');
    fireEvent.keyDown(getByRole('button', { name: 'View in glossary' }), { key: 'Escape', code: 'Escape', charCode: 27 });
    fireEvent.click(getByRole('button', { name: 'Series I bonds' }));
    expect(glossaryGAEvent).toHaveBeenCalledWith('Series I Bonds');
    fireEvent.keyDown(getByRole('button', { name: 'View in glossary' }), { key: 'Escape', code: 'Escape', charCode: 27 });
    fireEvent.click(getByRole('button', { name: 'Series EE bonds' }));
    expect(glossaryGAEvent).toHaveBeenCalledWith('Series EE Bonds');
    fireEvent.keyDown(getByRole('button', { name: 'View in glossary' }), { key: 'Escape', code: 'Escape', charCode: 27 });
  });

  describe('tests for higherOrLowerOrSameAs function logic', () => {
    it('returns "higher than" when the difference is greater than 0', () => {
      const result = higherOrLowerOrSameAs(2.3);
      expect(result).toBe('higher than');
    });

    it('returns "lower than" when the difference less than 0', () => {
      const result = higherOrLowerOrSameAs(-0.4);
      expect(result).toBe('lower than');
    });

    it('returns "the same as" when the difference equals 0', () => {
      const result = higherOrLowerOrSameAs(0);
      expect(result).toBe('the same as');
    });
  });
});
