import React from 'react';
import { currencyFormatter, customNumberFormatter, dateFormatter, numberFormatter } from '../../../helpers/text-format/text-format';
import { formattedCell, markdownRow } from '../dtg-table.module.scss';
import { MarkdownTransform } from '../../markdown-transform/markdown-transform';
import dayjs from 'dayjs';

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
      if (customFormat.decimalPlaces) {
        formattedData = customNumberFormatter.format(cellData, customFormat.decimalPlaces);
      } else if (customFormat.currency) {
        formattedData = currencyFormatter.format(cellData);
      } else if (customFormat.noFormatting) {
        formattedData = cellData;
      }
    } else {
      formattedData = numberFormatter.format(cellData);
    }
  } else if (type === 'PERCENTAGE') {
    formattedData = `${cellData}%`;
  } else if (type === 'DATE') {
    // .replace() resolves weird -1 day issue
    const date = new Date(cellData.replace(/-/g, '/'));
    const customFormat = customFormatConfig?.find(config => config.type === 'DATE' && config.fields.includes(property));
    formattedData = customFormat?.dateFormat ? dayjs(date).format(customFormat?.dateFormat) : dateFormatter.format(date);
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
          formattedData = formattedData + ', ' + dayjs(date).format('M/D/YYYY');
        } else {
          formattedData = formattedData + dayjs(date).format('M/D/YYYY');
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
    const metadataValueName = cells[index - 1]?.props.children;
    const formattedData = formatCellValue(cellData, type, tableName, property);

    cells.push(
      <td key={index} className={dataTypes.includes(type) ? formattedCell : ''}>
        {metadataValueName === 'Description (Long)' ? (
          <MarkdownTransform content={formattedData} isBanner={false} customClass={markdownRow} />
        ) : (
          formattedData
        )}
      </td>
    );
  });

  return <tr>{cells}</tr>;
}
