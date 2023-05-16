import {faChartColumn, faCoins, faHandHoldingDollar} from "@fortawesome/free-solid-svg-icons";
import CustomLink from "../../../../components/links/custom-link/custom-link";
import React from "react";
import reactStringReplace from "react-string-replace";

export const ChartPlaceholder = () => (
  <div
    style={{
      height: 500,
      marginTop: '16px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      backgroundColor: '#555'
    }}
  >
    Placeholder
  </div>
);

const thirdTakeawayText = `To pay for government programs while operating under a deficit, the federal
    government borrows money by selling U.S. Treasury bonds, bills, and other securities.
    The national debt is the accumulation of this borrowing along with associated interest
    owed to investors who purchased these securities.`;

const thirdTakeawayTextWithGlossaryTerm = reactStringReplace(
  thirdTakeawayText,
  'national debt',
  match => {
    return (
      <CustomLink url={"/americas-finance-guide/national-debt/"}>
        {match}
      </CustomLink>
    );
  }
);

export const deficitKeyTakeaways = [
  {
    text: `A budget deficit occurs when the money going out exceeds the money coming in for a
    given period. On this page, we calculate the deficit by the government’s fiscal year.`,
    icon: faChartColumn
  },
  {
    text: `In the last 50 years, the federal government budget has run a surplus five times,
    most recently in 2001.`,
    icon: faCoins
  },
  {
    text: thirdTakeawayTextWithGlossaryTerm,
    icon: faHandHoldingDollar
  }
];

export const deficitLearnMoreLinks = [
  {
    title: 'America’s Fiscal Future',
    url: 'https://www.gao.gov/americas-fiscal-future',
    eventNumber: '19'
  },
  {
    title: 'An Update to the Budget and Economic Outlook: 2021 to 2031',
    url: 'https://www.cbo.gov/publication/57339',
    eventNumber: '20'
  },
  {
    title: 'Congressional Budget Office Topics – Budget',
    url: 'https://www.cbo.gov/topics/budget',
    eventNumber: '21'
  },
  {
    title: 'Federal Deficits, Growing Debt, and the Economy in the Wake of COVID 19',
    url: 'https://crsreports.congress.gov/product/pdf/R/R46729',
    eventNumber: '22'
  },
  {
    title: 'President’s Budget – Historical Tables',
    url: 'https://www.whitehouse.gov/omb/historical-tables/',
    eventNumber: '23'
  },
  {
    title: 'FY 2022 Final Monthly Treasury Statement',
    url: 'https://fiscaldata.treasury.gov/static-data/published-reports/mts/' +
      'MonthlyTreasuryStatement_202209.pdf',
    eventNumber: '24'
  },
];

export const deficitLearnMoreDescription = `For more information about the national deficit, please
  explore more of Fiscal Data and check out the extensive resources listed below.`;

const mst =
  <CustomLink
    url={'/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays-of-' +
    'the-u-s-government'}
    eventNumber='28'
  >
    Monthly Treasury Statement (MTS)
  </CustomLink>;
const github =
  <CustomLink
    url={'https://github.com/fedspendingtransparency/fiscal-data/tree/master/documentation'}
    eventNumber='29'
  >
    GitHub repository
  </CustomLink>;

export const nationalDeficitDataSources = (
  <>
    The {mst} dataset provides all deficit, spending, and revenue values
    on this page. For detailed documentation, users can reference our {github}.
  </>
);
