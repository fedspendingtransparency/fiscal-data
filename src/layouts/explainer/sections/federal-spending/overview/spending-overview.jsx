import React, {useEffect, useState} from "react";
import CustomLink from "../../../../../components/links/custom-link/custom-link";
import {visWithCallout} from "../../../explainer.module.scss";
import VisualizationCallout
  from "../../../../../components/visualization-callout/visualization-callout";
import GlossaryPopoverDefinition from "../../../../../components/glossary/glossary-term/glossary-popover-definition"
import {
  spendingExplainerPrimary,
  spendingExplainerSecondary,
  spendingExplainerLightSecondary,
} from "../federal-spending.module.scss"
import QuoteBox from "../../../quote-box/quote-box"
import { faFlagUsa } from "@fortawesome/free-solid-svg-icons"
import {apiPrefix, basicFetch} from "../../../../../utils/api-utils";
import {getShortForm} from "../../../../../utils/rounding-utils";
export const SpendingOverview = ({ glossary, glossaryClickHandler }) => {
  const [latestCompleteFiscalYear, setLatestCompleteFiscalYear] = useState(null);
  const [priorYearSpending, setPriorYearSpending] = useState(null);
  const [spendingChange, setSpendingChange] = useState(null);
  const [deficitTerm, setDeficitTerm] = useState(null);

  const deficit = (
    <CustomLink url="/americas-finance-guide/national-deficit/" id="National Deficit">
      national deficit
    </CustomLink>
  )
  const usaSpending =
    <CustomLink
      url={'https://www.usaspending.gov/explorer'}
      eventNumber="11"
    >
      USAspending.gov
    </CustomLink>;

  const objectClass = (
    <GlossaryPopoverDefinition
      term={"Object Class"}
      page={"Spending explainer"}
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      object class
    </GlossaryPopoverDefinition>
  )

  const budgetFunctions = (
    <GlossaryPopoverDefinition
      term={"Budget Function"}
      page={"Spending explainer"}
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      budget functions
    </GlossaryPopoverDefinition>
  )
  const revenue = (
    <GlossaryPopoverDefinition
      term={"Revenue"}
      page={"Deficit & Spending explainer"}
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      revenue
    </GlossaryPopoverDefinition>
  )

  const agency = (
    <GlossaryPopoverDefinition
      term={"Agency"}
      page={"Spending explainer"}
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      agency
    </GlossaryPopoverDefinition>
  )

  const federalDebt = (
    <GlossaryPopoverDefinition
      term={"Federal Debt"}
      page={"Spending Explainer"}
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      federal debt
    </GlossaryPopoverDefinition>
  )

  useEffect(() => {
    const fields = 'fields=current_fytd_net_outly_amt,prior_fytd_net_outly_amt,record_date,' +
                   'record_calendar_month,record_calendar_year,record_fiscal_year';
    const filter = 'filter=line_code_nbr:eq:5691,record_calendar_month:eq:09';
    const sort = 'sort=-record_date';
    const pagination = 'page[size]=1';
    const endpointUrl = `v1/accounting/mts/mts_table_5?${fields}&${filter}&${sort}&${pagination}`;

    basicFetch(`${apiPrefix}${endpointUrl}`)
      .then((res) => {
        if (res.data) {
          const data = res.data[0];
          setLatestCompleteFiscalYear(data.record_fiscal_year);
          setPriorYearSpending(getShortForm(data.current_fytd_net_outly_amt.toString(), false));
        }
      });
  }, [])

  useEffect(() => {
    const fields =
      'fields=current_fytd_net_outly_amt,record_date,record_calendar_month,record_fiscal_year';
    const filter = 'filter=line_code_nbr:eq:5694,record_calendar_month:eq:09';
    const sort = 'sort=-record_date';
    const pagination = 'page[size]=1';
    const endpointUrl = `v1/accounting/mts/mts_table_5?${fields}&${filter}&${sort}&${pagination}`;

    basicFetch(`${apiPrefix}${endpointUrl}`)
      .then((res) => {
        if (res.data) {
          const data = res.data[0];
          const priorSpending = data.current_fytd_net_outly_amt;
          setSpendingChange(priorSpending < 0 ? 'more' : 'less');
          setDeficitTerm(priorSpending < 0 ? 'deficit' : 'surplus');
        }
      });
  }, [])


  return (
    <>
      <div className={visWithCallout}>
        <div>
          <p>
            The federal government spends money on a variety of goods, programs,
            and services that support the economy and people of the United
            States. The federal government also spends money on the interest it
            has incurred on outstanding {federalDebt}. Consequently, as the debt
            grows, the spending on interest expense also generally grows.
          </p>
          <p>
            If the government spends more than it collects in {revenue}, then
            there is a budget deficit. If the government spends less than it
            collects in revenue, there is a budget surplus. In fiscal year
            (FY) {latestCompleteFiscalYear}, the government spent ${priorYearSpending},
            which was {spendingChange} than it collected (revenue), resulting
            in a {deficitTerm}. Visit the {deficit} explainer to see how the
            deficit and revenue compare to federal spending.
          </p>
          <p>
            Federal government spending pays for everything from Social Security
            and Medicare to military equipment, highway maintenance, building
            construction, research, and education. This spending can be broken
            down into two primary categories: mandatory and discretionary. These
            purchases can also be classified by {objectClass} and{" "}
            {budgetFunctions}.
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
      <QuoteBox
        icon={faFlagUsa}
        primaryColor={spendingExplainerSecondary}
        secondaryColor={spendingExplainerLightSecondary}
        customTopMargin={'-1rem'}
      >
        <p>
          According to the Constitution’s Preamble, the purpose of the federal
          government is “…to establish Justice, insure domestic Tranquility,
          provide for the common defense, promote the general Welfare, and
          secure the Blessings of Liberty to ourselves and our Posterity.” These
          goals are achieved through government spending.
        </p>
      </QuoteBox>
    </>
  )
}
