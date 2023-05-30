import React from 'react';
import {currencyFormatter, numberFormatter, dateFormatter} from '../../../helpers/text-format/text-format';
import * as styles from '../dtg-table.module.scss';

const dataTypes = ['CURRENCY', 'NUMBER', 'DATE', 'PERCENTAGE'];

export default function DtgTableRow(props) {
  const cells = [];

  props.columns.forEach((column, index) => {
    const {property, type} = column;
    const cellData = props.data[property];
    let formattedData = cellData;

    if (!cellData || cellData === 'null' || cellData === '*') {
      formattedData = '';
    } else if (type === 'CURRENCY') {
      formattedData = currencyFormatter.format(cellData);
    } else if (type === 'NUMBER') {
      formattedData = numberFormatter.format(cellData);
    } else if (type === 'PERCENTAGE') {
      formattedData = `${cellData}%`;
    } else if (type === 'DATE') {
      // .replace() resolves weird -1 day issue https://stackoverflow.com/a/31732581/564406
      const date = new Date(cellData.replace(/-/g, '\/'));
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
