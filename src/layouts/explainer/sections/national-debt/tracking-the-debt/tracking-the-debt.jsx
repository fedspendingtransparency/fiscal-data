import React from 'react';
import { explainerCitationsMap } from '../../../explainer-helpers/explainer-helpers';

const TrackingTheDebt = () => {
  const { fiscalService } = explainerCitationsMap['national-debt'];

  return (
    <>
      <p>
        Created in 2012 and operating under the Department of the Treasury, the {fiscalService} manages all federal payments and collections and
        provides government-wide accounting and reporting services. A primary function of the Fiscal Service is to account for and report the national
        debt, as dictated by the U.S. Constitution, which states that “regular Statement and Account of the Receipts and Expenditures of all public
        Money shall be published from time to time.”
      </p>
    </>
  );
};

export default TrackingTheDebt;
