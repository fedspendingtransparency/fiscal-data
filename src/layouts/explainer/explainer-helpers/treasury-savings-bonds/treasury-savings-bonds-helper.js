import React from 'react';
import CustomLink from '../../../../components/links/custom-link/custom-link';

const est = (
  <CustomLink url="https://fiscaldata.treasury.gov/datasets/electronic-securities-transactions/">Electronic Securities Transactions</CustomLink>
);

const treasuryDirect = (
  <CustomLink url="https://www.treasurydirect.gov/research-center/history-of-savings-bond/savings-bond-sales/">TreasuryDirect</CustomLink>
);

const mspd = (
  <CustomLink
    url="https://fiscaldata.treasury.gov/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding"
    id="U.S. Treasury Monthly Statement of Public Debt"
  >
    U.S. Treasury Monthly Statement of Public Debt (MSPD)
  </CustomLink>
);

const bls = <CustomLink url="https://www.bls.gov/developers/">Bureau of Labor Statistics</CustomLink>;

const tsb = (
  <CustomLink url="https://fiscaldata.treasury.gov/datasets/savings-bonds-issues-redemptions-maturities-by-series/matured-unredeemed-debt">
    U.S. Treasury Savings Bonds: Issues, Redemptions, and Maturities by Series
  </CustomLink>
);

const github = <CustomLink url="https://github.com/fedspendingtransparency/fiscal-data/tree/master/documentation">GitHub repository</CustomLink>;

export const treasurySavingsbondsDataSources = (
  <>
    The number and value of total savings bonds sold since 2001 come from the {est} dataset. {treasuryDirect} provides all sales totals by savings
    bond type prior to 2001. Totals prior to 2001 do not include a one-time adjustment made in the historical dataset to balance totals for accounting
    purposes. Savings bonds sales as a percent of outstanding debt come from the {mspd}. Values reflect the percent of debt held by the public, which
    excludes debt held by the government (Intragovernmental Holdings). Inflation data and adjustments for inflation are calculated using Consumer
    Price Index values from the {bls}. Total redeemed savings bonds and matured unredeemed debt come from the {tsb} dataset. To view detailed
    documentation and the APIs used to power the data and visualizations on this page, visit our {github}.
  </>
);
