import React from 'react';
import { currencyFormatter, numberFormatter, dateFormatter, customNumberFormatter } from '../../../helpers/text-format/text-format';
import { formattedCell } from '../dtg-table.module.scss';
import moment from 'moment/moment';

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
};

export const formatCellValue = (cellData, type, tableName, property, customFormatConfig) => {
  let formattedData = cellData;
  console.log(customFormatConfig, property);
  if (!cellData || cellData === 'null' || cellData === '*') {
    formattedData = '';
  } else if (type === 'CURRENCY') {
    formattedData = currencyFormatter.format(cellData);
  } else if (type && type.includes('CURRENCY') && /\d/.test(type.split('CURRENCY')[1])) {
    const decimalPlaces = parseInt(type.split('CURRENCY')[1]);
    formattedData = customFormat(cellData, decimalPlaces);
  } else if (type === 'NUMBER') {
    const customFormat = customFormatConfig?.find(config => config.type === 'NUMBER' && config.fields.includes(property));
    if (!!customFormat) {
      formattedData = customNumberFormatter.format(cellData, customFormat.decimalPlaces);
    } else if (tableName === 'FRN Daily Indexes' && (property === 'daily_index' || property === 'daily_int_accrual_rate')) {
      formattedData = cellData;
    } else if (tableName === 'FRN Daily Indexes' && property === 'spread') {
      formattedData = Number(cellData).toFixed(3);
    } else {
      formattedData = numberFormatter.format(cellData);
    }
  } else if (type === 'PERCENTAGE') {
    formattedData = `${cellData}%`;
  } else if (type === 'DATE') {
    // .replace() resolves weird -1 day issue https://stackoverflow.com/a/31732581/564406
    const date = new Date(cellData.replace(/-/g, '/'));
    formattedData = dateFormatter.format(date);
  } else if (type === 'SMALL_FRACTION') {
    formattedData = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 5 }).format(cellData);
  } else if (type === 'STRING') {
    const customFormat = customFormatConfig?.find(config => config.type === 'STRING' && config.fields.includes(property));

    if (formattedData.includes('%')) {
      //replaces hyphens with a non-wrapping hyphen
      formattedData = cellData.replace(/-/g, '\u2011');
    } else if (customFormat && customFormat.customType === 'dateList') {
      const dates = cellData.split(customFormat.breakChar);
      formattedData = '';
      dates.forEach((date, index) => {
        if (index > 0) {
          formattedData = formattedData + ', ' + moment(date).format('M/DD/YYYY');
        } else {
          formattedData = formattedData + moment(date).format('M/DD/YYYY');
        }
      });
    }
  }

  return formattedData;
};

export default function DtgTableRow({ columns, data, tableName }) {
  const cells = [];

  columns.forEach((column, index) => {
    const { property, type } = column;
    const cellData = data[property];
    const formattedData = formatCellValue(cellData, type, tableName, property);

    cells.push(
      <td key={index} className={dataTypes.includes(type) ? formattedCell : ''}>
        {formattedData}
      </td>
    );
  });

  return <tr>{cells}</tr>;
}
