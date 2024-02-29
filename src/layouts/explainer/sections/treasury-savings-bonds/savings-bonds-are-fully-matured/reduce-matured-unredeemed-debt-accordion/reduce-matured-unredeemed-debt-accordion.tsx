import React from "react";
import Accordion from '../../../../../../components/accordion/accordion';
import GlossaryPopoverDefinition from '../../../../../../components/glossary/glossary-term/glossary-popover-definition';

const ReduceMaturedUnredeemedDebtAccordion = () => {
  const glossaryTerms = {
    maturedUnredeemedDebt: (
      <GlossaryPopoverDefinition term="Matured" page="Debt explainer">
        fiscal year (FY)
      </GlossaryPopoverDefinition>
    )
  };

  return (
    <>
      <div>
        <Accordion
          title="What is the Treasury Doing to Reduce Matured Unredeemed Debt?"
          altStyleAccordion={{ padding: '9px 16px' }}
          // containerClass={fundingProgramAccordion}
          openEventNumber="11"
          closeEventNumber="12"
          explainerGAEvent="Debt"
        >
          <div>
            <p>
              Treasury’s efforts to increase the redemption of MUD are complicated by issues such as the age and
              quality of MUD records, a paper-based redemption process, as well as reluctance by some bond owners to
              redeem their bonds. Treasury has been working for more than a decade to implement new techniques and
              technologies to reduce the amount of MUD and ensure that the public can access and redeem their matured bonds.
            </p>
          </div>
        </Accordion>
      </div>
    </>
  )
}

export default ReduceMaturedUnredeemedDebtAccordion;
