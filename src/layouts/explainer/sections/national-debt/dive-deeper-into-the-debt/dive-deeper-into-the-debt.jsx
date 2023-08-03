import LearnMoreSection from '../../../explainer-components/learn-more/learn-more-section';
import { debtLearnMoreLinks } from '../../../explainer-helpers/national-debt/national-debt-helper';
import benFranklin from '../../../../../images/ben-franklin.png';
import alexanderHamilton from '../../../../../images/alexander-hamilton.png';
import React from 'react';
import {
  diveDeeperCitation,
  diveDeeperQuote,
  diveDeeperQuoteLeft,
  diveDeeperQuoteRight,
  diveDeeperLink
} from './dive-deeper-into-the-debt.module.scss';


const DiveDeeperIntoTheDebt = () => {
  const description = 'For more information about the national debt, please explore more of ' +
    'Fiscal Data and check out the extensive resources listed below.';
  return (
    <>
      <div className={diveDeeperLink}>
        <LearnMoreSection
          links={debtLearnMoreLinks}
          description={description}
        />
      </div>
      <div className={diveDeeperQuoteRight}>
        <img src={benFranklin} alt="" />
        <div>
          <div className={diveDeeperQuote}>
            “Rather go to bed without dinner than to rise in debt.”
          </div>
          <div className={diveDeeperCitation}>
            Benjamin Franklin, statesman, civic leader, and diplomat
          </div>
        </div>
      </div>
      <div className={diveDeeperQuoteLeft}>
        <div>
          <div className={diveDeeperQuote}>
            “The necessity for borrowing in particular emergencies cannot be
            doubted, so on the other, it is equally evident that, to be able to
            borrow upon good terms, it is essential that the credit of the nation
            should be well established.”
          </div>
          <div className={diveDeeperCitation}>
            Alexander Hamilton, 1st U.S. Treasury Secretary
          </div>
        </div>
        <img src={alexanderHamilton} alt="" />
      </div>
    </>
  );
}

export default DiveDeeperIntoTheDebt;
