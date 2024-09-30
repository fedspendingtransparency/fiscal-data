import React, { FunctionComponent, useEffect, useState } from 'react';
import { container, currencyBoxContainer, boxWidth, conversionTitle, headTitle, selector } from './currency-exchange-rates-converter.module.scss';
import CurrencyEntryBox from '../currency-entry-box/currency-entry-box';
import NestSelectControl from '../../select-control/nest-select-control';
import {
  dateStringConverter,
  countDecimals,
  enforceTrailingZero,
  labelIcon,
  publishedDateInfoIcon,
  currencySelectionInfoIcon,
} from './currency-exchange-rates-converter-helper';
import Analytics from '../../../utils/analytics/analytics';
import BannerCallout from '../../banner-callout/banner-callout';
import { ga4DataLayerPush } from '../../../helpers/google-analytics/google-analytics-helper';
import { graphql, useStaticQuery } from 'gatsby';

let gaInfoTipTimer;
let gaCurrencyTimer;
let ga4Timer;

type CurrencyRate = {
  label: string;
  rates: Record<string, string>;
};

type CurrencyMap = Record<string, CurrencyRate>;

type DropdownOption = {
  label: string;
  value?: string;
  data?: number;
  isLabel?: boolean;
  children?: DropdownOption[];
  isDisabled?: boolean;
};

