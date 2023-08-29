import {BASE_URL} from "gatsby-env-variables";
import React from "react";


export const quarterNumToTerm = (num) => {
  switch (num) {
    case 1:
      return '1st';
    case 2:
      return '2nd';
    case 3:
      return '3rd';
    case 4:
      return '4th';
    default:
      return;
  }
}

export const dateStringConverter = (date) => {

  if (isNaN(date)) {
    return '';
  }
  const timeZoneOffset = date.getTimezoneOffset() * 60000;
  const offSetDate = new Date(date.getTime() + timeZoneOffset);
  const monthName = offSetDate.toLocaleString('default', { month: 'long' });
  const day = offSetDate.getDate();
  const year = offSetDate.getFullYear();
  return `${monthName} ${day}, ${year}`;
}

export const fastRound = (number) => {
  return (number + (number>0?0.50:-0.50)) << 0;
}

export const countDecimals = (number) => {
  if (number.toString().split('.')[1] === undefined) {
    return 0;
  }
  return number.toString().split('.')[1].length || 0;
}

export const enforceTrailingZero = (number, decimalPlaces) => {
  let num = number.toString();
  if (num.indexOf('.') === -1) num += '.';
  while (num.length < num.indexOf('.') + (decimalPlaces + 1)) num += '0';
  return num;
}

export const apiEndpoint = 'v1/accounting/od/rates_of_exchange?filter=record_date:gte:2022-12-31&sort=currency,-effective_date&page[size]=10000';

export const effectiveDateEndpoint = 'v1/accounting/od/rates_of_exchange?filter=record_date:gte:2022-12-31&sort=-effective_date';
export const breadCrumbLinks = [
  {
    name: 'Currency Exchange Rates Converter'
  },
  {
    name: 'Home',
    link: '/'
  }
];

const envBaseUrl = BASE_URL;

export const socialCopy = {
  title: 'Currency Exchange Rates Converter Tool',
  description: 'Do you need to calculate a foreign currency exchange rate for tax reporting? Fiscal Data presents ' +
    'an interactive tool that enables you to find accurate and reliable currency exchange rates based on trusted ' +
    'U.S. Treasury data.',
  body: 'Fiscal Data presents an interactive tool for currency exchange rate conversions.',
  emailSubject: 'Fiscal Data Presents the Currency Exchange Rates Converter Tool',
  emailBody: 'Check out Fiscal Data’s new Currency Exchange Rates Converter tool. This tool will help you ' +
    'search the value of any foreign currency as it compares to the U.S. Dollar. Whether you’re conducting ' +
    'international business, completing tax reporting, or planning your next trip abroad, use the Currency '+
    'Exchange Rates Converter Tool for trusted U.S. Treasury currency information.',
  url: envBaseUrl+'/currency-exchange-rates-converter/',
  image: envBaseUrl+'/images/currencyExchangeRatesConverter.png',
}

export const effectiveDateInfoIcon = {
  body: (
    <>
      Sometimes Treasury issues amendments to published exchange rates. The Effective Date is the most recent
      exchange rate published for the given quarter. This will either be the original publication date or the
      date the amendment was published. The tool below shows the latest value published for the year and quarter
      selected.
    </>
  )}
export const currencySelectionInfoIcon = {
  body: (
    <>
      Currencies listed in grey do not have available data for the date range selected. Please ensure that
      the desired currency does not appear by another name, or change the dates selected for available results.
    </>
  )
};

