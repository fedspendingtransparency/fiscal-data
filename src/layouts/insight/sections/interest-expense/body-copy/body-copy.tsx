import React, { ReactElement } from 'react';
import GlossaryPopoverDefinition from '../../../../../components/glossary/glossary-term/glossary-popover-definition';
import { analyticsEventHandler, insightsCitationsMap } from '../../../../../helpers/insights/insight-helpers';
import { ga4DataLayerPush } from '../../../../../helpers/google-analytics/google-analytics-helper';

const glossaryGAEvent = term => {
  analyticsEventHandler('Interest Expense', term, 'Glossary Term Click');
  ga4DataLayerPush({
    event: `Glossary Term Click`,
    eventLabel: term,
  });
};

const interestExpense = (
  <GlossaryPopoverDefinition term="Interest Expense" page="Interest Expense Insight" handleClick={() => glossaryGAEvent('Interest Expense')}>
    Interest Expense
  </GlossaryPopoverDefinition>
);

const treasurySecurity = (
  <GlossaryPopoverDefinition term="Treasury Security" page="Interest Expense Insight" handleClick={() => glossaryGAEvent('Treasury Security')}>
    Treasury securities
  </GlossaryPopoverDefinition>
);

const federalDebt = (
  <GlossaryPopoverDefinition term="Federal Debt" page="Interest Expense Insight" handleClick={() => glossaryGAEvent('Federal Debt')}>
    federal debt
  </GlossaryPopoverDefinition>
);

const interestRates = (
  <GlossaryPopoverDefinition term="Interest Rates" page="Interest Expense Insight" handleClick={() => glossaryGAEvent('Interest Rates')}>
    interest rates
  </GlossaryPopoverDefinition>
);

export const BodyCopy = (): ReactElement => {
  const { treasurySecurities } = insightsCitationsMap['interest-expense'];

  return (
    <div>
      {interestExpense} is the interest the government pays on its outstanding loans ({treasurySecurity}). It can be referred to as the cost to the
      U.S. for borrowing money. The amount of interest expense depends on the total {federalDebt} and the {interestRates} investors charged when they
      loaned the money. Average interest rates are a useful measure for showing general trends in the interest the government pays on its loans, even
      though the true cost of the loans will vary by security type and by the interest rate for those securities when the loan was taken. To see a
      breakdown of average rates by security, visit the {treasurySecurities} dataset.
    </div>
  );
};
