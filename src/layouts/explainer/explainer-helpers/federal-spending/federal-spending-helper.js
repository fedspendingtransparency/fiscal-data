import {faHandHoldingDollar, faCommentDollar, faPiggyBank} from "@fortawesome/free-solid-svg-icons";
import CustomLink from "../../../../components/links/custom-link/custom-link";
import React from "react";

export const ChartPlaceholder = () => (
  <div
    style={{
      height: 500,
      marginTop: '16px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      backgroundColor: '#555',
      marginBottom: '2rem'
    }}
  >
    Placeholder
  </div>
);

export const spendingKeyTakeaways = [
  {
    text: `The primary sources of revenue for the U.S. government are taxes on individual and corporate income, Social Security, and Medicare. This income is used to fund a variety of goods, programs, and services to support the American public and pay interest incurred from borrowing. Revenue is typically measured by fiscal year (FY).`,
    icon: faHandHoldingDollar,
  },
  {
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. `,
    icon: faCommentDollar,
  },
  {
    text:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    icon: faPiggyBank,
  },
];


const mts =
  <CustomLink
    url={'/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays-of-' +
    'the-u-s-government'}
  >
    Monthly Treasury Statement (MTS)
  </CustomLink>;

const bls =
  <CustomLink
    url={'https://data.bls.gov/timeseries/CUUR0000SA0'}
  >
    Bureau of Labor Statistics
  </CustomLink>;

const bea =
  <CustomLink
    url={'https://apps.bea.gov/iTable/iTable.cfm?reqid=19&step=3&isuri=1&nipa_table_list=5&' +
    'categories=survey'}
  >
    Bureau of Economic Analysis
  </CustomLink>;

const github =
  <CustomLink
    url={'https://github.com/fedspendingtransparency/fiscal-data/tree/master/documentation'}
  >
    GitHub repository
  </CustomLink>;

export const federalSpendingDataSources = (
  <>
    The {mts} datasets provide all spending values on this page. Adjustments for inflation are
    calculated using Consumer Price Index values from the {bls}. Fiscal year Gross Domestic Product
    values from the {bea} are calculated by averaging four relevant quarterly values from calendar
    year quarter 4 of the prior year through calendar year quarter 3 of the fiscal year shown. For
    detailed documentation, users can reference our {github}.
  </>
);
