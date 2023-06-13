import {debtAccordion} from "../national-debt.module.scss";
import {debtCeilingAccordion} from "./debt-ceiling.module.scss";
import Accordion from "../../../../../components/accordion/accordion";
import React from "react";

const debtCeilingSectionAccordionTitle =
  "How is the debt ceiling different from a government shutdown?";

const DebtCeilingSection = () => (
  <>
    <p>
      The debt ceiling, or debt limit, is a restriction imposed by Congress on
      the amount of outstanding national debt that the federal government can
      have. The debt ceiling is the amount that the Treasury can borrow to pay
      the bills that have become due and pay for future investments. Once the
      debt ceiling is reached, the federal government cannot increase the amount
      of outstanding debt, losing the ability to pay bills and fund programs and
      services. However, the Treasury can use extraordinary measures authorized
      by Congress to temporarily suspend certain intragovernmental debt allowing
      it to borrow to fund programs or services for a limited amount of time
      after it has reached the ceiling.
    </p>
    <p>
      Since the United States has never defaulted on its obligations, the scope
      of the negative repercussions related to a default are unknown but would
      likely have catastrophic repercussions in the United States and in markets
      across the globe.
    </p>
    <div className={debtAccordion}>
      <Accordion
        title={debtCeilingSectionAccordionTitle}
        containerClass={debtCeilingAccordion}
        openEventNumber="28"
        closeEventNumber="29"
        explainerGAEvent="Debt"
        ga4ID={"debt-ceiling"}
      >
        Government shutdowns occur when annual funding for ongoing federal
        government operations expires, and Congress does not renew it in time.
      </Accordion>
    </div>
  </>
);

export default DebtCeilingSection;
