import React, { FunctionComponent, useEffect, useState } from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import BreadCrumbs from '../../components/breadcrumbs/breadcrumbs';
import { breadCrumbsContainer, legalDisclaimer, componenentContianer } from './currency-exchange-rates-converter.module.scss';
import ExchangeRatesBanner from '../../components/exchange-rates-converter/exchange-rates-banner/exchange-rates-banner';
import { breadCrumbLinks, socialCopy } from './currency-exchange-rates-converter-helper';
import CustomLink from '../../components/links/custom-link/custom-link';
import Analytics from '../../utils/analytics/analytics';
import { ga4DataLayerPush } from '../../helpers/google-analytics/google-analytics-helper';
import CurrencyExchangeRateTool from '../../components/exchange-rates-converter/currency-exchange-rates-converter/currency-exchange-rates-converter';
import CurrencyExchangeFAQ from '../../components/exchange-rates-converter/exchange-rate-faq/exchange-rates-faq';

const CurrencyExchangeRatesConverter: FunctionComponent = () => {
  const analyticsHandler = (action, label) => {
    if (action && label) {
      Analytics.event({
        category: 'Exchange Rates Converter',
        action: action,
        label: label,
      });
      ga4DataLayerPush({
        event: action,
        eventLabel: label,
      });
    }
  };

  return (
    <SiteLayout isPreProd={false}>
      <PageHelmet
        pageTitle="Currency Exchange Rates Converter Tool"
        description={
          'Fiscal Data’s Currency Exchange Rates Converter Tool gives accurate and reliable currency ' +
          'exchange rates based on trusted U.S. Treasury data. This tool can be used for the IRS Report of Foreign ' +
          'Bank and Financial Accounts (FBAR) reporting.'
        }
        descriptionGenerator={false}
        keywords="us treasury exchange rates, us dollar, foreign currency, exchange rates converter"
        image=""
        canonical=""
        datasetDetails=""
      />
      <div className={breadCrumbsContainer}>
        <BreadCrumbs links={breadCrumbLinks} />
      </div>
      <ExchangeRatesBanner text="Currency Exchange Rates Converter" copy={socialCopy} />
      <div className={componenentContianer}>
        <CurrencyExchangeRateTool />
        <CurrencyExchangeFAQ />
      </div>
      <div className={legalDisclaimer}>
        <div>
          <span> Important Legal Disclosures and Information</span>
          <p>
            The Treasury Reporting Rates of Exchange dataset provides the U.S. government's authoritative foreign currency exchange rates for federal
            agencies to consistently report U.S. dollar equivalents. For more information on the calculation of exchange rates used by federal
            agencies, please see the{' '}
            <CustomLink
              url="https://tfm.fiscal.treasury.gov/v1/p2/c320"
              onClick={() => analyticsHandler('Citation Click', 'Treasury Financial Manual')}
            >
              Treasury Financial Manual, volume 1, part 2, section 3235
            </CustomLink>
            . This Exchange Rate Converter Tool is designed to make foreign currency exchange data values easier to access for federal agency
            reporting purposes.
          </p>
        </div>
      </div>
    </SiteLayout>
  );
};

export default CurrencyExchangeRatesConverter;
