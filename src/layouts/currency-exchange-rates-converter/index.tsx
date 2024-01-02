import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import BreadCrumbs from '../../components/breadcrumbs/breadcrumbs';
import {
  title,
  container,
  currencyBoxContainer,
  footer,
  breadCrumbsContainer,
  selector,
  box,
  legalDisclaimer,

} from './currency-exchange-rates-converter.module.scss';
import ExchangeRatesBanner from '../../components/exchange-rates-converter/exchange-rates-banner/exchange-rates-banner';
import CurrencyEntryBox from '../../components/exchange-rates-converter/currency-entry-box/currency-entry-box';
import NestSelectControl from '../../components/select-control/nest-select-control';
import { apiPrefix, basicFetch } from '../../utils/api-utils';
import {
  quarterNumToTerm,
  dateStringConverter,
  apiEndpoint,
  breadCrumbLinks,
  socialCopy,
  publishedDateInfoIcon,
  currencySelectionInfoIcon,
  effectiveDateEndpoint,
  countDecimals,
  enforceTrailingZero,
  labelIcon
} from './currency-exchange-rates-converter-helper';
import CustomLink from '../../components/links/custom-link/custom-link';
import Analytics from '../../utils/analytics/analytics';
import BannerCallout from '../../components/banner-callout/banner-callout';
import { ga4DataLayerPush } from '../../helpers/google-analytics/google-analytics-helper';

let gaInfoTipTimer;
let gaCurrencyTimer;
let ga4Timer;

type CurrencyRate = {
  label: string;
  rates: Record<string, string>;
}
type CurrencyMap = {
  [key: string]: CurrencyRate;
}

type DropdownOption = {
  label: string;
  value: string;
  data?: number;
}

