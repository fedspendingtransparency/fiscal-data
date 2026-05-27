import React from 'react';
import CustomLink from '../../../../components/links/custom-link/custom-link';
import { analyticsEventHandler } from '../explainer-helpers';

const est = (
  <CustomLink
    url="/datasets/electronic-securities-transactions/"
    onClick={() => analyticsEventHandler('Electronic Securities Transactions', 'Savings Bonds Citation Click')}
  >
    Electronic Securities Transactions
  </CustomLink>
);

const treasuryDirect = (
  <CustomLink
    url="https://www.treasurydirect.gov/research-center/history-of-savings-bond/savings-bond-sales/"
    onClick={() => analyticsEventHandler('Savings Bond Sales', 'Savings Bonds Citation Click')}
  >
    TreasuryDirect
  </CustomLink>
);

const mspd = (
  <CustomLink
    url="/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding"
    id="U.S. Treasury Monthly Statement of Public Debt"
    onClick={() => analyticsEventHandler('U.S. Treasury Monthly Statement of Public Debt', 'Savings Bonds Citation Click')}
  >
    U.S. Treasury Monthly Statement of Public Debt (MSPD)
  </CustomLink>
);

const bls = (
  <CustomLink
    url="https://www.bls.gov/developers/"
    onClick={() => analyticsEventHandler('Bureau of Labor Statistics', 'Savings Bonds Citation Click')}
  >
    Bureau of Labor Statistics
  </CustomLink>
);

const tsb = (
  <CustomLink
    url="/datasets/savings-bonds-issues-redemptions-maturities-by-series/matured-unredeemed-debt"
    onClick={() => analyticsEventHandler('Matured Unredeemed Debt', 'Savings Bonds Citation Click')}
  >
    U.S. Treasury Savings Bonds: Issues, Redemptions, and Maturities by Series
  </CustomLink>
);

const github = (
  <CustomLink
    url="https://github.com/fedspendingtransparency/fiscal-data/tree/master/documentation"
    onClick={() => analyticsEventHandler('GitHub repository', 'Savings Bonds Citation Click')}
  >
    GitHub repository
  </CustomLink>
);

export const treasurySavingsbondsDataSources = (
  <>
    The number and value of total savings bonds sold since 2001 come from the {est} dataset. {treasuryDirect} provides all sales totals by savings
    bond type prior to 2001. Totals prior to 2001 do not include a one-time adjustment made in the historical dataset to balance totals for accounting
    purposes. Savings bonds sales as a percent of outstanding debt come from the {mspd}. Values reflect the percent of debt held by the public, which
    excludes debt held by the government (Intragovernmental Holdings). Inflation data and adjustments for inflation are calculated using Consumer
    Price Index (CPI) values from the {bls}. If CPI data is delayed or missing, the latest available value for the given month is used.
    Total redeemed savings bonds and matured unredeemed debt come from the {tsb} dataset. To view detailed
    documentation and the APIs used to power the data and visualizations on this page, visit our {github}.
  </>
);
