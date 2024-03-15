import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HowSavingsBondsFinanceGovernment from './how-savings-bonds-finance-government';
import { RecoilRoot } from 'recoil';
import { useStaticQuery } from 'gatsby';

const mockUseStaticQueryData = {
  allSavingsBondsByTypeHistoricalCsv: {
    savingsBondsByTypeHistoricalCsv: {
      nodes: [{ year: '2021', bond_type: 'Series I', sales: 153000000000 }],
    },
  },
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
