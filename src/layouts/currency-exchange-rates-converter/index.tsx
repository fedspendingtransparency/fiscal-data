import React, { FunctionComponent } from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import BreadCrumbs from '../../components/breadcrumbs/breadcrumbs';
import { breadCrumbsContainer, componenentContianer, legalDisclaimer } from './currency-exchange-rates-converter.module.scss';
import ExchangeRatesBanner from '../../components/exchange-rates-converter/exchange-rates-banner/exchange-rates-banner';
import {
  analyticsHandler,
  breadCrumbLinks,
  socialCopy,
} from '../../helpers/currency-exchange-rates-converter/currency-exchange-rates-converter-helper';
import CustomLink from '../../components/links/custom-link/custom-link';
import CurrencyExchangeRateTool from '../../components/exchange-rates-converter/currency-exchange-rates-converter/currency-exchange-rates-converter';
import CurrencyExchangeFAQ from '../../components/exchange-rates-converter/exchange-rate-faq/exchange-rates-faq';
import PageHelmet from '../../components/page-helmet/page-helmet';

const CurrencyExchangeRatesConverter: FunctionComponent = () => {
  return (
    <SiteLayout isPreProd={false}>
      <div className={breadCrumbsContainer}>
        <BreadCrumbs links={breadCrumbLinks} />
      </div>
      <ExchangeRatesBanner text="Currency Exchange Rates Converter" copy={socialCopy} />
      <div className={componenentContianer}>
        <CurrencyExchangeRateTool />
        <CurrencyExchangeFAQ />
      </div>
      <section className={legalDisclaimer}>
        <div>
          <h4> Important Legal Disclosures and Information</h4>
          <p>
            The Treasury Reporting Rates of Exchange dataset provides the U.S. government's authoritative foreign currency exchange rates for federal
            agencies to consistently report U.S. dollar equivalents. For more information on the calculation of exchange rates used by federal
            agencies, please see the{' '}
            <CustomLink
              url="https://tfx.treasury.gov/tfm/volume1/part2/chapter-3200-foreign-currency-accounting-and-reporting#Section3235TranslatingForeignCurrenciestoUSDollarEquivalents"
              onClick={() => analyticsHandler('Citation Click', 'Treasury Financial Manual')}
            >
              Treasury Financial Manual, volume 1, part 2, section 3235
            </CustomLink>
            . This Exchange Rate Converter Tool is designed to make foreign currency exchange data values easier to access for federal agency
            reporting purposes.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
};

export default CurrencyExchangeRatesConverter;

export const Head = () => {
  return (
    <>
      <PageHelmet
        pageTitle="Currency Exchange Rates Converter"
        description={
          'This Currency Exchange Rates Tool gives reliable U.S. Treasury exchange rates and can be used ' +
          'for IRS Report of Foreign Bank and Financial Accounts (FBAR).'
        }
        descriptionGenerator={false}
        keywords="us treasury exchange rates, us dollar, foreign currency, exchange rates converter"
        socialShare={socialCopy}
      />
    </>
  );
};
