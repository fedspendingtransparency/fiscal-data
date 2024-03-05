import React, { FunctionComponent } from 'react';
import CustomLink from '../../../../../components/links/custom-link/custom-link';

const LearnMore: FunctionComponent = () => {
  return (
    <>
      <p>
        Today, individuals can buy Series I and Series EE bonds online through{' '}
        <CustomLink url="https://www.treasurydirect.gov/savings-bonds/buy-a-bond/">TreasuyDirect.gov</CustomLink>.
        TreasuryDirect also offers a feature called{' '}
        <CustomLink url="https://treasurydirect.gov/savings-bonds/treasury-hunt/">Treasure Hunt</CustomLink>, which allows users to search to see if there are unredeemed bonds in their name.
      </p>
    </>
  )
};

export default LearnMore;