const CurrencyExchangeRatesConverter: FunctionComponent = () => {
  const [data, setData] = useState(null);
  const [sortedCurrencies, setSortedCurrencies] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState(null);
  const [nonUSCurrency, setNonUSCurrency] = useState(null);
  const [usDollarValue, setUSDollarValue] = useState('1.00');
  const [nonUSCurrencyExchangeValue, setNonUSCurrencyExchangeValue] = useState('1.00');
  const [datasetDate, setDatasetDate] = useState(null);
  const [nonUSCurrencyDecimalPlaces, setNonUSCurrencyDecimalPlaces] = useState(0);
  const [inputWarning, setInputWarning] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [groupDateOption, setGroupedDateOptions] = useState<DropdownOption[]>([]);

  const XRWarningBanner = { banner: 'XRPageWarning' };

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

  const handleMouseEnterInfoTip = (label, ga4ID) => {
    gaInfoTipTimer = setTimeout(() => {
      analyticsHandler('Additional Info Hover', label);
    }, 3000);
    ga4Timer = setTimeout(() => {
      ga4DataLayerPush({
        event: `additional-info-hover-${ga4ID}`,
      });
    }, 3000);
  };

  const handleInfoTipClose = () => {
    clearTimeout(gaInfoTipTimer);
    clearTimeout(ga4Timer);
  };

  useEffect(() => {
    basicFetch(`${apiPrefix}${apiEndpoint}`).then(res => {
      const currencyMap: CurrencyMap = {};
      const dateGroups = {};
      const data = res.data;
      let mostRecentEuroRecord = null;

      data.forEach(record => {
        const currency = record.country_currency_desc;
        const date = record.record_date;
        const year = new Date(record.record_date).getFullYear().toString();
        const formattedDate = dateStringConverter(new Date(record.record_date));

        if(!currencyMap[currency]){
          currencyMap[currency] = {label: currency, rates: {}};
        }
        currencyMap[currency].rates[date] = record.exchange_rate;

        if (!dateGroups[year]) {
          dateGroups[year] = [];
        }

        if (!dateGroups[year].some(option => option.value === record.record_date)) {
          dateGroups[year].push({
            label: formattedDate,
            value: record.record_date,
          });
        }
        const sorted = Object.values(currencyMap).sort((a, b) => a.label.localeCompare(b.label));
        setSortedCurrencies(sorted);

        if (record.country_currency_desc === 'Euro Zone-Euro'){
          if (!mostRecentEuroRecord || new Date(record.record_date) > new Date(mostRecentEuroRecord.record_date)){
            mostRecentEuroRecord = record;
          }
        }
      });

      const nestedOptions = Object.keys(dateGroups)
        .sort((a, b) => Number(b) - Number(a))
        .map(year => ({
          label: year,
          value: year,
          children: dateGroups[year].sort((a, b) => new Date(b.value) - new Date(a.value)),
        }));

      setGroupedDateOptions(nestedOptions);

      if (mostRecentEuroRecord) {
        setSelectedDate({ label: dateStringConverter(new Date(mostRecentEuroRecord.record_date)), value: mostRecentEuroRecord.record_date});
        setNonUSCurrency(mostRecentEuroRecord);
        setNonUSCurrencyExchangeValue(mostRecentEuroRecord.exchange_rate);
        setNonUSCurrencyDecimalPlaces(countDecimals(mostRecentEuroRecord.exchange_rate));
      }

      setData(res.data);
    });
  }, []);

  useEffect(() => {
    if (data && sortedCurrencies.length > 0 && selectedDate) {
      const currencyOptions = sortedCurrencies.map(currency => {
        const rate = currency.rates[selectedDate.value];
        return {
          label: currency.label,
          value: rate ? rate : '',
          isDisabled: !rate,
        };
      });
      setDropdownOptions(currencyOptions);
    }
  }, [selectedDate, sortedCurrencies, data]);

    const useHandleChangeUSDollar = (event: React.ChangeEvent<HTMLInputElement>) => {
      clearTimeout(gaCurrencyTimer);
      let product: number | string;
      if (event.target.value === '') {
        setNonUSCurrencyExchangeValue('');
      }
      setUSDollarValue(event.target.value)
  
      if (!isNaN(parseFloat(event.target.value))) {
        gaCurrencyTimer = window.setTimeout(() => {
          analyticsHandler('USD Value Entered', event.target.value);
        }, 3000);
  
        product = parseFloat(event.target.value) * parseFloat(nonUSCurrency.exchange_rate);
        product = enforceTrailingZero(product, nonUSCurrencyDecimalPlaces);
      }
      if (!isNaN(product as number)) {
        setNonUSCurrencyExchangeValue(product.toString());
      }
    };
  

  const handleChangeNonUSCurrency = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(gaCurrencyTimer);
    let quotient: number | string;
    if (event.target.value === '') {
      setUSDollarValue('');
    }
    setNonUSCurrencyExchangeValue(event.target.value);
    if (!isNaN(parseFloat(event.target.value))) {
      gaCurrencyTimer = window.setTimeout(() => {
        analyticsHandler('Foreign Currency Value Entered', event.target.value);
      }, 3000);
      quotient = parseFloat(event.target.value) / parseFloat(nonUSCurrency.exchange_rate);
      quotient = quotient.toFixed(2);
    }
    if (!isNaN(quotient as number)) {
      setUSDollarValue(quotient.toString());
    }
  };

  const handleDateChange = (selectedDateOption: DropdownOption) => {
    setSelectedDate(selectedDateOption);
    if (selectedDateOption) {
      const newCurrency = data.find(record => record.country_currency_desc === nonUSCurrency.country_currency_desc && record.record_date === selectedDateOption.value);
      if (newCurrency) {
        setNonUSCurrency(newCurrency);
        setNonUSCurrencyExchangeValue(newCurrency.exchange_rate);
        setNonUSCurrencyDecimalPlaces(countDecimals(newCurrency.exchange_rate));
      }
    }
  };
  
  const handleCurrencyChange = (selectedCurrency: DropdownOption) => {
    const newCurrency = data.find(record => record.country_currency_desc === selectedCurrency.label && record.record_date === selectedDate?.value);
    if (newCurrency) {
      setNonUSCurrency(newCurrency);
      setNonUSCurrencyExchangeValue(newCurrency.exchange_rate);
      setNonUSCurrencyDecimalPlaces(countDecimals(newCurrency.exchange_rate));
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
        keywords=""
        image=""
        canonical=""
        datasetDetails=""
      />
      <div className={breadCrumbsContainer}>
        <BreadCrumbs links={breadCrumbLinks} />
      </div>
      <ExchangeRatesBanner text="Currency Exchange Rates Converter" copy={socialCopy} />
      <div className={container} onBlur={handleInfoTipClose} role="presentation">
        <span className={title}>Check foreign currency rates against the U.S. Dollar.</span>
        {nonUSCurrency !== null && (
          <div data-testid="box-container">
            <div>
            {data && (
              <div className={currencyBoxContainer}>
                <div 
                  className={selector}
                  onMouseEnter={() => {
                    handleMouseEnterInfoTip('Additional Effective Date Info', 'eff-date');
                  }}
                  onBlur={handleInfoTipClose}
                  role="presentation"
                >
                <NestSelectControl
                  label={labelIcon('Published Date', publishedDateInfoIcon.body, 'effective-date-info-tip', true)}
                  className={box}
                  options={groupDateOption}
                  selectedOption={selectedDate}
                  changeHandler={handleDateChange}
                />
                </div>
              </div>
            )}
            </div>
              <div 
                className={currencyBoxContainer} 
                data-testid="foreign-currency-info-tip"
                onMouseEnter={() => handleMouseEnterInfoTip('Additional Foreign Currency Info', 'foreign-curr')}
                onBlur={handleInfoTipClose}
                role="presentation"
              >
              <CurrencyEntryBox
              selectedCurrency={{
                label: nonUSCurrency.country_currency_desc ? nonUSCurrency.country_currency_desc : null,
                value: nonUSCurrency,
              }}
              defaultCurrency={nonUSCurrency.country_currency_desc}
              currencyValue={nonUSCurrencyExchangeValue}
              dropdown
              options={dropdownOptions}
              onCurrencyChange={handleCurrencyChange}
              onCurrencyValueChange={handleChangeNonUSCurrency}
              testId="non-us-box"
              header="FOREIGN CURRENCY"
              tooltipDiplay={true}
              tooltip={currencySelectionInfoIcon.body}
              />
            <CurrencyEntryBox
              defaultCurrency="U.S. Dollar"
              currencyValue={usDollarValue}
              onCurrencyValueChange={useHandleChangeUSDollar}
              testId="us-box"
              header="U.S. DOLLAR"
              tooltipDiplay={false}
              tooltip={""}
            />
              </div>
          </div>
        )}
        {nonUSCurrency !== null && nonUSCurrency.exchange_rate && !inputWarning && (
          <span data-testid="exchange-values">
            1.00 U.S. Dollar = {nonUSCurrency.exchange_rate} {nonUSCurrency.country_currency_desc}
          </span>
        )}
        {inputWarning && <BannerCallout bannerCallout={XRWarningBanner} bannerType="warning" />}
        <span className={footer}>
          The Currency Exchange Rates Converter tool is powered by the{' '}
          <CustomLink
            url="/datasets/treasury-reporting-rates-exchange/treasury-reporting-rates-of-exchange"
            onClick={() => analyticsHandler('Citation Click', 'Treasury Reporting Rates of Exchange Dataset')}
            id="Treasury Reporting Rates of Exchange"
          >
            Treasury Reporting Rates of Exchange
          </CustomLink>{' '}
          dataset. This dataset is updated quarterly and covers the period from December 31, 2022 to {datasetDate}.
        </span>
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
