import React from "react";
import CustomLink from "../../../../components/links/custom-link/custom-link";


const mts = (
  <CustomLink
    url="/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government"
    eventNumber="24"
    id="Monthly Treasury Statement"
  >
    Monthly Treasury Statement (MTS)
  </CustomLink>
);

const bls =
  <CustomLink
    url="https://www.bls.gov/developers/"
    eventNumber="25"
  >
    Bureau of Labor Statistics
  </CustomLink>;

const bea =
  <CustomLink
    url="https://apps.bea.gov/iTable/iTable.cfm?reqid=19&step=3&isuri=1&nipa_table_list=5&categories=survey"
    eventNumber="26"
  >
    Bureau of Economic Analysis
  </CustomLink>;

const github =
  <CustomLink
    url="https://github.com/fedspendingtransparency/fiscal-data/tree/master/documentation"
    eventNumber="27"
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
