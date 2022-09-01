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
