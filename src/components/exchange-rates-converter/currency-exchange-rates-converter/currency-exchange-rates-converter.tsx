import React, { FunctionComponent, useEffect, useState, useMemo } from 'react';
import {
  container,
  currencyBoxContainer,
  boxWidth,
  conversionTitle,
  headTitle,
  selector,
  arrowsIcon,
  conversionContainer,
} from './currency-exchange-rates-converter.module.scss';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';

let gaInfoTipTimer;
let gaCurrencyTimer;
let ga4Timer;

type CurrencyRate = {
  label: string;
  rates: Record<string, string>;
};
type CurrencyMap = {
  [key: string]: CurrencyRate;
};

type DropdownOption = {
  label: string;
  value?: string;
  data?: number;
  isLabel?: boolean;
  children?: DropdownOption[];
};

const CurrencyExchangeRateTool: FunctionComponent = () => {
  const allExchangeRatesData = useStaticQuery(
    graphql`
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
    `
  );

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

  const analyticsHandlers = (action, label) => {
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
      analyticsHandlers('Additional Info Hover', label);
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
    const dateGroups = {};
    const data = allExchangeRatesData.allExchangeRatesData.exchangeRatesData;
    let mostRecentEuroRecord = null;
    let mostRecentDate: Date | null = null;
    data.forEach(record => {
      const currency = record.country_currency_desc;
      const date = record.record_date;
      const rawDate = record.record_date;
      const parsedDate = new Date(rawDate);
      const year = new Date(record.record_date).getFullYear().toString();
      const formattedDate = dateStringConverter(new Date(record.record_date));

      if (mostRecentDate === null || parsedDate > mostRecentDate) {
        mostRecentDate = parsedDate;
      }

      if (!currencyMap[currency]) {
        currencyMap[currency] = { label: currency, rates: {} };
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

      if (record.country_currency_desc === 'Euro Zone-Euro' && record.record_calendar_quarter === '4') {
        if (!mostRecentEuroRecord || new Date(record.record_date) > new Date(mostRecentEuroRecord.record_date)) {
          mostRecentEuroRecord = record;
        }
      }
    });

    if (mostRecentDate) {
      setDatasetDate(dateStringConverter(mostRecentDate));
    }

    const nestedOptions: DropdownOption[] = Object.keys(dateGroups)
      .sort((a, b) => Number(b) - Number(a))
      .map(year => ({
        label: year,
        isLabel: true,
        children: dateGroups[year].sort((a, b) => new Date(b.value).getTime() - new Date(a.value).getTime()),
      }));

    setGroupedDateOptions(nestedOptions);

    if (mostRecentEuroRecord) {
      setSelectedDate({ label: dateStringConverter(new Date(mostRecentEuroRecord.record_date)), value: mostRecentEuroRecord.record_date });
      setNonUSCurrency(mostRecentEuroRecord);
      setNonUSCurrencyExchangeValue(mostRecentEuroRecord.exchange_rate);
      setNonUSCurrencyDecimalPlaces(countDecimals(mostRecentEuroRecord.exchange_rate));
    }

    setData(allExchangeRatesData.allExchangeRatesData.exchangeRatesData);
  }, []);

  useEffect(() => {
    if (data && sortedCurrencies.length > 0 && selectedDate) {
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

  const useHandleChangeUSDollar = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedDate) {
      setInputWarning(true);
      return;
    } else {
      setInputWarning(false);
    }
    clearTimeout(gaCurrencyTimer);
    let product: number | string;
    if (event.target.value === '') {
      setNonUSCurrencyExchangeValue('');
    }
    setUSDollarValue(event.target.value);

    if (!isNaN(parseFloat(event.target.value))) {
      gaCurrencyTimer = setTimeout(() => {
        analyticsHandlers('USD Value Entered', event.target.value);
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
        analyticsHandlers('Foreign Currency Value Entered', event.target.value);
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
    analyticsHandlers('Published Date Selection', selectedDateOption.value);
    if (selectedDateOption) {
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
                  options={groupDateOption}
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
              tooltip=""
            />
          </div>
        </div>
      )}
      {nonUSCurrency && nonUSCurrency.exchange_rate && !inputWarning && (
        <div>
          <div className={conversionContainer}>
            <FontAwesomeIcon icon={faArrowRightArrowLeft} className={arrowsIcon} />
            <div className={conversionTitle}>BASE CONVERSION RATE</div>
          </div>
          <span data-testid="exchange-values">
            1.00 U.S. Dollar = {nonUSCurrency.exchange_rate} {nonUSCurrency.country_currency_desc}
          </span>
        </div>
      )}
      {inputWarning && <BannerCallout bannerCallout={XRWarningBanner} bannerType="warningXR" />}
    </div>
  );
};

export default CurrencyExchangeRateTool;
