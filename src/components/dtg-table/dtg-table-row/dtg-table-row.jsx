import React from 'react';
import {
  currencyFormatter,
  numberFormatter,
  dateFormatter,
} from '../../../helpers/text-format/text-format';
import * as styles from '../dtg-table.module.scss';

const dataTypes = ['CURRENCY', 'NUMBER', 'DATE', 'PERCENTAGE', 'CURRENCY3'];

//TODO: Extend original currency formatter for all new CURRENCY data types
const customFormat = (stringValue, decimalPlaces) => {
  // if block is to show "-$123,123.23" instead of "$-123,123.23"
  const absVal = Math.abs(stringValue);
  let returnString = '$' + absVal.toFixed(decimalPlaces).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  if (Number(stringValue) < 0) {
    returnString = '-' + returnString;
  }
  return returnString;
}
export default function DtgTableRow({ columns, data }) {
  const cells = [];

  columns.forEach((column, index) => {
    const {property, type} = column;
    const cellData = data[property];
    let formattedData = cellData;

    if (!cellData || cellData === 'null' || cellData === '*') {
      formattedData = '';
    } else if (type === 'CURRENCY') {
      formattedData = currencyFormatter.format(cellData);
    } else if (type && type.includes('CURRENCY') && /\d/.test(type.split('CURRENCY')[1])) {
      const decimalPlaces = parseInt(type.split('CURRENCY')[1]);
      formattedData = customFormat(cellData, decimalPlaces);
    } else if (type === 'NUMBER') {
      formattedData = numberFormatter.format(cellData);
    } else if (type === 'PERCENTAGE') {
      formattedData = `${cellData}%`;
    } else if (type === 'DATE') {
      // .replace() resolves weird -1 day issue https://stackoverflow.com/a/31732581/564406
      const date = new Date(cellData.replace(/-/g, '/'));
      formattedData = dateFormatter.format(date);
    } else if (type === 'SMALL_FRACTION') {
      formattedData = new Intl.NumberFormat('en-US', {maximumSignificantDigits:5})
        .format(cellData);
    } else if (type === 'STRING' && formattedData.includes('%')) {
      //replaces hyphens with a non-wrapping hyphen
      formattedData = cellData.replace(/-/g, '\u2011');
    }

    cells.push(<td key={index} className={dataTypes.includes(type) ? styles.formattedCell : ''}>{formattedData}</td>);
  });

  return (
    <tr>{cells}</tr>
  )
}
