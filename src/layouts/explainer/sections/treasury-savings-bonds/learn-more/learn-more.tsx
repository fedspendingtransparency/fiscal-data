import React, { useState } from 'react';
import CustomLink from '../../../../../components/links/custom-link/custom-link';
import Footnote from '../../../../../components/footnote/footnote';
import { getSaleBondsFootNotes } from './learn-more-helper';
<<<<<<< HEAD
=======
import AnchorText from '../../../../../components/anchor-text/anchor-text';
import { analyticsEventHandler } from '../../../explainer-helpers/explainer-helpers';
>>>>>>> ef661e57d (FDG-10171)

const LearnMore: React.FC = () => {
  const [lastAnchorClicked, setLastAnchorClicked] = useState<string | null>(null);

  const handleAnchorClick = (anchorId: string) => {
    setLastAnchorClicked(anchorId);
  };

  const handleBackToContentClick = () => {
    if (lastAnchorClicked) {
      const anchorEl = document.getElementById(lastAnchorClicked);
      if (anchorEl) {
        anchorEl.scrollIntoView({ behavior: 'smooth' });
        anchorEl.focus();
      }
      setLastAnchorClicked(null);
    }
  };

  const links = {
    treasury: (
      <CustomLink
        url="https://www.treasurydirect.gov/savings-bonds/buy-a-bond/"
        onClick={() => analyticsEventHandler('TreasuryDirect', 'Savings Bonds Citation Click')}
      >
        TreasuryDirect
      </CustomLink>
    ),
    hunt: (
      <CustomLink
        url="https://treasurydirect.gov/savings-bonds/treasury-hunt/"
        onClick={() => analyticsEventHandler('Treasury Hunt', 'Savings Bonds Citation Click')}
      >
        Treasury Hunt
      </CustomLink>
    ),
  };

  return (
    <>
      <p>
        Today, individuals can buy Series I and Series EE bonds online through {links['treasury']}. TreasuryDirect also offers a feature called{' '}
        {links['hunt']}, which allows users to search to see if there are unredeemed bonds in their name.
      </p>
      <Footnote footnotes={getSaleBondsFootNotes()} width="100%" onBackToContentClick={handleBackToContentClick} />
    </>
  );
};

export default LearnMore;
