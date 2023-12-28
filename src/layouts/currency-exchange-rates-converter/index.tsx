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
  effectiveDateText,

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
  effectiveDateInfoIcon,
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

const CurrencyExchangeRatesConverter: FunctionComponent = () => {
  const [data, setData] = useState(null);
  const [sortedCurrencies, setSortedCurrencies] = useState(null as Currency[]);
  const [dropdownOptions, setDropdownOptions] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [nonUSCurrency, setNonUSCurrency] = useState(null);
  const [usDollarValue, setUSDollarValue] = useState('1.00');
  const [nonUSCurrencyExchangeValue, setNonUSCurrencyExchangeValue] = useState('1.00');
  const [datasetDate, setDatasetDate] = useState(null);
  const [nonUSCurrencyDecimalPlaces, setNonUSCurrencyDecimalPLaces] = useState(0);
  const [inputWarning, setInputWarning] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DropdownOption | null>(null);
  const [groupedDateOptions, setGroupedDateOptions] = useState<DropdownOption[]>([]);
  const [selectedDateOption, setSelectedDateOption] = useState<DropdownOption | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  
  type CurrencyYearQuarter = {
    effectiveDate: string;
    rate: string;
    data: Record<string, string>;
  };
  type DropdownOption = {
    label: string;
    value: string;
    data?: number; 
  }

  type Currency = {
    label: string;
    yearQuarterMap: Record<string, CurrencyYearQuarter>;
  };

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

  const yearQuarterParse = (dataRecord: Record<string, string>): string => `${dataRecord.record_calendar_year}Q${dataRecord.record_calendar_quarter}`;

  useEffect(() => {
    basicFetch(`${apiPrefix}${effectiveDateEndpoint}`).then(res => {
      if (res.data) {
        const date = new Date(res.data[0].effective_date);
        setDatasetDate(dateStringConverter(date));
      }
    });
  }, []);

  useEffect(() => {
    basicFetch(`${apiPrefix}${apiEndpoint}`).then(res => {
      const yearToQuartersMapLocal = {} as Record<string, number[]>;
      const currencyMapLocal: Record<string, Currency> = {};
      res.data.forEach(record => {
        if (!currencyMapLocal[record.country_currency_desc]) {
          currencyMapLocal[record.country_currency_desc] = {
            label: record.country_currency_desc,
            yearQuarterMap: {} as Record<string, CurrencyYearQuarter>,
          } as Currency;
        }
        if (!currencyMapLocal[record.country_currency_desc].yearQuarterMap[yearQuarterParse(record)]) {
          currencyMapLocal[record.country_currency_desc].yearQuarterMap[yearQuarterParse(record)] = {
            effectiveDate: record.effective_date,
            rate: record.exchange_rate,
            data: record,
          };
        } else if (currencyMapLocal[record.country_currency_desc].yearQuarterMap[yearQuarterParse(record)]) {
          if (
            new Date(currencyMapLocal[record.country_currency_desc].yearQuarterMap[yearQuarterParse(record)].effectiveDate) <
            new Date(record.effective_date)
          ) {
            currencyMapLocal[record.country_currency_desc].yearQuarterMap[yearQuarterParse(record)] = {
              effectiveDate: record.effective_date,
              rate: record.exchange_rate,
              data: record,
            };
          }
        }
        if (!yearToQuartersMapLocal[record.record_calendar_year]) {
          yearToQuartersMapLocal[record.record_calendar_year] = [];
        }
        if (!yearToQuartersMapLocal[record.record_calendar_year].includes(parseInt(record.record_calendar_quarter))) {
          yearToQuartersMapLocal[record.record_calendar_year].push(parseInt(record.record_calendar_quarter));
        }
      });
      Object.values(yearToQuartersMapLocal).forEach(quarters => {
        quarters = quarters.sort((a, b) => a - b);
      });
      setSortedCurrencies(Object.values(currencyMapLocal).sort((a, b) => a.label.localeCompare(b.label)));

      const listOfYearOptions = Object.keys(yearToQuartersMapLocal)
        .sort((a, b) => b.localeCompare(a))
        .map(year => ({ label: year, value: parseInt(year) }));
      const mostRecentYear = Math.max(...listOfYearOptions.map(entry => entry.value));
      const newestQuarter = yearToQuartersMapLocal[mostRecentYear][yearToQuartersMapLocal[mostRecentYear].length - 1];
      // Setting default values based on default non US currency (Euro)
      const euro = currencyMapLocal['Euro Zone-Euro'].yearQuarterMap[`${mostRecentYear}Q${newestQuarter}`].data;
      setNonUSCurrency(euro);
      setNonUSCurrencyExchangeValue(euro.exchange_rate);
      setNonUSCurrencyDecimalPLaces(countDecimals(euro.exchange_rate));

      const recordQuartersSet = [
        ...new Set(
          res.data
            .filter(entry => entry.country_currency_desc === euro.country_currency_desc && entry.record_calendar_year === euro.record_calendar_year)
            .map(entry => parseInt(entry.record_calendar_quarter))
        ),
      ];
      recordQuartersSet.sort((a: number, b: number) => {
        return a - b;
      });
      const listOfQuarterOptions = recordQuartersSet.map(quarter => ({
        label: quarterNumToTerm(quarter),
        value: quarter,
      }));
      const mostRecentQuarter = Math.max(...listOfQuarterOptions.map(entry => Number(entry.value)));
      setSelectedYear({
        label: mostRecentYear.toString(),
        value: mostRecentYear,
      });
      setSelectedQuarter({
        label: quarterNumToTerm(mostRecentQuarter),
        value: mostRecentQuarter,
      });

    });
  }, []);

  const updateCurrencyDropdownOptions = (selQuarter, selYear) => {
    const selectedYearQuarter = `${selYear.value}Q${selQuarter.value}`;

    const newOptions = sortedCurrencies.map(currency => {
    const isAvilable = currency.yearQuarterMap[selectedYearQuarter];
      return {
        label: currency.label,
        value: currency.yearQuarterMap[selectedYearQuarter] ? currency.yearQuarterMap[selectedYearQuarter].data : null,
        isDisabled: !isAvilable,
      }
    });
    setDropdownOptions(newOptions);
  };

  useEffect(() => {
    if (selectedQuarter && selectedYear) {
      updateCurrencyDropdownOptions(selectedQuarter, selectedYear);
    }
  }, [selectedQuarter, selectedYear]);

  const useHandleChangeUSDollar = useCallback(
    event => {
      clearTimeout(gaCurrencyTimer);

      let product;
      if (event.target.value === '') {
        setNonUSCurrencyExchangeValue('');
      }
      setUSDollarValue(event.target.value);
      if (!isNaN(parseFloat(event.target.value))) {
        gaCurrencyTimer = setTimeout(() => {
          analyticsHandler('USD Value Entered', event.target.value);
        }, 3000);

        if (nonUSCurrencyDecimalPlaces === 1) {
          product = Math.round(parseFloat(event.target.value) * parseFloat(nonUSCurrency.exchange_rate) * 10) / 10;
        } else if (nonUSCurrencyDecimalPlaces === 2) {
          product = Math.round(parseFloat(event.target.value) * parseFloat(nonUSCurrency.exchange_rate) * 100) / 100;
        } else {
          product = Math.round(parseFloat(event.target.value) * parseFloat(nonUSCurrency.exchange_rate) * 1000) / 1000;
        }
        product = enforceTrailingZero(product, nonUSCurrencyDecimalPlaces);
      }
      if (!isNaN(product)) {
        setNonUSCurrencyExchangeValue(product);
      }
    },
    [usDollarValue, nonUSCurrency, ]
  );

  const handleChangeNonUSCurrency = useCallback(
    event => {
      clearTimeout(gaCurrencyTimer);
      let quotient;
      if (event !== null) {
        if (event.target.value === '') {
          setUSDollarValue('');
        }
        setNonUSCurrencyExchangeValue(event.target.value);
        if (!isNaN(parseFloat(event.target.value))) {
          gaCurrencyTimer = setTimeout(() => {
            analyticsHandler('Foreign Currency Value Entered', event.target.value);
          }, 3000);
          quotient = (Math.round((parseFloat(event.target.value) / parseFloat(nonUSCurrency.exchange_rate)) * 100) / 100).toFixed(2);
        }
        if (!isNaN(quotient)) {
          setUSDollarValue(quotient.toString());}
      }
    },
    [nonUSCurrencyExchangeValue, nonUSCurrency]
  );
  
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return dateStringConverter(date); 
  };

  useEffect(() => {
    basicFetch(`${apiPrefix}${apiEndpoint}`).then(res => {
      const data = res.data;
      const dateGroups: Record<string, DropdownOption[]> = {};
      let mostRecentEuroRecord;

      data.forEach(record => {
        const year = new Date(record.effective_date).getFullYear().toString();
        const formattedDate = formatDate(record.effective_date);

        if (!dateGroups[year]) {
          dateGroups[year] = [];
        }

        if (!dateGroups[year].some(option => option.value === record.effective_date)) {
          dateGroups[year].push({
            label: formattedDate,
            value: record.effective_date,
          });
        }

        if (record.country_currency_desc === 'Euro Zone-Euro'){
          if (!mostRecentEuroRecord || new Date(record.effective_date) > new Date(mostRecentEuroRecord.effective_date)){
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
      if (mostRecentEuroRecord && selectedCountry === null) {
        setNonUSCurrency(mostRecentEuroRecord);
        setNonUSCurrencyExchangeValue(mostRecentEuroRecord.exchange_rate);
        setNonUSCurrencyDecimalPLaces(countDecimals(mostRecentEuroRecord.exchange_rate));
        setSelectedCountry(mostRecentEuroRecord.country_currency_desc)
        setSelectedDate({ label: dateStringConverter(new Date(mostRecentEuroRecord.effective_date)), value: mostRecentEuroRecord.effective_date});
      }
      setData(res.data);
    });
  }, [selectedCountry]);

  const fetchExchangeRate = (country, date) => {
    const relevantCurrencyDate = data.find(record =>
      record.country_currency_desc === country && record.effective_date === date
    );
    if(relevantCurrencyDate){
      setNonUSCurrency(relevantCurrencyDate);
      setNonUSCurrencyExchangeValue(relevantCurrencyDate.exchange_rate);
      setNonUSCurrencyDecimalPLaces(countDecimals(relevantCurrencyDate.exchange_rate));
      setUSDollarValue('1.00');
      setInputWarning(false);
    }
  };
  const handleDateChange = (selectedDateOption) => {
    setSelectedDate(selectedDateOption);
    setSelectedDateOption(selectedDateOption);
    const selectedDate = selectedDateOption.value;
    if (selectedCountry) {
      console.log(selectedDateOption)
      fetchExchangeRate(selectedCountry, selectedDate);
    }
  };
  const handleCurrencyChange = (selectedCurrency) => {
    setSelectedCountry(selectedCurrency.label);
    if (selectedDateOption) {
      fetchExchangeRate(selectedCurrency.label, selectedDateOption.value);
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
                  ariaLabel={'quater selector'}
                  label={labelIcon('Published Date', effectiveDateInfoIcon.body, 'effective-date-info-tip', true)}
                  className={box}
                  options={groupedDateOptions}
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
