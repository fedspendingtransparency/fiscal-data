import Analytics from '../../utils/analytics/analytics';
import CustomLink from '../../components/links/custom-link/custom-link';
import React from 'react';

export { featuredContentRegistry, getFeaturedContentPage } from '../../transform/featured-content-pages-config';

export const analyticsEventHandler = (pageName, eventLabel, eventAction = 'Citation Click') => {
  Analytics.event({
    category: pageName,
    action: eventAction,
    label: eventLabel,
  });
};

const featuredContentCitations = page => {
  return {
    accountsOfReceiptsAndExpendituresDataset: (
      <CustomLink
        url="/datasets/account-of-receipts-and-expenditures"
        id="Account of the Receipts and Expenditures of the United States"
        onClick={() => analyticsEventHandler(page, 'Account of the Receipts and Expenditures of the United States')}
      >
        Account of the Receipts and Expenditures of the United States
      </CustomLink>
    ),
    federalFundingAccountabilityAct: (
      <CustomLink
        url="https://www.govinfo.gov/content/pkg/PLAW-109publ282/pdf/PLAW-109publ282.pdf"
        id="Federal Funding Accountability Act (FFATA)"
        onClick={() => analyticsEventHandler(page, 'Federal Funding Accountability Act (FFATA)')}
      >
        Federal Funding Accountability Act (FFATA)
      </CustomLink>
    ),
    digitalAccountabilityAndTransparencyAct: (
      <CustomLink
        url="https://www.congress.gov/113/bills/s994/BILLS-113s994enr.pdf"
        id="Digital Accountability and Transparency Act of 2014 (DATA Act)"
        onClick={() => analyticsEventHandler(page, 'Digital Accountability and Transparency Act of 2014 (DATA Act)')}
      >
        Digital Accountability and Transparency Act of 2014 (DATA Act)
      </CustomLink>
    ),
    usaSpending: (
      <CustomLink url="https://www.usaspending.gov" id="USAspending.gov" onClick={() => analyticsEventHandler(page, 'USAspending.gov')}>
        USAspending.gov
      </CustomLink>
    ),
    combinedStatementDataset: (
      <CustomLink
        url="/datasets/combined-statement"
        id="Combined Statement of Receipts, Outlays, and Balances"
        onClick={() => analyticsEventHandler(page, 'Combined Statement of Receipts, Outlays, and Balances')}
      >
        Combined Statement of Receipts, Outlays, and Balances
      </CustomLink>
    ),
    monthlyTreasuryStatementDataset: (
      <CustomLink
        url="/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government"
        id="Monthly Treasury Statement"
        onClick={() => analyticsEventHandler(page, 'Monthly Treasury Statement')}
      >
        Monthly Treasury Statement
      </CustomLink>
    ),
    historicalDebtOutstandingDataset: (
      <CustomLink
        url="datasets/historical-debt-outstanding/historical-debt-outstanding"
        id="Historical Debt Outstanding"
        onClick={() => analyticsEventHandler(page, 'Historical Debt Outstanding')}
      >
        Historical Debt Outstanding
      </CustomLink>
    ),
    debtLink: (
      <CustomLink url="/americas-finance-guide/national-debt/" id="National Debt" onClick={() => analyticsEventHandler(page, 'National Debt')}>
        debt
      </CustomLink>
    ),
    spendingLink: (
      <CustomLink
        url="/americas-finance-guide/federal-spending"
        id="Federal Spending"
        onClick={() => analyticsEventHandler(page, 'Federal Spending')}
      >
        spending
      </CustomLink>
    ),
    revenueLink: (
      <CustomLink
        url="/americas-finance-guide/government-revenue"
        id="Government Revenue"
        onClick={() => analyticsEventHandler(page, 'Government Revenue')}
      >
        revenue
      </CustomLink>
    ),
    deficitLink: (
      <CustomLink
        url="/americas-finance-guide/national-deficit"
        id="National Deficit"
        onClick={() => analyticsEventHandler('National Deficit', 'Debt Citation Click')}
      >
        deficit
      </CustomLink>
    ),
  };
};

export const featuredContentCitationsMap = {
  'story-of-data-transparency': featuredContentCitations('The Story of Data Transparency'),
};
