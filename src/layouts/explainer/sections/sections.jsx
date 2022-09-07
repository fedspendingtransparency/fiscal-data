import React from "react"
import { nationalDeficitDataSources } from "../explainer-helpers/national-deficit/national-deficit-helper"
import nationalDeficitSections from "./national-deficit/national-deficit"
import nationalDebtSections, {
  nationalDebtDataSources,
  nationalDebtDescriptionGenerator,
} from "./national-debt/national-debt"
import federalSpendingSection from "./federal-spending/federal-spending"
import { federalSpendingDataSources } from "../explainer-helpers/federal-spending/federal-spending-helper"
import {
  revenueExplainerPrimary,
  revenueExplainerSecondary,
  revenueExplainerLightSecondary,
} from "../sections/revenue/revenue.module.scss"
import KeyTakeawaysSection from "../explainer-components/key-takeaways/key-takeaways-section"
import { SpendingOverview } from "./federal-spending/overview/spending-overview"
import { SpendingCategories } from "./federal-spending/spending-categories/spending-categories"
import SpendingDifference from "./federal-spending/spending-difference/spending-difference"
import { SpendingTrends } from "./federal-spending/spending-trends/spending-trends"
import { spendingKeyTakeaways } from "../explainer-helpers/federal-spending/federal-spending-helper"
import {
  faHandHoldingDollar,
  faCommentDollar,
  faPiggyBank,
} from "@fortawesome/free-solid-svg-icons"
import { ChartPlaceholder } from "../explainer-helpers/federal-spending/federal-spending-helper"
import Accordion from "../../../components/accordion/accordion"
import QuoteBox from "../quote-box/quote-box"
import { faFlagUsa } from "@fortawesome/free-solid-svg-icons"

const nationalDeficitSectionIds = [
  "key-takeaways1",
  "understanding1",
  "causes-and-sur1pluses",
  "deficit-vs-deb1t",
  "deficit-by-year1",
  "1learn-more",
]

export const revenueKeyTakeaways = [
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
]

