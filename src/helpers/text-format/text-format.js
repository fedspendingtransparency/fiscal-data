Object.defineProperty(exports, '__esModule', { value: true });
exports.dateFormatter = exports.numberFormatter = exports.currencyFormatter = void 0;
// using this instead of Intl.NumberFormatter because of an IE bug with rounding
const customFormat = stringValue => {
  // if block is to show "-$123,123.23" instead of "$-123,123.23"
  const absVal = Math.abs(stringValue);
  let returnString = '$' + absVal.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  if (Number(stringValue) < 0) {
    returnString = '-' + returnString;
  }
  return returnString;
};

const customFormatDecimals = (val, decimalPlaces) => {
  const customFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: decimalPlaces });
  return customFormatter.format(val);
};
// In use: currencyFormatter.format(123000.123);
// Output: $123,000.12
exports.currencyFormatter = { format: customFormat };
// In use: numberFormatter.format(123000.123);
// Output: 123,000.123
exports.numberFormatter = new Intl.NumberFormat('en-US');

exports.customNumberFormatter = { format: customFormatDecimals };
// In use: dateFormatter.format(new Date(2020/03/31));
// Output: "12/30/2020"
// NOTE: argument for new Date() MUST use '/' not '-'
exports.dateFormatter = new Intl.DateTimeFormat('en-US');
