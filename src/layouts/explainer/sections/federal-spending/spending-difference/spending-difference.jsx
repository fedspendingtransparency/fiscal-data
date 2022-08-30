import React, {useEffect} from "react";
import {ChartPlaceholder} from
    "../../../explainer-helpers/federal-spending/federal-spending-helper";
import {
  spendingDifferenceContent,
  mandatorySpendingImgStyle,
  mandatorySpendingContainer,
} from "./spending-difference.module.scss";
import {spendingAccordion} from "../federal-spending.module.scss";
import Accordion from "../../../../../components/accordion/accordion";
import {withWindowSize} from "react-fns";
import {pxToNumber} from "../../../../../helpers/styles-helper/styles-helper";
import {breakpointLg} from "../../../../../variables.module.scss";
import MandatorySpendingImgDesktop from "../../../../../../static/images/mandatory-spending_desktop.png";
import MandatorySpendingImgMobile from "../../../../../../static/images/mandatory-spending_mobile.png";

export const SpendingDifference = ({width}) => {
  return (
    <div className={spendingDifferenceContent}>
      <h5>Who controls federal government spending?</h5>
      <p>
        Government spending is broken down into two primary categories: mandatory and discretionary.
        Mandatory spending represents nearly two-thirds of annual federal spending. This type of
        spending does not require an annual vote by Congress. The second major category is
        discretionary spending. The difference between mandatory and discretionary spending
        relates to whether spending is dictated by prior law or voted on in the annual
        appropriations process. Another type of appropriation spending is called Supplemental
        Appropriations, in which spending laws are passed to address needs that have arisen after
        the fiscal year has begun.
      </p>
      <h6>Mandatory Spending</h6>
      <p>
        Mandatory spending, also known as direct spending, is mandated by existing laws. This type
        of spending includes funding for entitlement programs like Medicare and Social Security and
        other payments to people, businesses, and state and local governments. For example, the
        Social Security Act requires the government to provide payments to beneficiaries based on
        the amount of money they’ve earned and other factors. Last amended in 2019, the Social
        Security Act will determine the level of federal spending into the future until it is
        amended again. Due to authorization laws, the funding for these programs must be allocated
        for spending each year, hence the term mandatory.
      </p>

      <div className={mandatorySpendingContainer}>
        <img src={width < pxToNumber(breakpointLg) ? MandatorySpendingImgMobile : MandatorySpendingImgDesktop}
             alt={"Step 1: Existing laws require (mandatory) money for spending each year " +
             "Step 2: The Treasury issues funds to specific agency spending accounts towards contracts, " +
             "loans, grants, direct payments, and other financial assistance " +
             "Step 3: Entitlement program benefits are paid out from these accounts to support " +
             "people, businesses, and state and local governments "}
             data-testid={'mandatorySpendingImg'} className={mandatorySpendingImgStyle}/>
      </div>
      <h6>Discretionary Spending</h6>
      <p>
        Discretionary spending is money formally approved by Congress and the President during the
        appropriations process each year. Generally, Congress allocates over half of the
        discretionary budget towards national defense and the rest to fund the administration of
        other agencies and programs. These programs range from transportation, education, housing,
        and social service programs, as well as science and environmental organizations.
      </p>
      <ChartPlaceholder/>
      <h6>Supplemental Spending</h6>
      <p>
        Supplemental appropriations, also known as supplemental spending, are appropriations enacted
        after the regular annual appropriations when the need for funds is too urgent to wait for
        the next regular appropriations. In 2020, Congress passed four supplemental appropriations
        to aid the nation’s recovery from the COVID-19 pandemic. You can explore the spending
        related to these supplemental appropriation laws in USAspending.gov’s COVID-19 Spending
        Profile page.
      </p>
      <ChartPlaceholder/>
      <div className={spendingAccordion}>
        <Accordion title=" What is the process for determining discretionary spending?">
          Discretionary spending is determined by the president and Congress each year in the
          budget and appropriations process. First, the president creates a budget proposal and
          sends it to Congress. Then, the House and Senate both draft budget resolutions. Congress
          can change funding levels and add or eliminate programs, taxes, and other sources of
          revenue. Once the budget resolutions have been finalized in the House and Senate, Congress
          reconciles the differences and votes on a final budget. The discretionary spending levels
          in the budget are divided among the twelve Appropriations Subcommittees, which then draft
          bills providing funding levels for the departments, bureaus, and agencies within their
          jurisdiction. After the House and Senate agree to a final funding level for each bill,
          they are sent to the president for approval or veto.
        </Accordion>
      </div>
    </div>
  );

}

export default withWindowSize(SpendingDifference);
