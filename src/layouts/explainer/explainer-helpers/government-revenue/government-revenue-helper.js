import {faCommentDollar, faHandHoldingDollar, faPiggyBank} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import CustomLink from "../../../../components/links/custom-link/custom-link";

export const revenueKeyTakeaways = [
  {
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. `,
    icon: faHandHoldingDollar,
  },
  {
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. `,
    icon: faCommentDollar,
  },
  {
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. `,
    icon: faPiggyBank,
  },
];


const mts = (
  <CustomLink
    url={
      "/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government"
    }
  >
    Monthly Treasury Statement (MTS)
  </CustomLink>
);

const bls =
  <CustomLink
    url={'https://www.bls.gov/developers/'}
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

export const governmentRevenueDataSources = (
  <>
    The {mts} datasets provide all revenue values on this page. Adjustments for inflation are
    calculated using Consumer Price Index values from the {bls}. Fiscal year Gross Domestic Product
    values from the {bea} are calculated by averaging four relevant quarterly values from calendar
    year quarter 4 of the prior year through calendar year quarter 3 of the fiscal year shown.
    For detailed documentation, users can reference our {github}.
  </>
);
