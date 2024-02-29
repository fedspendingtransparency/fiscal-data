import React, { FunctionComponent } from 'react';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { fontBodyCopy } from '../../../explainer.module.scss';
import { treasurySavingsBondsExplainerSecondary } from '../treasury-savings-bonds.module.scss';
import QuoteBox from '../../../quote-box/quote-box';
import CustomLink from '../../../../../components/links/custom-link/custom-link';
import ReduceMaturedUnredeemedDebtAccordion
  from './reduce-matured-unredeemed-debt-accordion/reduce-matured-unredeemed-debt-accordion';
import GlossaryPopoverDefinition from '../../../../../components/glossary/glossary-term/glossary-popover-definition';

const SavingsBondsAreFullyMatured: FunctionComponent = () => {
   const glossaryTerms = {
     maturedUnredeemedDebt: (
      <GlossaryPopoverDefinition term="Matured Unredeemed Debt (MUD)" page="Savings Bonds Explainer">
        Matured Unredeemed Debt (MUD)
      </GlossaryPopoverDefinition>
    )
  };

  return (
    <>
      <p>A savings bond can be redeemed any time after at least one year; however, the longer a bond is held
        (up to 30 years), the more it earns. When a savings bond is redeemed after five years, the owner receives
        the original value plus all accrued interest. If a bond is redeemed before five years, the holder loses the
        last three months of interest.
      </p>
      <p>
        Occasionally, bond owners hold onto bonds after they have reached maturity and are no longer earning interest.
        These outstanding but unredeemed bonds are called {glossaryTerms.maturedUnredeemedDebt}. The government continues to be
        responsible for this debt, as it may be redeemed at any time. Therefore, the Treasury has increased efforts to
        encourage bondholders to redeem their matured savings bonds. As of Month YYYY, there were XXX million
        matured unredeemed savings bonds held by investors.
      </p>
      <p>
        If bonds are held past their maturity date, the bonds can lose value due to inflation. To understand how this
        value is lost, see the illustration below.
      </p>

      <div>
        **************** insert pictures here ****************
      </div>

      <QuoteBox
        icon={faMagnifyingGlass as IconProp}
        primaryColor={fontBodyCopy}
        secondaryColor={treasurySavingsBondsExplainerSecondary}
        customTopMargin={'0'}
      >
        <p>
          Could there be a savings bond in your name that you might not know about? Go on a{' '}
          <CustomLink url="https://treasurydirect.gov/savings-bonds/treasury-hunt/">Treasure Hunt</CustomLink> and see
          what bonds might be waiting for you to cash in!
        </p>
      </QuoteBox>
      <ReduceMaturedUnredeemedDebtAccordion/>
    </>
  )
}

export default SavingsBondsAreFullyMatured;
