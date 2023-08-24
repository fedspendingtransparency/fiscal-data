import React from 'react';

// using this instead of Intl.NumberFormatter because of an IE bug with rounding
export const customFormat = (stringValue) => {
  // if block is to show "-$123,123.23" instead of "$-123,123.23"
  const absVal = Math.abs(stringValue);
  let returnString = '$' + absVal.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  if (Number(stringValue) < 0) {
    returnString = '-' + returnString;
  }
  return returnString;
}

// In use: currencyFormatter.format(123000.123);
// Output: $123,000.12
export const currencyFormatter = { format: customFormat };

// In use: numberFormatter.format(123000.123);
// Output: 123,000.123
export const numberFormatter = new Intl.NumberFormat('en-US');

// In use: dateFormatter.format(new Date(2020/03/31));
// Output: "12/30/2020"
// NOTE: argument for new Date() MUST use '/' not '-'
export const dateFormatter = new Intl.DateTimeFormat('en-US');
