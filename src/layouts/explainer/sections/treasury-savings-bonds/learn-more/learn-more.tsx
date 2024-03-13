import React, { FunctionComponent } from 'react';
import CustomLink from '../../../../../components/links/custom-link/custom-link';
import Footnote from '../../../../../components/footnote/footnote';
import { getSaleBondsFootNotes } from './learn-more-helper';

const LearnMore: FunctionComponent = () => {
  return (
    <>
      <p>
        Today, individuals can buy Series I and Series EE bonds online through{' '}
        <CustomLink url="https://www.treasurydirect.gov/savings-bonds/buy-a-bond/">TreasuryDirect</CustomLink>. TreasuryDirect also offers a feature
        called <CustomLink url="https://treasurydirect.gov/savings-bonds/treasury-hunt/">Treasure Hunt</CustomLink>, which allows users to search to
        see if there are unredeemed bonds in their name.
      </p>
      <Footnote footnotes={getSaleBondsFootNotes} width="100%" />
    </>
  );
};

export default LearnMore;
