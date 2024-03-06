import React, { FunctionComponent } from 'react';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { fontBodyCopy } from '../../../explainer.module.scss';
import {
  holdingBondsLeft,
  holdingBondsRight,
  holdingBondsContainer,
  holdingBondsHeader,
  holdingBondsFooter,
  image1, image3} from './savings-bonds-are-fully-matured.module.scss';
import {
  mudAccordion,
  postQuoteBoxAccordionContainer,
  treasurySavingsBondsExplainerSecondary,
} from '../treasury-savings-bonds.module.scss';
import QuoteBox from '../../../quote-box/quote-box';
import CustomLink from '../../../../../components/links/custom-link/custom-link';
import GlossaryPopoverDefinition from '../../../../../components/glossary/glossary-term/glossary-popover-definition';
import Accordion from '../../../../../components/accordion/accordion';
import illustration1 from '../../../../../../static/images/savings-bonds/Fully-Matured-Bonds-Story_Illustration-1.svg';
import illustration2 from '../../../../../../static/images/savings-bonds/Fully-Matured-Bonds-Story_Illustration-2.svg';
import illustration3 from '../../../../../../static/images/savings-bonds/Fully-Matured-Bonds-Story_Illustration-3.svg';

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
        These outstanding but unredeemed bonds are called {glossaryTerms.maturedUnredeemedDebt}. The government
        continues to be
        responsible for this debt, as it may be redeemed at any time. Therefore, the Treasury has increased efforts to
        encourage bondholders to redeem their matured savings bonds. As of Month YYYY, there were XXX million
        matured unredeemed savings bonds held by investors.
      </p>
      <p>
        If bonds are held past their maturity date, the bonds can lose value due to inflation. To understand how this
        value is lost, see the illustration below.
      </p>

      <div className={holdingBondsContainer}>
        <div className={holdingBondsHeader}>How Holding onto Matured Bonds can Cost You Money</div>

        <div className={holdingBondsLeft}>
          <div>
            Imagine you bought a series EE bond 30 years ago for $500. After 20 years, it doubled in value ($1,000) and
            continued to earn interest ($600) until reaching maturity after 30 years.
          </div>
          <img src={illustration1} className={image1} alt="" />
        </div>
        <div className={holdingBondsRight}>
          <img src={illustration2} alt="" />
          <div>
            If you redeem your bond today, you can redeem it for $1,600 and spend that on goods or services or reinvest
            that money in a new savings bond.
          </div>
        </div>
        <div className={holdingBondsLeft}>
          <div>
            If you hold onto that bond and don’t redeem it for another 10 years, it will still be worth $1,600, but the
            same goods and services you would have purchased 10 years ago now cost $2,050, effectively losing you $450
            in value.
          </div>
          <img src={illustration3} className={image3} alt="" />
        </div>

        <p className={holdingBondsFooter}>
          *Please note this visual uses fictional data
        </p>
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

      <div className={postQuoteBoxAccordionContainer}>
        <div className={mudAccordion}>
          <Accordion
            title="What is the Treasury Doing to Reduce Matured Unredeemed Debt?"
            openEventNumber="26"
            closeEventNumber="27"
            explainerGAEvent="Debt"
            ga4ID="print-money"
          >
            Treasury’s efforts to increase the redemption of MUD are complicated by issues such as the age and quality
            of MUD records, a paper-based redemption process, as well as reluctance by some bond owners to redeem their
            bonds. Treasury has been working for more than a decade to implement new techniques and technologies to
            reduce the amount of MUD and ensure that the public can access and redeem their matured bonds.
          </Accordion>
        </div>
      </div>
    </>
  )
}

export default SavingsBondsAreFullyMatured;
