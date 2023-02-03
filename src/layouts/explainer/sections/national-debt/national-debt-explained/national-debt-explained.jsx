import GlossaryTerm from "../../../../../components/glossary-term/glossary-term";
import VisualizationCallout
  from "../../../../../components/visualization-callout/visualization-callout";
import React from "react";
import { nationalDebtExplainedTextContent } from "./national-debt-explained.module.scss";
import { visWithCallout } from "../../../explainer.module.scss";
import { debtExplainerPrimary } from "../../../../../variables.module.scss";
import { deficitLink } from "../national-debt";
import NationalDebtExplainedTable
  from "./national-debt-explained-table/national-debt-explained-table";
 const NationalDebtExplained = ({ glossary }) => {
  const glossaryTerms = {
    fiscalYear: (
      <GlossaryTerm
        term="Fiscal Year"
        page="Debt explainer"
        glossary={glossary}
      >
        fiscal year (FY)
      </GlossaryTerm>
    ),
    spending: (
      <GlossaryTerm term="Spending" page="Debt explainer" glossary={glossary}>
        spending
      </GlossaryTerm>
    ),
    revenue: (
      <GlossaryTerm term="Revenue" page="Debt explainer" glossary={glossary}>
        revenue
      </GlossaryTerm>
    ),
    deficit: (
      <GlossaryTerm term="Deficit" page="Debt explainer" glossary={glossary}>
        deficit
      </GlossaryTerm>
    ),
    bonds: (
      <GlossaryTerm term="Bonds" page="Debt explainer" glossary={glossary}>
        bonds
      </GlossaryTerm>
    ),
    bills: (
      <GlossaryTerm term="Bills" page="Debt explainer" glossary={glossary}>
        bills
      </GlossaryTerm>
    ),
    notes: (
      <GlossaryTerm term="Notes" page="Debt explainer" glossary={glossary}>
        notes
      </GlossaryTerm>
    ),
    floatingRateNotes: (
      <GlossaryTerm
        term="Floating Rate Notes"
        page="Debt explainer"
        glossary={glossary}
      >
        floating rate notes
      </GlossaryTerm>
    ),
    tips: (
      <GlossaryTerm
        term="Treasury Inflation Protected Securities (TIPS)"
        page="Debt explainer"
        glossary={glossary}
      >
        Treasury inflation-protected securities (TIPS)
      </GlossaryTerm>
    ),
  };

  return (
    <>
      <div className={visWithCallout}>
        <div className={nationalDebtExplainedTextContent}>
          <p>
            The national debt is the amount of money the federal government has
            borrowed to cover the outstanding balance of expenses incurred over
            time. In a given {glossaryTerms.fiscalYear}, when{" "}
            {glossaryTerms.spending} (ex. money for roadways) exceeds{" "}
            {glossaryTerms.revenue} (ex. money from federal income tax), a
            budget {glossaryTerms.deficit} results. To pay for this deficit, the
            federal government borrows money by selling marketable securities
            such as Treasury {glossaryTerms.bonds}, {glossaryTerms.bills},{" "}
            {glossaryTerms.notes}, {glossaryTerms.floatingRateNotes}, and{" "}
            {glossaryTerms.tips}. The national debt is the accumulation of this
            borrowing along with associated interest owed to the investors who
            purchased these securities. As the federal government experiences
            reoccurring deficits, which is common, the national debt grows.
          </p>
          <p>
            Simply put, the national debt is similar to a person using a credit
            card for purchases and not paying off the full balance each month.
            The cost of purchases exceeding the amount paid off represents a {deficitLink},
            while accumulated deficits over time represents a person’s
            overall debt.
          </p>
        </div>
        <VisualizationCallout color={debtExplainerPrimary} >
          <p>
            The U.S. Treasury uses the terms “national debt,” “federal debt,”
            and “public debt” interchangeably.
          </p>
        </VisualizationCallout>
      </div>
      <NationalDebtExplainedTable />
    </>
  );
};

export default NationalDebtExplained;
