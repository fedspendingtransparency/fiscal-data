import React, {FunctionComponent, useCallback, useEffect, useState} from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import BreadCrumbs from '../../components/breadcrumbs/breadcrumbs';
import {
  title,
  container,
  currencyBoxContainer,
  footer,
  icon,
  selectText,
  breadCrumbsContainer,
  selectorContainer,
  effectiveDateContainer,
  effectiveDateText,
  selector,
  box
} from './currency-exchange-rates-converter.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import ExchangeRatesBanner
  from "../../components/exchange-rates-converter/exchange-rates-banner/exchange-rates-banner";
import CurrencyEntryBox
  from "../../components/exchange-rates-converter/currency-entry-box/currency-entry-box";
import SelectControl from "../../components/select-control/select-control";
import {apiPrefix, basicFetch} from "../../utils/api-utils";
import { quarterNumToTerm, dateStringConverter, apiEndpoint, breadCrumbLinks, fastRound } from "./currency-exchange-rates-converter-helper";
import { BASE_URL } from "gatsby-env-variables";

const envBaseUrl = BASE_URL;

const CurrencyExchangeRatesConverter: FunctionComponent = () => {

  const [data, setData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [nonUSCurrency, setNonUSCurrency] = useState(null);
  const [effectiveDate, setEffectiveDate] = useState(null);
  const [quarters, setQuarters] = useState([]);
  const [years, setYears] = useState([]);
  const [usDollarValue, setUSDollarValue] = useState('1.00');
  const [nonUSCurrencyExchangeValue, setNonUSCurrencyExchangeValue] = useState('1.00');

  useEffect(() => {
    basicFetch(`${apiPrefix}${apiEndpoint}`).then((res) => {

      // Setting default values based on default non US currency (Euro)
      const euro = res.data.find(entry => entry.country_currency_desc === 'Euro Zone-Euro');
      // const euro = res.data[0];

      const recordYearsSet = [...new Set(res.data.filter((entry => entry.country_currency_desc === euro.country_currency_desc))
      .map(entry => parseInt(entry.record_calendar_year)))];
      const recordQuartersSet = [...new Set(res.data
      .filter((entry => entry.country_currency_desc === euro.country_currency_desc && entry.record_calendar_year === euro.record_calendar_year))
      .map(entry => parseInt(entry.record_calendar_quarter)))];
      recordQuartersSet.sort((a:number, b:number) => {return a-b});
      setNonUSCurrency(euro);
      setNonUSCurrencyExchangeValue(euro.exchange_rate);
      setSelectedYear({label: euro.record_calendar_year, value: parseInt(euro.record_calendar_year)});
      setSelectedQuarter({label: quarterNumToTerm(parseInt(euro.record_calendar_quarter)), value: parseInt(euro.record_calendar_quarter)});
      setYears(recordYearsSet.map((year) => ({ label: year.toString(), value: year })));
      setQuarters(recordQuartersSet.map((quarter) => ({ label: quarterNumToTerm(quarter), value: quarter })));
      const date = new Date(euro.effective_date);
      setEffectiveDate(dateStringConverter(date));
      setData(res.data);
    });
  }, []);

  const useHandleChangeQuarters = useCallback((option) => {
    setSelectedQuarter(option);
    const matchedRecord = data.find((entry) => entry.record_calendar_year === selectedYear.value.toString()
      && entry.record_calendar_quarter === option.value.toString() && entry.country_currency_desc === nonUSCurrency.country_currency_desc);
    setNonUSCurrency(matchedRecord);
    setNonUSCurrencyExchangeValue(matchedRecord.exchange_rate);
    const date = new Date(matchedRecord.effective_date);
    setEffectiveDate(dateStringConverter(date));
  }, [selectedQuarter, data]);


  const handleChangeYears = useCallback((option) => {
    setSelectedYear(option);
    const filteredDataForYear = data.filter(record => record.record_calendar_year === option.value.toString() &&
      record.country_currency_desc === nonUSCurrency.country_currency_desc);
    // Set quarter to most recent for that year
    const newestQuarter = Math.max(...filteredDataForYear.map(value => parseInt(value.record_calendar_quarter)));
    setSelectedQuarter({label: quarterNumToTerm(newestQuarter), value: newestQuarter});
    const matchedRecord = data.find((entry) => entry.record_calendar_year === option.value.toString()
      && entry.record_calendar_quarter === newestQuarter.toString() && entry.country_currency_desc === nonUSCurrency.country_currency_desc);
    // Update currency, exchange rate, and effective date entry to match quarter entry
    setNonUSCurrency(matchedRecord);
    setNonUSCurrencyExchangeValue(matchedRecord.exchange_rate);
    const date = new Date(matchedRecord.effective_date);
    setEffectiveDate(dateStringConverter(date));
    const recordQuartersSet = [...new Set(filteredDataForYear.map(entry => parseInt(entry.record_calendar_quarter)))];
    recordQuartersSet.sort((a:number, b:number) => {return a-b});
    setQuarters(recordQuartersSet.map((quarter) => ({ label: quarterNumToTerm(quarter), value: quarter })));
  }, [selectedYear, data]);

  const useHandleChangeUSDollar = useCallback((event) => {
    let product;
    setUSDollarValue(event.target.value);
    if (!isNaN(parseFloat(event.target.value))) {
      product = fastRound((parseFloat(event.target.value) * parseFloat(nonUSCurrency.exchange_rate)) * 100) / 100;
    }
    if (!isNaN(product)) {
      setNonUSCurrencyExchangeValue(product.toString());
    }
  }, [usDollarValue, nonUSCurrency]);

  const handleChangeNonUSCurrency = useCallback((event) => {
    let quotient;
    setNonUSCurrencyExchangeValue(event.target.value);
    if (!isNaN(parseFloat(event.target.value))) {
      quotient = fastRound((parseFloat(event.target.value) / parseFloat(nonUSCurrency.exchange_rate)) * 100) / 100;
    }
    if (!isNaN(quotient)) {
      setUSDollarValue(quotient.toString());
    }
  }, [nonUSCurrencyExchangeValue, nonUSCurrency]);

  const currencySearch = useCallback(() => {
    console.log('hi');
  }, [])


  const socialCopy = {
    title: 'Test title',
    description: 'Test description',
    body: 'Test body',
    emailSubject: 'Test email subject',
    emailBody: 'test email body',
    url: envBaseUrl+'/currency-exchange-rates-converter/',
    image: '',
  }

  return (
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
      <ExchangeRatesBanner text={'Currency Exchange Rates Converter'} copy={socialCopy} />
      <div className={container}>
          <span className={title}>
            Check foreign currency rates against the US Dollar.
          </span>
        {
          data && (
            <div className={selectorContainer}>
              <div className={selector} data-testid={'year-selector'}>
                <SelectControl label={'Year'} className={box} options={years} selectedOption={selectedYear} changeHandler={handleChangeYears} />
              </div>
              <div className={selector} data-testid={'quarter-selector'}>
                <SelectControl label={'Quarter'} className={box} options={quarters} selectedOption={selectedQuarter} changeHandler={useHandleChangeQuarters} />
              </div>
              <div className={effectiveDateContainer}>
                <div>Effective Date <FontAwesomeIcon icon={faCircleInfo as IconProp} className={icon} /> </div>
                <span className={effectiveDateText}> {effectiveDate} </span>
              </div>
            </div>
          )
        }
        <div className={selectText}>
            <span>
              Select a country-currency and then enter a value for US Dollars or for the foreign
              currency to see the conversion. {" "}
            </span>
          <FontAwesomeIcon icon={faCircleInfo as IconProp} className={icon} />
        </div>
        {
          nonUSCurrency !== null && (
            <div className={currencyBoxContainer}>
              <CurrencyEntryBox
                defaultCurrency={'US Dollar'}
                currencyValue={usDollarValue}
                onCurrencyChange={useHandleChangeUSDollar}
              />
              <CurrencyEntryBox
                defaultCurrency={nonUSCurrency.country_currency_desc}
                currencyValue={nonUSCurrencyExchangeValue}
                dropdown={true}
                onCurrencyChange={handleChangeNonUSCurrency}
                clickFunction={currencySearch}
              />
            </div>
          )
        }
        {
          nonUSCurrency !== null && (
            <span data-testid={'exchange-values'}>
              {usDollarValue} US Dollar = {nonUSCurrencyExchangeValue} {nonUSCurrency.country_currency_desc}
            </span>
          )
        }
        <span className={footer}>
            The Currency Exchange Rates Converter tool is driven by the Treasury Reporting Rates of
            Exchange dataset. This dataset is updated quarterly and covers the period from
            December 31, 2022 to Month, DD, YYYY. For more information and to see the full dataset,
            please visit the Treasury Reporting Rates of Exchange dataset page.
        </span>
      </div>
    </SiteLayout>
  )
};

export default CurrencyExchangeRatesConverter;