const CurrencyExchange: FunctionComponent = () => {
  const dataQuery = useStaticQuery(graphql`
    query {
      allExchangeRatesData {
        exchangeRatesData: nodes {
          record_date
          country_currency_desc
          exchange_rate
          effective_date
          record_calendar_quarter
        }
      }
    }
  `);

  const [data, setData] = useState<any[]>([]);
  const [sortedCurrencies, setSortedCurrencies] = useState<CurrencyRate[]>([]);
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([]);
  const [nonUSCurrency, setNonUSCurrency] = useState<any>(null);
  const [usDollarValue, setUSDollarValue] = useState('1.00');
  const [nonUSCurrencyExchangeValue, setNonUSCurrencyExchangeValue] = useState('1.00');
  const [nonUSCurrencyDecimalPlaces, setNonUSCurrencyDecimalPlaces] = useState(0);
  const [inputWarning, setInputWarning] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DropdownOption | null>(null);
  const [groupDateOptions, setGroupDateOptions] = useState<DropdownOption[]>([]);

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

  const handleMouseEnterInfoTip = (label: string, ga4ID: string) => {
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
    const currencyMap: CurrencyMap = {};
    const dateGroups: Record<string, DropdownOption[]> = {};
    const exchangeRatesData = dataQuery.allExchangeRatesData.exchangeRatesData;
    let mostRecentEuroRecord = null;

    exchangeRatesData.forEach(record => {
      const { country_currency_desc: currency, record_date, exchange_rate, record_calendar_quarter } = record;
      const parsedDate = new Date(record_date);
      const year = parsedDate.getFullYear().toString();
      const formattedDate = dateStringConverter(parsedDate);

      if (!currencyMap[currency]) {
        currencyMap[currency] = { label: currency, rates: {} };
      }
      currencyMap[currency].rates[record_date] = exchange_rate;

      if (!dateGroups[year]) {
        dateGroups[year] = [];
      }
      if (!dateGroups[year].some(option => option.value === record_date)) {
        dateGroups[year].push({
          label: formattedDate,
          value: record_date,
        });
      }

      if (currency === 'Euro Zone-Euro' && record_calendar_quarter === '4') {
        if (!mostRecentEuroRecord || new Date(record_date) > new Date(mostRecentEuroRecord.record_date)) {
          mostRecentEuroRecord = record;
        }
      }
    });

    const sortedCurrencies = Object.values(currencyMap).sort((a, b) => a.label.localeCompare(b.label));
    setSortedCurrencies(sortedCurrencies);

    const nestedOptions: DropdownOption[] = Object.keys(dateGroups)
      .sort((a, b) => Number(b) - Number(a))
      .map(year => ({
        label: year,
        isLabel: true,
        children: dateGroups[year].sort((a, b) => new Date(b.value!).getTime() - new Date(a.value!).getTime()),
      }));

    setGroupDateOptions(nestedOptions);

    if (mostRecentEuroRecord) {
      const recordDate = mostRecentEuroRecord.record_date;
      setSelectedDate({
        label: dateStringConverter(new Date(recordDate)),
        value: recordDate,
      });
      setNonUSCurrency(mostRecentEuroRecord);
      setNonUSCurrencyExchangeValue(mostRecentEuroRecord.exchange_rate);
      setNonUSCurrencyDecimalPlaces(countDecimals(mostRecentEuroRecord.exchange_rate));
    }

    setData(exchangeRatesData);
  }, [dataQuery]);

  useEffect(() => {
    if (data.length > 0 && sortedCurrencies.length > 0 && selectedDate) {
      const currencyOptions = sortedCurrencies.map(currency => {
        const rate = data.find(
          record =>
            record.country_currency_desc === currency.label &&
            record.record_date === selectedDate.value &&
            record.record_date === record.effective_date
        );
        return {
          label: currency.label,
          value: rate ? rate : '',
          isDisabled: !rate,
        };
      });
      setDropdownOptions(currencyOptions);
    }
  }, [selectedDate, sortedCurrencies, data]);

  const handleUSDollarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedDate) {
      setInputWarning(true);
      return;
    }
    setInputWarning(false);
    clearTimeout(gaCurrencyTimer);

    const inputValue = event.target.value;
    setUSDollarValue(inputValue);

    if (inputValue === '') {
      setNonUSCurrencyExchangeValue('');
      return;
    }

    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue)) {
      gaCurrencyTimer = setTimeout(() => {
        analyticsHandler('USD Value Entered', inputValue);
      }, 3000);

      let product = parsedValue * parseFloat(nonUSCurrency.exchange_rate);
      product = enforceTrailingZero(product, nonUSCurrencyDecimalPlaces);
      setNonUSCurrencyExchangeValue(product.toString());
    }
  };

  const handleNonUSCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(gaCurrencyTimer);

    const inputValue = event.target.value;
    setNonUSCurrencyExchangeValue(inputValue);

    if (inputValue === '') {
      setUSDollarValue('');
      return;
    }

    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue)) {
      gaCurrencyTimer = setTimeout(() => {
        analyticsHandler('Foreign Currency Value Entered', inputValue);
      }, 3000);

      const quotient = parsedValue / parseFloat(nonUSCurrency.exchange_rate);
      setUSDollarValue(quotient.toFixed(2));
    }
  };

  const handleDateChange = (selectedDateOption: DropdownOption) => {
    setSelectedDate(selectedDateOption);
    analyticsHandler('Published Date Selection', selectedDateOption.value!);

    const newCurrency = data.find(
      record =>
        record.country_currency_desc === nonUSCurrency.country_currency_desc &&
        record.record_date === selectedDateOption.value &&
        record.record_date === record.effective_date
    );

    if (newCurrency) {
      setNonUSCurrency(newCurrency);
      setUSDollarValue('1.00');
      setNonUSCurrencyExchangeValue(newCurrency.exchange_rate);
      setNonUSCurrencyDecimalPlaces(countDecimals(newCurrency.exchange_rate));
      setInputWarning(false);
    } else {
      setNonUSCurrencyExchangeValue('--');
      setUSDollarValue('--');
      setInputWarning(true);
    }
  };

  const handleCurrencyChange = (selectedCurrency: DropdownOption | null) => {
    if (!selectedCurrency || !selectedCurrency.label) {
      setInputWarning(false);
      return;
    }
    const newCurrency = data.find(
      record =>
        record.country_currency_desc === selectedCurrency.label &&
        record.record_date === selectedDate?.value &&
        record.record_date === record.effective_date
    );

    if (newCurrency) {
      setNonUSCurrency(newCurrency);
      setInputWarning(false);
      setUSDollarValue('1.00');
      setNonUSCurrencyExchangeValue(newCurrency.exchange_rate);
      setNonUSCurrencyDecimalPlaces(countDecimals(newCurrency.exchange_rate));
    }
  };

  return (
    <div className={container} onBlur={handleInfoTipClose} role="presentation">
      <h2 className={headTitle}>Check foreign currency rates against the U.S. Dollar.</h2>
      {nonUSCurrency && (
        <div data-testid="box-container" className={boxWidth}>
          {data && (
            <div className={currencyBoxContainer}>
              <div className={selector}>
                <NestSelectControl
                  label={labelIcon(
                    'Published Date',
                    publishedDateInfoIcon.body,
                    'effective-date-info-tip',
                    true,
                    () => handleMouseEnterInfoTip('Additional Published Date Info', 'eff-date'),
                    handleInfoTipClose
                  )}
                  className={boxWidth}
                  options={groupDateOptions}
                  selectedOption={selectedDate}
                  changeHandler={handleDateChange}
                />
              </div>
            </div>
          )}
          <div className={currencyBoxContainer}>
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
              onCurrencyValueChange={handleNonUSCurrencyChange}
              testId="non-us-box"
              header="FOREIGN CURRENCY"
              tooltipDiplay={true}
              tooltip={currencySelectionInfoIcon.body}
            />
            <CurrencyEntryBox
              defaultCurrency="U.S. Dollar"
              currencyValue={usDollarValue}
              onCurrencyValueChange={handleUSDollarChange}
              testId="us-box"
              header="U.S. DOLLAR"
              tooltipDiplay={false}
              tooltip=""
            />
          </div>
        </div>
      )}
      {nonUSCurrency && nonUSCurrency.exchange_rate && !inputWarning && (
        <div>
          <h2 className={conversionTitle}>BASED CONVERSION RATE</h2>
          <span data-testid="exchange-values">
            1.00 U.S. Dollar = {nonUSCurrency.exchange_rate} {nonUSCurrency.country_currency_desc}
          </span>
        </div>
      )}
      {inputWarning && <BannerCallout bannerCallout={XRWarningBanner} bannerType="warningXR" />}
    </div>
  );
};

export default CurrencyExchange;
