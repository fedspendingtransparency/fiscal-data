import React, { FunctionComponent, useState } from 'react';
import CustomLink from '../../../../../components/links/custom-link/custom-link';
import { subSectionTitle } from './how-savings-bonds-finance-government.module.scss';
import GlossaryPopoverDefinition from '../../../../../components/glossary/glossary-term/glossary-popover-definition';
import BondImage from '../../../../../../static/images/savings-bonds/Bond-Image.png';
import ImageContainer from '../../../explainer-components/image-container/image-container';
import { treasurySavingsBondsExplainerSecondary } from '../treasury-savings-bonds.module.scss';
import TypesOfSavingsBonds from './types-of-savings-bonds-table/types-of-savings-bonds';

const HowSavingsBondsFinanceGovernment = ({ glossary, glossaryClickHandler }) => {
  const [numberOfBondTypes, setNumberOfBondTypes] = useState('12');

  const marketable = (
    <GlossaryPopoverDefinition
      term={'Marketable Securities'}
      page={'Savings Bond Explainer'}
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      marketable
    </GlossaryPopoverDefinition>
  );

  const nonMarketable = (
    <GlossaryPopoverDefinition
      term={'Non-Marketable Securities'}
      page={'Savings Bond Explainer'}
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      non-marketable
    </GlossaryPopoverDefinition>
  );

  const govAccountSeries = (
    <GlossaryPopoverDefinition
      term={'Government Account Series'}
      page={'Savings Bond Explainer'}
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      Government Account Series
    </GlossaryPopoverDefinition>
  );

  const stateLocalGovSeries = (
    <GlossaryPopoverDefinition
      term={'State and Local Government Series'}
      page={'Savings Bond Explainer'}
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      State and Local Government Series
    </GlossaryPopoverDefinition>
  );

  const debtHeldByPublic = (
    <GlossaryPopoverDefinition
      term={'Debt Held by the Public'}
      page={'Savings Bond Explainer'}
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      debt held by the public
    </GlossaryPopoverDefinition>
  );

  const seriesIBonds = (
    <GlossaryPopoverDefinition
      term={'Series I Bonds'}
      page={'Savings Bond Explainer'}
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      Series I bonds
    </GlossaryPopoverDefinition>
  );

  const seriesEEBonds = (
    <GlossaryPopoverDefinition
      term={'Series EE Bonds'}
      page={'Savings Bond Explainer'}
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      Series EE Bonds
    </GlossaryPopoverDefinition>
  );

  return (
    <>
      <span>
        The government finances programs like building and maintaining roads, school funding, or support for veterans through{' '}
        <CustomLink url={'/americas-finance-guide/government-revenue/'}>revenue</CustomLink> sources like taxes. When the government{' '}
        <CustomLink url={'/americas-finance-guide/federal-spending/'}>spends</CustomLink> more than it collects from revenue, this results in a{' '}
        <CustomLink url={'/americas-finance-guide/national-deficit/'}>deficit</CustomLink>, which requires the government to borrow money (
        <CustomLink url={'/americas-finance-guide/national-debt/'}>debt</CustomLink>) by issuing loans (securities) that it promises to pay back with
        interest. Different types of securities earn interest in different ways. Treasury groups savings bonds into two categories called {marketable}{' '}
        and {nonMarketable} securities, which reflects whether they can be resold to another individual or entity after they are purchased.
      </span>
      <ImageContainer color={treasurySavingsBondsExplainerSecondary} caption="A paper Series E Savings Bond">
        <img src={BondImage} alt="A paper Series E Savings Bond" />
      </ImageContainer>
      <span>
        Savings bonds are the most well-known type of non-marketable security and the only type available for purchase by individuals. Other types of
        non-marketable securities include {govAccountSeries}, which can be purchased from Treasury by other federal agencies, and{' '}
        {stateLocalGovSeries}, which can be purchased by state and local governments. Use the chart below to explore how different types of loans make
        up the total {debtHeldByPublic}.
      </span>
      <h5 className={subSectionTitle}>Types of Savings Bonds</h5>
      <span>
        Over the course of American history, the U.S. government has issued {numberOfBondTypes} types of savings bonds to help fund certain programs
        and special projects ranging from the Postal Service to the Armed Forces. Each bond type has different terms and ways that it earns interest.
        Today, there are two types of savings bonds available for purchase: {seriesIBonds} and {seriesEEBonds}.
      </span>
      <TypesOfSavingsBonds />
    </>
  );
};

export default HowSavingsBondsFinanceGovernment;
