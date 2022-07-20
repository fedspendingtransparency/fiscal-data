import {
  deficitDebtDifferenceContent,
  deficitDebtDifferenceVisContainer,
  deficitExplainerPrimary,
  deficitAccordion
} from "../national-deficit.module.scss";
import Accordion from "../../../../../components/accordion/accordion";
import React from "react";
import {ChartPlaceholder} from "../../../explainer-helpers/national-deficit-helper";
import CustomLink from "../../../../../components/links/custom-link/custom-link";

export const DebtDeficitDifference = () => {

  const nationalDebtLink =
    <CustomLink url={'/national-debt/'} >
      National Debt Explainer
    </CustomLink>
  return (
    <>
      <div className={deficitDebtDifferenceContent} data-testid={'textContent'}>
        <p>
          The terms deficit and debt are frequently used when discussing the nation’s finances and
          are often confused with one another.
        </p>
        <p>
          To pay for a deficit, the federal government borrows money by selling Treasury bonds,
          bills, and other securities. The national debt is the accumulation of this borrowing along
          with associated interest owed to the investors who purchased these securities. As the
          federal government experiences reoccurring deficits, which are common, the national debt
          grows. To learn more about the national debt, visit the {nationalDebtLink}.
        </p>
        <p>
          The visualization below shows how deficits from previous years are added to the current
          year’s deficit to equal total debt. This illustration is simplified to show how debt and
          deficit are different. In reality, the U.S. government must pay interest on the national
          debt. This interest expense increases spending each year, increasing spending (and thus,
          deficits) as the debt grows.
        </p>
        <div className={deficitDebtDifferenceVisContainer} data-testid={'chart'}>
          <ChartPlaceholder  />
        </div>
        <div className={deficitAccordion}>
          <Accordion
            title="How else does the federal government finance a deficit?"
            altStyleAccordion={{
              borderColor:deficitExplainerPrimary,
              borderWidth:'1px'
            }}
          >
            <p>
              The government also uses operating cash available from an account at the Federal
              Reserve to pay for the deficit. This would be similar to a business using a line
              of credit from a bank to finance spending for a large project such as building a
              factory.
            </p>
          </Accordion>
        </div>
      </div>
    </>
  )
};

export default DebtDeficitDifference;
