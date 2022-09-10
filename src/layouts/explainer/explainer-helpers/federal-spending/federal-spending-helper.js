import React from "react"
import {
  faHandHoldingDollar,
  faCommentDollar,
  faPiggyBank,
} from "@fortawesome/free-solid-svg-icons"
import CustomLink from "../../../../components/links/custom-link/custom-link"

export const ChartPlaceholder = () => (
  <div
    style={{
      height: 500,
      marginTop: "16px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff",
      backgroundColor: "#555",
      marginBottom: "2rem",
    }}
  >
    Placeholder
  </div>
)

export const spendingKeyTakeaways = [
  {
    text: `The federal government spends money on a variety of goods, programs, and services to
    support the American public and pay interest incurred from borrowing. In fiscal year (FY) {YYYY
    (latest complete fiscal year)}, the government spent {$XX.X trillion}, which was {more/less}
    than it collected (revenue), resulting in a {deficit/surplus}. `,
    icon: faHandHoldingDollar,
    hasGlossaryTerm: true,
    glossaryString: "fiscal year (FY)",
    glossaryTerm: "fiscal year",
    page: "Debt & Spending explainer",
  },
  {
    text: `The U.S. Constitution gives Congress the ability to create a federal budget – in other
    words, to determine how much money the government can spend over the course of the upcoming
    fiscal year.  Congress’s budget is then approved by the President. Every year, Congress decides
     the amount and the type of discretionary spending, as well as provides resources for mandatory
     spending.`,
    icon: faCommentDollar,
    hasGlossaryTerm: true,
    glossaryRegex: /\b(discretionary|mandatory)\b/g,
    page: "Spending Explainer",
  },
  {
    text: `Money for federal spending primarily comes from government tax collection and borrowing.
    In FY {YYYY (latest complete fiscal year)} government spending equated to roughly {$X (Spending
    to GDP Ratio)} out of every $10 of the goods produced and services provided in the
    United States.`,
    icon: faPiggyBank,
    page: "Spending Explainer",
  },
]

const mts = (
  <CustomLink
    url={
      "/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays-of-" +
      "the-u-s-government"
    }
  >
    Monthly Treasury Statement
  </CustomLink>
)

const bls = (
  <CustomLink url={"https://data.bls.gov/timeseries/CUUR0000SA0"}>
    Bureau of Labor Statistics
  </CustomLink>
)

const bea = (
  <CustomLink
    url={
      "https://apps.bea.gov/iTable/iTable.cfm?reqid=19&step=3&isuri=1&nipa_table_list=5&" +
      "categories=survey"
    }
  >
    Bureau of Economic Analysis
  </CustomLink>
)

const github = (
  <CustomLink
    url={
      "https://github.com/fedspendingtransparency/fiscal-data/tree/master/documentation"
    }
  >
    GitHub repository
  </CustomLink>
)

export const federalSpendingDataSources = (
  <>
    The {mts} datasets provide all spending values on this page. Adjustments for
    inflation are calculated using Consumer Price Index values from the {bls}.
    Fiscal year Gross Domestic Product values from the {bea} are calculated by
    averaging four relevant quarterly values from calendar year quarter 4 of the
    prior year through calendar year quarter 3 of the fiscal year shown. For
    detailed documentation, users can reference our {github}.
  </>
)
