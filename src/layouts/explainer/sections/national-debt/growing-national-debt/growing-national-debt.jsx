import {withWindowSize} from "react-fns";
import useBeaGDP from "../../../../../hooks/useBeaGDP";
import GlossaryPopoverDefinition from "../../../../../components/glossary/glossary-term/glossary-popover-definition";
import {postGraphAccordionContainer} from "../national-debt.module.scss";
import DebtOverLast100y from "./debt-over-last-100y-linechart/debt-over-last-100y-linechart";
import {DebtTrendsOverTimeChart} from "./debt-trends-over-time/debt-trends-over-time-chart";
import React from "react";
import {spendingLink} from "../../../explainer-helpers/national-debt-helper";
import {VisualizingTheDebtAccordion} from "./debt-accordion/visualizing-the-debt-accordion";
import { debtExplainerPrimary } from "../../../../../variables.module.scss";
import VisualizationCallout from "../../../../../components/visualization-callout/visualization-callout";
import { visWithCallout } from "../../../explainer.module.scss";

export const GrowingNationalDebtSection = withWindowSize(
  ({ sectionId, glossary, cpiDataByYear, glossaryClickHandler, width }) => {
    const beaGDPData = useBeaGDP(cpiDataByYear);
    const gdp = (
      <GlossaryPopoverDefinition
        term="Gross Domestic Product (GDP)"
        page="Debt explainer"
        glossary={glossary}
        glossaryClickHandler={glossaryClickHandler}
      >
        gross domestic product (GDP)
      </GlossaryPopoverDefinition>
    );

    return (
      <div>
        <p>
          The U.S. has carried debt since its inception. Debts incurred during
          the American Revolutionary War amounted to over $75 million by January
          1, 1791. Over the next 45 years, the debt continued to grow until 1835
          when it notably shrank due to the sale of federally-owned lands and
          cuts to the federal budget. Shortly thereafter, an economic depression
          caused the debt to again grow into the millions. The debt grew over
          4,000% through the course of the American Civil War, increasing from
          $65 million in 1860 to $1 billion in 1863 and around $2.7 billion
          shortly after the conclusion of the war in 1865. The debt grew
          steadily into the 20th century and was roughly $22 billion after the
          country financed its involvement in World War I.
        </p>
        <p>
          Notable recent events triggering large spikes in the debt include the
          Afghanistan and Iraq Wars, the 2008 Great Recession, and the COVID-19
          pandemic. From FY 2019 to FY 2021, {spendingLink('spending')} increased by about 50%,
          largely due to the COVID-19 pandemic. Tax cuts, stimulus programs,
          increased government spending, and decreased tax revenue caused by
          widespread unemployment generally account for sharp rises in the
          national debt.
        </p>
        {!beaGDPData.isGDPLoading && (
          <DebtOverLast100y
            cpiDataByYear={cpiDataByYear}
            beaGDPData={beaGDPData}
          />
        )}
        <p>
          Comparing a country’s debt to its {gdp} reveals the country’s ability
          to pay down its debt. This ratio is considered a better indicator of a
          country’s fiscal situation than just the national debt number because
          it shows the burden of debt relative to the country’s total economic
          output and therefore its ability to repay it. The U.S. debt to GDP
          ratio surpassed 100% in 2013 when both debt and GDP were approximately
          16.7 trillion.
        </p>
        {!beaGDPData.isGDPLoading && (
            <DebtTrendsOverTimeChart sectionId={sectionId} beaGDPData={beaGDPData} width={width} />
        )}
        <div className={postGraphAccordionContainer}>
          <VisualizingTheDebtAccordion width={width} />
        </div>
      </div>
    );
  }
);
