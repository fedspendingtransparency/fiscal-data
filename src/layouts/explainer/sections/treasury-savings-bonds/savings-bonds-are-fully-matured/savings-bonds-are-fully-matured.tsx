import React, { FunctionComponent, useEffect, useState } from 'react';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { fontBodyCopy } from '../../../explainer.module.scss';
import {
  holdingBondsContainer,
  holdingBondsFooter,
  holdingBondsHeader,
  holdingBondsLeft,
  holdingBondsRight,
  image1,
  image3,
} from './savings-bonds-are-fully-matured.module.scss';
import { mudAccordion, postQuoteBoxAccordionContainer, treasurySavingsBondsExplainerSecondary } from '../treasury-savings-bonds.module.scss';
import QuoteBox from '../../../quote-box/quote-box';
import CustomLink from '../../../../../components/links/custom-link/custom-link';
import GlossaryPopoverDefinition from '../../../../../components/glossary/glossary-term/glossary-popover-definition';
import Accordion from '../../../../../components/accordion/accordion';
import illustration1 from '../../../../../../static/images/savings-bonds/Fully-Matured-Bonds-Story_Illustration-1.svg';
import illustration2 from '../../../../../../static/images/savings-bonds/Fully-Matured-Bonds-Story_Illustration-2.svg';
import illustration3 from '../../../../../../static/images/savings-bonds/Fully-Matured-Bonds-Story_Illustration-3.svg';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import { format } from 'date-fns';
import { getShortForm } from '../../../../../utils/rounding-utils';
import { analyticsEventHandler } from '../../../explainer-helpers/explainer-helpers';
import { glossaryGAEvent } from '../treasury-savings-bonds';

