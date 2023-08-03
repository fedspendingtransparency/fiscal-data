import CustomLink from '../../../../../components/links/custom-link/custom-link';
import { faFlagUsa } from '@fortawesome/free-solid-svg-icons';
import QuoteBox from '../../../quote-box/quote-box';
import React from 'react';
import { deficitLink, spendingLink } from '../../../explainer-helpers/national-debt/national-debt-helper';
import { analyticsClickHandler } from '../../../explainer-helpers/national-debt/national-debt-helper';
import { debtExplainerLightSecondary, debtExplainerPrimary } from '../national-debt.module.scss';
import SpendingCategoriesAccordion
  from './spending-categories-accordion/spending-categories-accordion';


const FundingProgramsAndServices = () => {
  const usaSpending = (
    <CustomLink
      url={"https://www.usaspending.gov/"}
      onClick={() =>
        analyticsClickHandler("Citation Click", "Funding Programs & Services")
      }
    >
      USAspending.gov
    </CustomLink>
  );

  const revenueLink = (
    <CustomLink
      url={'/americas-finance-guide/government-revenue/'}
      id="Government Revenue"
    >
      federal revenues
    </CustomLink>
  )

  return (
    <>
      <p>
        The federal government needs to borrow money to pay its bills when its
        ongoing {spendingLink('spending')} activities and investments cannot be funded
        by {revenueLink} alone. Decreases in federal revenue are largely due to either a
        decrease in tax rates or individuals or corporations making less money.
        The national debt enables the federal government to pay for important
        programs and services even if it does not have funds immediately
        available, often due to a decrease in revenue. Decreases in federal
        revenue coupled with increased government spending further increases the {deficitLink}.
      </p>
      <p>
        Consistent with the purpose of the federal government established by the
        U.S. Constitution, money is spent on programs and services to ensure the
        well-being of U.S. residents. The Constitution’s preamble states that
        the purpose of the federal government is “…to establish Justice, insure
        domestic Tranquility, provide for the common defense, promote the
        general Welfare, and secure the Blessings of Liberty to ourselves and
        our Posterity.” Uninterrupted funding of programs and services is
        critical to residents’ health, welfare, and security.
      </p>
      <SpendingCategoriesAccordion />
      <QuoteBox
        icon={faFlagUsa}
        primaryColor={debtExplainerPrimary}
        secondaryColor={debtExplainerLightSecondary}
        customTopMargin={"0"}
      >
        <p>
          In accordance with the 2014 DATA Act, federal agencies are required to
          submit financial data on a quarterly and/or monthly basis to{" "}
          {usaSpending}. Anyone can visit USAspending for a breakdown of what
          the federal government spends each year and how it spends that money.
          Visitors can follow the money from the Congressional appropriations to
          the federal agencies and down to local communities and businesses.
        </p>
      </QuoteBox>
    </>
  );
};

export default FundingProgramsAndServices;
