import React from "react"
import CustomLink from "../../../../../components/links/custom-link/custom-link"
import { visWithCallout } from "../../../explainer.module.scss"
import VisualizationCallout from "../../../../../components/visualization-callout/visualization-callout"
import { spendingExplainerPrimary } from "../federal-spending.module.scss"
import reactStringReplace from "react-string-replace"
import GlossaryTerm from "../../../../../components/glossary-term/glossary-term"
import { toTitleCase } from "../../../explainer-components/key-takeaways/key-takeaways-section"
export const SpendingOverview = ({ glossary }) => {
  const deficit = (
    <CustomLink url={"/national-deficit/"}>national deficit</CustomLink>
  )

  const objectClass = (
    <GlossaryTerm
      term={"Object Class"}
      page={"Spending explainer"}
      glossary={glossary}
    >
      object class
    </GlossaryTerm>
  )

  const budgetFunctions = (
    <GlossaryTerm
      term={"Budget Function"}
      page={"Spending explainer"}
      glossary={glossary}
    >
      budget functions
    </GlossaryTerm>
  )
  const revenue = (
    <GlossaryTerm
      term={"Revenue"}
      page={"Deficit & Spending explainer"}
      glossary={glossary}
    >
      revenue
    </GlossaryTerm>
  )

  const agency = (
    <GlossaryTerm
      term={"Agency"}
      page={"Spending explainer"}
      glossary={glossary}
    >
      agency
    </GlossaryTerm>
  )
  const usaSpending = (
    <CustomLink url={"https://www.usaspending.gov/explorer"}>
      USAspending.gov
    </CustomLink>
  )
  let content = `The federal government spends money on a variety of goods, programs, and
  services that support the economy and people of the United States. The federal
  government also spends money on the interest it has incurred on outstanding
  federal debt. Consequently, as the debt grows, the spending on interest expense
  also generally grows. If the government spends more than it collects in revenue,
  then there is a budget deficit. If the government spends less than it collects in
  revenue, there is a budget surplus.`

  content = reactStringReplace(content, "federal debt", (match, i) => (
    <GlossaryTerm
      term={toTitleCase(match)}
      page={"Spending Explainer"}
      glossary={glossary}
      key={i}
    >
      {match}
    </GlossaryTerm>
  ))
  return (
    <>
      <div className={visWithCallout}>
        <div>
          <p>{content}</p>
          <p>
            If the government spends more than it collects in {revenue}, then
            there is a budget deficit. If the government spends less than it
            collects in revenue, there is a budget surplus. In fiscal year (FY)
            YYYY (latest complete fiscal year), the government spent $XX.X
            trillion, which was more/less than it collected (revenue), resulting
            in a deficit/surplus. Visit the {deficit} explainer to see how the
            deficit and revenue compare to federal spending
          </p>
          <p>
            Federal government spending pays for everything from Social Security
            and Medicare to military equipment, highway maintenance, building
            construction, research, and education. This spending can be broken
            down into two primary categories: mandatory and discretionary. These
            purchases can also be classified by {objectClass} and{" "}
            {budgetFunctions}
          </p>
          <p>
            Throughout this page, we use outlays to represent spending. This is
            money that has actually been paid out and not just promised to be
            paid. When issuing a contract or grant, the U.S. government enters a
            binding agreement called an obligation. This means the government
            promises to spend the money, either immediately or in the future. As
            an example, an obligation occurs when a federal {agency} signs a
            contract, awards a grant, purchases a service, or takes other
            actions that require it to make a payment. Obligations do not always
            result in payments being made, which is why we show actual outlays
            that reflect actual spending occurring.
          </p>
          <p>
            To see details on federal obligations, including a breakdown by
            budget function and object class, visit {usaSpending}.
          </p>
        </div>
        <VisualizationCallout
          color={spendingExplainerPrimary}
          textWithCallout={true}
        >
          <p>
            The U.S. Treasury uses the terms “government spending,” “federal
            spending,” “national spending,” and “federal government spending”
            interchangeably to describe spending by the federal government.
          </p>
        </VisualizationCallout>
      </div>
      <p>
        According to the Constitution’s Preamble, the purpose of the federal
        government is “…to establish Justice, insure domestic Tranquility,
        provide for the common defense, promote the general Welfare, and secure
        the Blessings of Liberty to ourselves and our Posterity.” These goals
        are achieved through government spending.
      </p>
    </>
  )
}
