import QuoteBox from '../../../quote-box/quote-box';
import { treasurySavingsBondsExplainerSecondary } from '../treasury-savings-bonds.module.scss';
import { faCalculator } from '@fortawesome/free-solid-svg-icons/faCalculator';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import CustomLink from '../../../../../components/links/custom-link/custom-link';
import React, { FunctionComponent } from 'react';
import { fontBodyCopy } from '../../../explainer.module.scss';

const SavingsBondsOverview: FunctionComponent = () => {
  return (
    <>
      <span>
        U.S. Treasury savings bonds are a type of loan issued by the U.S. Department of the Treasury (the Treasury). They are low-risk,
        interest-bearing securities that individuals and investors can purchase directly from the government on{' '}
        <CustomLink url="https://www.treasurydirect.gov/savings-bonds/buy-a-bond/">TreasuryDirect</CustomLink>. Savings bonds are designed to offer a
        safe investment opportunity to ordinary citizens with the hope that by owning shares in their country, people may become more interested in,
        and concerned about national policy.
      </span>
      <QuoteBox
        icon={faCalculator as IconProp}
        primaryColor={fontBodyCopy}
        secondaryColor={treasurySavingsBondsExplainerSecondary}
        customTopMargin={'0'}
      >
        <p>
          Wondering how much your savings bond is worth today? Visit the{' '}
          <CustomLink url="https://www.treasurydirect.gov/savings-bonds/savings-bond-calculator/">Savings Bond Calculator</CustomLink> to price your
          paper bonds or log in to your TreasuryDirect account to determine how much your bond is worth.
        </p>
      </QuoteBox>
    </>
  );
};

export default SavingsBondsOverview;
