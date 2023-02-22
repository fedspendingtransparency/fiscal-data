import React, {FunctionComponent, useEffect, useState} from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import {breadCrumbsContainer} from '../explainer/explainer.module.scss';
import BreadCrumbs from '../../components/breadcrumbs/breadcrumbs';
import {
  title,
  container,
  currencyBoxContainer,
  footer,
  icon,
  selectText,
  selectorContainer,
  effectiveDateContainer,
  selector,
  box
} from './currency-exchange-rates-converter.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import ExchangeRatesBanner
  from "../../components/exchange-rates-converter/exchange-rates-banner/exchange-rates-banner";
import QuarterSelectionBox
  from "../../components/exchange-rates-converter/quarter-selection-box/quarter-selection-box";
import CurrencyEntryBox
  from "../../components/exchange-rates-converter/currency-entry-box/currency-entry-box";
import SelectControl from "../../components/select-control/select-control";
import {apiPrefix, basicFetch} from "../../utils/api-utils";

const CurrencyExchangeRatesConverter: FunctionComponent = () => {

  const [data, setData] = useState(null);
  const [defaultSelectedYear, setDefaultSelectedYear] = useState(null);
  const [defaultSelectedQuarter, setDefaultSelectedQuarter] = useState(null);
  const [defaultCurrency, setDefaultCurrency] = useState(null);
  const [effectiveDate, setEffectiveDate] = useState(null);
  const [quarters, setQuarters] = useState([]);
  const [years, setYears] = useState([]);

  const breadCrumbLinks = [
    {
      name: 'Currency Exchange Rates Convertor'
    },
    {
      name: 'Home',
      link: '/'
    }
  ];

  const apiEndpoint = 'v1/accounting/od/rates_of_exchange?filter=record_date:gte:2022-12-31&sort=currency,-effective_date';

  useEffect(() => {
    basicFetch(`${apiPrefix}${apiEndpoint}`).then((res) => {
      const recordYears = res.data.map(entry => parseInt(entry.record_calendar_year));
      const recordYearsSet = [...new Set(res.data.map(entry => parseInt(entry.record_calendar_year)))];
      setYears(recordYearsSet.map((year) => ({ label: year.toString(), value: year })));
      setData(res.data);
      setDefaultSelectedYear({label: Math.max(...recordYears).toString(), value: Math.max(...recordYears)});
      setDefaultSelectedQuarter({label: '4', value: 4});
      const recordQuartersSet = [...new Set(res.data.map(entry => parseInt(entry.record_calendar_quarter)))]
      setQuarters(recordQuartersSet.map((quarter) => ({ label: quarter.toString(), value: quarter })))
      setEffectiveDate(res.data[0].effective_date);
    });
  }, [])

  const handleChangeQuarters = (option) => {
    console.log('hi');
  }

  const handleChangeYears = (option) => {
    console.log(option.value);
    const filteredDataForYear = data.filter(record => record.record_calendar_year === option.value.toString());
    console.log(filteredDataForYear);
  }

  // @ts-ignore
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
                <SelectControl label={'Year'} className={box} options={years} selectedOption={defaultSelectedYear} changeHandler={handleChangeYears} />
              </div>
              <div className={selector}>
                <SelectControl label={'Quarter'} className={box} options={quarters} selectedOption={defaultSelectedQuarter} changeHandler={handleChangeQuarters} />
              </div>
              <div className={effectiveDateContainer}>
                <div>Effective Date <FontAwesomeIcon icon={faCircleInfo as IconProp} className={icon} /> </div>
                <span> {effectiveDate} </span>
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
  )
};

export default CurrencyExchangeRatesConverter;
