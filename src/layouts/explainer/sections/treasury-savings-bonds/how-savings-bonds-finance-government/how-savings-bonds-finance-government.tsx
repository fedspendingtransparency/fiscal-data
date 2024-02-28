import React, { FunctionComponent, useState } from 'react';
import CustomLink from '../../../../../components/links/custom-link/custom-link';
import { subSectionTitle } from './how-savings-bonds-finance-government.module.scss';

const HowSavingsBondsFinanceGovernment: FunctionComponent = () => {
  const [numberOfBondTypes, setNumberOfBondTypes] = useState('12');

  return (
    <>
      <span>
        The government finances programs like building and maintaining roads, school funding, or support for veterans through{' '}
        <CustomLink url={'/americas-finance-guide/government-revenue/'}>revenue</CustomLink> sources like taxes. When the government{' '}
        <CustomLink url={'/americas-finance-guide/federal-spending/'}>spends</CustomLink> more that it collects from revenue, this results in a{' '}
        <CustomLink url={'/americas-finance-guide/national-deficit/'}>deficit</CustomLink>, which requires the government to borrow money (
        <CustomLink url={'/americas-finance-guide/national-debt/'}>debt</CustomLink>) by issuing loans (securities) that it promises to pay back with
        interest. Different types of securities earn interest in different ways. Treasury groups savings bonds into two categories called marketable
        and non-marketable securities, which reflects whether they can be resold to another individual or entity after they are purchased.
      </span>
      <div> Bond Image Goes Here </div>
      <span>
        Savings bonds are the most well-known type of non-marketable security and the only type available for purchase by individuals. Other types of
        non-marketable securities include Government Account Series, which can be purchased from Treasury by other federal agencies, and State and
        Local Government Series, which can be purchased by state and local governments. Use the chart below to explore how different types of loans
        make up the total debt held by the public.
      </span>
      <div>Chart will go here</div>
      <h5 className={subSectionTitle}>Types of Savings Bonds</h5>
      <span>
        Over the course of American history, the U.S. government has issued {numberOfBondTypes} types of savings bonds to help fund certain programs
        and special projects ranging from the Postal Service to the Armed Forces. Each bond type has different terms and ways that it earns interest.
        Today, there are two types of savings bonds available for purchase: Series I bonds and Series EE bonds.
      </span>
      <div>Savings bond type table placeholder</div>
    </>
  );
};

export default HowSavingsBondsFinanceGovernment;
