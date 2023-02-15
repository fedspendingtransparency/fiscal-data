import React, {FunctionComponent} from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import {breadCrumbsContainer} from '../../layouts/explainer/explainer.module.scss';
import BreadCrumbs from '../../components/breadcrumbs/breadcrumbs';
import {
  title,
  container,
  currencyBoxContainer,
  footer,
  icon,
  selectText,
} from './currency-exchange-rates-converter.module.scss';
import Experimental from "../../components/experimental/experimental";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import ExchangeRatesBanner
  from "../../components/exchange-rates-converter/exchange-rates-banner/exchange-rates-banner";
import QuarterSelectionBox
  from "../../components/exchange-rates-converter/quater-selection-box/quarter-selection-box";
import CurrencyEntryBox
  from "../../components/exchange-rates-converter/currency-entry-box/currency-entry-box";

const CurrencyExchangeRatesConverter: FunctionComponent = () => {
  const breadCrumbLinks = [
    {
      name: 'Currency Exchange Rates Convertor'
    },
    {
      name: 'Home',
      link: '/'
    }
  ];

  return (
    <Experimental featureId={"exchange-rates-converter"} exclude={true}>
      <SiteLayout isPreProd={false}>
        <PageHelmet
          pageTitle= "Currency Exchange Rates Convertor Tool "
          description={"Fiscal Data’s Currency Exchange Rates Convertor Tool provides accurate " +
            "and reliable currency exchange rates based on trusted U.S. Treasury data that can " +
            "be used for purposes such as IRS Report of Foreign Bank and Financial Accounts " +
            "(FBAR) reporting."}
          descriptionGenerator={false}
          keywords=""
          image=""
          canonical=""
          datasetDetails=""
        />
        <div className={breadCrumbsContainer}>
          <BreadCrumbs links={breadCrumbLinks} />
        </div>
        <ExchangeRatesBanner text={'Currency Exchange Rates Converter'} />
        <div className={container}>
          <span className={title}>
            Check foreign currency rates against the US Dollar.
          </span>
          <QuarterSelectionBox />
          <div className={selectText}>
            <span>
              Select a country-currency and then enter a value for US Dollars or for the foreign
              currency to see the conversion. {" "}
            </span>
            <FontAwesomeIcon icon={faCircleInfo} className={icon} />
          </div>
          <div className={currencyBoxContainer}>
            <CurrencyEntryBox defaultCurrency={'US Dollar'}  />
            <CurrencyEntryBox defaultCurrency={'Euro Zone-Euro'} dropdown={true} />
          </div>
          <span>
            1.00 US Dollar = 0.92 Euro Zone-Euro
          </span>
          <span className={footer}>
            The Currency Exchange Rates Converter tool is driven by the Treasury Reporting Rates of
            Exchange dataset. This dataset is updated quarterly and covers the period from
            December 31, 2022 to Month, DD, YYYY. For more information and to see the full dataset,
            please visit the Treasury Reporting Rates of Exchange dataset page.
          </span>
        </div>
      </SiteLayout>
    </Experimental>
  )
};

export default CurrencyExchangeRatesConverter;
