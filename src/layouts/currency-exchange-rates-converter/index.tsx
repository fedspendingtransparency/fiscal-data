import React, {FunctionComponent, useEffect, useState} from 'react';
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

  const breadCrumbLinks = [
    {
      name: 'Currency Exchange Rates Convertor'
    },
    {
      name: 'Home',
      link: '/'
    }
  ];

  const quarterNumToTerm = (num) => {
    switch (num) {
      case 1:
        return '1st';
      case 2:
        return '2nd';
      case 3:
        return '3rd';
      case 4:
        return '4th';
    }
  }

  const dateStringConverter = (date) => {
    const timeZoneOffset = date.getTimezoneOffset() * 60000;
    const offSetDate = new Date(date.getTime() + timeZoneOffset);
    const monthName = offSetDate.toLocaleString('default', { month: 'long' });
    const day = offSetDate.getDate();
    const year = offSetDate.getFullYear();
    return `${monthName} ${day}, ${year}`;
  }

  const apiEndpoint = 'v1/accounting/od/rates_of_exchange?filter=record_date:gte:2022-12-31&sort=currency,-effective_date';

  useEffect(() => {
    basicFetch(`${apiPrefix}${apiEndpoint}`).then((res) => {

      // Setting default values based on default non US currency (Euro)
      const euro = res.data.find(entry => entry.country_currency_desc === 'Euro Zone-Euro');

      const recordYearsSet = [...new Set(res.data.filter((entry => entry.country_currency_desc === 'Euro Zone-Euro'))
      .map(entry => parseInt(entry.record_calendar_year)))];
      const recordQuartersSet = [...new Set(res.data
      .filter((entry => entry.country_currency_desc === 'Euro Zone-Euro' && entry.record_calendar_year === euro.record_calendar_year))
      .map(entry => parseInt(entry.record_calendar_quarter)))];
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
  }, [])

  const handleChangeQuarters = (option) => {
    setSelectedQuarter(option);
    const matchedRecord = data.find((entry) => entry.record_calendar_year === selectedYear.value.toString()
      && entry.record_calendar_quarter === option.value.toString() && entry.country_currency_desc === nonUSCurrency.country_currency_desc);
    setNonUSCurrency(matchedRecord);
    setNonUSCurrencyExchangeValue(matchedRecord.exchange_rate);
    const date = new Date(matchedRecord.effective_date);
    setEffectiveDate(dateStringConverter(date));
  }

  const handleChangeYears = (option) => {
    setSelectedYear(option);
    const filteredDataForYear = data.filter(record => record.record_calendar_year === option.value.toString());
    const recordQuartersSet = [...new Set(filteredDataForYear.map(entry => parseInt(entry.record_calendar_quarter)))];
    setQuarters(recordQuartersSet.map((quarter) => ({ label: quarterNumToTerm(quarter), value: quarter })));
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
      <ExchangeRatesBanner text={'Currency Exchange Rates Converter'} />
      <div className={container}>
          <span className={title}>
            Check foreign currency rates against the US Dollar.
          </span>
        {
          data && (
            <div className={selectorContainer}>
              <div className={selector}>
                <SelectControl label={'Year'} className={box} options={years} selectedOption={selectedYear} changeHandler={handleChangeYears} />
              </div>
              <div className={selector}>
                <SelectControl label={'Quarter'} className={box} options={quarters} selectedOption={selectedQuarter} changeHandler={handleChangeQuarters} />
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
              <CurrencyEntryBox defaultCurrency={'US Dollar'}  currencyValue={usDollarValue} />
              <CurrencyEntryBox defaultCurrency={nonUSCurrency.country_currency_desc} currencyValue={nonUSCurrencyExchangeValue} dropdown={true} />
            </div>
          )
        }
        {
          nonUSCurrency !== null && (
            <span>
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
