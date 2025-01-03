import React, { useState, useCallback } from 'react';
import CustomLink from '../../../../../components/links/custom-link/custom-link';
import Footnote from '../../../../../components/footnote/footnote';
import { getSaleBondsFootNotes } from './learn-more-helper';
import AnchorText from '../../../../../components/anchor-text/anchor-text';

const LearnMore: React.FC = () => {
  const [lastAnchorClicked, setLastAnchorClicked] = useState<string | null>(null);

  const handleAnchorClick = useCallback((anchorId: string) => {
    setLastAnchorClicked(anchorId);

    const footnotesEl = document.getElementById('footnote');
    if (footnotesEl) {
      footnotesEl.scrollIntoView({ behavior: 'smooth' });
      footnotesEl.focus();
    }
  }, []);

  const handleBackToContentClick = useCallback(() => {
    if (lastAnchorClicked) {
      const anchorEl = document.getElementById(lastAnchorClicked);
      if (anchorEl) {
        anchorEl.scrollIntoView({ behavior: 'smooth' });
        anchorEl.focus();
      }
      setLastAnchorClicked(null);
    }
  }, [lastAnchorClicked]);

  return (
    <>
      <p>
        Today, individuals can buy Series I and Series EE bonds online through{' '}
        <CustomLink url="https://www.treasurydirect.gov/savings-bonds/buy-a-bond/">TreasuryDirect</CustomLink>. TreasuryDirect also offers a feature
        called <CustomLink url="https://treasurydirect.gov/savings-bonds/treasury-hunt/">Treasury Hunt</CustomLink>, which allows users to search to
        see if there are unredeemed bonds in their name.
      </p>

      <p>
        This is some text referencing a footnote
        <AnchorText link={'savings-bonds-overview'} text={'1'} onAnchorClick={handleAnchorClick} />
      </p>

      <Footnote footnotes={getSaleBondsFootNotes()} width="100%" onBackToContentClick={handleBackToContentClick} />
    </>
  );
};

export default LearnMore;
