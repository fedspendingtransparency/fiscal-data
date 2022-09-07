import KeyTakeawaysSection from "../../explainer-components/key-takeaways/key-takeaways-section";
import {
  revenueExplainerLightSecondary,
  revenueExplainerPrimary,
  revenueExplainerSecondary
} from "./revenue.module.scss";
import {ChartPlaceholder} from "../../explainer-helpers/federal-spending/federal-spending-helper";
import Accordion from "../../../../components/accordion/accordion";
import QuoteBox from "../../quote-box/quote-box";
import {faFlagUsa} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {revenueKeyTakeaways} from "../sections";


const governmentRevenueSectionIds = [
  "key-takeaways",
  "federal-revenue-overview",
  "sources-of-federal-revenue",
  "federal-revenue-trends-over-time",
  "federal-revenue-trends-and-us-economy"
]


const governmentRevenueSections = [
  {
    index: 0,
    id: governmentRevenueSectionIds[0],
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
    id: governmentRevenueSectionIds[1],
    title: "Federal Revenue Overview",
    component: (glossary, cpiDataByYear) =>
      `Where does the money come from? If you lived or worked in the United States in {YYYY (latest complete fiscal year}, most likely your contributions are part of the {$X.XX trillion} collected in revenue. The federal government collects revenue from a variety of sources, including individual income taxes, payroll taxes, corporate income taxes, and excise taxes from people who live, work, or do business in the United States each fiscal year. It also collects revenue from services like admission to national parks and customs duties. In FY {YYYY (latest complete fiscal year)}, the federal government spent {$X.XX trillion}. Since the government spent {more/less} than it collected, the {deficit/surplus} for {YYYY (latest complete fiscal year)} was {$X.XX trillion}.  `,
  },

  {
    index: 2,
    id: governmentRevenueSectionIds[2],
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
    id: governmentRevenueSectionIds[3],
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
    id: governmentRevenueSectionIds[4],
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

export default governmentRevenueSections;