const mockRevenueSection = [
  {
    index: 0,
    id: nationalDeficitSectionIds[0],
    title: "Key Takeaways",
    component: (glossary, cpiDataByYear) => (
      <KeyTakeawaysSection
        takeaways={revenueKeyTakeaways}
        primaryColor={revenueExplainerPrimary}
        secondaryColor={revenueExplainerLightSecondary}
      />
    ),
  },

  {
    index: 1,
    id: nationalDeficitSectionIds[1],
    title: "Federal Revenue Overview",
    component: (glossary, cpiDataByYear) =>
      `Where does the money come from? If you lived or worked in the United States in {YYYY (latest complete fiscal year}, most likely your contributions are part of the {$X.XX trillion} collected in revenue. The federal government collects revenue from a variety of sources, including individual income taxes, payroll taxes, corporate income taxes, and excise taxes from people who live, work, or do business in the United States each fiscal year. It also collects revenue from services like admission to national parks and customs duties. In FY {YYYY (latest complete fiscal year)}, the federal government spent {$X.XX trillion}. Since the government spent {more/less} than it collected, the {deficit/surplus} for {YYYY (latest complete fiscal year)} was {$X.XX trillion}.  `,
  },

  {
    index: 2,
    id: nationalDeficitSectionIds[2],
    title: "Sources of Federal Revenue",
    component: (glossary, cpiDataByYear) => {
      return (
        <>
          <div>
            {`Most of the revenue the government collects comes from contributions from individual taxpayers, small businesses, and corporations through taxes that get collected on a yearly or quarterly basis. The remaining sources of federal revenue consist of excise, estate, and other taxes and fees.  So far in FY {YYYY (current fiscal year)}, individual income taxes have accounted for {XX.X%} of total revenue, and Social Security and Medicare taxes made up another {XX.X%}. Government revenue also comes from payments to federal agencies like the U.S. Department of the Interior. Have you visited a national park recently? Did you know your national park entry fee also applies to government revenue? Other agencies generate revenue from leases, the sale of natural resources, and various usage and licensing fees. `}
          </div>
          <ChartPlaceholder></ChartPlaceholder>
          <Accordion title="Why does the Federal Reserve send money to the federal government?">
            TODO
          </Accordion>
          <div>
            <h3>Social Security and Medicare Taxes </h3>
            You may recognize taxes on your paycheck for Social Security and
            Medicare. Unlike personal income taxes, these taxes are used to help
            fund specific social service programs. Funds are collected from your
            paycheck, and in most cases, matched by your employer, and then
            divided into the various trust fund accounts. Social Security has
            two trust fund accounts: the Old Age and Survivors Insurance Trust
            Fund (OASI) and the Disability Trust Fund (DI). The funds in these
            accounts are responsible for providing workers and their families
            with retirement, disability, and survivor's insurance benefits.
            Medicare also has two accounts: the Hospital Insurance Trust Fund
            (HI), also known as Medicare Part A, and the Supplementary Medicare
            Insurance Trust Fund (SMI). These funds pay for hospital, home
            health, skilled nursing, and hospice care for the elderly and
            disabled.
          </div>
          <QuoteBox
            icon={faFlagUsa}
            primaryColor={revenueExplainerPrimary}
            secondaryColor={revenueExplainerSecondary}
          >
            <p>
              According to the Constitution’s Preamble, the purpose of the
              federal government is “…to establish Justice, insure domestic
              Tranquility, provide for the common defense, promote the general
              Welfare, and secure the Blessings of Liberty to ourselves and our
              Posterity.” These goals are achieved through government spending.
            </p>
          </QuoteBox>
        </>
      )
    },
  },
  {
    index: 3,
    id: nationalDeficitSectionIds[3],
    title: "Federal Revenue Trends Over Time",
    component: (glossary, cpiDataByYear) => {
      return (
        <>
          <div>
            The majority of federal revenue comes from individual and corporate
            income taxes as well as social insurance taxes. When individuals and
            corporations earn more money, they pay more in taxes, and thus
            federal revenue increases. Alternatively, if they make the same
            amount, but tax rates increase, the federal revenue will also
            increase. Decreases in federal revenue are largely due to either
            individuals or corporations making less money or a decrease in tax
            rates. Changes in other sources of revenue can be due to changes in
            other tax laws. If the U.S. government increases tariffs on imports
            from a particular country or countries, it could increase revenues,
            depending on the level of trade the U.S. continues to do with those
            countries. This isn’t always the case, however. If tariffs increase
            and U.S. consumers import fewer goods as a result of the higher
            prices, then revenue from customs duties could decrease overall. The
            chart below shows how federal revenue has changed over time, broken
            out by the various source categories.{" "}
          </div>
          <ChartPlaceholder />
        </>
      )
    },
  },
  {
    index: 4,
    id: nationalDeficitSectionIds[4],
    title: "Federal Revenue Trends and the U.S. Economy",
    component: (glossary, cpiDataByYear) => {
      return (
        <>
          <div>
            {`In fiscal year {YYYY}, federal revenue was equal to {XX.X%} of total gross domestic product (GDP), or economic activity, of the United States that year {$XX.XX trillion}. Why do we compare federal revenue to gross domestic product? First, the comparison serves as a rough gauge of the size of the federal government's footprint related to size of the entire country's economic activity. In addition, federal taxes are based on a percentage of income for people and businesses. If an economy is performing well, people and businesses earn more, and federal revenue from taxes increases. `}
          </div>
          <ChartPlaceholder />
        </>
      )
    },
  },
]
const explainerSections = {
  "national-debt": nationalDebtSections,
  "national-deficit": nationalDeficitSections,
  "federal-spending": federalSpendingSection,
  "government-revenue": mockRevenueSection,
}
export const explainerDataSources = {
  "national-debt": nationalDebtDataSources,
  "national-deficit": nationalDeficitDataSources,
  "federal-spending": federalSpendingDataSources,
  "government-revenue": federalSpendingDataSources,
}

export const explainerDescriptionGenerators = {
  "national-debt": nationalDebtDescriptionGenerator,
}

export default explainerSections
