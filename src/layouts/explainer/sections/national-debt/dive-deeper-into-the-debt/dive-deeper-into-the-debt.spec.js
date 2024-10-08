import Analytics from '../../../../../utils/analytics/analytics';
import { render } from '@testing-library/react';
import React from 'react';
import DiveDeeperIntoTheDebt from './dive-deeper-into-the-debt';

describe('Dive deeper into the debt', () => {
  it('calls the appropriate analytics event when links are clicked on', () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByText } = render(<DiveDeeperIntoTheDebt />);

    const financialReport = getByText('FRUSG_2022.pdf', { exact: false });
    const americasFiscalFuture = getByText('americas-fiscal-future', { exact: false });
    const debtCeiling = getByText('whitehouse.gov/cea', { exact: false });
    const federalBorrowing = getByText('whitehouse.gov/wp-content', { exact: false });
    const federalNetInterestCost = getByText('cbo.gov/publication/56910', { exact: false });
    const treasurySecurities = getByText('federalreserve.gov', { exact: false });
    const reducingDeficit = getByText('cbo.gov/publication/56783', { exact: false });
    const treasuryBulletin = getByText('treasury-bulletin', { exact: false });
    const usaSpending = getByText('usaspending.gov', { exact: false });

    const resources = [
      financialReport,
      americasFiscalFuture,
      debtCeiling,
      federalBorrowing,
      federalNetInterestCost,
      treasurySecurities,
      reducingDeficit,
      treasuryBulletin,
      usaSpending,
    ];

    const resourceLabels = [
      'The most recent U.S. Government Financial Report',
      'America’s Fiscal Future: Federal Debt',
      'The Debt Ceiling: An Explainer',
      'Federal Borrowing and Debt',
      'Federal Net Interest Costs: A Primer',
      'Is the Federal Reserve Printing Money in Order to Buy Treasury Securities?',
      'Options for Reducing Deficit',
      'Treasury Bulletin',
      'USAspending'
    ]

    resources.forEach((resource, index) => {
      resource.click();
      expect(spy).toHaveBeenCalledWith({
        category: 'Explainers',
        action: `Debt Citation Click`,
        label: resourceLabels[index],
      });
      spy.mockClear();
    });
  });
});
