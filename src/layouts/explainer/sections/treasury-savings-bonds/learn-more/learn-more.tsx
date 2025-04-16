import React from 'react';
import CustomLink from '../../../../../components/links/custom-link/custom-link';
import Footnote from '../../../../../components/footnote/footnote';
import { getSaleBondsFootNotes } from './learn-more-helper';
import { analyticsEventHandler } from '../../../explainer-helpers/explainer-helpers';

const LearnMore: React.FC = () => {
  const links = {
    treasury: (
      <CustomLink
        url="https://www.treasurydirect.gov/savings-bonds/buy-a-bond/"
        id="TreasuryDirect"
        onClick={() => analyticsEventHandler('TreasuryDirect', 'Savings Bonds Citation Click')}
      >
        TreasuryDirect
      </CustomLink>
    ),
    hunt: (
      <CustomLink
        url="https://treasurydirect.gov/savings-bonds/treasury-hunt/"
        id="Treasury Hunt"
        onClick={() => analyticsEventHandler('Treasury Hunt', 'Savings Bonds Citation Click')}
      >
        Treasury Hunt
      </CustomLink>
    ),
  };

  const handleBackToContentClick = () => {
    analyticsEventHandler('Savings Bonds - Footnote Click', 'Footnote Click');
  };

  return (
    <>
      <p>
        Today, individuals can buy Series I and Series EE bonds online through {links['treasury']}. TreasuryDirect also offers a feature called{' '}
        {links['hunt']}, which allows users to search to see if there are unredeemed bonds in their name.
      </p>
      <Footnote footnotes={getSaleBondsFootNotes()} width="100%" onBackToContentClick={handleBackToContentClick} id="Back to Content" />
    </>
  );
};

export default LearnMore;