const SavingsBondsAreFullyMatured: FunctionComponent = () => {
  const [mudMonthYear, setMudMonthYear] = useState(null);
  const [mud, setMud] = useState(null);

  useEffect(() => {
    const sort: string = 'sort=-record_date';
    const pagination: string = 'page[size]=1';
    const mudDateEndpoint: string = `v1/accounting/od/savings_bonds_mud?${sort}&${pagination}`;

    basicFetch(`${apiPrefix}${mudDateEndpoint}`).then(res => {
      if (res.data) {
        const data = res.data[0];
        const mudRecordDate: string = data.record_date;
        const mudEndpoint: string = `v1/accounting/od/savings_bonds_mud?filter=record_date:eq:${mudRecordDate}`;
        setMudMonthYear(mudRecordDate);

        basicFetch(`${apiPrefix}${mudEndpoint}`).then(res => {
          if (res.data) {
            const data = res.data;
            let mudTotal: number = 0;
            data.map(index => {
              mudTotal = mudTotal + parseInt(index.bonds_out_cnt);
            });

            setMud(mudTotal);
          }
        });
      }
    });
  }, []);

  const glossaryTerms = {
    maturedUnredeemedDebt: (
      <GlossaryPopoverDefinition
        term="Matured Unredeemed Debt (MUD)"
        page="Savings Bonds Explainer"
        handleClick={() => glossaryGAEvent('Matured Unredeemed Debt (MUD)')}
      >
        Matured Unredeemed Debt (MUD)
      </GlossaryPopoverDefinition>
    ),
  };

  const onAccordionClick = () => {
    analyticsEventHandler('Savings Bonds - What is the Treasury Doing to Reduce Matured Unredeemed Debt?', 'Accordion Expand Click');
  };

  return (
    <>
      <p>
        A savings bond can be redeemed anytime after at least one year; however, the longer a bond is held (up to 30 years), the more it earns. When a
        savings bond is redeemed after five years, the owner receives the original value plus all accrued interest. If a bond is redeemed before five
        years, the holder loses the last three months of interest.
      </p>
      <p>
        Occasionally, bond owners hold onto bonds after they have reached maturity and are no longer earning interest. These outstanding but
        unredeemed bonds are called {glossaryTerms.maturedUnredeemedDebt}. The government continues to be responsible for this debt, as it may be
        redeemed at any time. Therefore, the Treasury has increased efforts to encourage bondholders to redeem their matured savings bonds. As of{' '}
        {format(new Date(mudMonthYear), 'MMMM y')}, there were {getShortForm(mud, false)} matured unredeemed savings bonds held by investors.
      </p>
      <p>
        If bonds are held past their maturity date, the bonds can lose value due to inflation. To understand how this value is lost, see the
        illustration below.
      </p>

      <div
        className={holdingBondsContainer}
        aria-label={
          'Three images of the same person. The first image is of the person with a new savings bond certificate and a few gold coins. ' +
          'The next image is of the same person, now unboxing more gold coins resulting from redeeming a fully matured savings bond. ' +
          'The final image is of the same person, now with some of their gold coins flying away, ' +
          'symbolizing how value disappears from fully matured savings bonds that go unredeemed.'
        }
      >
        <div className={holdingBondsHeader}>How Holding onto Matured Bonds can Cost You Money</div>

        <div className={holdingBondsLeft}>
          <div>
            Imagine you bought a series EE bond 30 years ago for $500. After 20 years, it doubled in value ($1,000) and continued to earn interest
            ($600) until reaching maturity after 30 years.
          </div>
          <img src={illustration1} className={image1} alt="An image of a smiling woman with a new savings bond certificate and a few gold coins." />
        </div>
        <div className={holdingBondsRight}>
          <img
            src={illustration2}
            alt={
              'An image of the same woman, now unboxing more gold coins resulting from redeeming a fully matured ' +
              'savings bond. She is smiling and clapping her hands.'
            }
          />
          <div>
            If you redeem your bond today, you can redeem it for $1,600 and spend that on goods or services or reinvest that money in a new savings
            bond.
          </div>
        </div>
        <div className={holdingBondsLeft}>
          <div>
            If you hold onto that bond and don’t redeem it for another 10 years, it will still be worth $1,600, but the same goods and services you
            would have purchased 10 years ago now cost $2,050, effectively losing you $450 in value.
          </div>
          <img
            src={illustration3}
            className={image3}
            alt={
              'An image of the same woman with her hand on her chin as she is thinking. Some of the gold coins are ' +
              'flying away, symbolizing how value disappears from fully matured savings bonds that go unredeemed.'
            }
          />
        </div>

        <p className={holdingBondsFooter}>*Please note this visual uses fictional data</p>
      </div>

      <QuoteBox
        icon={faMagnifyingGlass as IconProp}
        primaryColor={fontBodyCopy}
        secondaryColor={treasurySavingsBondsExplainerSecondary}
        customTopMargin="0"
      >
        <p>
          Could there be a savings bond in your name that you might not know about? Go on a{' '}
          <CustomLink
            url="https://treasurydirect.gov/savings-bonds/treasury-hunt/"
            id="Treasury Hunt"
            onClick={() => analyticsEventHandler('Treasury Hunt', 'Savings Bonds Citation Click')}
          >
            Treasure Hunt
          </CustomLink>{' '}
          and see what bonds might be waiting for you to cash in!
        </p>
      </QuoteBox>

      <div className={postQuoteBoxAccordionContainer}>
        <div className={mudAccordion}>
          <Accordion
            title="What is the Treasury Doing to Reduce Matured Unredeemed Debt?"
            onOpen={onAccordionClick}
            ga4ID="reduce-matured-unredeemed-debt"
          >
            Treasury’s efforts to increase the redemption of MUD are complicated by issues such as the age and quality of MUD records, a paper-based
            redemption process, as well as reluctance by some bond owners to redeem their bonds. Treasury has been working for more than a decade to
            implement new techniques and technologies to reduce the amount of MUD and ensure that the public can access and redeem their matured
            bonds.
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default SavingsBondsAreFullyMatured;
